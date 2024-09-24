# 使用 Flutter 进行 WebRTC 视频通话

## 介绍

Flutter 上的 WebRTC 通常通过flutter_webrtc 库实现，该库包含 Flutter 支持的所有平台所需的 WebRTC 代码。该插件抽象出了 WebRTC 中几个难以实现的部分，本文构建的应用程序基于插件中给出的示例代码。

在本教程中，我们将向 Flutter 应用程序添加基于 WebRTC 的通话解决方案。

## 设置 flutter_webrtc 插件

必须设置各种组件才能实现完整的视频通话体验。第一个是将基础 WebRTC 插件添加到您的 Flutter 应用。在本课中，我们仅关注 Android 和 iOS，但请注意，可能需要进行额外设置才能在其他平台上设置类似的体验。

首先，将插件添加到您的 `pubspec.yaml` 文件中：

```yml
dependencies:

	flutter_webrtc: ^0.9.48
```

对于iOS，我们需要通过`Info.plist`文件让平台知道，我们将使用麦克风和摄像头进行通话：

```xml
<key>NSCameraUsageDescription</key>

<string>$(PRODUCT_NAME) Camera Usage!</string>

<key>NSMicrophoneUsageDescription</key>

<string>$(PRODUCT_NAME) Microphone Usage!</string>
```

类似地，对于 Android，我们在`AndroidManifest.xml`文件中声明相同的内容：

```xml
<uses-feature android:name="android.hardware.camera" />

<uses-feature android:name="android.hardware.camera.autofocus" />

<uses-permission android:name="android.permission.CAMERA" />

<uses-permission android:name="android.permission.RECORD_AUDIO" />

<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />

<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

您还可以添加权限以使用蓝牙设备：

```xml
<uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30" />

<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:maxSdkVersion="30" />
```

此外，您必须通过修改Android 的应用级文件`build.gradle`将您的应用设置为针对 Java 8 的配置：

```gradle
android {

//...

	compileOptions {
		sourceCompatibility JavaVersion.VERSION_1_8
		targetCompatibility JavaVersion.VERSION_1_8
	}

}
```

## 添加 WebSocket

任何基于 WebRTC 的应用程序都需要与大量服务器和组件进行通信。为此，我们必须首先设置一个允许我们连接到这些服务器的 WebSocket。

这是一个通过提供的 URL 与上面提到的服务器建立连接的类：

```dart
import 'dart:io';
import 'dart:math';
import 'dart:convert';
import 'dart:async';

class SimpleWebSocket {
  String _url;
  var _socket;
  Function()? onOpen;
  Function(dynamic msg)? onMessage;
  Function(int? code, String? reaso)? onClose;
  SimpleWebSocket(this._url);

  connect() async {
    try {
      _socket = await _connectForSelfSignedCert(_url);
      onOpen?.call();
      _socket.listen((data) {
        onMessage?.call(data);
      }, onDone: () {
        onClose?.call(_socket.closeCode, _socket.closeReason);
      });
    } catch (e) {
      onClose?.call(500, e.toString());
    }
  }

  send(data) {
    if (_socket != null) {
      _socket.add(data);
      print('send: $data');
    }
  }

  close() {
    if (_socket != null) _socket.close();
  }

  Future<WebSocket> _connectForSelfSignedCert(url) async {
    try {
      Random r = Random();
      String key = base64.encode(List<int>.generate(8, (_) => r.nextInt(255)));
      HttpClient client = HttpClient(context: SecurityContext());
      client.badCertificateCallback =
          (X509Certificate cert, String host, int port) {
        print(
            'SimpleWebSocket: Allow self-signed certificate => $host:$port. ');
        return true;
      };

      HttpClientRequest request =
          await client.getUrl(Uri.parse(url)); // form the correct url here
      request.headers.add('Connection', 'Upgrade');
      request.headers.add('Upgrade', 'websocket');
      request.headers.add(
          'Sec-WebSocket-Version', '13'); // insert the correct version here
      request.headers.add('Sec-WebSocket-Key', key.toLowerCase());

      HttpClientResponse response = await request.close();
      // ignore: close_sinks
      var socket = await response.detachSocket();
      var webSocket = WebSocket.fromUpgradedSocket(
        socket,
        protocol: 'signaling',
        serverSide: false,
      );

      return webSocket;
    } catch (e) {
      throw e;
    }
  }
}
```

## 信令服务器

虽然整个 WebRTC框架 标准化了创建视频通话体验的几个方面，但它遗漏了信令服务器。创建通话平台时，您需要设置自己的信令服务器才能连接设备。我们在上一课中介绍了创建自己的信令服务器的过程。在本课中，为了简洁起见，我们将使用 flutter_webrtc 插件提供的[信令服务器](https://github.com/flutter-webrtc/flutter-webrtc-server)。

信令服务器项目处理 WebRTC 中的多个连接方面，而不仅仅是基本信令。我们项目中处理与信令服务器连接的类必须创建一个 WebSocket 并监听更改以及通过套接字发送的任何消息：

```dart
Future<void> connect() async {
    var url = 'https://$_host:$_port/ws';
    _socket = SimpleWebSocket(url);

    print('connect to $url');

    if (_turnCredential == null) {
      try {
        _turnCredential = await getTurnCredential(_host, _port);
        _iceServers = {
          'iceServers': [
            {
              'urls': _turnCredential['uris'][0],
              'username': _turnCredential['username'],
              'credential': _turnCredential['password']
            },
          ]
        };
      } catch (e) {}
    }

    _socket?.onOpen = () {
      print('onOpen');
      onSignalingStateChange?.call(SignalingState.connectionOpen);
      _send('new', {
        'name': DeviceInfo.label,
        'id': _selfId,
        'user_agent': DeviceInfo.userAgent
      });
    };

    _socket?.onMessage = (message) {
      print('Received data: ' + message);
      onMessage(_decoder.convert(message));
    };

    _socket?.onClose = (int? code, String? reason) {
      print('Closed by server [$code => $reason]!');
      onSignalingStateChange?.call(SignalingState.connectionClosed);
    };

    await _socket?.connect();
}
```

连接和管理信令服务器连接的整个类较大，在此进行了简化，但您可以在项目存储库中完整查看。

## 在对等体之间传输数据

当对等端（网络上的设备）想要与另一方建立呼叫时，它需要创建并向对方发送要约。它还需要指定会话描述，该描述定义了有关潜在呼叫的几个细节。有关更多信息，请参阅有关会话描述协议 (SDP)的课程。

```dart
Future<void> _createOffer(Session session, String media) async {
    try {
      RTCSessionDescription s =
          await session.pc!.createOffer(media == 'data' ? _dcConstraints : {});
      await session.pc!.setLocalDescription(_fixSdp(s));
      _send('offer', {
        'to': session.pid,
        'from': _selfId,
        'description': {'sdp': s.sdp, 'type': s.type},
        'session_id': session.sid,
        'media': media,
      });
    } catch (e) {
      print(e.toString());
    }
}
```

一旦另一对等体收到第一对等体发出的提议，它就需要接受或拒绝该提议。为此，它会创建一个答案并将其发送给第一对等体。如果被接受，它们就可以发起呼叫会话并开始交换数据。

```dart
Future<void> _createAnswer(Session session, String media) async {
    try {
      RTCSessionDescription s =
          await session.pc!.createAnswer(media == 'data' ? _dcConstraints : {});
      await session.pc!.setLocalDescription(_fixSdp(s));
      _send('answer', {
        'to': session.pid,
        'from': _selfId,
        'description': {'sdp': s.sdp, 'type': s.type},
        'session_id': session.sid,
      });
    } catch (e) {
      print(e.toString());
    }
}
```

我们必须监视套接字上的任何消息，例如要约、答案、同行、候选人等。根据收到的数据，我们可以更新每个设备上的本地信息并发起呼叫：

```dart
void onMessage(message) async {
    Map<String, dynamic> mapData = message;
    var data = mapData['data'];

    switch (mapData['type']) {
      case 'peers':
        {
          List<dynamic> peers = data;
          if (onPeersUpdate != null) {
            Map<String, dynamic> event = <String, dynamic>{};
            event['self'] = _selfId;
            event['peers'] = peers;
            onPeersUpdate?.call(event);
          }
        }
        break;
      case 'offer':
        {
          var peerId = data['from'];
          var description = data['description'];
          var media = data['media'];
          var sessionId = data['session_id'];
          var session = _sessions[sessionId];
          var newSession = await _createSession(session,
              peerId: peerId,
              sessionId: sessionId,
              media: media,
              screenSharing: false);
          _sessions[sessionId] = newSession;
          await newSession.pc?.setRemoteDescription(
              RTCSessionDescription(description['sdp'], description['type']));

          if (newSession.remoteCandidates.isNotEmpty) {
            newSession.remoteCandidates.forEach((candidate) async {
              await newSession.pc?.addCandidate(candidate);
            });
            newSession.remoteCandidates.clear();
          }
          onCallStateChange?.call(newSession, CallState.callStateNew);
          onCallStateChange?.call(newSession, CallState.callStateRinging);
        }
        break;
      case 'answer':
        {
          var description = data['description'];
          var sessionId = data['session_id'];
          var session = _sessions[sessionId];
          session?.pc?.setRemoteDescription(
              RTCSessionDescription(description['sdp'], description['type']));
          onCallStateChange?.call(session!, CallState.callStateConnected);
        }
        break;
      case 'candidate':
        {
          var peerId = data['from'];
          var candidateMap = data['candidate'];
          var sessionId = data['session_id'];
          var session = _sessions[sessionId];
          RTCIceCandidate candidate = RTCIceCandidate(candidateMap['candidate'],
              candidateMap['sdpMid'], candidateMap['sdpMLineIndex']);

          if (session != null) {
            if (session.pc != null) {
              await session.pc?.addCandidate(candidate);
            } else {
              session.remoteCandidates.add(candidate);
            }
          } else {
            _sessions[sessionId] = Session(pid: peerId, sid: sessionId)
              ..remoteCandidates.add(candidate);
          }
        }
        break;
      case 'leave':
        {
          var peerId = data as String;
          _closeSessionByPeerId(peerId);
        }
        break;
      case 'bye':
        {
          var sessionId = data['session_id'];
          print('bye: ' + sessionId);
          var session = _sessions.remove(sessionId);
          if (session != null) {
            onCallStateChange?.call(session, CallState.callStateBye);
            _closeSession(session);
          }
        }
        break;
      case 'keepalive':
        {
          print('keepalive response!');
        }
        break;
      default:
        break;
    }
}
```

## 构建视频渲染器

一旦我们收到来自其他对等方的数据流，我们就可以开始显示所有用户的视频。为此，我们创建一个 RTCVideoRenderer，它代表单个用户的视频流数据。在两个用户之间的这个通话中，我们创建一个本地渲染器和一个代表两个参与者的远程渲染器。

然后，我们可以分别使用 onAddRemoteStream 和 onLocalStream（项目中信号类的一部分）监听远程和本地流的变化。然后可以将这些渲染器传递给 RTCVideoView 小部件以进行显示：

```dart
RTCVideoRenderer _localRenderer = RTCVideoRenderer();
RTCVideoRenderer _remoteRenderer = RTCVideoRenderer();
  
// ...

_signaling?.onLocalStream = ((stream) {
    _localRenderer.srcObject = stream;
    setState(() {});
});

_signaling?.onAddRemoteStream = ((_, stream) {
    _remoteRenderer.srcObject = stream;
    setState(() {});
});

// When declaring widgets

RTCVideoView(_localRenderer, mirror: true)

RTCVideoView(_remoteRenderer)
```

## 添加控件

仅仅创建视频源是不够的。我们需要为用户添加控件，以便他们打开或关闭输入设备（例如摄像头和麦克风）。该`flutter_webrtc`插件通过`Helper`类帮助我们轻松切换摄像头。我们可以直接禁用音频流来启用或禁用麦克风。

```dart
void switchCamera() {
    if (_localStream != null) {
        Helper.switchCamera(_localStream!.getVideoTracks()[0]);
    }
}

void muteMic() {
    if (_localStream != null) {
        bool enabled = _localStream!.getAudioTracks()[0].enabled;
        _localStream!.getAudioTracks()[0].enabled = !enabled;
    }
}
```

该`Helper`类还使您能够执行其他一些操作，例如选择音频输入/输出设备、启用/禁用扬声器等：

```dart
static Future<void> selectAudioOutput(String deviceId) async {
    await navigator.mediaDevices
        .selectAudioOutput(AudioOutputOptions(deviceId: deviceId));
  }

static Future<void> selectAudioInput(String deviceId) =>
      NativeAudioManagement.selectAudioInput(deviceId);

  
static Future<void> setSpeakerphoneOn(bool enable) =>
      NativeAudioManagement.setSpeakerphoneOn(enable);
```

就这样！结合这些方面，使用 WebRTC 和 Flutter 即可创建简单、极简的视频通话体验。

## 结论

您可以在[此处 Github](https://github.com/GetStream/webrtc-in-flutter)找到有关代码。

在本教程中，我们深入研究了如何使用 WebRTC 在 Flutter 中实现实时视频流，重点介绍了建立点对点视频共享连接所需的实际步骤。有了这些知识，您现在可以探索 Flutter 项目中交互式媒体的巨大潜力。

## 原文地址

[WebRTC Video Calling with Flutter](https://getstream.io/resources/projects/webrtc/platforms/flutter/)

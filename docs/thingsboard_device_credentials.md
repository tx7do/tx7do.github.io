# ThingsBoard设备登陆认证

## ThingsBoard设备有关的表

![thingsboard_device_table](/assets/images/thingsboard/thingsboard_device_table.png)

* **device_profile** 这个表相当于国内的“产品”的概念
* **ota_package** 这个表是OTA升级包相关的数据
* **device** 这个表是设备的数据
* **device_credentials** 这个表是设备的登陆验证凭证信息

## 支持的凭证类型

* 访问令牌
* MQTT验证信息
* x509证书
* LWM2M

## 前端定义的相关类

```typescript
export enum DeviceCredentialsType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  X509_CERTIFICATE = 'X509_CERTIFICATE',
  MQTT_BASIC = 'MQTT_BASIC',
  LWM2M_CREDENTIALS = 'LWM2M_CREDENTIALS'
}

export class DeviceCredentialsId implements HasUUID {
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}

export interface DeviceCredentials extends BaseData<DeviceCredentialsId> {
  deviceId: DeviceId;
  credentialsType: DeviceCredentialsType;
  credentialsId: string;
  credentialsValue: string;
}

export interface DeviceCredentialMQTTBasic {
  clientId: string;
  userName: string;
  password: string;
}
```

## 后端定义的相关类

```java
@ApiModel
@EqualsAndHashCode(callSuper = true)
public class DeviceCredentials extends BaseData<DeviceCredentialsId> implements DeviceCredentialsFilter {
    private static final long serialVersionUID = -7869261127032877765L;
    private DeviceId deviceId;
    private DeviceCredentialsType credentialsType;
    private String credentialsId;
    private String credentialsValue;
};

@Data
public class ProvisionDeviceCredentialsData {
    private final String token;
    private final String clientId;
    private final String username;
    private final String password;
    private final String x509CertHash;
}

@Data
public class BasicMqttCredentials {
    private String clientId;
    private String userName;
    private String password;
}
```

## 各类型凭证如何存数据

处理数据的代码在：`DeviceCredentialsServiceImpl`和`DeviceServiceImpl`中

### 访问令牌

| 字段 | 数值         |
|----|------------|
|  credentials_type  | ACCESS_TOKEN |
|  credentials_id  | 访问令牌       |
|  credentials_value  | 无          |

### MQTT验证信息

| 字段                | 数值                                                                                                         |
|-------------------|------------------------------------------------------------------------------------------------------------|
| credentials_type  | MQTT_BASIC                                                                                                 |
| credentials_id    | <li>clientId为空：userName</li><li>userName为空：SHA3(clientId)</li><li>其他情况：SHA3(clientId &#124; userName)</li> |
| credentials_value | { userName:"", password:"", clientId:"" }                                                                  |

### x509证书

| 字段 | 数值                |
|----|-------------------|
|  credentials_type  | X509_CERTIFICATE  |
|  credentials_id  | SHA3(掐头去尾去换行符的证书) |
|  credentials_value  | 掐头去尾去换行符的证书         |

## 如何登陆认证设备

![处理MQTT消息流程](/assets/images/thingsboard/thingsboard_mqtt_process_message.drawio.svg)

具体处理连接的代码在：`MqttTransportHandler`中。

从代码中可以知道，当用户名或者客户端ID为`PROVISION`时，设备会被认为是设备的初始化，需要进行设备的初始化，否则会被认为是设备的登陆，需要进行设备的登陆。

```java
void processConnect(ChannelHandlerContext ctx, MqttConnectMessage msg) {
    log.debug("[{}] Processing connect msg for client: {}!", sessionId, msg.payload().clientIdentifier());
    String userName = msg.payload().userName();
    String clientId = msg.payload().clientIdentifier();
    if (DataConstants.PROVISION.equals(userName) || DataConstants.PROVISION.equals(clientId)) {
        deviceSessionCtx.setProvisionOnly(true);
        ctx.writeAndFlush(createMqttConnAckMsg(CONNECTION_ACCEPTED, msg));
    } else {
        X509Certificate cert;
        if (sslHandler != null && (cert = getX509Certificate()) != null) {
            processX509CertConnect(ctx, cert, msg);
        } else {
            processAuthTokenConnect(ctx, msg);
        }
    }
}
```

`MqttTransportHandler::processAuthTokenConnect`方法是连同访问令牌和MQTT验证一起做的。

```java
private void processAuthTokenConnect(ChannelHandlerContext ctx, MqttConnectMessage connectMessage) {
    String userName = connectMessage.payload().userName();
    log.debug("[{}][{}] Processing connect msg for client with user name: {}!", address, sessionId, userName);
    TransportProtos.ValidateBasicMqttCredRequestMsg.Builder request = TransportProtos.ValidateBasicMqttCredRequestMsg.newBuilder()
            .setClientId(connectMessage.payload().clientIdentifier());
    if (userName != null) {
        request.setUserName(userName);
    }
    byte[] passwordBytes = connectMessage.payload().passwordInBytes();
    if (passwordBytes != null) {
        String password = new String(passwordBytes, CharsetUtil.UTF_8);
        request.setPassword(password);
    }
    transportService.process(DeviceTransportType.MQTT, request.build(),
            new TransportServiceCallback<>() {
                @Override
                public void onSuccess(ValidateDeviceCredentialsResponse msg) {
                    onValidateDeviceResponse(msg, ctx, connectMessage);
                }

                @Override
                public void onError(Throwable e) {
                    log.trace("[{}] Failed to process credentials: {}", address, userName, e);
                    ctx.writeAndFlush(createMqttConnAckMsg(MqttConnectReturnCode.CONNECTION_REFUSED_SERVER_UNAVAILABLE, connectMessage));
                    ctx.close();
                }
            });
}
```

上一步的`transportService.process`传递到了`DefaultTransportService::process`当中做了处理。

```java
@Override
public void process(DeviceTransportType transportType, TransportProtos.ValidateDeviceTokenRequestMsg msg,
                    TransportServiceCallback<ValidateDeviceCredentialsResponse> callback) {
    log.trace("Processing msg: {}", msg);
    TbProtoQueueMsg<TransportApiRequestMsg> protoMsg = new TbProtoQueueMsg<>(UUID.randomUUID(),
            TransportApiRequestMsg.newBuilder().setValidateTokenRequestMsg(msg).build());
    doProcess(transportType, protoMsg, callback);
}
```

请求的消息被翻译成了内部队列的Protobuf的消息，然后再继续投递到`DefaultTransportService::doProcess`中。

```java
private void doProcess(DeviceTransportType transportType, TbProtoQueueMsg<TransportApiRequestMsg> protoMsg,
                       TransportServiceCallback<ValidateDeviceCredentialsResponse> callback) {
    ListenableFuture<ValidateDeviceCredentialsResponse> response = Futures.transform(transportApiRequestTemplate.send(protoMsg), tmp -> {
        TransportProtos.ValidateDeviceCredentialsResponseMsg msg = tmp.getValue().getValidateCredResponseMsg();
        ValidateDeviceCredentialsResponse.ValidateDeviceCredentialsResponseBuilder result = ValidateDeviceCredentialsResponse.builder();
        if (msg.hasDeviceInfo()) {
            result.credentials(msg.getCredentialsBody());
            TransportDeviceInfo tdi = getTransportDeviceInfo(msg.getDeviceInfo());
            result.deviceInfo(tdi);
            ByteString profileBody = msg.getProfileBody();
            if (!profileBody.isEmpty()) {
                DeviceProfile profile = deviceProfileCache.getOrCreate(tdi.getDeviceProfileId(), profileBody);
                if (transportType != DeviceTransportType.DEFAULT
                        && profile != null && profile.getTransportType() != DeviceTransportType.DEFAULT && profile.getTransportType() != transportType) {
                    log.debug("[{}] Device profile [{}] has different transport type: {}, expected: {}", tdi.getDeviceId(), tdi.getDeviceProfileId(), profile.getTransportType(), transportType);
                    throw new IllegalStateException("Device profile has different transport type: " + profile.getTransportType() + ". Expected: " + transportType);
                }
                result.deviceProfile(profile);
            }
        }
        return result.build();
    }, MoreExecutors.directExecutor());
    AsyncCallbackTemplate.withCallback(response, callback::onSuccess, callback::onError, transportCallbackExecutor);
}
```

`DefaultTransportService::doProcess`中把通过`DeviceCredentials`查询`DeviceProfile`信息，并且把结果返回给`TransportServiceCallback`。

```java
onValidateDeviceResponse
```

此时回调回到了`MqttTransportHandler::processAuthTokenConnect`，进入到`MqttTransportHandler::onValidateDeviceResponse`处理。

```java
private void onValidateDeviceResponse(ValidateDeviceCredentialsResponse msg, ChannelHandlerContext ctx, MqttConnectMessage connectMessage) {
    if (!msg.hasDeviceInfo()) {
        context.onAuthFailure(address);
        ctx.writeAndFlush(createMqttConnAckMsg(CONNECTION_REFUSED_NOT_AUTHORIZED, connectMessage));
        ctx.close();
    } else {
        context.onAuthSuccess(address);
        deviceSessionCtx.setDeviceInfo(msg.getDeviceInfo());
        deviceSessionCtx.setDeviceProfile(msg.getDeviceProfile());
        deviceSessionCtx.setSessionInfo(SessionInfoCreator.create(msg, context, sessionId));
        transportService.process(deviceSessionCtx.getSessionInfo(), DefaultTransportService.getSessionEventMsg(SessionEvent.OPEN), new TransportServiceCallback<Void>() {
            @Override
            public void onSuccess(Void msg) {
                SessionMetaData sessionMetaData = transportService.registerAsyncSession(deviceSessionCtx.getSessionInfo(), MqttTransportHandler.this);
                checkGatewaySession(sessionMetaData);
                ctx.writeAndFlush(createMqttConnAckMsg(CONNECTION_ACCEPTED, connectMessage));
                deviceSessionCtx.setConnected(true);
                log.debug("[{}] Client connected!", sessionId);
                transportService.getCallbackExecutor().execute(() -> processMsgQueue(ctx)); //this callback will execute in Producer worker thread and hard or blocking work have to be submitted to the separate thread.
            }

            @Override
            public void onError(Throwable e) {
                if (e instanceof TbRateLimitsException) {
                    log.trace("[{}] Failed to submit session event: {}", sessionId, e.getMessage());
                } else {
                    log.warn("[{}] Failed to submit session event", sessionId, e);
                }
                ctx.writeAndFlush(createMqttConnAckMsg(MqttConnectReturnCode.CONNECTION_REFUSED_SERVER_UNAVAILABLE, connectMessage));
                ctx.close();
            }
        });
    }
}
```

```context.onAuthSuccess```主要做了限流。

接着最终应该送给了`DeviceActorMessageProcessor::processSessionStateMsgs`。

```java
private void processSessionStateMsgs(SessionInfoProto sessionInfo, SessionEventMsg msg) {
    UUID sessionId = getSessionId(sessionInfo);
    Objects.requireNonNull(sessionId);
    if (msg.getEvent() == SessionEvent.OPEN) {
        if (sessions.containsKey(sessionId)) {
            log.debug("[{}] Received duplicate session open event [{}]", deviceId, sessionId);
            return;
        }
        log.debug("[{}] Processing new session [{}]. Current sessions size {}", deviceId, sessionId, sessions.size());

        sessions.put(sessionId, new SessionInfoMetaData(new SessionInfo(SessionType.ASYNC, sessionInfo.getNodeId())));
        if (sessions.size() == 1) {
            reportSessionOpen();
        }
        systemContext.getDeviceStateService().onDeviceActivity(tenantId, deviceId, System.currentTimeMillis());
        dumpSessions();
    } else if (msg.getEvent() == SessionEvent.CLOSED) {
        log.debug("[{}] Canceling subscriptions for closed session [{}]", deviceId, sessionId);
        sessions.remove(sessionId);
        attributeSubscriptions.remove(sessionId);
        rpcSubscriptions.remove(sessionId);
        if (sessions.isEmpty()) {
            reportSessionClose();
        }
        dumpSessions();
    }
}
````

最终的凭证校验的代码在`DefaultTransportApiService::validateCredentials`由`DefaultTransportApiService::handle`调用。

```java
private ListenableFuture<TransportApiResponseMsg> validateCredentials(TransportProtos.ValidateBasicMqttCredRequestMsg mqtt) {
    DeviceCredentials credentials;
    if (StringUtils.isEmpty(mqtt.getUserName())) {
        credentials = checkMqttCredentials(mqtt, EncryptionUtil.getSha3Hash(mqtt.getClientId()));
        if (credentials != null) {
            return getDeviceInfo(credentials);
        } else {
            return getEmptyTransportApiResponseFuture();
        }
    } else {
        credentials = deviceCredentialsService.findDeviceCredentialsByCredentialsId(
                EncryptionUtil.getSha3Hash("|", mqtt.getClientId(), mqtt.getUserName()));
        if (checkIsMqttCredentials(credentials)) {
            var validationResult = validateMqttCredentials(mqtt, credentials);
            if (VALID.equals(validationResult)) {
                return getDeviceInfo(credentials);
            } else if (PASSWORD_MISMATCH.equals(validationResult)) {
                return getEmptyTransportApiResponseFuture();
            } else {
                return validateUserNameCredentials(mqtt);
            }
        } else {
            return validateUserNameCredentials(mqtt);
        }
    }
}
```

下面校验访问令牌和MQTT认证。

```java
private ListenableFuture<TransportApiResponseMsg> validateUserNameCredentials(TransportProtos.ValidateBasicMqttCredRequestMsg mqtt) {
    DeviceCredentials credentials = deviceCredentialsService.findDeviceCredentialsByCredentialsId(mqtt.getUserName());
    if (credentials != null) {
        switch (credentials.getCredentialsType()) {
            case ACCESS_TOKEN:
                return getDeviceInfo(credentials);
            case MQTT_BASIC:
                if (VALID.equals(validateMqttCredentials(mqtt, credentials))) {
                    return getDeviceInfo(credentials);
                } else {
                    return getEmptyTransportApiResponseFuture();
                }
        }
    }
    return getEmptyTransportApiResponseFuture();
}
```

绕来绕去，脑袋都要炸了，这也是我不喜欢Java的原因。再加上ThingsBoard还用了类似于Akka的Actor模型，就更加增大了复杂度。

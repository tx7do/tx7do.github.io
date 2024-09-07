# 部署Jitsi Meet

## Jitsi项目组成

- **Jitsi Meet**，与WebRTC兼容的JavaScript应用程序，使用Jitsi Videobridge提供高质量、可扩展的视频会议。基于React和React Native构建
- **Jitsi Videobridge（JVB）** - 与WebRTC兼容的服务器，用于在会议参与者之间路由视频流。
- **Jitsi Conference Focus (jicofo)** - 用于Jitsi会议的服务器端焦点组件，用于管理媒体会话，并充当每个参与者和视频桥之间的负载平衡器。
- **Jitsi Gateway to SIP (jigasi)** - 允许常规SIP客户端加入Jitsi会议的服务器端应用程序
- **Jitsi Broadcasting Infrastructure (jibri)** - 用于录制和/或流式传输Jitsi会议的一组工具，通过启动虚拟帧缓冲区中呈现的Chrome实例，并使用ffmpeg捕获和编码输出来工作

## 部署

下载源码

```bash
wget $(curl -s https://api.github.com/repos/jitsi/docker-jitsi-meet/releases/latest | grep 'zip' | cut -d" -f4)
```

解压缩

```bash
unzip stable-9258
```

进入代码目录

```bash
cd jitsi-docker-jitsi-meet-c92026a
```

创建配置

```bash
cp env.example .env
```

生成强密码

```bash
./gen-passwords.sh
```

修改`.env`配置

```env
HTTP_PORT=8088
HTTPS_PORT=9443

# 时区
TZ=Asia/Shanghai

# 公开链接
PUBLIC_URL=https://dns.com

# 启用访客
ENABLE_GUESTS=1
# 禁用身份验证
#ENABLE_AUTH=1

# 
ENABLE_XMPP_WEBSOCKET=0
```

Docker Compose部署

```bash
docker compose up -d
```

网络端口白名单：

- **80/TCP** Nginx服务使用。
- **443/TCP** - Nginx服务使用。HTTPS默认端口: 1. jitsi-meet页面资源加载 2. xmpp服务的BOSH接入
- **4443/TCP** - JVB服务使用，UDP不可用时jitsi-videobridge的备用接入端口
- **10000-20000/UDP** - JVB服务使用，RTP/RTCP连接：WebRTC客户端和服务端SFU(jitsi-videobridge)之间的视频流传输

## 参考资料

- [腾讯会议替代品！10分钟搭建一个开源视频会议项目——Jitsi ｜ 好玩儿的Docker项目](https://iwanlab.com/docker-compose-install-jitsi/)
- [浏览器也能开视频会议？开源项目Jitsi Meet部署教程](https://post.smzdm.com/p/akle006k/)

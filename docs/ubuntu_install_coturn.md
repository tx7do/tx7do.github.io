# Ubuntu 安装 CoTURN

## 使用apt安装

```bash
sudo apt-get -y update
sudo apt-get -y install coturn
```

## 开机启动

修改`/etc/default/coturn`文件：

```bash
sudo vim /etc/default/coturn
```

下面这一行默认是使用`#`注释掉的，去掉`#`注释：

```bash
TURNSERVER_ENABLED=1
```

## 修改配置

```ini
# --- 网络配置 ---
# 监听所有网络接口。注意：在生产环境中，应该只监听必要的接口
listening-ip=0.0.0.0
#listening-ip=2607:f0d0:1002:51::4

# 标准 TURN 端口
listening-port=3478
# TLS/DTLS 端口（取消注释以启用）
tls-listening-port=5349

# --- 中继配置 ---
# 中继端口范围，根据您的网络环境和预期负载调整
min-port=40000
max-port=60000

# 内部中继IP地址
relay-ip=0.0.0.0
# 外部IP地址（NAT后的公网IP，如果有）
external-ip=192.168.137.3

# --- 认证配置 ---
# 设置域名，用于长期凭证机制
realm=example.com
# 启用长期凭证机制
lt-cred-mech

# --- 用户凭证 ---
user=user:password1

# --- TLS/DTLS 配置 ---
# TLS 证书和私钥路径（取消注释以启用）
#cert=/etc/turnserver/fullchain.pem
#pkey=/etc/turnserver/privkey.pem
# 推荐的密码套件，提供强加密（取消注释以启用）
#cipher-list="ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384"

# --- 安全设置 ---
# 启用指纹，防止中间人攻击
fingerprint
# 启用过期 nonce 检测，防止重放攻击（取消注释以启用）
#stale-nonce=3600
# 设置 DTLS 会话密钥的生命周期（单位：秒）（取消注释以启用）
#dtls-key-lifetime=3600

# --- 性能优化 ---
# 最大允许的总带宽（字节/秒），0 表示无限制
max-bps=0
# 所有会话的总配额（字节/秒），格式：数字:数字，0 表示无限制
total-quota=0:0
# 单个用户的配额（字节/秒），0 表示无限制
user-quota=0

# --- 日志设置 ---
# 启用详细日志，便于调试。在生产环境中可以降低日志级别
verbose

log-file=/var/log/turn.log
syslog

# --- 高级配置 ---
# 允许环回地址，用于测试。生产环境中应禁用
#no-loopback-peers

# 允许使用 TURN 服务的 IP 范围，增强安全性（取消注释并根据需要调整）
#allowed-peer-ip=10.0.0.0-10.255.255.255
#allowed-peer-ip=172.16.0.0-172.31.255.255
#allowed-peer-ip=192.168.0.0-192.168.255.255

# 启用 CLI 访问和状态报告（取消注释并设置密码以启用）
#cli-password=<strong-admin-password>
#status-port=5986

# --- Web后台配置 ---
web-admin
web-admin-ip=0.0.0.0
web-port=8080
```

## 公开的免费STUN服务器

```bash
stunserver.org 
stun.xten.com 
stun.fwdnet.net 
stun.fwdnet.net:3478

stun.wirlab.net
stun01.sipphone.com

stun.iptel.org
stun.ekiga.net
stun.fwdnet.net 
stun01.sipphone.com (no DNS SRV record) 
stun.softjoys.com (no DNS SRV record) 
stun.voipbuster.com (no DNS SRV record) 
stun.voxgratia.org (no DNS SRV record)
stun.xten.com
stunserver.org
stun.sipgate.net:10000
stun.softjoys.com:3478
```

from <https://gist.github.com/zziuni/3741933>

```bash
# source : http://code.google.com/p/natvpn/source/browse/trunk/stun_server_list
# A list of available STUN server.
 
stun.l.google.com:19302
stun1.l.google.com:19302
stun2.l.google.com:19302
stun3.l.google.com:19302
stun4.l.google.com:19302
stun01.sipphone.com
stun.ekiga.net
stun.fwdnet.net
stun.ideasip.com
stun.iptel.org
stun.rixtelecom.se
stun.schlund.de
stunserver.org
stun.softjoys.com
stun.voiparound.com
stun.voipbuster.com
stun.voipstunt.com
stun.voxgratia.org
stun.xten.com
```

## 参考资料

- [CoTURN in Docker: A Step-by-Step Guide](https://www.metered.ca/blog/running-coturn-in-docker-a-step-by-step-guide/)
- [WebRTC 生产环境部署：CoTURN 服务器配置详解](https://watermelonwater.tech/archives/coturn%E4%B8%80%E9%94%AE%E9%83%A8%E7%BD%B2%EF%BC%9A%E4%BB%8E%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE%E5%88%B0docker%20compose%E9%83%A8%E7%BD%B2%EF%BC%8C%E6%90%AD%E5%BB%BA%E9%AB%98%E5%8F%AF%E7%94%A8WebRTC%E6%9C%8D%E5%8A%A1%EF%BC%8C%E7%90%86%E8%A7%A3%E5%90%84%E4%B8%AA%E7%AB%AF%E5%8F%A3%E7%9A%84%E5%90%AB%E4%B9%89%EF%BC%8C%E5%AE%9E%E7%8E%B0%E5%8A%A0%E5%AF%86)
- [安装和配置 WebRTC 的 STUN/TURN 服务 CoTURN](https://xueshi.io/2018/12/10/webrtc-coturn/)
- [How to install Turn/Stun server on AWS Ubuntu 20.04](https://cloudkul.com/blog/how-to-install-turn-stun-server-on-aws-ubuntu-20-04/)
- [在 Ubuntu 上安装 TURN 服务器](https://help.hcl-software.com/sametime/11.6/admin/turnserver_ubuntu.html)

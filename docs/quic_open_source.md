# QUIC协议开源实现列表

## 框架和开源实现

### C/C++

| Name                          | Version                                                       | Roles                                            | Handshake               |
|-------------------------------|---------------------------------------------------------------|--------------------------------------------------|-------------------------|
| Microsoft's [MsQuic](https://github.com/microsoft/msquic)            | draft-27/28/29/30/31/32                                       | client, server                                   | TLS 1.3 RFC             |
| Facebook's [mvfst](https://github.com/facebookincubator/mvfst)              | draft-29                                                      | library, client, server                          | TLS 1.3                 |
| Google's [Chromium](https://www.chromium.org/quic/playing-with-quic)             | Q043, Q046, Q050, T050, T051, draft-27, draft-29              | library, client, server                          | QUIC Crypto, TLS        |
| [ats](https://cwiki.apache.org/confluence/display/TS/QUIC) (Apache Traffic Server)   | draft-29                                                      | client. server                                   | TLS 1.3                 |
| LiteSpeed's [lsquic](https://github.com/litespeedtech/lsquic)            | Draft-32, Draft-29, Draft-28, Draft-27, Q043, Q046, and Q050. | library, client, server                          | QUIC Crypto, RFC 8446   |
| [ngtcp2](https://github.com/ngtcp2/ngtcp2)                        | draft-29, draft-30, draft-31, and draft-32                    | library, client, server                          | TLSv1.3 (RFC 8446)      |
| Cloudflare's [nginx-cloudflare](https://github.com/cloudflare/quiche/tree/master/extras/nginx) | draft-27, draft-28, draft-29                                  | server                                           | TLSv1.3 (RFC8446)       |
| [picoquic](https://github.com/private-octopus/picoquic)                      | draft-32/31/30/29/28/27                                       | library and test tools, test client, test server | TLS 1.3 (using picotls) |
| [Pluginized QUIC](https://github.com/p-quic/pquic)               | draft-29                                                      | library, client, server                          | TLS 1.3 (using picotls) |
| [quant](https://github.com/NTAP/quant)                         | draft-33, draft-34, v1                                              | library, client, server                          | TLS 1.3                 |
| Fastly's [quicly](https://github.com/h2o/quicly)               | draft-27                                                      | client, server                                   | TLS 1.3 (final)         |
| [nginx-quic](https://hg.nginx.org/nginx-quic/)               | draft-27 .. draft-32                                            | server                                   | TLSv1.3 (RFC8446)        |
| Alibaba's [xquic](https://github.com/alibaba/xquic)               | draft-29                                            | library                                   | TLSv1.3        |
| Google's [quiche](https://github.com/google/quiche)               | draft-29                                            | library                                   | TLSv1.3        |

### Rust

| Name                   | Version                      | Roles                   | Handshake         |
|------------------------|------------------------------|-------------------------|-------------------|
| Cloudflare's [quiche](https://github.com/cloudflare/quiche)    | draft-27, draft-28, draft-29 | library, client, server | TLSv1.3 (RFC8446) |
| Mozilla/Firefox's [Neqo](https://github.com/mozilla/neqo) | draft-30                     | library, client, server | TLS 1.3           |
| [Quinn](https://github.com/djc/quinn)                  | draft-28                     | library, client, server | TLS 1.3           |

### Go

| Name    | Version                  | Roles                   | Handshake   |
|---------|--------------------------|-------------------------|-------------|
| [quic-go](https://github.com/lucas-clemente/quic-go) | always the current draft | library, client, server | TLS 1.3 RFC |

### Node.js

| Name         | Version  | Roles          | Handshake |
|--------------|----------|----------------|-----------|
| [Node.js QUIC](https://github.com/nodejs/quic) | draft-25 | client, server | TLS 1.3   |

### Python

| Name    | Version  | Roles                   | Handshake |
|---------|----------|-------------------------|-----------|
| [aioquic](https://github.com/aiortc/aioquic) | draft-29 | library, client, server | TLS 1.3   |

### Haskell

| Name         | Version  | Roles                   | Handshake |
|--------------|----------|-------------------------|-----------|
| [Haskell quic](https://github.com/kazu-yamamoto/quic) | draft-29 | library, client, server | TLS 1.3   |

### Java

| Name | Version  | Roles           | Handshake |
|------|----------|-----------------|-----------|
| [kwik](https://bitbucket.org/pjtr/kwik) | draft-29, draft-30, draft-31, draft-32 | library, client | TLS 1.3   |

## 参考资料

- [Awesome QUIC](https://github.com/xileteam/awesome-quic)

# Kratos微服务框架下的的TLS单向和双向认证

## 什么是SSL

**SSL（安全套接字层）** 及其后继者 **TLS（传输层安全性）** 是用于在联网计算机之间建立经过身份验证和加密的链接的协议。 尽管SSL协议已随着以下版本的发布而被弃用 TLS 1.0，在1999年，将这些相关技术称为“ SSL”或“ SSL /TLS。” 最新版本是 TLS 1.3，定义于 [RFC 8446](https://tools.ietf.org/html/rfc8446) （八月2018）。

**SSL（安全套接字层）** 及其后继者 **TLS （传输层安全性）** 是用于在联网计算机之间建立经过身份验证和加密的链接的协议。 尽管SSL协议已随着以下版本的发布而被弃用 TLS 1.0，在1999年，将这些相关技术称为“ SSL”或“ SSL /TLS设立的区域办事处外，我们在美国也开设了办事处，以便我们为当地客户提供更多的支持。

## 什么是SSL证书？

**SSL证书** （也称为 TLS 或SSL /TLS 证书）是将网站的身份绑定到由公共密钥和私有密钥组成的加密密钥对的数字文档。 证书中包含的公钥允许Web浏览器执行以下操作： 通过 TLS 和 HTTPS 协议。 私钥在服务器上保持安全，并用于对网页和其他文档（例如图像和JavaScript文件）进行数字签名。

SSL证书还包括有关网站的标识信息（包括域名）以及（可选）有关网站所有者的标识信息。 如果Web服务器的SSL证书是由公共信任的证书颁发机构（CA）签名的，例如 [SSL.com](https://www.ssl.com/zh-CN/) ，最终用户的Web浏览器和操作系统将信任来自服务器的数字签名内容，使其具有真实性。

公司和组织需要在其网站上添加 SSL 证书，以保护在线交易并保持客户信息的私密性和安全性。

简而言之：SSL 可确保互联网连接的安全，并防止犯罪分子读取或修改两个系统之间传输的信息。如果您在地址栏中的 URL 旁看到一个挂锁图标，则表示 SSL 在保护您正在访问的网站。

SSL证书是一种 **X.509证书**。

## 什么是TLS

**TLS （传输层安全性）** 于1999年发布，是继 **SSL（安全套接字层）** 认证和加密协议。 TLS 1.3在中定义 [RFC 8446](https://tools.ietf.org/html/rfc8446) （八月2018）。

## 什么是mTLS

双向TLS（mTLS）是指在服务器端和客户端之间使用双向加密通道。如今，mTLS是确保云原生应用程序中微服务之间的通信安全的首选协议。

> 双向认证，顾名思义，客户端和服务器端都需要验证对方的身份，在建立Https连接的过程中，握手的流程比单向认证多了几步。单向认证的过程，客户端从服务器端下载服务器端公钥证书进行验证，然后建立安全通信通道。双向通信流程，客户端除了需要从服务器端下载服务器的公钥证书进行验证外，还需要把客户端的公钥证书上传到服务器端给服务器端进行验证，等双方都认证通过了，才开始建立安全通信通道进行数据传输。

传输层安全性（TLS）已用于保护Internet上客户端和服务器之间的流量很多年，但通常使用单向身份验证-服务器向用户提供证书以证明其身份。这种单向身份验证的基本示例是–在线访问银行帐户时，服务器向你的计算机发送证书，以证明它实际上是你要连接的银行。该证书还包含一个公共加密密钥，该密钥用于在你和数据通过的银行之间创建一个安全的加密链接。

双向TLS扩展了客户端-服务器TLS模型，以包括双方的身份验证。在银行依靠其他特定于应用程序的机制来确认客户身份的情况下，例如用户名和密码（通常带有两因素身份验证），mTLS使用x.509证书来识别和验证每个微服务。每个证书都包含一个公共加密密钥和一个身份，并由受信任的证书颁发机构签名，该证书颁发机构证明该证书代表提出该证书的实体。

在mTLS中，服务网格中的每个微服务都会验证对方的证书，并使用公共密钥来创建每个会话唯一的加密密钥。

* **TLS** **服务器端**提供一个授信证书，当我们使用 https 协议访问**服务器端**时，**客户端**会向**服务器端**索取证书并认证（浏览器会与自己的授信域匹配或弹出不安全的页面）。
* **mTLS** 则是由同一个 **Root CA** 生成两套证书，即**客户端证书**和**服务端证书**。客户端使用 https 访问服务端时，双方会交换证书，并进行认证，认证通过方可通信。

## 什么是X509

**X.509** 是用于的标准格式 **公钥证书**，是将加密密钥对与网站，个人或组织等身份安全地关联的数字文档。

X.509是公钥基础设施（PKI）的标准格式。X.509证书就是基于国际电信联盟（ITU）制定的X.509标准的数字证书。X.509证书主要用于识别互联网通信和计算机网络中的身份，保护数据传输安全。X.509证书无处不在，比如我们每天使用的网站、移动应用程序、电子文档以及连接的设备等都有它的身影。

X.509证书的常见应用包括：

* SSL /TLS 和 HTTPS 用于经过身份验证和加密的Web浏览
* 通过签名并加密的电子邮件 S/MIME 协议
* 代码签名
* 文件签署
* 客户端认证
* 政府签发的电子身份证

## 证书格式类型

证书主要的格式有以下几种

* .DER .CER，文件是二进制格式，只保存证书，不保存私钥。
* .PEM，一般是文本格式，可保存证书，可保存私钥。
* .CRT，可以是二进制格式，可以是文本格式，与 .DER 格式相同，不保存私钥。
* .PFX .P12，二进制格式，同时包含证书和私钥，一般有密码保护。
* .JKS，二进制格式，同时包含证书和私钥，一般有密码保护。

### DER

该格式是二进制文件内容，Java 和 Windows 服务器偏向于使用这种编码格式。

```text
3082 07fd 3082 05e5 a003 0201 0202 1068
1604 dff3 34f1 71d8 0a73 5599 c141 7230
0d06 092a 8648 86f7 0d01 010b 0500 3072
310b 3009 0603 5504 0613 0255 5331 0e30
0c06 0355 0408 0c05 5465 7861 7331 1030
0e06 0355 0407 0c07 486f 7573 746f 6e31
1130 0f06 0355 040a 0c08 5353 4c20 436f
7270 312e 302c 0603 5504 030c 2553 534c
2e63 6f6d 2045 5620 5353 4c20 496e 7465
726d 6564 6961 7465 2043 4120 5253 4120
5233 301e 170d 3230 3034 3031 3030 3538
3333 5a17 0d32 3130 3731 3630 3035 3833
335a 3081 bd31 0b30 0906 0355 0406 1302
5553 310e 300c 0603 5504 080c 0554 6578
6173 3110 300e 0603 5504 070c 0748 6f75
7374 6f6e 3111 300f 0603 5504 0a0c 0853
534c 2043 6f72 7031 1630 1406 0355 0405
130d 4e56 3230 3038 3136 3134 3234 3331
1430 1206 0355 0403 0c0b 7777 772e 7373
6c2e 636f 6d31 1d30 1b06 0355 040f 0c14
5072 6976 6174 6520 4f72 6761 6e69 7a61
7469 6f6e 3117 3015 060b 2b06 0104 0182
373c 0201 020c 064e 6576 6164 6131 1330
1106 0b2b 0601 0401 8237 3c02 0103 1302
5553 3082 0122 300d 0609 2a86 4886 f70d
0101 0105 0003 8201 0f00 3082 010a 0282
0101 00c7 85e4 646d bd45 09ce f144 ab2d
c0ad 0920 668a 63cb 7b25 b4b6 6d0d 9be9
8209 0e09 c7b8 8607 a81a c251 5efd a1e9
6292 4a24 4641 6f72 fa5a 2a29 c51c 3407
5295 8423 a454 1116 2648 2837 3bc5 a2e3
6b8e 715d 81e5 969b 9970 a4c1 dc58 e447
25e7 505b 33c5 2719 da00 19b7 4d9a 2466
4a64 e372 cfa5 84cc 60e1 f158 ea50 6988
4545 8865 2319 147e eb54 7aec bcfa 5382
8978 b35c 0a6d 3b43 0158 2819 a98b 4f20
7728 12bd 1754 c39e 49a2 9ade 763f 951a
d8d4 901e 2115 3e06 417f e086 debd 465a
b3ff ef2e d1d1 1092 1b94 bae7 2ba9 a966
486c b8dc 7470 05f0 ca17 061e 58ce c23c
c779 7bf7 4efa dd3c b7c3 db8f 3553 4efe
6140 30ac 1182 15d9 3ec0 148f 5270 dc4c
921e ff02 0301 0001 a382 0341 3082 033d
301f 0603 551d 2304 1830 1680 14bf c15a
87ff 28fa 413d fdb7 4fe4 1daf a061 5829
bd30 7f06 082b 0601 0505 0701 0104 7330
7130 4d06 082b 0601 0505 0730 0286 4168
7474 703a 2f2f 7777 772e 7373 6c2e 636f
6d2f 7265 706f 7369 746f 7279 2f53 534c
636f 6d2d 5375 6243 412d 4556 2d53 534c
2d52 5341 2d34 3039 362d 5233 2e63 7274
3020 0608 2b06 0105 0507 3001 8614 6874
7470 3a2f 2f6f 6373 7073 2e73 736c 2e63
6f6d 301f 0603 551d 1104 1830 1682 0b77
7777 2e73 736c 2e63 6f6d 8207 7373 6c2e
636f 6d30 5f06 0355 1d20 0458 3056 3007
0605 6781 0c01 0130 0d06 0b2a 8468 0186
f677 0205 0101 303c 060c 2b06 0104 0182
a930 0103 0104 302c 302a 0608 2b06 0105
0507 0201 161e 6874 7470 733a 2f2f 7777
772e 7373 6c2e 636f 6d2f 7265 706f 7369
746f 7279 301d 0603 551d 2504 1630 1406
082b 0601 0505 0703 0206 082b 0601 0505
0703 0130 4806 0355 1d1f 0441 303f 303d
a03b a039 8637 6874 7470 3a2f 2f63 726c
732e 7373 6c2e 636f 6d2f 5353 4c63 6f6d
2d53 7562 4341 2d45 562d 5353 4c2d 5253
412d 3430 3936 2d52 332e 6372 6c30 1d06
0355 1d0e 0416 0414 00c0 1542 1acf 0e6b
6481 daa6 7471 2149 e9c3 e18b 300e 0603
551d 0f01 01ff 0404 0302 05a0 3082 017d
060a 2b06 0104 01d6 7902 0402 0482 016d
0482 0169 0167 0077 00f6 5c94 2fd1 7730
2214 5418 0830 9456 8ee3 4d13 1933 bfdf
0c2f 200b cc4e f164 e300 0001 7133 4868
6f00 0004 0300 4830 4602 2100 eb17 a588
d47c 1a4f fade 961d 9d2f ef3b 1fc2 8e9b
4430 4bfc f565 a1d7 fbab 5881 0221 00f2
06b7 8753 6e43 cf0b a441 a450 8f05 bae7
964b 92a0 a7c5 bc50 5918 8e7a 68fd 2400
7500 9420 bc1e 8ed5 8d6c 8873 1f82 8b22
2c0d d1da 4d5e 6c4f 943d 61db 4e2f 584d
a2c2 0000 0171 3348 68dc 0000 0403 0046
3044 0220 1911 38c3 369b 3517 43f2 4abf
bc53 f7b5 07b6 866d 31e6 75ee 968c 21e0
86f0 de59 0220 561b ff79 520e 9952 ec07
11e2 bf97 a56b 4429 24c5 5899 8d09 16dc
5c9b abd9 1181 0075 00ee c095 ee8d 7264
0f92 e3c3 b91b c712 a369 6a09 7b4b 6a1a
1438 e647 b2cb edc5 f900 0001 7133 4868
f300 0004 0300 4630 4402 207a 22f6 e85a
cb37 4782 2d57 08de 6e5e c3df 2a05 697d
0d0e 1d9d 5a18 60c0 2c6b 1f02 2009 fabb
a1c3 02e6 dfb5 8e2e 4ce7 168b 98f0 b823
e597 dc8f c046 4592 ca23 bb21 0730 0d06
092a 8648 86f7 0d01 010b 0500 0382 0201
0027 aeba be10 9ee8 ea9a 0b92 ac75 379a
17fe 709a 1dcd 340d aa8e 2d75 ef8f 0f5f
de15 d600 10bb bcc4 5fb4 02de f126 23d8
8b94 4ac2 2972 3f9e affb 7898 d93f 65c3
b4bc 4c9d 38d5 52e1 6882 a9d7 8333 494c
d1c9 ea0e 02c2 7b40 00cc 0a51 ca50 3947
514d a936 ea3c f18e a282 8bd3 ddbb 27c0
9362 1103 6aca 6492 6219 2dc3 4b5a 76ea
2a8e a5e7 d3a8 2c56 2a16 4d50 d7ca c779
a84c 78b7 ab08 8087 0c9b 6e98 1f5b c9a4
2404 84aa 5cdb 2d3b 8119 2494 1651 b4c8
d386 fe1c 5f2c 8c5f bb93 71d4 fb00 904f
b9e8 9f0a 8576 e49c 57ba 8f1d e75d fd83
03f5 0407 bb20 154f c76b bb28 dfd4 c8e5
dd66 6c0c 7ff4 e614 6c03 7427 ecc8 77ff
66c0 76c0 b1e8 cd36 2801 5990 f45a 14d4
92e0 7158 afa8 9faf 3650 611d 7865 c4c7
4dd2 3f34 47d3 73e8 4220 9508 de2b 73bc
23f7 051a 6fc1 f3ee 3684 e942 21df 5976
d9dd 25c4 4956 38b4 c03d 2ac1 ebc2 69f0
3d8c 9947 bff8 ec13 e23d 533e 9ca4 2ca1
b30f a5ac 5771 520a 94e7 c6b1 a9e2 bcf4
547e 368e 2ad0 820e f898 b5ac 92ab f679
1207 406a 5e8c d59c 4d58 07f2 8bbd d22c
b986 49ba a6f6 a4a9 2efb 3cd3 ea05 301d
44d9 bc18 8d3a d5cb e0dc 7073 f293 ed6c
ce49 ddb0 3f5d 1023 c0ca 838b df88 d0ec
1d69 81d5 ce0a 8e2e a03a 0039 b925 3368
69aa fefe 159d c2b9 52bf a7f4 b6df 9df2
dcdb c279 7edf c6a2 d8a7 3320 e4de 26ab
175d 1896 a70e 99e5 f5b8 598a 6dd8 bf5e
8ac6 9640 a830 5dd3 0f1f 2b9a 9f43 0620
7f
```

### PEM

Privacy Enhanced Mail，一般为文本格式（Base64 ASCII），以 —–BEGIN… 开头，以 —–END… 结尾。中间的内容是 BASE64 编码。这种格式可以保存证书和私钥，有时我们也把PEM 格式的私钥的后缀改为 .key 以区别证书与私钥。具体你可以看文件的内容。

这种格式常用于 Apache 和 Nginx 服务器。

* 如果存在`——BEGIN CERTIFICATE——`，则说明这是一个证书文件。
* 如果存在`—–BEGIN RSA PRIVATE KEY—–`，则说明这是一个私钥文件


```text
-----BEGIN CERTIFICATE-----
MIIH/TCCBeWgAwIBAgIQaBYE3/M08XHYCnNVmcFBcjANBgkqhkiG9w0BAQsFADBy
MQswCQYDVQQGEwJVUzEOMAwGA1UECAwFVGV4YXMxEDAOBgNVBAcMB0hvdXN0b24x
ETAPBgNVBAoMCFNTTCBDb3JwMS4wLAYDVQQDDCVTU0wuY29tIEVWIFNTTCBJbnRl
cm1lZGlhdGUgQ0EgUlNBIFIzMB4XDTIwMDQwMTAwNTgzM1oXDTIxMDcxNjAwNTgz
M1owgb0xCzAJBgNVBAYTAlVTMQ4wDAYDVQQIDAVUZXhhczEQMA4GA1UEBwwHSG91
c3RvbjERMA8GA1UECgwIU1NMIENvcnAxFjAUBgNVBAUTDU5WMjAwODE2MTQyNDMx
FDASBgNVBAMMC3d3dy5zc2wuY29tMR0wGwYDVQQPDBRQcml2YXRlIE9yZ2FuaXph
dGlvbjEXMBUGCysGAQQBgjc8AgECDAZOZXZhZGExEzARBgsrBgEEAYI3PAIBAxMC
VVMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDHheRkbb1FCc7xRKst
wK0JIGaKY8t7JbS2bQ2b6YIJDgnHuIYHqBrCUV79oelikkokRkFvcvpaKinFHDQH
UpWEI6RUERYmSCg3O8Wi42uOcV2B5ZabmXCkwdxY5Ecl51BbM8UnGdoAGbdNmiRm
SmTjcs+lhMxg4fFY6lBpiEVFiGUjGRR+61R67Lz6U4KJeLNcCm07QwFYKBmpi08g
dygSvRdUw55Jopredj+VGtjUkB4hFT4GQX/ght69Rlqz/+8u0dEQkhuUuucrqalm
SGy43HRwBfDKFwYeWM7CPMd5e/dO+t08t8PbjzVTTv5hQDCsEYIV2T7AFI9ScNxM
kh7/AgMBAAGjggNBMIIDPTAfBgNVHSMEGDAWgBS/wVqH/yj6QT39t0/kHa+gYVgp
vTB/BggrBgEFBQcBAQRzMHEwTQYIKwYBBQUHMAKGQWh0dHA6Ly93d3cuc3NsLmNv
bS9yZXBvc2l0b3J5L1NTTGNvbS1TdWJDQS1FVi1TU0wtUlNBLTQwOTYtUjMuY3J0
MCAGCCsGAQUFBzABhhRodHRwOi8vb2NzcHMuc3NsLmNvbTAfBgNVHREEGDAWggt3
d3cuc3NsLmNvbYIHc3NsLmNvbTBfBgNVHSAEWDBWMAcGBWeBDAEBMA0GCyqEaAGG
9ncCBQEBMDwGDCsGAQQBgqkwAQMBBDAsMCoGCCsGAQUFBwIBFh5odHRwczovL3d3
dy5zc2wuY29tL3JlcG9zaXRvcnkwHQYDVR0lBBYwFAYIKwYBBQUHAwIGCCsGAQUF
BwMBMEgGA1UdHwRBMD8wPaA7oDmGN2h0dHA6Ly9jcmxzLnNzbC5jb20vU1NMY29t
LVN1YkNBLUVWLVNTTC1SU0EtNDA5Ni1SMy5jcmwwHQYDVR0OBBYEFADAFUIazw5r
ZIHapnRxIUnpw+GLMA4GA1UdDwEB/wQEAwIFoDCCAX0GCisGAQQB1nkCBAIEggFt
BIIBaQFnAHcA9lyUL9F3MCIUVBgIMJRWjuNNExkzv98MLyALzE7xZOMAAAFxM0ho
bwAABAMASDBGAiEA6xeliNR8Gk/63pYdnS/vOx/CjptEMEv89WWh1/urWIECIQDy
BreHU25DzwukQaRQjwW655ZLkqCnxbxQWRiOemj9JAB1AJQgvB6O1Y1siHMfgosi
LA3R2k1ebE+UPWHbTi9YTaLCAAABcTNIaNwAAAQDAEYwRAIgGRE4wzabNRdD8kq/
vFP3tQe2hm0x5nXulowh4Ibw3lkCIFYb/3lSDplS7AcR4r+XpWtEKSTFWJmNCRbc
XJur2RGBAHUA7sCV7o1yZA+S48O5G8cSo2lqCXtLahoUOOZHssvtxfkAAAFxM0ho
8wAABAMARjBEAiB6IvboWss3R4ItVwjebl7D3yoFaX0NDh2dWhhgwCxrHwIgCfq7
ocMC5t+1ji5M5xaLmPC4I+WX3I/ARkWSyiO7IQcwDQYJKoZIhvcNAQELBQADggIB
ACeuur4QnujqmguSrHU3mhf+cJodzTQNqo4tde+PD1/eFdYAELu8xF+0At7xJiPY
i5RKwilyP56v+3iY2T9lw7S8TJ041VLhaIKp14MzSUzRyeoOAsJ7QADMClHKUDlH
UU2pNuo88Y6igovT3bsnwJNiEQNqymSSYhktw0taduoqjqXn06gsVioWTVDXysd5
qEx4t6sIgIcMm26YH1vJpCQEhKpc2y07gRkklBZRtMjThv4cXyyMX7uTcdT7AJBP
ueifCoV25JxXuo8d5139gwP1BAe7IBVPx2u7KN/UyOXdZmwMf/TmFGwDdCfsyHf/
ZsB2wLHozTYoAVmQ9FoU1JLgcVivqJ+vNlBhHXhlxMdN0j80R9Nz6EIglQjeK3O8
I/cFGm/B8+42hOlCId9ZdtndJcRJVji0wD0qwevCafA9jJlHv/jsE+I9Uz6cpCyh
sw+lrFdxUgqU58axqeK89FR+No4q0IIO+Ji1rJKr9nkSB0BqXozVnE1YB/KLvdIs
uYZJuqb2pKku+zzT6gUwHUTZvBiNOtXL4Nxwc/KT7WzOSd2wP10QI8DKg4vfiNDs
HWmB1c4Kji6gOgA5uSUzaGmq/v4VncK5Ur+n9LbfnfLc28J5ft/GotinMyDk3iar
F10YlqcOmeX1uFmKbdi/XorGlkCoMF3TDx8rmp9DBiB/
-----END CERTIFICATE-----
```

### CRT

Certificate 的简称，有可能是 PEM 编码格式，也有可能是 DER 编码格式。

### PFX

Predecessor of PKCS#12，这种格式是二进制格式，且证书和私钥存在一个 PFX 文件中。一般用于 Windows 上的 IIS 服务器。改格式的文件一般会有一个密码用于保证私钥的安全。

### JKS

Java Key Storage，很容易知道这是 JAVA 的专属格式，利用 JAVA 的一个叫 keytool 的工具可以进行格式转换。一般用于 Tomcat 服务器。

## 服务器端的证书生成

### 1. 生成服务器端的私钥

```bash
openssl genrsa -out server.key 2048
```

### 2. 生成服务器端证书

```bash
openssl req -new -x509 -key server.key -out server.pem -days 3650
```

或者

```bash
go run $GOROOT/src/crypto/tls/generate_cert.go --host localhost
```

## 客户端的证书生成

### 1. 生成客户端的私钥

```bash
openssl genrsa -out client.key 2048
```

### 2. 生成客户端的证书

```bash
openssl req -new -x509 -key client.key -out client.pem -days 3650
```

## 使用脚本生成

[generate_certs.sh](https://github.com/HemantNegi/go-mtls/blob/master/generate_certs.sh)

```bash
#!/usr/bin/env bash
# If you are getting the error “Error Loading extension section v3_ca” using macOS on step 2,
# add the following to your /etc/ssl/openssl.cnf
# [ v3_ca ]
# basicConstraints = critical,CA:TRUE
# subjectKeyIdentifier = hash
# authorityKeyIdentifier = keyid:always,issuer:always

# 生成CA的私钥和证书
echo Generate the ca certificate
openssl genrsa -out ../certs/ca.key 4096
openssl req -x509 -sha256 -new -nodes -key ../certs/ca.key -days 3650 -subj "/C=IN/ST=UK/L=Dehradun/O=VMware/CN=Hemant Root CA" -extensions v3_ca -out ../certs/ca.crt

# 生成服务端的私钥和证书
echo generating server certificate
openssl genrsa -out ../certs/server.key 2048
openssl req -new -subj "/C=IN/ST=UK/L=Dehradun/O=VMware/CN=localhost" -key ../certs/server.key -out server_signing_req.csr
openssl x509 -req -days 365 -in server_signing_req.csr -CA ../certs/ca.crt -CAkey ../certs/ca.key -CAcreateserial -out ../certs/server.crt
del server_signing_req.csr

# 生成客户端的私钥和证书
echo generating client certificate
openssl genrsa -out ../certs/client.key 2048
openssl req -new -subj "/C=IN/ST=UK/L=Dehradun/O=VMware/CN=localhost" -key ../certs/client.key -out client_signing_req.csr
openssl x509 -req -days 365 -in client_signing_req.csr -CA ../certs/ca.crt -CAkey ../certs/ca.key -CAcreateserial -out ../certs/client.crt
rm client_signing_req.csr

# 验证证书
openssl verify -CAfile ../certs/ca.crt ../certs/server.crt
openssl verify -CAfile ../certs/ca.crt ../certs/client.crt
```

```bat
:: 生成CA的私钥和证书
echo Generate the ca certificate
openssl genrsa -out ../certs/ca.key 4096
openssl req -x509 -sha256 -new -nodes -key ../certs/ca.key -days 3650 -subj "/C=CN/O=VMware/CN=Root CA" -extensions v3_ca -out ../certs/ca.crt

:: 生成服务端的私钥和证书
echo generating server certificate
openssl genrsa -out ../certs/server.key 2048
openssl req -new -subj "/C=CN/O=VMware/CN=host.docker.internal" -key ../certs/server.key -out server_signing_req.csr
openssl x509 -req -days 365 -in server_signing_req.csr -CA ../certs/ca.crt -CAkey ../certs/ca.key -CAcreateserial -out ../certs/server.crt
del server_signing_req.csr

:: 生成客户端的私钥和证书
echo generating client certificate
openssl genrsa -out ../certs/client.key 2048
openssl req -new -subj "/C=CN/O=VMware/CN=host.docker.internal" -key ../certs/client.key -out client_signing_req.csr
openssl x509 -req -days 365 -in client_signing_req.csr -CA ../certs/ca.crt -CAkey ../certs/ca.key -CAcreateserial -out ../certs/client.crt
del client_signing_req.csr

:: 验证证书
openssl verify -CAfile ../certs/ca.crt ../certs/server.crt
openssl verify -CAfile ../certs/ca.crt ../certs/client.crt
```

## 在线工具

测试证书生成工具 <https://myssl.com/create_test_cert.html>
证书查看工具 <https://myssl.com/cert_decode.html>

## golang实例代码

gprc进行mTLS双向加密

```go
var opts = []grpc.ServerOption{
      grpc.Middleware(
            recovery.Recovery(),
            tracing.Server(),
            logging.Server(logger),
      ),
      grpc.TLSConfig(bootstrap.NewServerTlsConfig(dir+"/server.key", dir+"/server.crt", dir+"/ca.crt")),
}
```

http进行TLS单向加密

```go
var opts = []http.ServerOption{
      NewMiddleware(logger),
      http.Filter(handlers.CORS(
            handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
            handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"}),
            handlers.AllowedOrigins([]string{"*"}),
      )),
      http.TLSConfig(bootstrap.NewServerTlsConfig(dir+"/server.key", dir+"/server.crt", "")),
}
```

客户端使用单向加密的话，不用任何证书也能行。

```go
callHTTP("https://127.0.0.1:8000", NewTlsConfig("", "", ""))
NewTlsConfig("", "", "")
```

客户端双向加密的话就要把所有的证书都招呼上。

```go
callGRPC("192.168.1.6:9000", NewTlsConfig(dir+"/client.key", dir+"/client.crt", dir+"/ca.crt"))
```

初始化的服务器和客户端的代码在这里

```go
// 用来控制客户端是否证书和服务器主机名。如果设置为true,则不会校验证书以及证书中的主机名和服务器主机名是否一致。
const insecureSkipVerify = true

// TLSInfo holds the SSL certificates paths.
type TLSInfo struct {
	CertFile           string `json:"CertFile"`
	KeyFile            string `json:"KeyFile"`
	CAFile             string `json:"CAFile"`
	InsecureSkipVerify bool   `json:"InsecureSkipVerify"`
}

func (info TLSInfo) Scheme() string {
	if info.KeyFile != "" && info.CertFile != "" {
		return "https"
	} else {
		return "http"
	}
}

func (info TLSInfo) ServerConfig() (*tls.Config, error) {
	if info.KeyFile == "" || info.CertFile == "" {
		return nil, fmt.Errorf("KeyFile and CertFile must both be present[key: %v, cert: %v]", info.KeyFile, info.CertFile)
	}

	var cfg tls.Config
	cfg.InsecureSkipVerify = info.InsecureSkipVerify
	//cfg.ServerName = "host.docker.internal"
	cfg.MinVersion = tls.VersionTLS13

	tlsCert, err := tls.LoadX509KeyPair(info.CertFile, info.KeyFile)
	if err != nil {
		log.Println("LoadX509KeyPair error:", err)
		return nil, err
	}

	cfg.Certificates = []tls.Certificate{tlsCert}

	if info.CAFile != "" {
		cfg.ClientAuth = tls.RequireAndVerifyClientCert
		cp, err := newCertPool(info.CAFile)
		if err != nil {
			log.Fatalln("read cert file error:", err)
			return nil, err
		}

		cfg.RootCAs = cp
		cfg.ClientCAs = cp
	} else {
		cfg.ClientAuth = tls.NoClientCert
	}

	return &cfg, nil
}

func (info TLSInfo) ClientConfig() (*tls.Config, error) {
	var cfg tls.Config
	cfg.InsecureSkipVerify = info.InsecureSkipVerify
	//cfg.ServerName = "host.docker.internal"
	cfg.MinVersion = tls.VersionTLS13

	if info.CAFile != "" {
		cp, err := newCertPool(info.CAFile)
		if err != nil {
			log.Fatalln("read cert file error:", err)
			return nil, err
		}

		cfg.RootCAs = cp
	}

	if info.KeyFile == "" || info.CertFile == "" {
		return &cfg, nil
	}

	tlsCert, err := tls.LoadX509KeyPair(info.CertFile, info.KeyFile)
	if err != nil {
		log.Fatalln("read pair file error:", err)
		return nil, err
	}

	cfg.Certificates = []tls.Certificate{tlsCert}

	return &cfg, nil
}

// newCertPool creates x509 certPool with provided CA file
func newCertPool(caFile string) (*x509.CertPool, error) {
	certPool := x509.NewCertPool()
	pemByte, err := os.ReadFile(caFile)
	if err != nil {
		return nil, err
	}

	if !certPool.AppendCertsFromPEM(pemByte) {
		return nil, fmt.Errorf("can't add CA cert")
	}
	return certPool, nil
}

// NewServerTlsConfig 创建服务端TLS证书认证配置
// param [in] keyFile 服务端私钥文件路径，必须提供
// param [in] certFile 服务端证书文件路径，必须提供
// param [in] caFile CA根证书，如果提供则为双向认证，否则为单向认证
func NewServerTlsConfig(keyFile, certFile, caFile string) *tls.Config {
	var info = TLSInfo{
		CertFile:           certFile,
		KeyFile:            keyFile,
		CAFile:             caFile,
		InsecureSkipVerify: insecureSkipVerify,
	}
	cfg, _ := info.ServerConfig()
	return cfg
}

// NewClientTlsConfig 创建客户端端TLS证书认证配置
// param [in] keyFile 客户端私钥文件路径
// param [in] certFile 客户端证书文件路径
// param [in] caFile CA根证书
func NewClientTlsConfig(keyFile, certFile, caFile string) *tls.Config {
	var info = TLSInfo{
		CertFile:           certFile,
		KeyFile:            keyFile,
		CAFile:             caFile,
		InsecureSkipVerify: insecureSkipVerify,
	}
	cfg, _ := info.ClientConfig()
	return cfg
}
```

## 踩的坑

我用 **自签名证书(self-signed cert)** 的时候，客户端连服务端的：127.0.0.1和localhost都是通畅的，可是我一旦用局域网IP（比如：192.168.1.6），就连接不上，这个可真是让人烦恼啊……或许，需要一张由认证网站签发的证书才行。

## 参考资料

* [基于x509的认证授权技术
](https://islishude.github.io/blog/2020/09/22/crypto/%E5%9F%BA%E4%BA%8Ex509%E7%9A%84%E8%AE%A4%E8%AF%81%E6%8E%88%E6%9D%83%E6%8A%80%E6%9C%AF/)
* [双向TLS：保护服务网格中微服务的通信安全](https://www.kubernetes.org.cn/8900.html)
* [什么是SSL？](https://www.ssl.com/zh-CN/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E4%BB%80%E4%B9%88%E6%98%AFssl/)
* [为 Ingress-nginx 配置双向认证（mtls）](https://zhuanlan.zhihu.com/p/140752944)
* [PEM，DER，CRT和CER：X.509编码和转换](https://www.ssl.com/zh-CN/%E6%8C%87%E5%AF%BC/pem-der-crt%E5%92%8Ccer-x-509%E7%BC%96%E7%A0%81%E5%92%8C%E8%BD%AC%E6%8D%A2/)
* [SSL 证书格式普及，PEM、CER、JKS、PKCS12](https://blog.freessl.cn/ssl-cert-format-introduce/)
* [Java 证书以及证书管理(keytool实例),jks\crt\cet\ketstore](https://www.cnblogs.com/molao-doing/articles/9687445.html)
* [使用Go实现TLS 服务器和客户端](https://colobu.com/2016/06/07/simple-golang-tls-examples/)
* [维基百科 - 传输层安全性协议](https://zh.wikipedia.org/wiki/%E5%82%B3%E8%BC%B8%E5%B1%A4%E5%AE%89%E5%85%A8%E5%8D%94%E8%AD%B0)
* [SSL/TLS协议运行机制的概述](https://www.ruanyifeng.com/blog/2014/02/ssl_tls.html)
* [gist - TLS server and client](https://gist.github.com/spikebike/2232102)
* [Golang TLS example](https://github.com/nareix/tls-example)
* [golang crypto/tls pkg](https://golang.org/pkg/crypto/tls/)
* [局域网内搭建浏览器可信任的SSL证书](https://www.tangyuecan.com/2021/12/17/%E5%B1%80%E5%9F%9F%E7%BD%91%E5%86%85%E6%90%AD%E5%BB%BA%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8F%AF%E4%BF%A1%E4%BB%BB%E7%9A%84ssl%E8%AF%81%E4%B9%A6/)

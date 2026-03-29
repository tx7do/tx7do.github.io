<template><div><h1 id="kratos微服务框架下的tls单向和双向认证" tabindex="-1"><a class="header-anchor" href="#kratos微服务框架下的tls单向和双向认证"><span>Kratos微服务框架下的TLS单向和双向认证</span></a></h1>
<h2 id="什么是ssl" tabindex="-1"><a class="header-anchor" href="#什么是ssl"><span>什么是SSL</span></a></h2>
<p><strong>SSL（安全套接字层）</strong> 及其后继者 <strong>TLS（传输层安全性）</strong> 是用于在联网计算机之间建立经过身份验证和加密的链接的协议。 尽管SSL协议已随着以下版本的发布而被弃用 TLS 1.0，在1999年，将这些相关技术称为“ SSL”或“ SSL /TLS。” 最新版本是 TLS 1.3，定义于 <a href="https://tools.ietf.org/html/rfc8446" target="_blank" rel="noopener noreferrer">RFC 8446</a> （八月2018）。</p>
<p><strong>SSL（安全套接字层）</strong> 及其后继者 <strong>TLS （传输层安全性）</strong> 是用于在联网计算机之间建立经过身份验证和加密的链接的协议。 尽管SSL协议已随着以下版本的发布而被弃用 TLS 1.0，在1999年，将这些相关技术称为“ SSL”或“ SSL /TLS设立的区域办事处外，我们在美国也开设了办事处，以便我们为当地客户提供更多的支持。</p>
<h2 id="什么是ssl证书" tabindex="-1"><a class="header-anchor" href="#什么是ssl证书"><span>什么是SSL证书？</span></a></h2>
<p><strong>SSL证书</strong> （也称为 TLS 或SSL /TLS 证书）是将网站的身份绑定到由公共密钥和私有密钥组成的加密密钥对的数字文档。 证书中包含的公钥允许Web浏览器执行以下操作： 通过 TLS 和 HTTPS 协议。 私钥在服务器上保持安全，并用于对网页和其他文档（例如图像和JavaScript文件）进行数字签名。</p>
<p>SSL证书还包括有关网站的标识信息（包括域名）以及（可选）有关网站所有者的标识信息。 如果Web服务器的SSL证书是由公共信任的证书颁发机构（CA）签名的，例如 <a href="https://www.ssl.com/zh-CN/" target="_blank" rel="noopener noreferrer">SSL.com</a> ，最终用户的Web浏览器和操作系统将信任来自服务器的数字签名内容，使其具有真实性。</p>
<p>公司和组织需要在其网站上添加 SSL 证书，以保护在线交易并保持客户信息的私密性和安全性。</p>
<p>简而言之：SSL 可确保互联网连接的安全，并防止犯罪分子读取或修改两个系统之间传输的信息。如果您在地址栏中的 URL 旁看到一个挂锁图标，则表示 SSL 在保护您正在访问的网站。</p>
<p>SSL证书是一种 <strong>X.509证书</strong>。</p>
<h2 id="什么是tls" tabindex="-1"><a class="header-anchor" href="#什么是tls"><span>什么是TLS</span></a></h2>
<p><strong>TLS （传输层安全性）</strong> 于1999年发布，是继 <strong>SSL（安全套接字层）</strong> 认证和加密协议。 TLS 1.3在中定义 <a href="https://tools.ietf.org/html/rfc8446" target="_blank" rel="noopener noreferrer">RFC 8446</a> （八月2018）。</p>
<h2 id="什么是mtls" tabindex="-1"><a class="header-anchor" href="#什么是mtls"><span>什么是mTLS</span></a></h2>
<p>双向TLS（mTLS）是指在服务器端和客户端之间使用双向加密通道。如今，mTLS是确保云原生应用程序中微服务之间的通信安全的首选协议。</p>
<blockquote>
<p>双向认证，顾名思义，客户端和服务器端都需要验证对方的身份，在建立Https连接的过程中，握手的流程比单向认证多了几步。单向认证的过程，客户端从服务器端下载服务器端公钥证书进行验证，然后建立安全通信通道。双向通信流程，客户端除了需要从服务器端下载服务器的公钥证书进行验证外，还需要把客户端的公钥证书上传到服务器端给服务器端进行验证，等双方都认证通过了，才开始建立安全通信通道进行数据传输。</p>
</blockquote>
<p>传输层安全性（TLS）已用于保护Internet上客户端和服务器之间的流量很多年，但通常使用单向身份验证-服务器向用户提供证书以证明其身份。这种单向身份验证的基本示例是–在线访问银行帐户时，服务器向你的计算机发送证书，以证明它实际上是你要连接的银行。该证书还包含一个公共加密密钥，该密钥用于在你和数据通过的银行之间创建一个安全的加密链接。</p>
<p>双向TLS扩展了客户端-服务器TLS模型，以包括双方的身份验证。在银行依靠其他特定于应用程序的机制来确认客户身份的情况下，例如用户名和密码（通常带有两因素身份验证），mTLS使用x.509证书来识别和验证每个微服务。每个证书都包含一个公共加密密钥和一个身份，并由受信任的证书颁发机构签名，该证书颁发机构证明该证书代表提出该证书的实体。</p>
<p>在mTLS中，服务网格中的每个微服务都会验证对方的证书，并使用公共密钥来创建每个会话唯一的加密密钥。</p>
<ul>
<li><strong>TLS</strong> <strong>服务器端</strong>提供一个授信证书，当我们使用 https 协议访问<strong>服务器端</strong>时，<strong>客户端</strong>会向<strong>服务器端</strong>索取证书并认证（浏览器会与自己的授信域匹配或弹出不安全的页面）。</li>
<li><strong>mTLS</strong> 则是由同一个 <strong>Root CA</strong> 生成两套证书，即<strong>客户端证书</strong>和<strong>服务端证书</strong>。客户端使用 https 访问服务端时，双方会交换证书，并进行认证，认证通过方可通信。</li>
</ul>
<h2 id="什么是x509" tabindex="-1"><a class="header-anchor" href="#什么是x509"><span>什么是X509</span></a></h2>
<p><strong>X.509</strong> 是用于的标准格式 <strong>公钥证书</strong>，是将加密密钥对与网站，个人或组织等身份安全地关联的数字文档。</p>
<p>X.509是公钥基础设施（PKI）的标准格式。X.509证书就是基于国际电信联盟（ITU）制定的X.509标准的数字证书。X.509证书主要用于识别互联网通信和计算机网络中的身份，保护数据传输安全。X.509证书无处不在，比如我们每天使用的网站、移动应用程序、电子文档以及连接的设备等都有它的身影。</p>
<p>X.509证书的常见应用包括：</p>
<ul>
<li>SSL /TLS 和 HTTPS 用于经过身份验证和加密的Web浏览</li>
<li>通过签名并加密的电子邮件 S/MIME 协议</li>
<li>代码签名</li>
<li>文件签署</li>
<li>客户端认证</li>
<li>政府签发的电子身份证</li>
</ul>
<h2 id="证书格式类型" tabindex="-1"><a class="header-anchor" href="#证书格式类型"><span>证书格式类型</span></a></h2>
<p>证书主要的格式有以下几种</p>
<ul>
<li>.DER .CER，文件是二进制格式，只保存证书，不保存私钥。</li>
<li>.PEM，一般是文本格式，可保存证书，可保存私钥。</li>
<li>.CRT，可以是二进制格式，可以是文本格式，与 .DER 格式相同，不保存私钥。</li>
<li>.PFX .P12，二进制格式，同时包含证书和私钥，一般有密码保护。</li>
<li>.JKS，二进制格式，同时包含证书和私钥，一般有密码保护。</li>
</ul>
<h3 id="der" tabindex="-1"><a class="header-anchor" href="#der"><span>DER</span></a></h3>
<p>该格式是二进制文件内容，Java 和 Windows 服务器偏向于使用这种编码格式。</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">3082 07fd 3082 05e5 a003 0201 0202 1068</span>
<span class="line">1604 dff3 34f1 71d8 0a73 5599 c141 7230</span>
<span class="line">0d06 092a 8648 86f7 0d01 010b 0500 3072</span>
<span class="line">310b 3009 0603 5504 0613 0255 5331 0e30</span>
<span class="line">0c06 0355 0408 0c05 5465 7861 7331 1030</span>
<span class="line">0e06 0355 0407 0c07 486f 7573 746f 6e31</span>
<span class="line">1130 0f06 0355 040a 0c08 5353 4c20 436f</span>
<span class="line">7270 312e 302c 0603 5504 030c 2553 534c</span>
<span class="line">2e63 6f6d 2045 5620 5353 4c20 496e 7465</span>
<span class="line">726d 6564 6961 7465 2043 4120 5253 4120</span>
<span class="line">5233 301e 170d 3230 3034 3031 3030 3538</span>
<span class="line">3333 5a17 0d32 3130 3731 3630 3035 3833</span>
<span class="line">335a 3081 bd31 0b30 0906 0355 0406 1302</span>
<span class="line">5553 310e 300c 0603 5504 080c 0554 6578</span>
<span class="line">6173 3110 300e 0603 5504 070c 0748 6f75</span>
<span class="line">7374 6f6e 3111 300f 0603 5504 0a0c 0853</span>
<span class="line">534c 2043 6f72 7031 1630 1406 0355 0405</span>
<span class="line">130d 4e56 3230 3038 3136 3134 3234 3331</span>
<span class="line">1430 1206 0355 0403 0c0b 7777 772e 7373</span>
<span class="line">6c2e 636f 6d31 1d30 1b06 0355 040f 0c14</span>
<span class="line">5072 6976 6174 6520 4f72 6761 6e69 7a61</span>
<span class="line">7469 6f6e 3117 3015 060b 2b06 0104 0182</span>
<span class="line">373c 0201 020c 064e 6576 6164 6131 1330</span>
<span class="line">1106 0b2b 0601 0401 8237 3c02 0103 1302</span>
<span class="line">5553 3082 0122 300d 0609 2a86 4886 f70d</span>
<span class="line">0101 0105 0003 8201 0f00 3082 010a 0282</span>
<span class="line">0101 00c7 85e4 646d bd45 09ce f144 ab2d</span>
<span class="line">c0ad 0920 668a 63cb 7b25 b4b6 6d0d 9be9</span>
<span class="line">8209 0e09 c7b8 8607 a81a c251 5efd a1e9</span>
<span class="line">6292 4a24 4641 6f72 fa5a 2a29 c51c 3407</span>
<span class="line">5295 8423 a454 1116 2648 2837 3bc5 a2e3</span>
<span class="line">6b8e 715d 81e5 969b 9970 a4c1 dc58 e447</span>
<span class="line">25e7 505b 33c5 2719 da00 19b7 4d9a 2466</span>
<span class="line">4a64 e372 cfa5 84cc 60e1 f158 ea50 6988</span>
<span class="line">4545 8865 2319 147e eb54 7aec bcfa 5382</span>
<span class="line">8978 b35c 0a6d 3b43 0158 2819 a98b 4f20</span>
<span class="line">7728 12bd 1754 c39e 49a2 9ade 763f 951a</span>
<span class="line">d8d4 901e 2115 3e06 417f e086 debd 465a</span>
<span class="line">b3ff ef2e d1d1 1092 1b94 bae7 2ba9 a966</span>
<span class="line">486c b8dc 7470 05f0 ca17 061e 58ce c23c</span>
<span class="line">c779 7bf7 4efa dd3c b7c3 db8f 3553 4efe</span>
<span class="line">6140 30ac 1182 15d9 3ec0 148f 5270 dc4c</span>
<span class="line">921e ff02 0301 0001 a382 0341 3082 033d</span>
<span class="line">301f 0603 551d 2304 1830 1680 14bf c15a</span>
<span class="line">87ff 28fa 413d fdb7 4fe4 1daf a061 5829</span>
<span class="line">bd30 7f06 082b 0601 0505 0701 0104 7330</span>
<span class="line">7130 4d06 082b 0601 0505 0730 0286 4168</span>
<span class="line">7474 703a 2f2f 7777 772e 7373 6c2e 636f</span>
<span class="line">6d2f 7265 706f 7369 746f 7279 2f53 534c</span>
<span class="line">636f 6d2d 5375 6243 412d 4556 2d53 534c</span>
<span class="line">2d52 5341 2d34 3039 362d 5233 2e63 7274</span>
<span class="line">3020 0608 2b06 0105 0507 3001 8614 6874</span>
<span class="line">7470 3a2f 2f6f 6373 7073 2e73 736c 2e63</span>
<span class="line">6f6d 301f 0603 551d 1104 1830 1682 0b77</span>
<span class="line">7777 2e73 736c 2e63 6f6d 8207 7373 6c2e</span>
<span class="line">636f 6d30 5f06 0355 1d20 0458 3056 3007</span>
<span class="line">0605 6781 0c01 0130 0d06 0b2a 8468 0186</span>
<span class="line">f677 0205 0101 303c 060c 2b06 0104 0182</span>
<span class="line">a930 0103 0104 302c 302a 0608 2b06 0105</span>
<span class="line">0507 0201 161e 6874 7470 733a 2f2f 7777</span>
<span class="line">772e 7373 6c2e 636f 6d2f 7265 706f 7369</span>
<span class="line">746f 7279 301d 0603 551d 2504 1630 1406</span>
<span class="line">082b 0601 0505 0703 0206 082b 0601 0505</span>
<span class="line">0703 0130 4806 0355 1d1f 0441 303f 303d</span>
<span class="line">a03b a039 8637 6874 7470 3a2f 2f63 726c</span>
<span class="line">732e 7373 6c2e 636f 6d2f 5353 4c63 6f6d</span>
<span class="line">2d53 7562 4341 2d45 562d 5353 4c2d 5253</span>
<span class="line">412d 3430 3936 2d52 332e 6372 6c30 1d06</span>
<span class="line">0355 1d0e 0416 0414 00c0 1542 1acf 0e6b</span>
<span class="line">6481 daa6 7471 2149 e9c3 e18b 300e 0603</span>
<span class="line">551d 0f01 01ff 0404 0302 05a0 3082 017d</span>
<span class="line">060a 2b06 0104 01d6 7902 0402 0482 016d</span>
<span class="line">0482 0169 0167 0077 00f6 5c94 2fd1 7730</span>
<span class="line">2214 5418 0830 9456 8ee3 4d13 1933 bfdf</span>
<span class="line">0c2f 200b cc4e f164 e300 0001 7133 4868</span>
<span class="line">6f00 0004 0300 4830 4602 2100 eb17 a588</span>
<span class="line">d47c 1a4f fade 961d 9d2f ef3b 1fc2 8e9b</span>
<span class="line">4430 4bfc f565 a1d7 fbab 5881 0221 00f2</span>
<span class="line">06b7 8753 6e43 cf0b a441 a450 8f05 bae7</span>
<span class="line">964b 92a0 a7c5 bc50 5918 8e7a 68fd 2400</span>
<span class="line">7500 9420 bc1e 8ed5 8d6c 8873 1f82 8b22</span>
<span class="line">2c0d d1da 4d5e 6c4f 943d 61db 4e2f 584d</span>
<span class="line">a2c2 0000 0171 3348 68dc 0000 0403 0046</span>
<span class="line">3044 0220 1911 38c3 369b 3517 43f2 4abf</span>
<span class="line">bc53 f7b5 07b6 866d 31e6 75ee 968c 21e0</span>
<span class="line">86f0 de59 0220 561b ff79 520e 9952 ec07</span>
<span class="line">11e2 bf97 a56b 4429 24c5 5899 8d09 16dc</span>
<span class="line">5c9b abd9 1181 0075 00ee c095 ee8d 7264</span>
<span class="line">0f92 e3c3 b91b c712 a369 6a09 7b4b 6a1a</span>
<span class="line">1438 e647 b2cb edc5 f900 0001 7133 4868</span>
<span class="line">f300 0004 0300 4630 4402 207a 22f6 e85a</span>
<span class="line">cb37 4782 2d57 08de 6e5e c3df 2a05 697d</span>
<span class="line">0d0e 1d9d 5a18 60c0 2c6b 1f02 2009 fabb</span>
<span class="line">a1c3 02e6 dfb5 8e2e 4ce7 168b 98f0 b823</span>
<span class="line">e597 dc8f c046 4592 ca23 bb21 0730 0d06</span>
<span class="line">092a 8648 86f7 0d01 010b 0500 0382 0201</span>
<span class="line">0027 aeba be10 9ee8 ea9a 0b92 ac75 379a</span>
<span class="line">17fe 709a 1dcd 340d aa8e 2d75 ef8f 0f5f</span>
<span class="line">de15 d600 10bb bcc4 5fb4 02de f126 23d8</span>
<span class="line">8b94 4ac2 2972 3f9e affb 7898 d93f 65c3</span>
<span class="line">b4bc 4c9d 38d5 52e1 6882 a9d7 8333 494c</span>
<span class="line">d1c9 ea0e 02c2 7b40 00cc 0a51 ca50 3947</span>
<span class="line">514d a936 ea3c f18e a282 8bd3 ddbb 27c0</span>
<span class="line">9362 1103 6aca 6492 6219 2dc3 4b5a 76ea</span>
<span class="line">2a8e a5e7 d3a8 2c56 2a16 4d50 d7ca c779</span>
<span class="line">a84c 78b7 ab08 8087 0c9b 6e98 1f5b c9a4</span>
<span class="line">2404 84aa 5cdb 2d3b 8119 2494 1651 b4c8</span>
<span class="line">d386 fe1c 5f2c 8c5f bb93 71d4 fb00 904f</span>
<span class="line">b9e8 9f0a 8576 e49c 57ba 8f1d e75d fd83</span>
<span class="line">03f5 0407 bb20 154f c76b bb28 dfd4 c8e5</span>
<span class="line">dd66 6c0c 7ff4 e614 6c03 7427 ecc8 77ff</span>
<span class="line">66c0 76c0 b1e8 cd36 2801 5990 f45a 14d4</span>
<span class="line">92e0 7158 afa8 9faf 3650 611d 7865 c4c7</span>
<span class="line">4dd2 3f34 47d3 73e8 4220 9508 de2b 73bc</span>
<span class="line">23f7 051a 6fc1 f3ee 3684 e942 21df 5976</span>
<span class="line">d9dd 25c4 4956 38b4 c03d 2ac1 ebc2 69f0</span>
<span class="line">3d8c 9947 bff8 ec13 e23d 533e 9ca4 2ca1</span>
<span class="line">b30f a5ac 5771 520a 94e7 c6b1 a9e2 bcf4</span>
<span class="line">547e 368e 2ad0 820e f898 b5ac 92ab f679</span>
<span class="line">1207 406a 5e8c d59c 4d58 07f2 8bbd d22c</span>
<span class="line">b986 49ba a6f6 a4a9 2efb 3cd3 ea05 301d</span>
<span class="line">44d9 bc18 8d3a d5cb e0dc 7073 f293 ed6c</span>
<span class="line">ce49 ddb0 3f5d 1023 c0ca 838b df88 d0ec</span>
<span class="line">1d69 81d5 ce0a 8e2e a03a 0039 b925 3368</span>
<span class="line">69aa fefe 159d c2b9 52bf a7f4 b6df 9df2</span>
<span class="line">dcdb c279 7edf c6a2 d8a7 3320 e4de 26ab</span>
<span class="line">175d 1896 a70e 99e5 f5b8 598a 6dd8 bf5e</span>
<span class="line">8ac6 9640 a830 5dd3 0f1f 2b9a 9f43 0620</span>
<span class="line">7f</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="pem" tabindex="-1"><a class="header-anchor" href="#pem"><span>PEM</span></a></h3>
<p>Privacy Enhanced Mail，一般为文本格式（Base64 ASCII），以 —–BEGIN… 开头，以 —–END… 结尾。中间的内容是 BASE64 编码。这种格式可以保存证书和私钥，有时我们也把PEM 格式的私钥的后缀改为 .key 以区别证书与私钥。具体你可以看文件的内容。</p>
<p>这种格式常用于 Apache 和 Nginx 服务器。</p>
<ul>
<li>如果存在<code v-pre>——BEGIN CERTIFICATE——</code>，则说明这是一个证书文件。</li>
<li>如果存在<code v-pre>—–BEGIN RSA PRIVATE KEY—–</code>，则说明这是一个私钥文件</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">-----BEGIN CERTIFICATE-----</span>
<span class="line">MIIH/TCCBeWgAwIBAgIQaBYE3/M08XHYCnNVmcFBcjANBgkqhkiG9w0BAQsFADBy</span>
<span class="line">MQswCQYDVQQGEwJVUzEOMAwGA1UECAwFVGV4YXMxEDAOBgNVBAcMB0hvdXN0b24x</span>
<span class="line">ETAPBgNVBAoMCFNTTCBDb3JwMS4wLAYDVQQDDCVTU0wuY29tIEVWIFNTTCBJbnRl</span>
<span class="line">cm1lZGlhdGUgQ0EgUlNBIFIzMB4XDTIwMDQwMTAwNTgzM1oXDTIxMDcxNjAwNTgz</span>
<span class="line">M1owgb0xCzAJBgNVBAYTAlVTMQ4wDAYDVQQIDAVUZXhhczEQMA4GA1UEBwwHSG91</span>
<span class="line">c3RvbjERMA8GA1UECgwIU1NMIENvcnAxFjAUBgNVBAUTDU5WMjAwODE2MTQyNDMx</span>
<span class="line">FDASBgNVBAMMC3d3dy5zc2wuY29tMR0wGwYDVQQPDBRQcml2YXRlIE9yZ2FuaXph</span>
<span class="line">dGlvbjEXMBUGCysGAQQBgjc8AgECDAZOZXZhZGExEzARBgsrBgEEAYI3PAIBAxMC</span>
<span class="line">VVMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDHheRkbb1FCc7xRKst</span>
<span class="line">wK0JIGaKY8t7JbS2bQ2b6YIJDgnHuIYHqBrCUV79oelikkokRkFvcvpaKinFHDQH</span>
<span class="line">UpWEI6RUERYmSCg3O8Wi42uOcV2B5ZabmXCkwdxY5Ecl51BbM8UnGdoAGbdNmiRm</span>
<span class="line">SmTjcs+lhMxg4fFY6lBpiEVFiGUjGRR+61R67Lz6U4KJeLNcCm07QwFYKBmpi08g</span>
<span class="line">dygSvRdUw55Jopredj+VGtjUkB4hFT4GQX/ght69Rlqz/+8u0dEQkhuUuucrqalm</span>
<span class="line">SGy43HRwBfDKFwYeWM7CPMd5e/dO+t08t8PbjzVTTv5hQDCsEYIV2T7AFI9ScNxM</span>
<span class="line">kh7/AgMBAAGjggNBMIIDPTAfBgNVHSMEGDAWgBS/wVqH/yj6QT39t0/kHa+gYVgp</span>
<span class="line">vTB/BggrBgEFBQcBAQRzMHEwTQYIKwYBBQUHMAKGQWh0dHA6Ly93d3cuc3NsLmNv</span>
<span class="line">bS9yZXBvc2l0b3J5L1NTTGNvbS1TdWJDQS1FVi1TU0wtUlNBLTQwOTYtUjMuY3J0</span>
<span class="line">MCAGCCsGAQUFBzABhhRodHRwOi8vb2NzcHMuc3NsLmNvbTAfBgNVHREEGDAWggt3</span>
<span class="line">d3cuc3NsLmNvbYIHc3NsLmNvbTBfBgNVHSAEWDBWMAcGBWeBDAEBMA0GCyqEaAGG</span>
<span class="line">9ncCBQEBMDwGDCsGAQQBgqkwAQMBBDAsMCoGCCsGAQUFBwIBFh5odHRwczovL3d3</span>
<span class="line">dy5zc2wuY29tL3JlcG9zaXRvcnkwHQYDVR0lBBYwFAYIKwYBBQUHAwIGCCsGAQUF</span>
<span class="line">BwMBMEgGA1UdHwRBMD8wPaA7oDmGN2h0dHA6Ly9jcmxzLnNzbC5jb20vU1NMY29t</span>
<span class="line">LVN1YkNBLUVWLVNTTC1SU0EtNDA5Ni1SMy5jcmwwHQYDVR0OBBYEFADAFUIazw5r</span>
<span class="line">ZIHapnRxIUnpw+GLMA4GA1UdDwEB/wQEAwIFoDCCAX0GCisGAQQB1nkCBAIEggFt</span>
<span class="line">BIIBaQFnAHcA9lyUL9F3MCIUVBgIMJRWjuNNExkzv98MLyALzE7xZOMAAAFxM0ho</span>
<span class="line">bwAABAMASDBGAiEA6xeliNR8Gk/63pYdnS/vOx/CjptEMEv89WWh1/urWIECIQDy</span>
<span class="line">BreHU25DzwukQaRQjwW655ZLkqCnxbxQWRiOemj9JAB1AJQgvB6O1Y1siHMfgosi</span>
<span class="line">LA3R2k1ebE+UPWHbTi9YTaLCAAABcTNIaNwAAAQDAEYwRAIgGRE4wzabNRdD8kq/</span>
<span class="line">vFP3tQe2hm0x5nXulowh4Ibw3lkCIFYb/3lSDplS7AcR4r+XpWtEKSTFWJmNCRbc</span>
<span class="line">XJur2RGBAHUA7sCV7o1yZA+S48O5G8cSo2lqCXtLahoUOOZHssvtxfkAAAFxM0ho</span>
<span class="line">8wAABAMARjBEAiB6IvboWss3R4ItVwjebl7D3yoFaX0NDh2dWhhgwCxrHwIgCfq7</span>
<span class="line">ocMC5t+1ji5M5xaLmPC4I+WX3I/ARkWSyiO7IQcwDQYJKoZIhvcNAQELBQADggIB</span>
<span class="line">ACeuur4QnujqmguSrHU3mhf+cJodzTQNqo4tde+PD1/eFdYAELu8xF+0At7xJiPY</span>
<span class="line">i5RKwilyP56v+3iY2T9lw7S8TJ041VLhaIKp14MzSUzRyeoOAsJ7QADMClHKUDlH</span>
<span class="line">UU2pNuo88Y6igovT3bsnwJNiEQNqymSSYhktw0taduoqjqXn06gsVioWTVDXysd5</span>
<span class="line">qEx4t6sIgIcMm26YH1vJpCQEhKpc2y07gRkklBZRtMjThv4cXyyMX7uTcdT7AJBP</span>
<span class="line">ueifCoV25JxXuo8d5139gwP1BAe7IBVPx2u7KN/UyOXdZmwMf/TmFGwDdCfsyHf/</span>
<span class="line">ZsB2wLHozTYoAVmQ9FoU1JLgcVivqJ+vNlBhHXhlxMdN0j80R9Nz6EIglQjeK3O8</span>
<span class="line">I/cFGm/B8+42hOlCId9ZdtndJcRJVji0wD0qwevCafA9jJlHv/jsE+I9Uz6cpCyh</span>
<span class="line">sw+lrFdxUgqU58axqeK89FR+No4q0IIO+Ji1rJKr9nkSB0BqXozVnE1YB/KLvdIs</span>
<span class="line">uYZJuqb2pKku+zzT6gUwHUTZvBiNOtXL4Nxwc/KT7WzOSd2wP10QI8DKg4vfiNDs</span>
<span class="line">HWmB1c4Kji6gOgA5uSUzaGmq/v4VncK5Ur+n9LbfnfLc28J5ft/GotinMyDk3iar</span>
<span class="line">F10YlqcOmeX1uFmKbdi/XorGlkCoMF3TDx8rmp9DBiB/</span>
<span class="line">-----END CERTIFICATE-----</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="crt" tabindex="-1"><a class="header-anchor" href="#crt"><span>CRT</span></a></h3>
<p>Certificate 的简称，有可能是 PEM 编码格式，也有可能是 DER 编码格式。</p>
<h3 id="pfx" tabindex="-1"><a class="header-anchor" href="#pfx"><span>PFX</span></a></h3>
<p>Predecessor of PKCS#12，这种格式是二进制格式，且证书和私钥存在一个 PFX 文件中。一般用于 Windows 上的 IIS 服务器。该格式的文件一般会有一个密码用于保证私钥的安全。</p>
<h3 id="jks" tabindex="-1"><a class="header-anchor" href="#jks"><span>JKS</span></a></h3>
<p>Java Key Storage，很容易知道这是 JAVA 的专属格式，利用 JAVA 的一个叫 keytool 的工具可以进行格式转换。一般用于 Tomcat 服务器。</p>
<h2 id="服务器端的证书生成" tabindex="-1"><a class="header-anchor" href="#服务器端的证书生成"><span>服务器端的证书生成</span></a></h2>
<h3 id="_1-生成服务器端的私钥" tabindex="-1"><a class="header-anchor" href="#_1-生成服务器端的私钥"><span>1. 生成服务器端的私钥</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">openssl genrsa <span class="token parameter variable">-out</span> server.key <span class="token number">2048</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="_2-生成服务器端证书" tabindex="-1"><a class="header-anchor" href="#_2-生成服务器端证书"><span>2. 生成服务器端证书</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">openssl req <span class="token parameter variable">-new</span> <span class="token parameter variable">-x509</span> <span class="token parameter variable">-key</span> server.key <span class="token parameter variable">-out</span> server.pem <span class="token parameter variable">-days</span> <span class="token number">3650</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>或者</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go run <span class="token variable">$GOROOT</span>/src/crypto/tls/generate_cert.go <span class="token parameter variable">--host</span> localhost</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="客户端的证书生成" tabindex="-1"><a class="header-anchor" href="#客户端的证书生成"><span>客户端的证书生成</span></a></h2>
<h3 id="_1-生成客户端的私钥" tabindex="-1"><a class="header-anchor" href="#_1-生成客户端的私钥"><span>1. 生成客户端的私钥</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">openssl genrsa <span class="token parameter variable">-out</span> client.key <span class="token number">2048</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="_2-生成客户端的证书" tabindex="-1"><a class="header-anchor" href="#_2-生成客户端的证书"><span>2. 生成客户端的证书</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">openssl req <span class="token parameter variable">-new</span> <span class="token parameter variable">-x509</span> <span class="token parameter variable">-key</span> client.key <span class="token parameter variable">-out</span> client.pem <span class="token parameter variable">-days</span> <span class="token number">3650</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="使用脚本生成" tabindex="-1"><a class="header-anchor" href="#使用脚本生成"><span>使用脚本生成</span></a></h2>
<p><a href="https://github.com/HemantNegi/go-mtls/blob/master/generate_certs.sh" target="_blank" rel="noopener noreferrer">generate_certs.sh</a></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token shebang important">#!/usr/bin/env bash</span></span>
<span class="line"><span class="token comment"># If you are getting the error “Error Loading extension section v3_ca” using macOS on step 2,</span></span>
<span class="line"><span class="token comment"># add the following to your /etc/ssl/openssl.cnf</span></span>
<span class="line"><span class="token comment"># [ v3_ca ]</span></span>
<span class="line"><span class="token comment"># basicConstraints = critical,CA:TRUE</span></span>
<span class="line"><span class="token comment"># subjectKeyIdentifier = hash</span></span>
<span class="line"><span class="token comment"># authorityKeyIdentifier = keyid:always,issuer:always</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 生成CA的私钥和证书</span></span>
<span class="line"><span class="token builtin class-name">echo</span> Generate the ca certificate</span>
<span class="line">openssl genrsa <span class="token parameter variable">-out</span> <span class="token punctuation">..</span>/certs/ca.key <span class="token number">4096</span></span>
<span class="line">openssl req <span class="token parameter variable">-x509</span> <span class="token parameter variable">-sha256</span> <span class="token parameter variable">-new</span> <span class="token parameter variable">-nodes</span> <span class="token parameter variable">-key</span> <span class="token punctuation">..</span>/certs/ca.key <span class="token parameter variable">-days</span> <span class="token number">3650</span> <span class="token parameter variable">-subj</span> <span class="token string">"/C=IN/ST=UK/L=Dehradun/O=VMware/CN=Hemant Root CA"</span> <span class="token parameter variable">-extensions</span> v3_ca <span class="token parameter variable">-out</span> <span class="token punctuation">..</span>/certs/ca.crt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 生成服务端的私钥和证书</span></span>
<span class="line"><span class="token builtin class-name">echo</span> generating server certificate</span>
<span class="line">openssl genrsa <span class="token parameter variable">-out</span> <span class="token punctuation">..</span>/certs/server.key <span class="token number">2048</span></span>
<span class="line">openssl req <span class="token parameter variable">-new</span> <span class="token parameter variable">-subj</span> <span class="token string">"/C=IN/ST=UK/L=Dehradun/O=VMware/CN=localhost"</span> <span class="token parameter variable">-key</span> <span class="token punctuation">..</span>/certs/server.key <span class="token parameter variable">-out</span> server_signing_req.csr</span>
<span class="line">openssl x509 <span class="token parameter variable">-req</span> <span class="token parameter variable">-days</span> <span class="token number">365</span> <span class="token parameter variable">-in</span> server_signing_req.csr <span class="token parameter variable">-CA</span> <span class="token punctuation">..</span>/certs/ca.crt <span class="token parameter variable">-CAkey</span> <span class="token punctuation">..</span>/certs/ca.key <span class="token parameter variable">-CAcreateserial</span> <span class="token parameter variable">-out</span> <span class="token punctuation">..</span>/certs/server.crt</span>
<span class="line">del server_signing_req.csr</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 生成客户端的私钥和证书</span></span>
<span class="line"><span class="token builtin class-name">echo</span> generating client certificate</span>
<span class="line">openssl genrsa <span class="token parameter variable">-out</span> <span class="token punctuation">..</span>/certs/client.key <span class="token number">2048</span></span>
<span class="line">openssl req <span class="token parameter variable">-new</span> <span class="token parameter variable">-subj</span> <span class="token string">"/C=IN/ST=UK/L=Dehradun/O=VMware/CN=localhost"</span> <span class="token parameter variable">-key</span> <span class="token punctuation">..</span>/certs/client.key <span class="token parameter variable">-out</span> client_signing_req.csr</span>
<span class="line">openssl x509 <span class="token parameter variable">-req</span> <span class="token parameter variable">-days</span> <span class="token number">365</span> <span class="token parameter variable">-in</span> client_signing_req.csr <span class="token parameter variable">-CA</span> <span class="token punctuation">..</span>/certs/ca.crt <span class="token parameter variable">-CAkey</span> <span class="token punctuation">..</span>/certs/ca.key <span class="token parameter variable">-CAcreateserial</span> <span class="token parameter variable">-out</span> <span class="token punctuation">..</span>/certs/client.crt</span>
<span class="line"><span class="token function">rm</span> client_signing_req.csr</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证证书</span></span>
<span class="line">openssl verify <span class="token parameter variable">-CAfile</span> <span class="token punctuation">..</span>/certs/ca.crt <span class="token punctuation">..</span>/certs/server.crt</span>
<span class="line">openssl verify <span class="token parameter variable">-CAfile</span> <span class="token punctuation">..</span>/certs/ca.crt <span class="token punctuation">..</span>/certs/client.crt</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bat line-numbers-mode" data-highlighter="prismjs" data-ext="bat"><pre v-pre><code><span class="line">:: 生成CA的私钥和证书</span>
<span class="line">echo Generate the ca certificate</span>
<span class="line">openssl genrsa -out ../certs/ca.key 4096</span>
<span class="line">openssl req -x509 -sha256 -new -nodes -key ../certs/ca.key -days 3650 -subj &quot;/C=CN/O=VMware/CN=Root CA&quot; -extensions v3_ca -out ../certs/ca.crt</span>
<span class="line"></span>
<span class="line">:: 生成服务端的私钥和证书</span>
<span class="line">echo generating server certificate</span>
<span class="line">openssl genrsa -out ../certs/server.key 2048</span>
<span class="line">openssl req -new -subj &quot;/C=CN/O=VMware/CN=host.docker.internal&quot; -key ../certs/server.key -out server_signing_req.csr</span>
<span class="line">openssl x509 -req -days 365 -in server_signing_req.csr -CA ../certs/ca.crt -CAkey ../certs/ca.key -CAcreateserial -out ../certs/server.crt</span>
<span class="line">del server_signing_req.csr</span>
<span class="line"></span>
<span class="line">:: 生成客户端的私钥和证书</span>
<span class="line">echo generating client certificate</span>
<span class="line">openssl genrsa -out ../certs/client.key 2048</span>
<span class="line">openssl req -new -subj &quot;/C=CN/O=VMware/CN=host.docker.internal&quot; -key ../certs/client.key -out client_signing_req.csr</span>
<span class="line">openssl x509 -req -days 365 -in client_signing_req.csr -CA ../certs/ca.crt -CAkey ../certs/ca.key -CAcreateserial -out ../certs/client.crt</span>
<span class="line">del client_signing_req.csr</span>
<span class="line"></span>
<span class="line">:: 验证证书</span>
<span class="line">openssl verify -CAfile ../certs/ca.crt ../certs/server.crt</span>
<span class="line">openssl verify -CAfile ../certs/ca.crt ../certs/client.crt</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="openssl测试证书" tabindex="-1"><a class="header-anchor" href="#openssl测试证书"><span>OpenSSL测试证书</span></a></h2>
<h3 id="连接到远程服务器" tabindex="-1"><a class="header-anchor" href="#连接到远程服务器"><span>连接到远程服务器</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">openssl s_client <span class="token parameter variable">-connect</span> host.docker.internal:8000 <span class="token parameter variable">-showcerts</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="带ca证书连接远程服务器" tabindex="-1"><a class="header-anchor" href="#带ca证书连接远程服务器"><span>带CA证书连接远程服务器</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">openssl s_client <span class="token parameter variable">-connect</span> host.docker.internal:8000 <span class="token parameter variable">-CAfile</span> ca.crt</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="仅以tls1或者tls2连接远程服务器" tabindex="-1"><a class="header-anchor" href="#仅以tls1或者tls2连接远程服务器"><span>仅以TLS1或者TLS2连接远程服务器</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">openssl s_client <span class="token parameter variable">-connect</span> host.docker.internal:8000 <span class="token parameter variable">-tls1_2</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="调试远程服务器的ssl-tls" tabindex="-1"><a class="header-anchor" href="#调试远程服务器的ssl-tls"><span>调试远程服务器的SSL/TLS</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">openssl s_client <span class="token parameter variable">-connect</span> host.docker.internal:8000 <span class="token parameter variable">-tlsextdebug</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="模拟的https服务-可以返回openssl相关信息" tabindex="-1"><a class="header-anchor" href="#模拟的https服务-可以返回openssl相关信息"><span>模拟的HTTPS服务，可以返回Openssl相关信息</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">openssl s_server <span class="token parameter variable">-accept</span> <span class="token number">443</span> <span class="token parameter variable">-cert</span> server.crt <span class="token parameter variable">-key</span> server.key <span class="token parameter variable">-www</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="在线工具" tabindex="-1"><a class="header-anchor" href="#在线工具"><span>在线工具</span></a></h2>
<p>测试证书生成工具 <a href="https://myssl.com/create_test_cert.html" target="_blank" rel="noopener noreferrer">https://myssl.com/create_test_cert.html</a>
证书查看工具 <a href="https://myssl.com/cert_decode.html" target="_blank" rel="noopener noreferrer">https://myssl.com/cert_decode.html</a></p>
<h2 id="golang实例代码" tabindex="-1"><a class="header-anchor" href="#golang实例代码"><span>golang实例代码</span></a></h2>
<p>gprc进行mTLS双向加密</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">var</span> opts <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>grpc<span class="token punctuation">.</span>ServerOption<span class="token punctuation">{</span></span>
<span class="line">      grpc<span class="token punctuation">.</span><span class="token function">Middleware</span><span class="token punctuation">(</span></span>
<span class="line">            recovery<span class="token punctuation">.</span><span class="token function">Recovery</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            tracing<span class="token punctuation">.</span><span class="token function">Server</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            logging<span class="token punctuation">.</span><span class="token function">Server</span><span class="token punctuation">(</span>logger<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      grpc<span class="token punctuation">.</span><span class="token function">TLSConfig</span><span class="token punctuation">(</span>bootstrap<span class="token punctuation">.</span><span class="token function">NewServerTlsConfig</span><span class="token punctuation">(</span>dir<span class="token operator">+</span><span class="token string">"/server.key"</span><span class="token punctuation">,</span> dir<span class="token operator">+</span><span class="token string">"/server.crt"</span><span class="token punctuation">,</span> dir<span class="token operator">+</span><span class="token string">"/ca.crt"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>http进行TLS单向加密</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">var</span> opts <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>http<span class="token punctuation">.</span>ServerOption<span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">NewMiddleware</span><span class="token punctuation">(</span>logger<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      http<span class="token punctuation">.</span><span class="token function">Filter</span><span class="token punctuation">(</span>handlers<span class="token punctuation">.</span><span class="token function">CORS</span><span class="token punctuation">(</span></span>
<span class="line">            handlers<span class="token punctuation">.</span><span class="token function">AllowedHeaders</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span><span class="token punctuation">{</span><span class="token string">"X-Requested-With"</span><span class="token punctuation">,</span> <span class="token string">"Content-Type"</span><span class="token punctuation">,</span> <span class="token string">"Authorization"</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            handlers<span class="token punctuation">.</span><span class="token function">AllowedMethods</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span><span class="token punctuation">{</span><span class="token string">"GET"</span><span class="token punctuation">,</span> <span class="token string">"POST"</span><span class="token punctuation">,</span> <span class="token string">"PUT"</span><span class="token punctuation">,</span> <span class="token string">"DELETE"</span><span class="token punctuation">,</span> <span class="token string">"HEAD"</span><span class="token punctuation">,</span> <span class="token string">"OPTIONS"</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            handlers<span class="token punctuation">.</span><span class="token function">AllowedOrigins</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span><span class="token punctuation">{</span><span class="token string">"*"</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      http<span class="token punctuation">.</span><span class="token function">TLSConfig</span><span class="token punctuation">(</span>bootstrap<span class="token punctuation">.</span><span class="token function">NewServerTlsConfig</span><span class="token punctuation">(</span>dir<span class="token operator">+</span><span class="token string">"/server.key"</span><span class="token punctuation">,</span> dir<span class="token operator">+</span><span class="token string">"/server.crt"</span><span class="token punctuation">,</span> <span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端使用单向加密的话，不用任何证书也能行。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token function">callHTTP</span><span class="token punctuation">(</span><span class="token string">"https://127.0.0.1:8000"</span><span class="token punctuation">,</span> <span class="token function">NewTlsConfig</span><span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">,</span> <span class="token string">""</span><span class="token punctuation">,</span> <span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token function">NewTlsConfig</span><span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">,</span> <span class="token string">""</span><span class="token punctuation">,</span> <span class="token string">""</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端双向加密的话就要把所有的证书都招呼上。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token function">callGRPC</span><span class="token punctuation">(</span><span class="token string">"192.168.1.6:9000"</span><span class="token punctuation">,</span> <span class="token function">NewTlsConfig</span><span class="token punctuation">(</span>dir<span class="token operator">+</span><span class="token string">"/client.key"</span><span class="token punctuation">,</span> dir<span class="token operator">+</span><span class="token string">"/client.crt"</span><span class="token punctuation">,</span> dir<span class="token operator">+</span><span class="token string">"/ca.crt"</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>初始化的服务器和客户端的代码在这里</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token comment">// 用来控制客户端是否证书和服务器主机名。如果设置为true,则不会校验证书以及证书中的主机名和服务器主机名是否一致。</span></span>
<span class="line"><span class="token keyword">const</span> insecureSkipVerify <span class="token operator">=</span> <span class="token boolean">true</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// TLSInfo holds the SSL certificates paths.</span></span>
<span class="line"><span class="token keyword">type</span> TLSInfo <span class="token keyword">struct</span> <span class="token punctuation">{</span></span>
<span class="line">	CertFile           <span class="token builtin">string</span> <span class="token string">`json:"CertFile"`</span></span>
<span class="line">	KeyFile            <span class="token builtin">string</span> <span class="token string">`json:"KeyFile"`</span></span>
<span class="line">	CAFile             <span class="token builtin">string</span> <span class="token string">`json:"CAFile"`</span></span>
<span class="line">	InsecureSkipVerify <span class="token builtin">bool</span>   <span class="token string">`json:"InsecureSkipVerify"`</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>info TLSInfo<span class="token punctuation">)</span> <span class="token function">Scheme</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">if</span> info<span class="token punctuation">.</span>KeyFile <span class="token operator">!=</span> <span class="token string">""</span> <span class="token operator">&amp;&amp;</span> info<span class="token punctuation">.</span>CertFile <span class="token operator">!=</span> <span class="token string">""</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token string">"https"</span></span>
<span class="line">	<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token string">"http"</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>info TLSInfo<span class="token punctuation">)</span> <span class="token function">ServerConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token operator">*</span>tls<span class="token punctuation">.</span>Config<span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">if</span> info<span class="token punctuation">.</span>KeyFile <span class="token operator">==</span> <span class="token string">""</span> <span class="token operator">||</span> info<span class="token punctuation">.</span>CertFile <span class="token operator">==</span> <span class="token string">""</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> fmt<span class="token punctuation">.</span><span class="token function">Errorf</span><span class="token punctuation">(</span><span class="token string">"KeyFile and CertFile must both be present[key: %v, cert: %v]"</span><span class="token punctuation">,</span> info<span class="token punctuation">.</span>KeyFile<span class="token punctuation">,</span> info<span class="token punctuation">.</span>CertFile<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">var</span> cfg tls<span class="token punctuation">.</span>Config</span>
<span class="line">	cfg<span class="token punctuation">.</span>InsecureSkipVerify <span class="token operator">=</span> info<span class="token punctuation">.</span>InsecureSkipVerify</span>
<span class="line">	<span class="token comment">//cfg.ServerName = "host.docker.internal"</span></span>
<span class="line">	cfg<span class="token punctuation">.</span>MinVersion <span class="token operator">=</span> tls<span class="token punctuation">.</span>VersionTLS13</span>
<span class="line"></span>
<span class="line">	tlsCert<span class="token punctuation">,</span> err <span class="token operator">:=</span> tls<span class="token punctuation">.</span><span class="token function">LoadX509KeyPair</span><span class="token punctuation">(</span>info<span class="token punctuation">.</span>CertFile<span class="token punctuation">,</span> info<span class="token punctuation">.</span>KeyFile<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">"LoadX509KeyPair error:"</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> err</span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	cfg<span class="token punctuation">.</span>Certificates <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>tls<span class="token punctuation">.</span>Certificate<span class="token punctuation">{</span>tlsCert<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">if</span> info<span class="token punctuation">.</span>CAFile <span class="token operator">!=</span> <span class="token string">""</span> <span class="token punctuation">{</span></span>
<span class="line">		cfg<span class="token punctuation">.</span>ClientAuth <span class="token operator">=</span> tls<span class="token punctuation">.</span>RequireAndVerifyClientCert</span>
<span class="line">		cp<span class="token punctuation">,</span> err <span class="token operator">:=</span> <span class="token function">newCertPool</span><span class="token punctuation">(</span>info<span class="token punctuation">.</span>CAFile<span class="token punctuation">)</span></span>
<span class="line">		<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">			log<span class="token punctuation">.</span><span class="token function">Fatalln</span><span class="token punctuation">(</span><span class="token string">"read cert file error:"</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span></span>
<span class="line">			<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> err</span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">		cfg<span class="token punctuation">.</span>RootCAs <span class="token operator">=</span> cp</span>
<span class="line">		cfg<span class="token punctuation">.</span>ClientCAs <span class="token operator">=</span> cp</span>
<span class="line">	<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">		cfg<span class="token punctuation">.</span>ClientAuth <span class="token operator">=</span> tls<span class="token punctuation">.</span>NoClientCert</span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> <span class="token operator">&amp;</span>cfg<span class="token punctuation">,</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token punctuation">(</span>info TLSInfo<span class="token punctuation">)</span> <span class="token function">ClientConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token operator">*</span>tls<span class="token punctuation">.</span>Config<span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">var</span> cfg tls<span class="token punctuation">.</span>Config</span>
<span class="line">	cfg<span class="token punctuation">.</span>InsecureSkipVerify <span class="token operator">=</span> info<span class="token punctuation">.</span>InsecureSkipVerify</span>
<span class="line">	<span class="token comment">//cfg.ServerName = "host.docker.internal"</span></span>
<span class="line">	cfg<span class="token punctuation">.</span>MinVersion <span class="token operator">=</span> tls<span class="token punctuation">.</span>VersionTLS13</span>
<span class="line"></span>
<span class="line">	<span class="token keyword">if</span> info<span class="token punctuation">.</span>CAFile <span class="token operator">!=</span> <span class="token string">""</span> <span class="token punctuation">{</span></span>
<span class="line">		cp<span class="token punctuation">,</span> err <span class="token operator">:=</span> <span class="token function">newCertPool</span><span class="token punctuation">(</span>info<span class="token punctuation">.</span>CAFile<span class="token punctuation">)</span></span>
<span class="line">		<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">			log<span class="token punctuation">.</span><span class="token function">Fatalln</span><span class="token punctuation">(</span><span class="token string">"read cert file error:"</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span></span>
<span class="line">			<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> err</span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">		cfg<span class="token punctuation">.</span>RootCAs <span class="token operator">=</span> cp</span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">if</span> info<span class="token punctuation">.</span>KeyFile <span class="token operator">==</span> <span class="token string">""</span> <span class="token operator">||</span> info<span class="token punctuation">.</span>CertFile <span class="token operator">==</span> <span class="token string">""</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token operator">&amp;</span>cfg<span class="token punctuation">,</span> <span class="token boolean">nil</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	tlsCert<span class="token punctuation">,</span> err <span class="token operator">:=</span> tls<span class="token punctuation">.</span><span class="token function">LoadX509KeyPair</span><span class="token punctuation">(</span>info<span class="token punctuation">.</span>CertFile<span class="token punctuation">,</span> info<span class="token punctuation">.</span>KeyFile<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatalln</span><span class="token punctuation">(</span><span class="token string">"read pair file error:"</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> err</span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	cfg<span class="token punctuation">.</span>Certificates <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>tls<span class="token punctuation">.</span>Certificate<span class="token punctuation">{</span>tlsCert<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">return</span> <span class="token operator">&amp;</span>cfg<span class="token punctuation">,</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// newCertPool creates x509 certPool with provided CA file</span></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">newCertPool</span><span class="token punctuation">(</span>caFile <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token operator">*</span>x509<span class="token punctuation">.</span>CertPool<span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	certPool <span class="token operator">:=</span> x509<span class="token punctuation">.</span><span class="token function">NewCertPool</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">	pemByte<span class="token punctuation">,</span> err <span class="token operator">:=</span> os<span class="token punctuation">.</span><span class="token function">ReadFile</span><span class="token punctuation">(</span>caFile<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> err</span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">if</span> <span class="token operator">!</span>certPool<span class="token punctuation">.</span><span class="token function">AppendCertsFromPEM</span><span class="token punctuation">(</span>pemByte<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> fmt<span class="token punctuation">.</span><span class="token function">Errorf</span><span class="token punctuation">(</span><span class="token string">"can't add CA cert"</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token keyword">return</span> certPool<span class="token punctuation">,</span> <span class="token boolean">nil</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// NewServerTlsConfig 创建服务端TLS证书认证配置</span></span>
<span class="line"><span class="token comment">// param [in] keyFile 服务端私钥文件路径，必须提供</span></span>
<span class="line"><span class="token comment">// param [in] certFile 服务端证书文件路径，必须提供</span></span>
<span class="line"><span class="token comment">// param [in] caFile CA根证书，如果提供则为双向认证，否则为单向认证</span></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">NewServerTlsConfig</span><span class="token punctuation">(</span>keyFile<span class="token punctuation">,</span> certFile<span class="token punctuation">,</span> caFile <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">*</span>tls<span class="token punctuation">.</span>Config <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">var</span> info <span class="token operator">=</span> TLSInfo<span class="token punctuation">{</span></span>
<span class="line">		CertFile<span class="token punctuation">:</span>           certFile<span class="token punctuation">,</span></span>
<span class="line">		KeyFile<span class="token punctuation">:</span>            keyFile<span class="token punctuation">,</span></span>
<span class="line">		CAFile<span class="token punctuation">:</span>             caFile<span class="token punctuation">,</span></span>
<span class="line">		InsecureSkipVerify<span class="token punctuation">:</span> insecureSkipVerify<span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	cfg<span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">:=</span> info<span class="token punctuation">.</span><span class="token function">ServerConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> cfg</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// NewClientTlsConfig 创建客户端端TLS证书认证配置</span></span>
<span class="line"><span class="token comment">// param [in] keyFile 客户端私钥文件路径</span></span>
<span class="line"><span class="token comment">// param [in] certFile 客户端证书文件路径</span></span>
<span class="line"><span class="token comment">// param [in] caFile CA根证书</span></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">NewClientTlsConfig</span><span class="token punctuation">(</span>keyFile<span class="token punctuation">,</span> certFile<span class="token punctuation">,</span> caFile <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">*</span>tls<span class="token punctuation">.</span>Config <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">var</span> info <span class="token operator">=</span> TLSInfo<span class="token punctuation">{</span></span>
<span class="line">		CertFile<span class="token punctuation">:</span>           certFile<span class="token punctuation">,</span></span>
<span class="line">		KeyFile<span class="token punctuation">:</span>            keyFile<span class="token punctuation">,</span></span>
<span class="line">		CAFile<span class="token punctuation">:</span>             caFile<span class="token punctuation">,</span></span>
<span class="line">		InsecureSkipVerify<span class="token punctuation">:</span> insecureSkipVerify<span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	cfg<span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">:=</span> info<span class="token punctuation">.</span><span class="token function">ClientConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> cfg</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="windows管理证书" tabindex="-1"><a class="header-anchor" href="#windows管理证书"><span>Windows管理证书</span></a></h2>
<ol>
<li>
<p>使用快捷键<code v-pre>win + r</code>打开“运行”窗口，然后输入“mmc”回车。<br>
随即会出现 MMC。</p>
</li>
<li>
<p>从“文件”菜单中，选择“添加/删除管理单元”。<br>
随即会出现“添加或删除管理单元”窗口。</p>
</li>
<li>
<p>从“可用管理单元”列表中选择“证书”，然后选择“添加”。
<img src="https://docs.microsoft.com/zh-cn/dotnet/framework/wcf/feature-details/media/mmc-add-certificate-snap-in.png" alt="certificate"></p>
</li>
<li>
<p>在“证书管理单元”窗口中选择“计算机帐户”，然后选择“下一步”。<br>
（可选）可以选择当前用户对应的“我的用户帐户”，或特定服务对应的“服务帐户”。</p>
<blockquote>
<p>如果你不是设备管理员，则只能管理你自己的用户帐户的证书。</p>
</blockquote>
</li>
<li>
<p>在“选择计算机”窗口中，保留选中“本地计算机”，然后选择“完成”。</p>
</li>
<li>
<p>在“添加或删除管理单元”窗口中，选择“确定”。
<img src="https://docs.microsoft.com/zh-cn/dotnet/framework/wcf/feature-details/media/mmc-certificate-snap-in-selected.png" alt="certificate"></p>
</li>
<li>
<p>可选：从“文件”菜单中选择“保存”或“另存为”，以保存 MMC 控制台文件供稍后使用。</p>
</li>
<li>
<p>若要在 MMC 管理单元中查看你的证书，请在左侧窗格中选择“控制台根节点”，然后展开“证书(本地计算机)”。</p>
<p>此时将显示每种类型的证书的目录列表。 在每个证书目录中，可以查看、导出、导入和删除其证书。</p>
</li>
<li>
<p>在“运行”窗口打开证书编辑器：如果是管理员查看本机的打开“<code v-pre>certlm.msc</code>”，如果只查看当前用户的打开“<code v-pre>certmgr.msc</code>”。<br>
此时会显示当前用户的证书管理器工具。</p>
</li>
<li>
<p>在左侧的控制节点中展开“<strong>证书</strong>” -&gt; “<strong>受信任的证书颁发机构</strong>” -&gt; “<strong>证书</strong>”，在<strong>证书</strong>上鼠标单击右键 -&gt; &quot;<strong>所有任务</strong>&quot; -&gt; “<strong>导入</strong>”。<br>
只需要在这里选择你的证书导入即可。
<img src="https://img-blog.csdnimg.cn/2020032016093246.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTkxMzEyMg==,size_16,color_FFFFFF,t_70" alt="certificate"></p>
</li>
</ol>
<h2 id="macos管理证书" tabindex="-1"><a class="header-anchor" href="#macos管理证书"><span>MacOS管理证书</span></a></h2>
<h2 id="linux管理证书" tabindex="-1"><a class="header-anchor" href="#linux管理证书"><span>Linux管理证书</span></a></h2>
<h2 id="踩的坑" tabindex="-1"><a class="header-anchor" href="#踩的坑"><span>踩的坑</span></a></h2>
<ul>
<li>
<p>2022.4.5<br>
我用 <strong>自签名证书(self-signed cert)</strong> 的时候，客户端连服务端的：127.0.0.1和localhost都是通畅的，可是我一旦用局域网IP（比如：192.168.1.6），就连接不上，这个可真是让人烦恼。</p>
</li>
<li>
<p>2022.4.6<br>
我现在把证书给加进去到受信任里边去了，现在在浏览器里面浏览倒是没问题了，其实也不能说有问题，也就是浏览器认为证书不可信，却始终是能够能用的。在gRpc程序里边是不行，握手就失败了，今天还是不行。继续捣鼓。<br>
我用gin实现了一套简单的web服务，然后用http包实现了客户端。相互之间访问没有问题。我后来又拿这个http包的客户端访问了gRpc的http服务，访问也是没有问题的。这说明，证书能用，服务器也没问题。现在问题可以确定是出在了gRpc的客户端上面了。网上去搜了一圈，无果。</p>
</li>
</ul>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://islishude.github.io/blog/2020/09/22/crypto/%E5%9F%BA%E4%BA%8Ex509%E7%9A%84%E8%AE%A4%E8%AF%81%E6%8E%88%E6%9D%83%E6%8A%80%E6%9C%AF/" target="_blank" rel="noopener noreferrer">基于x509的认证授权技术
</a></li>
<li><a href="https://www.kubernetes.org.cn/8900.html" target="_blank" rel="noopener noreferrer">双向TLS：保护服务网格中微服务的通信安全</a></li>
<li><a href="https://www.ssl.com/zh-CN/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E4%BB%80%E4%B9%88%E6%98%AFssl/" target="_blank" rel="noopener noreferrer">什么是SSL？</a></li>
<li><a href="https://zhuanlan.zhihu.com/p/140752944" target="_blank" rel="noopener noreferrer">为 Ingress-nginx 配置双向认证（mtls）</a></li>
<li><a href="https://www.ssl.com/zh-CN/%E6%8C%87%E5%AF%BC/pem-der-crt%E5%92%8Ccer-x-509%E7%BC%96%E7%A0%81%E5%92%8C%E8%BD%AC%E6%8D%A2/" target="_blank" rel="noopener noreferrer">PEM，DER，CRT和CER：X.509编码和转换</a></li>
<li><a href="https://blog.freessl.cn/ssl-cert-format-introduce/" target="_blank" rel="noopener noreferrer">SSL 证书格式普及，PEM、CER、JKS、PKCS12</a></li>
<li><a href="https://www.cnblogs.com/molao-doing/articles/9687445.html" target="_blank" rel="noopener noreferrer">Java 证书以及证书管理(keytool实例),jks\crt\cet\ketstore</a></li>
<li><a href="https://colobu.com/2016/06/07/simple-golang-tls-examples/" target="_blank" rel="noopener noreferrer">使用Go实现TLS 服务器和客户端</a></li>
<li><a href="https://zh.wikipedia.org/wiki/%E5%82%B3%E8%BC%B8%E5%B1%A4%E5%AE%89%E5%85%A8%E5%8D%94%E8%AD%B0" target="_blank" rel="noopener noreferrer">维基百科 - 传输层安全性协议</a></li>
<li><a href="https://www.ruanyifeng.com/blog/2014/02/ssl_tls.html" target="_blank" rel="noopener noreferrer">SSL/TLS协议运行机制的概述</a></li>
<li><a href="https://gist.github.com/spikebike/2232102" target="_blank" rel="noopener noreferrer">gist - TLS server and client</a></li>
<li><a href="https://github.com/nareix/tls-example" target="_blank" rel="noopener noreferrer">Golang TLS example</a></li>
<li><a href="https://golang.org/pkg/crypto/tls/" target="_blank" rel="noopener noreferrer">golang crypto/tls pkg</a></li>
<li><a href="https://www.tangyuecan.com/2021/12/17/%E5%B1%80%E5%9F%9F%E7%BD%91%E5%86%85%E6%90%AD%E5%BB%BA%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8F%AF%E4%BF%A1%E4%BB%BB%E7%9A%84ssl%E8%AF%81%E4%B9%A6/" target="_blank" rel="noopener noreferrer">局域网内搭建浏览器可信任的SSL证书</a></li>
<li><a href="https://docs.microsoft.com/zh-cn/dotnet/framework/wcf/feature-details/how-to-view-certificates-with-the-mmc-snap-in" target="_blank" rel="noopener noreferrer">如何：使用 MMC 管理单元查看证书</a></li>
<li><a href="https://docs.microsoft.com/zh-cn/dotnet/framework/wcf/feature-details/how-to-create-temporary-certificates-for-use-during-development" target="_blank" rel="noopener noreferrer">如何：创建开发期间使用的临时证书</a></li>
<li><a href="https://blog.csdn.net/weixin_41913122/article/details/104992412" target="_blank" rel="noopener noreferrer">将证书导入到“受信任的根证书颁发机构”存储区中</a></li>
<li><a href="https://www.poftut.com/use-openssl-s_client-check-verify-ssltls-https-webserver/" target="_blank" rel="noopener noreferrer">How To Use OpenSSL s_client To Check and Verify SSL/TLS Of HTTPS Webserver?</a></li>
</ul>
</div></template>



import{_ as s,c as a,e,o as p}from"./app-QnUuAS07.js";const l={};function i(t,n){return p(),a("div",null,[...n[0]||(n[0]=[e(`<h1 id="mqtt用x509进行认证" tabindex="-1"><a class="header-anchor" href="#mqtt用x509进行认证"><span>MQTT用X509进行认证</span></a></h1><h2 id="什么是ssl" tabindex="-1"><a class="header-anchor" href="#什么是ssl"><span>什么是SSL</span></a></h2><p><strong>SSL（安全套接字层）</strong> 及其后继者 <strong>TLS（传输层安全性）</strong> 是用于在联网计算机之间建立经过身份验证和加密的链接的协议。 尽管SSL协议已随着以下版本的发布而被弃用 TLS 1.0，在1999年，将这些相关技术称为“ SSL”或“ SSL /TLS。” 最新版本是 TLS 1.3，定义于 <a href="https://tools.ietf.org/html/rfc8446" target="_blank" rel="noopener noreferrer">RFC 8446</a> （八月2018）。</p><p><strong>SSL（安全套接字层）</strong> 及其后继者 <strong>TLS （传输层安全性）</strong> 是用于在联网计算机之间建立经过身份验证和加密的链接的协议。 尽管SSL协议已随着以下版本的发布而被弃用 TLS 1.0，在1999年，将这些相关技术称为“ SSL”或“ SSL /TLS设立的区域办事处外，我们在美国也开设了办事处，以便我们为当地客户提供更多的支持。</p><h2 id="什么是ssl证书" tabindex="-1"><a class="header-anchor" href="#什么是ssl证书"><span>什么是SSL证书？</span></a></h2><p><strong>SSL证书</strong> （也称为 TLS 或SSL /TLS 证书）是将网站的身份绑定到由公共密钥和私有密钥组成的加密密钥对的数字文档。 证书中包含的公钥允许Web浏览器执行以下操作： 通过 TLS 和 HTTPS 协议。 私钥在服务器上保持安全，并用于对网页和其他文档（例如图像和JavaScript文件）进行数字签名。</p><p>SSL证书还包括有关网站的标识信息（包括域名）以及（可选）有关网站所有者的标识信息。 如果Web服务器的SSL证书是由公共信任的证书颁发机构（CA）签名的，例如 <a href="https://www.ssl.com/zh-CN/" target="_blank" rel="noopener noreferrer">SSL.com</a> ，最终用户的Web浏览器和操作系统将信任来自服务器的数字签名内容，使其具有真实性。</p><p>公司和组织需要在其网站上添加 SSL 证书，以保护在线交易并保持客户信息的私密性和安全性。</p><p>简而言之：SSL 可确保互联网连接的安全，并防止犯罪分子读取或修改两个系统之间传输的信息。如果您在地址栏中的 URL 旁看到一个挂锁图标，则表示 SSL 在保护您正在访问的网站。</p><p>SSL证书是一种 <strong>X.509证书</strong>。</p><h2 id="什么是tls" tabindex="-1"><a class="header-anchor" href="#什么是tls"><span>什么是TLS</span></a></h2><p><strong>TLS （传输层安全性）</strong> 于1999年发布，是继 <strong>SSL（安全套接字层）</strong> 认证和加密协议。 TLS 1.3在中定义 <a href="https://tools.ietf.org/html/rfc8446" target="_blank" rel="noopener noreferrer">RFC 8446</a> （八月2018）。</p><h2 id="什么是mtls" tabindex="-1"><a class="header-anchor" href="#什么是mtls"><span>什么是mTLS</span></a></h2><p>双向TLS（mTLS）是指在服务器端和客户端之间使用双向加密通道。如今，mTLS是确保云原生应用程序中微服务之间的通信安全的首选协议。</p><blockquote><p>双向认证，顾名思义，客户端和服务器端都需要验证对方的身份，在建立Https连接的过程中，握手的流程比单向认证多了几步。单向认证的过程，客户端从服务器端下载服务器端公钥证书进行验证，然后建立安全通信通道。双向通信流程，客户端除了需要从服务器端下载服务器的公钥证书进行验证外，还需要把客户端的公钥证书上传到服务器端给服务器端进行验证，等双方都认证通过了，才开始建立安全通信通道进行数据传输。</p></blockquote><p>传输层安全性（TLS）已用于保护Internet上客户端和服务器之间的流量很多年，但通常使用单向身份验证-服务器向用户提供证书以证明其身份。这种单向身份验证的基本示例是–在线访问银行帐户时，服务器向你的计算机发送证书，以证明它实际上是你要连接的银行。该证书还包含一个公共加密密钥，该密钥用于在你和数据通过的银行之间创建一个安全的加密链接。</p><p>双向TLS扩展了客户端-服务器TLS模型，以包括双方的身份验证。在银行依靠其他特定于应用程序的机制来确认客户身份的情况下，例如用户名和密码（通常带有两因素身份验证），mTLS使用x.509证书来识别和验证每个微服务。每个证书都包含一个公共加密密钥和一个身份，并由受信任的证书颁发机构签名，该证书颁发机构证明该证书代表提出该证书的实体。</p><p>在mTLS中，服务网格中的每个微服务都会验证对方的证书，并使用公共密钥来创建每个会话唯一的加密密钥。</p><ul><li><strong>TLS</strong> <strong>服务器端</strong>提供一个授信证书，当我们使用 https 协议访问<strong>服务器端</strong>时，<strong>客户端</strong>会向<strong>服务器端</strong>索取证书并认证（浏览器会与自己的授信域匹配或弹出不安全的页面）。</li><li><strong>mTLS</strong> 则是由同一个 <strong>Root CA</strong> 生成两套证书，即<strong>客户端证书</strong>和<strong>服务端证书</strong>。客户端使用 https 访问服务端时，双方会交换证书，并进行认证，认证通过方可通信。</li></ul><h2 id="什么是x509" tabindex="-1"><a class="header-anchor" href="#什么是x509"><span>什么是X509</span></a></h2><p><strong>X.509</strong> 是用于的标准格式 <strong>公钥证书</strong>，是将加密密钥对与网站，个人或组织等身份安全地关联的数字文档。</p><p>X.509是公钥基础设施（PKI）的标准格式。X.509证书就是基于国际电信联盟（ITU）制定的X.509标准的数字证书。X.509证书主要用于识别互联网通信和计算机网络中的身份，保护数据传输安全。X.509证书无处不在，比如我们每天使用的网站、移动应用程序、电子文档以及连接的设备等都有它的身影。</p><p>X.509证书的常见应用包括：</p><ul><li>SSL /TLS 和 HTTPS 用于经过身份验证和加密的Web浏览</li><li>通过签名并加密的电子邮件 S/MIME 协议</li><li>代码签名</li><li>文件签署</li><li>客户端认证</li><li>政府签发的电子身份证</li></ul><h2 id="证书格式类型" tabindex="-1"><a class="header-anchor" href="#证书格式类型"><span>证书格式类型</span></a></h2><p>证书主要的格式有以下几种</p><ul><li>.DER .CER，文件是二进制格式，只保存证书，不保存私钥。</li><li>.PEM，一般是文本格式，可保存证书，可保存私钥。</li><li>.CRT，可以是二进制格式，可以是文本格式，与 .DER 格式相同，不保存私钥。</li><li>.PFX .P12，二进制格式，同时包含证书和私钥，一般有密码保护。</li><li>.JKS，二进制格式，同时包含证书和私钥，一般有密码保护。</li></ul><h3 id="der" tabindex="-1"><a class="header-anchor" href="#der"><span>DER</span></a></h3><p>该格式是二进制文件内容，Java 和 Windows 服务器偏向于使用这种编码格式。</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">3082 07fd 3082 05e5 a003 0201 0202 1068</span>
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
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="pem" tabindex="-1"><a class="header-anchor" href="#pem"><span>PEM</span></a></h3><p>Privacy Enhanced Mail，一般为文本格式（Base64 ASCII），以 —–BEGIN… 开头，以 —–END… 结尾。中间的内容是 BASE64 编码。这种格式可以保存证书和私钥，有时我们也把PEM 格式的私钥的后缀改为 .key 以区别证书与私钥。具体你可以看文件的内容。</p><p>这种格式常用于 Apache 和 Nginx 服务器。</p><ul><li>如果存在<code>——BEGIN CERTIFICATE——</code>，则说明这是一个证书文件。</li><li>如果存在<code>—–BEGIN RSA PRIVATE KEY—–</code>，则说明这是一个私钥文件</li></ul><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">-----BEGIN CERTIFICATE-----</span>
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
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="crt" tabindex="-1"><a class="header-anchor" href="#crt"><span>CRT</span></a></h3><p>Certificate 的简称，有可能是 PEM 编码格式，也有可能是 DER 编码格式。</p><h3 id="pfx" tabindex="-1"><a class="header-anchor" href="#pfx"><span>PFX</span></a></h3><p>Predecessor of PKCS#12，这种格式是二进制格式，且证书和私钥存在一个 PFX 文件中。一般用于 Windows 上的 IIS 服务器。改格式的文件一般会有一个密码用于保证私钥的安全。</p><h3 id="jks" tabindex="-1"><a class="header-anchor" href="#jks"><span>JKS</span></a></h3><p>Java Key Storage，很容易知道这是 JAVA 的专属格式，利用 JAVA 的一个叫 keytool 的工具可以进行格式转换。一般用于 Tomcat 服务器。</p><h2 id="golang实例代码" tabindex="-1"><a class="header-anchor" href="#golang实例代码"><span>golang实例代码</span></a></h2><h3 id="tls证书单向认证" tabindex="-1"><a class="header-anchor" href="#tls证书单向认证"><span>TLS证书单向认证</span></a></h3><p>只需要提供CA证书即可。</p><p>CA证书由emqx提供的，CA 证书文件下载地址：<a href="https://static.emqx.net/data/broker.emqx.io-ca.crt" target="_blank" rel="noopener noreferrer">https://static.emqx.net/data/broker.emqx.io-ca.crt</a></p><div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre><code><span class="line"><span class="token keyword">func</span> <span class="token function">NewTlsConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span>tls<span class="token punctuation">.</span>Config <span class="token punctuation">{</span></span>
<span class="line">	certpool <span class="token operator">:=</span> x509<span class="token punctuation">.</span><span class="token function">NewCertPool</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">	ca<span class="token punctuation">,</span> err <span class="token operator">:=</span> ioutil<span class="token punctuation">.</span><span class="token function">ReadFile</span><span class="token punctuation">(</span><span class="token string">&quot;./broker.emqx.io-ca.crt&quot;</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatalln</span><span class="token punctuation">(</span>err<span class="token punctuation">.</span><span class="token function">Error</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	certpool<span class="token punctuation">.</span><span class="token function">AppendCertsFromPEM</span><span class="token punctuation">(</span>ca<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token operator">&amp;</span>tls<span class="token punctuation">.</span>Config<span class="token punctuation">{</span></span>
<span class="line">		RootCAs<span class="token punctuation">:</span> certpool<span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>mosquitto订阅</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">mosquitto_sub <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.111.100 <span class="token parameter variable">-p</span> <span class="token number">8883</span> <span class="token parameter variable">-t</span> <span class="token string">&quot;/topic/UpdateTemperature&quot;</span> <span class="token parameter variable">--cafile</span> /ca.crt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>mosquitto发布</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">mosquitto_pub <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.111.100 <span class="token parameter variable">-p</span> <span class="token number">8883</span> <span class="token parameter variable">-t</span> <span class="token string">&quot;/topic/UpdateTemperature&quot;</span> <span class="token parameter variable">-m</span> <span class="token string">&quot;temperature:15&quot;</span>  <span class="token parameter variable">--cafile</span> /ca.crt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="mtls证书双向认证" tabindex="-1"><a class="header-anchor" href="#mtls证书双向认证"><span>mTLS证书双向认证</span></a></h3><p>不仅需要提供CA证书，还需要提供客户端的证书和私钥。</p><p>照理说，双向认证之后，MQTT服务器就不需要再进行用户名和密码的校验了，但是现实是，更多的时候，部署的时候，我们并不是直接在MQTT服务器上做SSL的支持，而是在此之前加一个代理服务器，比如HAProxy之类的，这样就只会在代理服务器上做SSL的支持，而不会在MQTT服务器上做SSL的支持。这样的话，我们在MQTT服务器上可能获取不到客户端的TLS证书，就更不要提获取到证书中的用户信息了。所以，至少还是需要做一下用户名的校验。</p><div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre><code><span class="line"><span class="token keyword">func</span> <span class="token function">NewMTLSConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span>tls<span class="token punctuation">.</span>Config <span class="token punctuation">{</span></span>
<span class="line">	certpool <span class="token operator">:=</span> x509<span class="token punctuation">.</span><span class="token function">NewCertPool</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">	ca<span class="token punctuation">,</span> err <span class="token operator">:=</span> ioutil<span class="token punctuation">.</span><span class="token function">ReadFile</span><span class="token punctuation">(</span><span class="token string">&quot;ca.pem&quot;</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatalln</span><span class="token punctuation">(</span>err<span class="token punctuation">.</span><span class="token function">Error</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	certpool<span class="token punctuation">.</span><span class="token function">AppendCertsFromPEM</span><span class="token punctuation">(</span>ca<span class="token punctuation">)</span></span>
<span class="line">	<span class="token comment">// Import client certificate/key pair</span></span>
<span class="line">	clientKeyPair<span class="token punctuation">,</span> err <span class="token operator">:=</span> tls<span class="token punctuation">.</span><span class="token function">LoadX509KeyPair</span><span class="token punctuation">(</span><span class="token string">&quot;client-crt.pem&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;client-key.pem&quot;</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token operator">&amp;</span>tls<span class="token punctuation">.</span>Config<span class="token punctuation">{</span></span>
<span class="line">		RootCAs<span class="token punctuation">:</span>            certpool<span class="token punctuation">,</span></span>
<span class="line">		ClientAuth<span class="token punctuation">:</span>         tls<span class="token punctuation">.</span>NoClientCert<span class="token punctuation">,</span></span>
<span class="line">		ClientCAs<span class="token punctuation">:</span>          <span class="token boolean">nil</span><span class="token punctuation">,</span></span>
<span class="line">		InsecureSkipVerify<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">		Certificates<span class="token punctuation">:</span>       <span class="token punctuation">[</span><span class="token punctuation">]</span>tls<span class="token punctuation">.</span>Certificate<span class="token punctuation">{</span>clientKeyPair<span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>mosquitto订阅</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">mosquitto_sub <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.111.100 <span class="token parameter variable">-p</span> <span class="token number">8883</span> <span class="token parameter variable">-t</span> <span class="token string">&quot;/topic/UpdateTemperature&quot;</span> <span class="token parameter variable">--cafile</span> /ca.crt <span class="token parameter variable">--cert</span> /client.crt <span class="token parameter variable">--key</span> /client.key</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>mosquitto发布</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">mosquitto_pub <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.111.100 <span class="token parameter variable">-p</span> <span class="token number">8883</span> <span class="token parameter variable">-t</span> <span class="token string">&quot;/topic/UpdateTemperature&quot;</span> <span class="token parameter variable">-m</span> <span class="token string">&quot;temperature:15&quot;</span>  <span class="token parameter variable">--cafile</span> /ca.crt <span class="token parameter variable">--cert</span> /client.crt <span class="token parameter variable">--key</span> /client.key</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="完整代码" tabindex="-1"><a class="header-anchor" href="#完整代码"><span>完整代码</span></a></h3><div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre><code><span class="line"><span class="token keyword">package</span> main</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token string">&quot;crypto/tls&quot;</span></span>
<span class="line">	<span class="token string">&quot;crypto/x509&quot;</span></span>
<span class="line">	<span class="token string">&quot;fmt&quot;</span></span>
<span class="line">	<span class="token string">&quot;io/ioutil&quot;</span></span>
<span class="line">	<span class="token string">&quot;log&quot;</span></span>
<span class="line">	<span class="token string">&quot;time&quot;</span></span>
<span class="line"></span>
<span class="line">	mqtt <span class="token string">&quot;github.com/eclipse/paho.mqtt.golang&quot;</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 接入信息</span></span>
<span class="line"><span class="token comment">// Broker: broker-cn.emqx.io</span></span>
<span class="line"><span class="token comment">// TCP 端口: 1883</span></span>
<span class="line"><span class="token comment">// Websocket 端口: 8083</span></span>
<span class="line"><span class="token comment">// TCP/TLS 端口: 8883</span></span>
<span class="line"><span class="token comment">// Websocket/TLS 端口: 8084</span></span>
<span class="line"><span class="token comment">// CA 证书文件: https://static.emqx.net/data/broker.emqx.io-ca.crt</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> QoS <span class="token operator">=</span> <span class="token number">0x02</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">NewMTlsConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span>tls<span class="token punctuation">.</span>Config <span class="token punctuation">{</span></span>
<span class="line">	certpool <span class="token operator">:=</span> x509<span class="token punctuation">.</span><span class="token function">NewCertPool</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">	ca<span class="token punctuation">,</span> err <span class="token operator">:=</span> ioutil<span class="token punctuation">.</span><span class="token function">ReadFile</span><span class="token punctuation">(</span><span class="token string">&quot;ca.pem&quot;</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatalln</span><span class="token punctuation">(</span>err<span class="token punctuation">.</span><span class="token function">Error</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	certpool<span class="token punctuation">.</span><span class="token function">AppendCertsFromPEM</span><span class="token punctuation">(</span>ca<span class="token punctuation">)</span></span>
<span class="line">	<span class="token comment">// Import client certificate/key pair</span></span>
<span class="line">	clientKeyPair<span class="token punctuation">,</span> err <span class="token operator">:=</span> tls<span class="token punctuation">.</span><span class="token function">LoadX509KeyPair</span><span class="token punctuation">(</span><span class="token string">&quot;client-crt.pem&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;client-key.pem&quot;</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token operator">&amp;</span>tls<span class="token punctuation">.</span>Config<span class="token punctuation">{</span></span>
<span class="line">		RootCAs<span class="token punctuation">:</span>            certpool<span class="token punctuation">,</span></span>
<span class="line">		ClientAuth<span class="token punctuation">:</span>         tls<span class="token punctuation">.</span>NoClientCert<span class="token punctuation">,</span></span>
<span class="line">		ClientCAs<span class="token punctuation">:</span>          <span class="token boolean">nil</span><span class="token punctuation">,</span></span>
<span class="line">		InsecureSkipVerify<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">		Certificates<span class="token punctuation">:</span>       <span class="token punctuation">[</span><span class="token punctuation">]</span>tls<span class="token punctuation">.</span>Certificate<span class="token punctuation">{</span>clientKeyPair<span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">NewTlsConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span>tls<span class="token punctuation">.</span>Config <span class="token punctuation">{</span></span>
<span class="line">	certpool <span class="token operator">:=</span> x509<span class="token punctuation">.</span><span class="token function">NewCertPool</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">	ca<span class="token punctuation">,</span> err <span class="token operator">:=</span> ioutil<span class="token punctuation">.</span><span class="token function">ReadFile</span><span class="token punctuation">(</span><span class="token string">&quot;./broker.emqx.io-ca.crt&quot;</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatalln</span><span class="token punctuation">(</span>err<span class="token punctuation">.</span><span class="token function">Error</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	certpool<span class="token punctuation">.</span><span class="token function">AppendCertsFromPEM</span><span class="token punctuation">(</span>ca<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token operator">&amp;</span>tls<span class="token punctuation">.</span>Config<span class="token punctuation">{</span></span>
<span class="line">		RootCAs<span class="token punctuation">:</span> certpool<span class="token punctuation">,</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">var</span> messagePubHandler mqtt<span class="token punctuation">.</span>MessageHandler <span class="token operator">=</span> <span class="token keyword">func</span><span class="token punctuation">(</span>client mqtt<span class="token punctuation">.</span>Client<span class="token punctuation">,</span> msg mqtt<span class="token punctuation">.</span>Message<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;Received message: %s from topic: %s\\n&quot;</span><span class="token punctuation">,</span> msg<span class="token punctuation">.</span><span class="token function">Payload</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> msg<span class="token punctuation">.</span><span class="token function">Topic</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">var</span> connectHandler mqtt<span class="token punctuation">.</span>OnConnectHandler <span class="token operator">=</span> <span class="token keyword">func</span><span class="token punctuation">(</span>client mqtt<span class="token punctuation">.</span>Client<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;Connected&quot;</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">var</span> connectLostHandler mqtt<span class="token punctuation">.</span>ConnectionLostHandler <span class="token operator">=</span> <span class="token keyword">func</span><span class="token punctuation">(</span>client mqtt<span class="token punctuation">.</span>Client<span class="token punctuation">,</span> err <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;Connect lost: %v&quot;</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">sub</span><span class="token punctuation">(</span>client mqtt<span class="token punctuation">.</span>Client<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	topic <span class="token operator">:=</span> <span class="token string">&quot;topic/test&quot;</span></span>
<span class="line">	token <span class="token operator">:=</span> client<span class="token punctuation">.</span><span class="token function">Subscribe</span><span class="token punctuation">(</span>topic<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token boolean">nil</span><span class="token punctuation">)</span></span>
<span class="line">	token<span class="token punctuation">.</span><span class="token function">Wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;Subscribed to topic %s&quot;</span><span class="token punctuation">,</span> topic<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">publish</span><span class="token punctuation">(</span>client mqtt<span class="token punctuation">.</span>Client<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	num <span class="token operator">:=</span> <span class="token number">10</span></span>
<span class="line">	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> num<span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">{</span></span>
<span class="line">		text <span class="token operator">:=</span> fmt<span class="token punctuation">.</span><span class="token function">Sprintf</span><span class="token punctuation">(</span><span class="token string">&quot;Message %d&quot;</span><span class="token punctuation">,</span> i<span class="token punctuation">)</span></span>
<span class="line">		token <span class="token operator">:=</span> client<span class="token punctuation">.</span><span class="token function">Publish</span><span class="token punctuation">(</span><span class="token string">&quot;topic/test&quot;</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">,</span> text<span class="token punctuation">)</span></span>
<span class="line">		token<span class="token punctuation">.</span><span class="token function">Wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">		time<span class="token punctuation">.</span><span class="token function">Sleep</span><span class="token punctuation">(</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">RunMqttClient</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">var</span> broker <span class="token operator">=</span> <span class="token string">&quot;broker.emqx.io&quot;</span></span>
<span class="line">	<span class="token keyword">var</span> port <span class="token operator">=</span> <span class="token number">8883</span></span>
<span class="line">	<span class="token keyword">var</span> clientId <span class="token operator">=</span> <span class="token string">&quot;go_mqtt_client&quot;</span></span>
<span class="line">	<span class="token keyword">var</span> username <span class="token operator">=</span> <span class="token string">&quot;emqx&quot;</span></span>
<span class="line">	<span class="token keyword">var</span> password <span class="token operator">=</span> <span class="token string">&quot;public&quot;</span></span>
<span class="line"></span>
<span class="line">	tlsConfig <span class="token operator">:=</span> <span class="token function">NewTlsConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	opts <span class="token operator">:=</span> mqtt<span class="token punctuation">.</span><span class="token function">NewClientOptions</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">	opts<span class="token punctuation">.</span><span class="token function">AddBroker</span><span class="token punctuation">(</span>fmt<span class="token punctuation">.</span><span class="token function">Sprintf</span><span class="token punctuation">(</span><span class="token string">&quot;tcp://%s:%d&quot;</span><span class="token punctuation">,</span> broker<span class="token punctuation">,</span> port<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	opts<span class="token punctuation">.</span><span class="token function">SetTLSConfig</span><span class="token punctuation">(</span>tlsConfig<span class="token punctuation">)</span></span>
<span class="line">	opts<span class="token punctuation">.</span><span class="token function">SetClientID</span><span class="token punctuation">(</span>clientId<span class="token punctuation">)</span></span>
<span class="line">	opts<span class="token punctuation">.</span><span class="token function">SetUsername</span><span class="token punctuation">(</span>username<span class="token punctuation">)</span></span>
<span class="line">	opts<span class="token punctuation">.</span><span class="token function">SetPassword</span><span class="token punctuation">(</span>password<span class="token punctuation">)</span></span>
<span class="line">	opts<span class="token punctuation">.</span><span class="token function">SetDefaultPublishHandler</span><span class="token punctuation">(</span>messagePubHandler<span class="token punctuation">)</span></span>
<span class="line">	opts<span class="token punctuation">.</span>OnConnect <span class="token operator">=</span> connectHandler</span>
<span class="line">	opts<span class="token punctuation">.</span>OnConnectionLost <span class="token operator">=</span> connectLostHandler</span>
<span class="line">	client <span class="token operator">:=</span> mqtt<span class="token punctuation">.</span><span class="token function">NewClient</span><span class="token punctuation">(</span>opts<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> token <span class="token operator">:=</span> client<span class="token punctuation">.</span><span class="token function">Connect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> token<span class="token punctuation">.</span><span class="token function">Wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> token<span class="token punctuation">.</span><span class="token function">Error</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token function">panic</span><span class="token punctuation">(</span>token<span class="token punctuation">.</span><span class="token function">Error</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token function">sub</span><span class="token punctuation">(</span>client<span class="token punctuation">)</span></span>
<span class="line">	<span class="token function">publish</span><span class="token punctuation">(</span>client<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	client<span class="token punctuation">.</span><span class="token function">Disconnect</span><span class="token punctuation">(</span><span class="token number">250</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token function">RunMqttClient</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2><ul><li><a href="https://www.kubernetes.org.cn/8900.html" target="_blank" rel="noopener noreferrer">双向TLS：保护服务网格中微服务的通信安全</a></li><li><a href="https://www.ssl.com/zh-CN/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E4%BB%80%E4%B9%88%E6%98%AFssl/" target="_blank" rel="noopener noreferrer">什么是SSL？</a></li><li><a href="https://zhuanlan.zhihu.com/p/140752944" target="_blank" rel="noopener noreferrer">为 Ingress-nginx 配置双向认证（mtls）</a></li><li><a href="https://www.ssl.com/zh-CN/%E6%8C%87%E5%AF%BC/pem-der-crt%E5%92%8Ccer-x-509%E7%BC%96%E7%A0%81%E5%92%8C%E8%BD%AC%E6%8D%A2/" target="_blank" rel="noopener noreferrer">PEM，DER，CRT和CER：X.509编码和转换</a></li><li><a href="https://blog.freessl.cn/ssl-cert-format-introduce/" target="_blank" rel="noopener noreferrer">SSL 证书格式普及，PEM、CER、JKS、PKCS12</a></li><li><a href="https://www.cnblogs.com/molao-doing/articles/9687445.html" target="_blank" rel="noopener noreferrer">Java 证书以及证书管理(keytool实例),jks\\crt\\cet\\ketstore</a></li><li><a href="https://blog.csdn.net/mayue_web/article/details/121249082" target="_blank" rel="noopener noreferrer">mosquitto 测试MQTT TLS单向认证和双向认证</a></li><li><a href="https://openest.io/en/2020/01/03/mqtts-how-to-use-mqtt-with-tls/" target="_blank" rel="noopener noreferrer">MQTTS : How to use MQTT with TLS?</a></li></ul>`,62)])])}const o=s(l,[["render",i]]),u=JSON.parse('{"path":"/posts/mqtt_x509.html","title":"MQTT用X509进行认证","lang":"zh-CN","frontmatter":{"date":"2020-01-01T00:00:00.000Z","category":["编程技术"],"tag":["MQTT"],"sticky":10},"headers":[{"level":2,"title":"什么是SSL","slug":"什么是ssl","link":"#什么是ssl","children":[]},{"level":2,"title":"什么是SSL证书？","slug":"什么是ssl证书","link":"#什么是ssl证书","children":[]},{"level":2,"title":"什么是TLS","slug":"什么是tls","link":"#什么是tls","children":[]},{"level":2,"title":"什么是mTLS","slug":"什么是mtls","link":"#什么是mtls","children":[]},{"level":2,"title":"什么是X509","slug":"什么是x509","link":"#什么是x509","children":[]},{"level":2,"title":"证书格式类型","slug":"证书格式类型","link":"#证书格式类型","children":[{"level":3,"title":"DER","slug":"der","link":"#der","children":[]},{"level":3,"title":"PEM","slug":"pem","link":"#pem","children":[]},{"level":3,"title":"CRT","slug":"crt","link":"#crt","children":[]},{"level":3,"title":"PFX","slug":"pfx","link":"#pfx","children":[]},{"level":3,"title":"JKS","slug":"jks","link":"#jks","children":[]}]},{"level":2,"title":"golang实例代码","slug":"golang实例代码","link":"#golang实例代码","children":[{"level":3,"title":"TLS证书单向认证","slug":"tls证书单向认证","link":"#tls证书单向认证","children":[]},{"level":3,"title":"mTLS证书双向认证","slug":"mtls证书双向认证","link":"#mtls证书双向认证","children":[]},{"level":3,"title":"完整代码","slug":"完整代码","link":"#完整代码","children":[]}]},{"level":2,"title":"参考资料","slug":"参考资料","link":"#参考资料","children":[]}],"git":{"updatedTime":1774788457000,"contributors":[{"name":"tx7do","username":"tx7do","email":"yanglinbo@gmail.com","commits":2,"url":"https://github.com/tx7do"},{"name":"Bobo","username":"Bobo","email":"yanglinbo@gmail.com","commits":1,"url":"https://github.com/Bobo"}],"changelog":[{"hash":"a3e88b19cfead00baa606aa5110b2802dac32768","time":1774788457000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: REBUILD."},{"hash":"1a1aae65e361cb0fec8e8647ce95576150b6eb27","time":1649131951000,"email":"yanglinbo@gmail.com","author":"tx7do","message":"feat: edit post"},{"hash":"643cc3300965df44813b26880e436fa82144ebdc","time":1649131462000,"email":"yanglinbo@gmail.com","author":"tx7do","message":"feat: add post"}]},"filePathRelative":"posts/mqtt_x509.md","excerpt":"\\n<h2>什么是SSL</h2>\\n<p><strong>SSL（安全套接字层）</strong> 及其后继者 <strong>TLS（传输层安全性）</strong> 是用于在联网计算机之间建立经过身份验证和加密的链接的协议。 尽管SSL协议已随着以下版本的发布而被弃用 TLS 1.0，在1999年，将这些相关技术称为“ SSL”或“ SSL /TLS。” 最新版本是 TLS 1.3，定义于 <a href=\\"https://tools.ietf.org/html/rfc8446\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">RFC 8446</a> （八月2018）。</p>"}');export{o as comp,u as data};

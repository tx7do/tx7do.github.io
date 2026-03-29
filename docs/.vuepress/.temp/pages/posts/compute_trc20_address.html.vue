<template><div><h1 id="计算trc20地址" tabindex="-1"><a class="header-anchor" href="#计算trc20地址"><span>计算TRC20地址</span></a></h1>
<h2 id="python" tabindex="-1"><a class="header-anchor" href="#python"><span>Python</span></a></h2>
<h3 id="使用tronpy软件包" tabindex="-1"><a class="header-anchor" href="#使用tronpy软件包"><span>使用tronpy软件包</span></a></h3>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line"><span class="token keyword">from</span> tronpy<span class="token punctuation">.</span>keys <span class="token keyword">import</span> PrivateKey</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 指定私钥（请替换为你实际的私钥）</span></span>
<span class="line">private_key_hex <span class="token operator">=</span> <span class="token string">"your_private_key_hex_string"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 将十六进制私钥转换为PrivateKey对象</span></span>
<span class="line">private_key <span class="token operator">=</span> PrivateKey<span class="token punctuation">(</span><span class="token builtin">bytes</span><span class="token punctuation">.</span>fromhex<span class="token punctuation">(</span>private_key_hex<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 从私钥派生公钥</span></span>
<span class="line">public_key <span class="token operator">=</span> private_key<span class="token punctuation">.</span>public_key</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 从公钥生成TRC地址</span></span>
<span class="line">address <span class="token operator">=</span> public_key<span class="token punctuation">.</span>to_base58check_address<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"私钥 (十六进制):"</span><span class="token punctuation">,</span> private_key_hex<span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"公钥 (十六进制):"</span><span class="token punctuation">,</span> public_key<span class="token punctuation">.</span><span class="token builtin">hex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"TRC地址:"</span><span class="token punctuation">,</span> address<span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'\n'</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="寻常算法" tabindex="-1"><a class="header-anchor" href="#寻常算法"><span>寻常算法</span></a></h3>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line"><span class="token keyword">import</span> hashlib</span>
<span class="line"><span class="token keyword">import</span> base58</span>
<span class="line"><span class="token keyword">import</span> ecdsa</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 示例私钥，可替换为你自己的私钥</span></span>
<span class="line">private_key_hex <span class="token operator">=</span> <span class="token string">"your_private_key_hex_string"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 将十六进制私钥转换为字节形式</span></span>
<span class="line">private_key_bytes <span class="token operator">=</span> <span class="token builtin">bytes</span><span class="token punctuation">.</span>fromhex<span class="token punctuation">(</span>private_key_hex<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 SECP256k1 曲线生成私钥对象</span></span>
<span class="line">sk <span class="token operator">=</span> ecdsa<span class="token punctuation">.</span>SigningKey<span class="token punctuation">.</span>from_string<span class="token punctuation">(</span>private_key_bytes<span class="token punctuation">,</span> curve<span class="token operator">=</span>ecdsa<span class="token punctuation">.</span>SECP256k1<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 从私钥派生公钥</span></span>
<span class="line">vk <span class="token operator">=</span> sk<span class="token punctuation">.</span>get_verifying_key<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">public_key_bytes <span class="token operator">=</span> vk<span class="token punctuation">.</span>to_string<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">public_key_point <span class="token operator">=</span> vk<span class="token punctuation">.</span>pubkey<span class="token punctuation">.</span>point</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Hash the public key using Keccak-256</span></span>
<span class="line">public_key_hash <span class="token operator">=</span> keccak<span class="token punctuation">(</span>public_key_bytes<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Take the last 20 bytes of the hash and prepend 0x41</span></span>
<span class="line"><span class="token comment"># 添加 TRON 地址前缀 (0x41)</span></span>
<span class="line">tron_prefix <span class="token operator">=</span> <span class="token string">b'\x41'</span></span>
<span class="line">prefixed_hash160 <span class="token operator">=</span> tron_prefix <span class="token operator">+</span> public_key_hash<span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">20</span><span class="token punctuation">:</span><span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 对添加前缀后的结果进行两次 SHA-256 哈希以获取校验和</span></span>
<span class="line">first_sha256 <span class="token operator">=</span> hashlib<span class="token punctuation">.</span>sha256<span class="token punctuation">(</span>prefixed_hash160<span class="token punctuation">)</span><span class="token punctuation">.</span>digest<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">second_sha256 <span class="token operator">=</span> hashlib<span class="token punctuation">.</span>sha256<span class="token punctuation">(</span>first_sha256<span class="token punctuation">)</span><span class="token punctuation">.</span>digest<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 取前 4 字节作为校验和</span></span>
<span class="line">checksum <span class="token operator">=</span> second_sha256<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token number">4</span><span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 将前缀、哈希结果和校验和拼接</span></span>
<span class="line">full_payload <span class="token operator">=</span> prefixed_hash160 <span class="token operator">+</span> checksum</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Convert to hexadecimal string</span></span>
<span class="line">trc_address_hex <span class="token operator">=</span> prefixed_hash160<span class="token punctuation">.</span><span class="token builtin">hex</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 Base58 编码生成最终的 TRC 地址</span></span>
<span class="line">trc_address <span class="token operator">=</span> base58<span class="token punctuation">.</span>b58encode<span class="token punctuation">(</span>full_payload<span class="token punctuation">)</span><span class="token punctuation">.</span>decode<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 打印私钥（以十六进制字符串形式）</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"私钥 (十六进制):"</span><span class="token punctuation">,</span> sk<span class="token punctuation">.</span>to_string<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token builtin">hex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token comment"># 打印公钥（以十六进制字符串形式）</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"公钥 (十六进制):"</span><span class="token punctuation">,</span> vk<span class="token punctuation">.</span>to_string<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token builtin">hex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token comment"># 打印公钥对应的椭圆曲线上的点</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"公钥对应的椭圆曲线上的点:"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"  x 坐标 (十六进制):"</span><span class="token punctuation">,</span> <span class="token builtin">hex</span><span class="token punctuation">(</span>public_key_point<span class="token punctuation">.</span>x<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"  y 坐标 (十六进制):"</span><span class="token punctuation">,</span> <span class="token builtin">hex</span><span class="token punctuation">(</span>public_key_point<span class="token punctuation">.</span>y<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"Keccak-256哈希:"</span><span class="token punctuation">,</span> public_key_hash<span class="token punctuation">.</span><span class="token builtin">hex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"校验和:"</span><span class="token punctuation">,</span> checksum<span class="token punctuation">.</span><span class="token builtin">hex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"完整地址数据:"</span><span class="token punctuation">,</span> full_payload<span class="token punctuation">.</span><span class="token builtin">hex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"TRC 地址数据:"</span><span class="token punctuation">,</span> trc_address_hex<span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"TRC 地址:"</span><span class="token punctuation">,</span> trc_address<span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'\n'</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>



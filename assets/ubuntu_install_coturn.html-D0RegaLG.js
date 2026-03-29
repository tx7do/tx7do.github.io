import{_ as s,c as a,e,o as l}from"./app-BF-3zepC.js";const i={};function p(t,n){return l(),a("div",null,[...n[0]||(n[0]=[e(`<h1 id="ubuntu-安装-coturn" tabindex="-1"><a class="header-anchor" href="#ubuntu-安装-coturn"><span>Ubuntu 安装 CoTURN</span></a></h1><h2 id="使用apt安装" tabindex="-1"><a class="header-anchor" href="#使用apt安装"><span>使用apt安装</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token parameter variable">-y</span> update</span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token parameter variable">-y</span> <span class="token function">install</span> coturn</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="开机启动" tabindex="-1"><a class="header-anchor" href="#开机启动"><span>开机启动</span></a></h2><p>修改<code>/etc/default/coturn</code>文件：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">vim</span> /etc/default/coturn</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>下面这一行默认是使用<code>#</code>注释掉的，去掉<code>#</code>注释：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token assign-left variable">TURNSERVER_ENABLED</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="修改配置" tabindex="-1"><a class="header-anchor" href="#修改配置"><span>修改配置</span></a></h2><div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre><code><span class="line"><span class="token comment"># --- 网络配置 ---</span></span>
<span class="line"><span class="token comment"># 监听所有网络接口。注意：在生产环境中，应该只监听必要的接口</span></span>
<span class="line"><span class="token key attr-name">listening-ip</span><span class="token punctuation">=</span><span class="token value attr-value">0.0.0.0</span></span>
<span class="line"><span class="token comment">#listening-ip=2607:f0d0:1002:51::4</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 标准 TURN 端口</span></span>
<span class="line"><span class="token key attr-name">listening-port</span><span class="token punctuation">=</span><span class="token value attr-value">3478</span></span>
<span class="line"><span class="token comment"># TLS/DTLS 端口（取消注释以启用）</span></span>
<span class="line"><span class="token key attr-name">tls-listening-port</span><span class="token punctuation">=</span><span class="token value attr-value">5349</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># --- 中继配置 ---</span></span>
<span class="line"><span class="token comment"># 中继端口范围，根据您的网络环境和预期负载调整</span></span>
<span class="line"><span class="token key attr-name">min-port</span><span class="token punctuation">=</span><span class="token value attr-value">40000</span></span>
<span class="line"><span class="token key attr-name">max-port</span><span class="token punctuation">=</span><span class="token value attr-value">60000</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 内部中继IP地址</span></span>
<span class="line"><span class="token key attr-name">relay-ip</span><span class="token punctuation">=</span><span class="token value attr-value">0.0.0.0</span></span>
<span class="line"><span class="token comment"># 外部IP地址（NAT后的公网IP，如果有）</span></span>
<span class="line"><span class="token key attr-name">external-ip</span><span class="token punctuation">=</span><span class="token value attr-value">192.168.137.3</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># --- 认证配置 ---</span></span>
<span class="line"><span class="token comment"># 设置域名，用于长期凭证机制</span></span>
<span class="line"><span class="token key attr-name">realm</span><span class="token punctuation">=</span><span class="token value attr-value">example.com</span></span>
<span class="line"><span class="token comment"># 启用长期凭证机制</span></span>
<span class="line">lt-cred-mech</span>
<span class="line"></span>
<span class="line"><span class="token comment"># --- 用户凭证 ---</span></span>
<span class="line"><span class="token key attr-name">user</span><span class="token punctuation">=</span><span class="token value attr-value">user:password1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># --- TLS/DTLS 配置 ---</span></span>
<span class="line"><span class="token comment"># TLS 证书和私钥路径（取消注释以启用）</span></span>
<span class="line"><span class="token comment">#cert=/etc/turnserver/fullchain.pem</span></span>
<span class="line"><span class="token comment">#pkey=/etc/turnserver/privkey.pem</span></span>
<span class="line"><span class="token comment"># 推荐的密码套件，提供强加密（取消注释以启用）</span></span>
<span class="line"><span class="token comment">#cipher-list=&quot;ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># --- 安全设置 ---</span></span>
<span class="line"><span class="token comment"># 启用指纹，防止中间人攻击</span></span>
<span class="line">fingerprint</span>
<span class="line"><span class="token comment"># 启用过期 nonce 检测，防止重放攻击（取消注释以启用）</span></span>
<span class="line"><span class="token comment">#stale-nonce=3600</span></span>
<span class="line"><span class="token comment"># 设置 DTLS 会话密钥的生命周期（单位：秒）（取消注释以启用）</span></span>
<span class="line"><span class="token comment">#dtls-key-lifetime=3600</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># --- 性能优化 ---</span></span>
<span class="line"><span class="token comment"># 最大允许的总带宽（字节/秒），0 表示无限制</span></span>
<span class="line"><span class="token key attr-name">max-bps</span><span class="token punctuation">=</span><span class="token value attr-value">0</span></span>
<span class="line"><span class="token comment"># 所有会话的总配额（字节/秒），格式：数字:数字，0 表示无限制</span></span>
<span class="line"><span class="token key attr-name">total-quota</span><span class="token punctuation">=</span><span class="token value attr-value">0:0</span></span>
<span class="line"><span class="token comment"># 单个用户的配额（字节/秒），0 表示无限制</span></span>
<span class="line"><span class="token key attr-name">user-quota</span><span class="token punctuation">=</span><span class="token value attr-value">0</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># --- 日志设置 ---</span></span>
<span class="line"><span class="token comment"># 启用详细日志，便于调试。在生产环境中可以降低日志级别</span></span>
<span class="line">verbose</span>
<span class="line"></span>
<span class="line"><span class="token key attr-name">log-file</span><span class="token punctuation">=</span><span class="token value attr-value">/var/log/turn.log</span></span>
<span class="line">syslog</span>
<span class="line"></span>
<span class="line"><span class="token comment"># --- 高级配置 ---</span></span>
<span class="line"><span class="token comment"># 允许环回地址，用于测试。生产环境中应禁用</span></span>
<span class="line"><span class="token comment">#no-loopback-peers</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 允许使用 TURN 服务的 IP 范围，增强安全性（取消注释并根据需要调整）</span></span>
<span class="line"><span class="token comment">#allowed-peer-ip=10.0.0.0-10.255.255.255</span></span>
<span class="line"><span class="token comment">#allowed-peer-ip=172.16.0.0-172.31.255.255</span></span>
<span class="line"><span class="token comment">#allowed-peer-ip=192.168.0.0-192.168.255.255</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启用 CLI 访问和状态报告（取消注释并设置密码以启用）</span></span>
<span class="line"><span class="token comment">#cli-password=&lt;strong-admin-password&gt;</span></span>
<span class="line"><span class="token comment">#status-port=5986</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># --- Web后台配置 ---</span></span>
<span class="line">web-admin</span>
<span class="line"><span class="token key attr-name">web-admin-ip</span><span class="token punctuation">=</span><span class="token value attr-value">0.0.0.0</span></span>
<span class="line"><span class="token key attr-name">web-port</span><span class="token punctuation">=</span><span class="token value attr-value">8080</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="公开的免费stun服务器" tabindex="-1"><a class="header-anchor" href="#公开的免费stun服务器"><span>公开的免费STUN服务器</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">stunserver.org </span>
<span class="line">stun.xten.com </span>
<span class="line">stun.fwdnet.net </span>
<span class="line">stun.fwdnet.net:3478</span>
<span class="line"></span>
<span class="line">stun.wirlab.net</span>
<span class="line">stun01.sipphone.com</span>
<span class="line"></span>
<span class="line">stun.iptel.org</span>
<span class="line">stun.ekiga.net</span>
<span class="line">stun.fwdnet.net </span>
<span class="line">stun01.sipphone.com <span class="token punctuation">(</span>no DNS SRV record<span class="token punctuation">)</span> </span>
<span class="line">stun.softjoys.com <span class="token punctuation">(</span>no DNS SRV record<span class="token punctuation">)</span> </span>
<span class="line">stun.voipbuster.com <span class="token punctuation">(</span>no DNS SRV record<span class="token punctuation">)</span> </span>
<span class="line">stun.voxgratia.org <span class="token punctuation">(</span>no DNS SRV record<span class="token punctuation">)</span></span>
<span class="line">stun.xten.com</span>
<span class="line">stunserver.org</span>
<span class="line">stun.sipgate.net:10000</span>
<span class="line">stun.softjoys.com:3478</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>from <a href="https://gist.github.com/zziuni/3741933" target="_blank" rel="noopener noreferrer">https://gist.github.com/zziuni/3741933</a></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># source : http://code.google.com/p/natvpn/source/browse/trunk/stun_server_list</span></span>
<span class="line"><span class="token comment"># A list of available STUN server.</span></span>
<span class="line"> </span>
<span class="line">stun.l.google.com:19302</span>
<span class="line">stun1.l.google.com:19302</span>
<span class="line">stun2.l.google.com:19302</span>
<span class="line">stun3.l.google.com:19302</span>
<span class="line">stun4.l.google.com:19302</span>
<span class="line">stun01.sipphone.com</span>
<span class="line">stun.ekiga.net</span>
<span class="line">stun.fwdnet.net</span>
<span class="line">stun.ideasip.com</span>
<span class="line">stun.iptel.org</span>
<span class="line">stun.rixtelecom.se</span>
<span class="line">stun.schlund.de</span>
<span class="line">stunserver.org</span>
<span class="line">stun.softjoys.com</span>
<span class="line">stun.voiparound.com</span>
<span class="line">stun.voipbuster.com</span>
<span class="line">stun.voipstunt.com</span>
<span class="line">stun.voxgratia.org</span>
<span class="line">stun.xten.com</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2><ul><li><a href="https://www.metered.ca/blog/running-coturn-in-docker-a-step-by-step-guide/" target="_blank" rel="noopener noreferrer">CoTURN in Docker: A Step-by-Step Guide</a></li><li><a href="https://watermelonwater.tech/archives/coturn%E4%B8%80%E9%94%AE%E9%83%A8%E7%BD%B2%EF%BC%9A%E4%BB%8E%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE%E5%88%B0docker%20compose%E9%83%A8%E7%BD%B2%EF%BC%8C%E6%90%AD%E5%BB%BA%E9%AB%98%E5%8F%AF%E7%94%A8WebRTC%E6%9C%8D%E5%8A%A1%EF%BC%8C%E7%90%86%E8%A7%A3%E5%90%84%E4%B8%AA%E7%AB%AF%E5%8F%A3%E7%9A%84%E5%90%AB%E4%B9%89%EF%BC%8C%E5%AE%9E%E7%8E%B0%E5%8A%A0%E5%AF%86" target="_blank" rel="noopener noreferrer">WebRTC 生产环境部署：CoTURN 服务器配置详解</a></li><li><a href="https://xueshi.io/2018/12/10/webrtc-coturn/" target="_blank" rel="noopener noreferrer">安装和配置 WebRTC 的 STUN/TURN 服务 CoTURN</a></li><li><a href="https://cloudkul.com/blog/how-to-install-turn-stun-server-on-aws-ubuntu-20-04/" target="_blank" rel="noopener noreferrer">How to install Turn/Stun server on AWS Ubuntu 20.04</a></li><li><a href="https://help.hcl-software.com/sametime/11.6/admin/turnserver_ubuntu.html" target="_blank" rel="noopener noreferrer">在 Ubuntu 上安装 TURN 服务器</a></li></ul>`,16)])])}const o=s(i,[["render",p]]),r=JSON.parse('{"path":"/posts/ubuntu_install_coturn.html","title":"Ubuntu 安装 CoTURN","lang":"zh-CN","frontmatter":{"date":"2020-01-01T00:00:00.000Z","category":["运维技术"],"tag":["CoTURN"],"sticky":10},"headers":[{"level":2,"title":"使用apt安装","slug":"使用apt安装","link":"#使用apt安装","children":[]},{"level":2,"title":"开机启动","slug":"开机启动","link":"#开机启动","children":[]},{"level":2,"title":"修改配置","slug":"修改配置","link":"#修改配置","children":[]},{"level":2,"title":"公开的免费STUN服务器","slug":"公开的免费stun服务器","link":"#公开的免费stun服务器","children":[]},{"level":2,"title":"参考资料","slug":"参考资料","link":"#参考资料","children":[]}],"git":{"updatedTime":1774788457000,"contributors":[{"name":"tx7do","username":"tx7do","email":"yanglinbo@gmail.com","commits":2,"url":"https://github.com/tx7do"},{"name":"Bobo","username":"Bobo","email":"yanglinbo@gmail.com","commits":1,"url":"https://github.com/Bobo"}],"changelog":[{"hash":"a3e88b19cfead00baa606aa5110b2802dac32768","time":1774788457000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: REBUILD."},{"hash":"9306a17923c4dcb48feb9f8a02e715d6be1f67e6","time":1728822040000,"email":"yanglinbo@gmail.com","author":"tx7do","message":"feat: edit posts."},{"hash":"93191c70f20fe002ad8a6293db0a14dc2ff580b4","time":1727580767000,"email":"yanglinbo@gmail.com","author":"tx7do","message":"feat: edit post."}]},"filePathRelative":"posts/ubuntu_install_coturn.md","excerpt":"\\n<h2>使用apt安装</h2>\\n<div class=\\"language-bash line-numbers-mode\\" data-highlighter=\\"prismjs\\" data-ext=\\"sh\\"><pre><code><span class=\\"line\\"><span class=\\"token function\\">sudo</span> <span class=\\"token function\\">apt-get</span> <span class=\\"token parameter variable\\">-y</span> update</span>\\n<span class=\\"line\\"><span class=\\"token function\\">sudo</span> <span class=\\"token function\\">apt-get</span> <span class=\\"token parameter variable\\">-y</span> <span class=\\"token function\\">install</span> coturn</span>\\n<span class=\\"line\\"></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>"}');export{o as comp,r as data};

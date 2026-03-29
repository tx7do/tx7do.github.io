<template><div><h1 id="部署rustdesk服务器" tabindex="-1"><a class="header-anchor" href="#部署rustdesk服务器"><span>部署RustDesk服务器</span></a></h1>
<p>两个可执行程序：</p>
<ul>
<li><code v-pre>hbbs</code> - RustDesk ID注册服务器，是管各个客户端 ID 的，每个客户端都有一个唯一的 ID 。</li>
<li><code v-pre>hbbr</code> - RustDesk中继服务器，是负责检测、中转各个客户端连接和数据传输。</li>
</ul>
<p>端口占用情况：</p>
<ul>
<li>TCP(21115, 21116, 21117, 21118, 21119)</li>
<li>UDP(21116)</li>
</ul>
<p>进程占用端口情况：</p>
<ul>
<li><code v-pre>hbbs</code> - 21115(tcp), 21116(tcp/udp), 21118(tcp)</li>
<li><code v-pre>hbbr</code> - 21117(tcp), 21119(tcp)</li>
</ul>
<p>端口的作用：</p>
<ul>
<li>21115(<code v-pre>TCP</code>) - 用作 NAT 类型测试</li>
<li>21116(<code v-pre>UDP</code>) - 用作 ID 注册 与 心跳服务</li>
<li>21116(<code v-pre>TCP</code>) - 用作 TCP打洞 与 连接服务</li>
<li>21117(<code v-pre>TCP</code>) - 用作中继服务</li>
<li>21118/21119(<code v-pre>TCP</code>) - 为了支持网页客户端</li>
</ul>
<p>如果启动的时候不加<code v-pre>-k _</code>参数，则不使用<code v-pre>key</code>也可以连接服务器。</p>
<h2 id="pm2-常用命令" tabindex="-1"><a class="header-anchor" href="#pm2-常用命令"><span>pm2 常用命令</span></a></h2>
<ul>
<li>启动进程 <code v-pre>pm2 start bin/www</code> 或 <code v-pre>pm2 start app.js</code></li>
<li>重命名进程 <code v-pre>pm2 start app.js --name wb123</code></li>
<li>添加进程 <code v-pre>pm2 start bin/www --watch</code></li>
<li>结束进程 <code v-pre>pm2 stop www</code></li>
<li>结束所有进程 <code v-pre>pm2 stop all</code></li>
<li>删除进程 <code v-pre>pm2 delete www</code></li>
<li>删除所有进程 <code v-pre>pm2 delete all</code></li>
<li>列出所有进程 <code v-pre>pm2 list</code></li>
<li>查看某个进程具体情况 <code v-pre>pm2 describe www</code></li>
<li>进程监视器 <code v-pre>pm2 monit</code></li>
<li>查看pm2的日志 <code v-pre>pm2 logs</code></li>
<li>查看某个进程的日志 <code v-pre>pm2 logs www</code></li>
<li>重新启动进程 <code v-pre>pm2 restart www</code></li>
<li>重新启动所有进程 <code v-pre>pm2 restart all</code></li>
</ul>
<h2 id="centos" tabindex="-1"><a class="header-anchor" href="#centos"><span>CentOS</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 设置时区为东八区的上海</span></span>
<span class="line"><span class="token function">sudo</span> timedatectl set-timezone Asia/Shanghai</span>
<span class="line"><span class="token function">date</span> +%Z</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 更新软件库</span></span>
<span class="line"><span class="token function">sudo</span> yum update<span class="token punctuation">;</span> <span class="token function">sudo</span> yum upgrade</span>
<span class="line"><span class="token function">sudo</span> yum <span class="token function">install</span> <span class="token function">htop</span> <span class="token function">wget</span> <span class="token function">unzip</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装nodejs和npm</span></span>
<span class="line"><span class="token function">sudo</span> yum <span class="token function">install</span> <span class="token function">node</span> <span class="token function">npm</span> <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token function">node</span> <span class="token parameter variable">-v</span></span>
<span class="line"><span class="token function">npm</span> <span class="token parameter variable">-v</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装pm2</span></span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> pm2</span>
<span class="line"><span class="token comment"># 查看pm2的版本</span></span>
<span class="line">pm2 <span class="token parameter variable">--version</span></span>
<span class="line"><span class="token comment"># tab补全</span></span>
<span class="line">pm2 completion <span class="token function">install</span></span>
<span class="line"><span class="token comment"># 创建pm2开机启动脚本</span></span>
<span class="line">pm2 startup</span>
<span class="line"><span class="token comment"># 设置pm2的开机启动</span></span>
<span class="line"><span class="token function">sudo</span> systemctl <span class="token builtin class-name">enable</span> pm2-<span class="token variable">${<span class="token environment constant">USER</span>}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查询RustDesk-Server的最新版本</span></span>
<span class="line"><span class="token assign-left variable">REPO</span><span class="token operator">=</span><span class="token string">"rustdesk/rustdesk-server"</span></span>
<span class="line"><span class="token assign-left variable">latest_tag</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> <span class="token parameter variable">-s</span> https://api.github.com/repos/$REPO/releases/latest <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">'"tag_name":'</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token parameter variable">-E</span> <span class="token string">'s/.*"([^"]+)".*/\1/'</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">"Using rustdesk-server version <span class="token variable">$latest_tag</span>"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用wget进行下载最新版RustDesk-Server</span></span>
<span class="line"><span class="token function">wget</span> https://github.com/<span class="token variable">$REPO</span>/releases/download/<span class="token variable">$latest_tag</span>/rustdesk-server-linux-amd64.zip</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 解压缩RustDesk-Server</span></span>
<span class="line"><span class="token function">unzip</span> rustdesk-server-linux-amd64.zip</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 文件夹改名</span></span>
<span class="line"><span class="token function">mv</span> amd64 RustDesk</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 移除掉压缩文件</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-f</span> rustdesk-server-linux-amd64.zip</span>
<span class="line"></span>
<span class="line"><span class="token comment"># pm2启动RustDesk-Server服务</span></span>
<span class="line"><span class="token builtin class-name">cd</span> ~/RustDesk</span>
<span class="line">pm2 start hbbs -- <span class="token parameter variable">-k</span> _</span>
<span class="line">pm2 start hbbr -- <span class="token parameter variable">-k</span> _</span>
<span class="line">pm2 save</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="ubuntu" tabindex="-1"><a class="header-anchor" href="#ubuntu"><span>Ubuntu</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 设置时区为东八区的上海</span></span>
<span class="line"><span class="token function">sudo</span> timedatectl set-timezone Asia/Shanghai</span>
<span class="line"><span class="token function">date</span> +%Z</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 更新软件库</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> update<span class="token punctuation">;</span> <span class="token function">sudo</span> <span class="token function">apt</span> upgrade</span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> <span class="token function">htop</span> <span class="token function">wget</span> <span class="token function">unzip</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装nodejs和npm</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> nodejs <span class="token function">npm</span> <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token function">node</span> <span class="token parameter variable">-v</span></span>
<span class="line"><span class="token function">npm</span> <span class="token parameter variable">-v</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装pm2</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> pm2</span>
<span class="line"><span class="token comment"># 查看pm2的版本</span></span>
<span class="line">pm2 <span class="token parameter variable">--version</span></span>
<span class="line"><span class="token comment"># tab补全</span></span>
<span class="line">pm2 completion <span class="token function">install</span></span>
<span class="line"><span class="token comment"># 创建pm2开机启动脚本，会有提示信息，循着提示信息去做就好。</span></span>
<span class="line">pm2 startup</span>
<span class="line"><span class="token comment"># 设置pm2的开机启动</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">env</span> <span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span><span class="token environment constant">$PATH</span>:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd <span class="token parameter variable">-u</span> <span class="token variable">${<span class="token environment constant">USER</span>}</span> <span class="token parameter variable">--hp</span> <span class="token variable">${<span class="token environment constant">HOME</span>}</span></span>
<span class="line"><span class="token function">sudo</span> systemctl <span class="token builtin class-name">enable</span> pm2-<span class="token variable">${<span class="token environment constant">USER</span>}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查询RustDesk-Server的最新版本</span></span>
<span class="line"><span class="token assign-left variable">REPO</span><span class="token operator">=</span><span class="token string">"rustdesk/rustdesk-server"</span></span>
<span class="line"><span class="token assign-left variable">latest_tag</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> <span class="token parameter variable">-s</span> https://api.github.com/repos/$REPO/releases/latest <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">'"tag_name":'</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token parameter variable">-E</span> <span class="token string">'s/.*"([^"]+)".*/\1/'</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">"Using rustdesk-server version <span class="token variable">$latest_tag</span>"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用wget进行下载最新版RustDesk-Server</span></span>
<span class="line"><span class="token function">wget</span> https://github.com/<span class="token variable">$REPO</span>/releases/download/<span class="token variable">$latest_tag</span>/rustdesk-server-linux-amd64.zip</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 解压缩RustDesk-Server</span></span>
<span class="line"><span class="token function">unzip</span> rustdesk-server-linux-amd64.zip</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 文件夹改名</span></span>
<span class="line"><span class="token function">mv</span> amd64 RustDesk</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 移除掉压缩文件</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-f</span> rustdesk-server-linux-amd64.zip</span>
<span class="line"></span>
<span class="line"><span class="token comment"># pm2启动RustDesk-Server服务</span></span>
<span class="line"><span class="token builtin class-name">cd</span> ~/RustDesk</span>
<span class="line">pm2 start hbbs -- <span class="token parameter variable">-k</span> _</span>
<span class="line">pm2 start hbbr -- <span class="token parameter variable">-k</span> _</span>
<span class="line">pm2 save</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="macos" tabindex="-1"><a class="header-anchor" href="#macos"><span>MacOS</span></a></h2>
<h2 id="windows" tabindex="-1"><a class="header-anchor" href="#windows"><span>Windows</span></a></h2>
<h2 id="docker" tabindex="-1"><a class="header-anchor" href="#docker"><span>Docker</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">docker</span> image pull rustdesk/rustdesk-server</span>
<span class="line"></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">docker</span> run <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">--name</span> hbbs <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">21115</span>:21115 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">21116</span>:21116 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">21116</span>:21116/udp <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">21118</span>:21118 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">`</span><span class="token builtin class-name">pwd</span><span class="token variable">`</span></span>:/root <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-td</span> <span class="token parameter variable">--net</span><span class="token operator">=</span>host <span class="token punctuation">\</span></span>
<span class="line">    rustdesk/rustdesk-server hbbs <span class="token parameter variable">-r</span> <span class="token operator">&lt;</span>relay-server-ip<span class="token punctuation">[</span>:port<span class="token punctuation">]</span><span class="token operator">></span></span>
<span class="line"></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">docker</span> run <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">--name</span> hbbr <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">21117</span>:21117 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-p</span> <span class="token number">21119</span>:21119 <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">`</span><span class="token builtin class-name">pwd</span><span class="token variable">`</span></span>:/root <span class="token punctuation">\</span></span>
<span class="line">    <span class="token parameter variable">-td</span> <span class="token parameter variable">--net</span><span class="token operator">=</span>host <span class="token punctuation">\</span></span>
<span class="line">    rustdesk/rustdesk-server hbbr</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://www.mintimate.cn/2023/08/27/guideToHostRustDesk/" target="_blank" rel="noopener noreferrer">自建远程桌面连接服务，RustDesk搭建教程</a></li>
<li><a href="https://rustdesk.com/docs/zh-tw/self-host/rustdesk-server-oss/install/" target="_blank" rel="noopener noreferrer">RustDesk 說明文件 &gt; 自架伺服器 &gt; 自架伺服器 OSS &gt; 安裝</a></li>
<li><a href="https://rustdesk.com/docs/zh-cn/self-host/rustdesk-server-oss/windows/" target="_blank" rel="noopener noreferrer">WINDOWS &amp; PM2 或者 NSSM</a></li>
<li><a href="https://zhuanlan.zhihu.com/p/33691734" target="_blank" rel="noopener noreferrer">centos7 systemd pm2 开机启动</a></li>
<li><a href="https://blog.csdn.net/qq_37546835/article/details/91359443" target="_blank" rel="noopener noreferrer">CentOS7下pm2开机自启动</a></li>
<li><a href="https://juejin.cn/post/7163906312756658190" target="_blank" rel="noopener noreferrer">CentOS 7 安装和使用PM2</a></li>
<li><a href="https://www.sysadm.cc/index.php/xitongyunwei/1001-only-using-windows-can-easy-to-build-remote-desktop-rustdesk-self-host" target="_blank" rel="noopener noreferrer">只会 Windows 也能轻松搭建远程桌面 RustDesk 自用服务器</a></li>
</ul>
</div></template>



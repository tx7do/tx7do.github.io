<template><div><h1 id="将kratos微服务程序运行为linux守护进程" tabindex="-1"><a class="header-anchor" href="#将kratos微服务程序运行为linux守护进程"><span>将Kratos微服务程序运行为Linux守护进程</span></a></h1>
<h2 id="supervisor" tabindex="-1"><a class="header-anchor" href="#supervisor"><span>supervisor</span></a></h2>
<h3 id="安装supervisor" tabindex="-1"><a class="header-anchor" href="#安装supervisor"><span>安装supervisor</span></a></h3>
<p>Centos：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 先安装 EPEL</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> epel-release</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装supervisor</span></span>
<span class="line"><span class="token function">sudo</span> yum <span class="token parameter variable">-y</span> <span class="token function">install</span> supervisor</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置为开机启动</span></span>
<span class="line"><span class="token function">sudo</span> systemctl <span class="token builtin class-name">enable</span> supervisord</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动进程</span></span>
<span class="line"><span class="token function">sudo</span> systemctl start supervisord</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="启动守护进程" tabindex="-1"><a class="header-anchor" href="#启动守护进程"><span>启动守护进程</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">cd</span> ~/app/service/admin/service/bin/</span>
<span class="line">pm2 start <span class="token parameter variable">--namespace</span> kratos_app <span class="token parameter variable">--name</span> admin server -- <span class="token parameter variable">-conf</span> <span class="token punctuation">..</span>/configs/</span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">cd</span> ~/app/service/front/service/bin/</span>
<span class="line">pm2 start <span class="token parameter variable">--namespace</span> kratos_app <span class="token parameter variable">--name</span> front server -- <span class="token parameter variable">-conf</span> <span class="token punctuation">..</span>/configs/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 保存配置</span></span>
<span class="line">pm2 save</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重启全部守护进程</span></span>
<span class="line">pm2 restart all</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="pm2" tabindex="-1"><a class="header-anchor" href="#pm2"><span>pm2</span></a></h2>
<h3 id="安装pm2" tabindex="-1"><a class="header-anchor" href="#安装pm2"><span>安装pm2</span></a></h3>
<p>Centos：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 安装nodejs和npm</span></span>
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
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="启动守护进程-1" tabindex="-1"><a class="header-anchor" href="#启动守护进程-1"><span>启动守护进程</span></a></h3>
<p>在当前路径下创建一个ini文件，比如：<code v-pre>supervisor/admin_service.ini</code></p>
<div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre v-pre><code><span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">program:admin_service</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token comment">; 程序异常退出后自动重启</span></span>
<span class="line"><span class="token key attr-name">autorestart</span><span class="token punctuation">=</span><span class="token value attr-value">True</span></span>
<span class="line"><span class="token comment">; 在 supervisord 启动的时候也自动启动</span></span>
<span class="line"><span class="token key attr-name">autostart</span><span class="token punctuation">=</span><span class="token value attr-value">True</span></span>
<span class="line"><span class="token comment">; 用哪个用户启动</span></span>
<span class="line"><span class="token key attr-name">user</span><span class="token punctuation">=</span><span class="token value attr-value">root</span></span>
<span class="line"><span class="token comment">; 启动命令，与手动在命令行启动的命令是一样的</span></span>
<span class="line"><span class="token key attr-name">command</span><span class="token punctuation">=</span><span class="token value attr-value">/root/app/service/admin/service/bin/server -conf /root/app/service/admin/service/configs/</span></span>
<span class="line"><span class="token comment">; 程序的启动目录</span></span>
<span class="line"><span class="token key attr-name">directory</span><span class="token punctuation">=</span><span class="token value attr-value">/root/app/service/admin/service/bin/</span></span>
<span class="line"><span class="token comment">; stdout 日志文件大小，默认 50MB</span></span>
<span class="line"><span class="token key attr-name">stdout_logfile_maxbytes</span> <span class="token punctuation">=</span> <span class="token value attr-value">20MB</span></span>
<span class="line"><span class="token comment">; stdout 日志文件备份数</span></span>
<span class="line"><span class="token key attr-name">stdout_logfile_backups</span> <span class="token punctuation">=</span> <span class="token value attr-value">20</span></span>
<span class="line"><span class="token comment">; 把 stderr 重定向到 stdout，默认 false</span></span>
<span class="line"><span class="token key attr-name">redirect_stderr</span><span class="token punctuation">=</span><span class="token value attr-value">True</span></span>
<span class="line"><span class="token comment">; 日志输出</span></span>
<span class="line"><span class="token key attr-name">stderr_logfile</span><span class="token punctuation">=</span><span class="token value attr-value">/data/logs/admin_service.stderr.log</span></span>
<span class="line"><span class="token key attr-name">stdout_logfile</span><span class="token punctuation">=</span><span class="token value attr-value">/data/logs/admin_service.stdout.log</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后执行脚本：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 拷贝配置文件</span></span>
<span class="line"><span class="token function">cp</span> <span class="token parameter variable">-rf</span> ./script/supervisor/*.ini /etc/supervisord.d/</span>
<span class="line"><span class="token comment"># 重载配置</span></span>
<span class="line"><span class="token function">sudo</span> supervisorctl reload</span>
<span class="line"><span class="token comment"># 重启所有守护进程</span></span>
<span class="line"><span class="token function">sudo</span> supervisorctl restart all</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="screen" tabindex="-1"><a class="header-anchor" href="#screen"><span>screen</span></a></h2>
<p>关闭所有的screen：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token assign-left variable">str</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">screen</span> <span class="token parameter variable">-ls</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">array</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> $str<span class="token operator">|</span><span class="token function">tr</span> <span class="token string">"."</span> <span class="token string">"<span class="token entity" title="\n">\n</span>"</span><span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">for</span> <span class="token for-or-select variable">V</span> <span class="token keyword">in</span> <span class="token variable">$array</span></span>
<span class="line"><span class="token keyword">do</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable">$V</span> <span class="token parameter variable">-gt</span> <span class="token number">0</span>  <span class="token punctuation">]</span></span>
<span class="line">  <span class="token keyword">then</span> <span class="token function">screen</span> <span class="token parameter variable">-S</span> <span class="token variable">$V</span> <span class="token parameter variable">-X</span> quit</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动screen：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">screen</span> <span class="token parameter variable">-dmS</span> front <span class="token function">bash</span> <span class="token parameter variable">-c</span> <span class="token string">'~/app/service/front/service/bin/server -conf ~/app/service/front/service/configs/'</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">screen</span> <span class="token parameter variable">-dmS</span> admin <span class="token function">bash</span> <span class="token parameter variable">-c</span> <span class="token string">'~/app/service/admin/service/bin/server -conf ~/app/service/admin/service/configs/'</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></div></template>



<template><div><h1 id="docker-hub-镜像源" tabindex="-1"><a class="header-anchor" href="#docker-hub-镜像源"><span>Docker Hub 镜像源</span></a></h1>
<table>
<thead>
<tr>
<th>提供商</th>
<th>公共镜像</th>
<th>私有镜像</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="https://sf.163.com/help/documents/56918246390157312" target="_blank" rel="noopener noreferrer">网易云</a></td>
<td>http://hub-mirror.c.163.com</td>
<td></td>
</tr>
<tr>
<td><a href="https://cloud.baidu.com/doc/CCE/s/Yjxppt74z" target="_blank" rel="noopener noreferrer">百度云</a></td>
<td>https://mirror.baidubce.com</td>
<td></td>
</tr>
<tr>
<td><a href="https://cloud.tencent.com/document/product/1141/50332" target="_blank" rel="noopener noreferrer">腾讯云</a></td>
<td>https://ccr.ccs.tencentyun.com</td>
<td></td>
</tr>
<tr>
<td><a href="https://dockerproxy.com/docs" target="_blank" rel="noopener noreferrer">Docker Proxy</a></td>
<td>https://dockerproxy.com</td>
<td></td>
</tr>
<tr>
<td><a href="https://support.huaweicloud.com/topic/85789-1-H" target="_blank" rel="noopener noreferrer">华为云</a></td>
<td>https://05f073ad3c0010ea0f4bc00b7105ec20.mirror.swr.myhuaweicloud.com</td>
<td>https://{你的ID}.mirror.swr.myhuaweicloud.com</td>
</tr>
<tr>
<td><a href="https://cr.console.aliyun.com/" target="_blank" rel="noopener noreferrer">阿里云</a></td>
<td>https://1nj0zren.mirror.aliyuncs.com</td>
<td>http://{你的ID}.mirror.aliyuncs.com</td>
</tr>
<tr>
<td><a href="https://www.daocloud.io/mirror" target="_blank" rel="noopener noreferrer">DaoCloud</a></td>
<td><s>http://f1361db2.m.daocloud.io</s></td>
<td></td>
</tr>
<tr>
<td><a href="https://kirk-enterprise.github.io/hub-docs/#/user-guide/mirror" target="_blank" rel="noopener noreferrer">七牛云</a></td>
<td><s>https://reg-mirror.qiniu.com</s></td>
<td></td>
</tr>
<tr>
<td><a href="https://github.com/Azure/container-service-for-azure-china/blob/master/aks/README.md#22-container-registry-proxy" target="_blank" rel="noopener noreferrer">Azure</a></td>
<td><s>https://dockerhub.azk8s.cn</s></td>
<td></td>
</tr>
<tr>
<td><a href="https://docker-cn.com/registry-mirror" target="_blank" rel="noopener noreferrer">Docker中国区官方</a></td>
<td><s>https://registry.docker-cn.com</s></td>
<td></td>
</tr>
<tr>
<td><a href="https://mirrors.ustc.edu.cn/help/dockerhub.html" target="_blank" rel="noopener noreferrer">中国科学技术大学</a>（适用于校园网）</td>
<td><s>http://docker.mirrors.ustc.edu.cn</s></td>
<td></td>
</tr>
</tbody>
</table>
<h2 id="修改配置" tabindex="-1"><a class="header-anchor" href="#修改配置"><span>修改配置</span></a></h2>
<p>修改daemon.json，增加或者修改以下配置：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"registry-mirrors"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token string">"https://dockerproxy.com"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">"https://hub-mirror.c.163.com"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">"https://mirror.baidubce.com"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">"https://ccr.ccs.tencentyun.com"</span></span>
<span class="line">  <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Docker从1.3.X之后，与docker registry交互默认使用的是https，然而此处搭建的私有仓库只提供http服务，所以当与私有仓库交互式就会有错误。http服务则需要填写到<code v-pre>insecure-registries</code>下面。</p>
<p>配置文件所在位置：</p>
<ul>
<li>Linux: <code v-pre>/etc/docker/daemon.json</code></li>
<li>Windows: <code v-pre>%USERPROFILE%\.docker\daemon.json</code> 或者 <code v-pre>%programdata%\Docker\config\daemon.json</code></li>
<li>MacOS: <code v-pre>~/.docker/daemon.json</code></li>
</ul>
<p>如果使用的Docker Desktop，那就更好办了，只需要在配置界面找到<code v-pre>Docker Engine</code>选项，修改之后然后点击<code v-pre>Apply &amp; Restart</code>按钮，即可生效。在此修改等同于直接修改daemon.json文件。</p>
<h2 id="检查配置是否生效" tabindex="-1"><a class="header-anchor" href="#检查配置是否生效"><span>检查配置是否生效</span></a></h2>
<p>输入以下命令：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> info</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>如果从结果中看到了如下类似的内容，说明配置成功：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">Registry Mirrors:</span>
<span class="line"> https://hub-mirror.c.163.com/</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="测试源镜像是否有效" tabindex="-1"><a class="header-anchor" href="#测试源镜像是否有效"><span>测试源镜像是否有效</span></a></h2>
<p>使用<code v-pre>docker pull</code>命令拉取软件，只要能够正常拉取就是有效的，否则就是无效的。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> pull dockerproxy.com/library/nginx:latest</span>
<span class="line"><span class="token function">docker</span> pull hub-mirror.c.163.com/library/nginx:latest</span>
<span class="line"><span class="token function">docker</span> pull mirror.baidubce.com/library/nginx:latest</span>
<span class="line"><span class="token function">docker</span> pull ccr.ccs.tencentyun.com/library/nginx:latest</span>
<span class="line"><span class="token function">docker</span> pull 1nj0zren.mirror.aliyuncs.com/library/nginx:latest</span>
<span class="line"><span class="token function">docker</span> pull 05f073ad3c0010ea0f4bc00b7105ec20.mirror.swr.myhuaweicloud.com/library/nginx:latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="源镜像测速" tabindex="-1"><a class="header-anchor" href="#源镜像测速"><span>源镜像测速</span></a></h2>
<h3 id="linux" tabindex="-1"><a class="header-anchor" href="#linux"><span>Linux</span></a></h3>
<p>在Linux下面有<code v-pre>time</code>命令，可以使用该命令对源进行测速：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">time</span> <span class="token function">docker</span> pull nginx:latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>测速结果大致如下：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">real   1m14.078s</span>
<span class="line">user   0m0.176s</span>
<span class="line">sys    0m0.120s</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="windows" tabindex="-1"><a class="header-anchor" href="#windows"><span>Windows</span></a></h3>
<p>在Windows的PowerShell下面可以使用以下命令测速：</p>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell"><pre v-pre><code><span class="line"><span class="token function">Measure-Command</span> <span class="token punctuation">{</span>docker pull nginx:latest <span class="token punctuation">|</span> <span class="token function">Out-Default</span><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>测速结果大致如下：</p>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell"><pre v-pre><code><span class="line">Days              : 0</span>
<span class="line">Hours             : 0</span>
<span class="line">Minutes           : 0</span>
<span class="line">Seconds           : 4</span>
<span class="line">Milliseconds      : 217</span>
<span class="line">Ticks             : 42174202</span>
<span class="line">TotalDays         : 4<span class="token punctuation">.</span>88127337962963E-05</span>
<span class="line">TotalHours        : 0<span class="token punctuation">.</span>00117150561111111</span>
<span class="line">TotalMinutes      : 0<span class="token punctuation">.</span>0702903366666667</span>
<span class="line">TotalSeconds      : 4<span class="token punctuation">.</span>2174202</span>
<span class="line">TotalMilliseconds : 4217<span class="token punctuation">.</span>4202</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://yeasy.gitbook.io/docker_practice/install/mirror" target="_blank" rel="noopener noreferrer">镜像加速器</a></li>
<li><a href="https://segmentfault.com/a/1190000023117518" target="_blank" rel="noopener noreferrer">Docker必备六大国内镜像</a></li>
</ul>
</div></template>



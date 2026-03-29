<template><div><h1 id="ubuntu安装cmake" tabindex="-1"><a class="header-anchor" href="#ubuntu安装cmake"><span>Ubuntu安装CMake</span></a></h1>
<h2 id="_1-使用apt安装" tabindex="-1"><a class="header-anchor" href="#_1-使用apt安装"><span>1. 使用Apt安装</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> update<span class="token punctuation">;</span> <span class="token function">sudo</span> <span class="token function">apt</span> upgrade<span class="token punctuation">;</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> cmake<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-源码构建安装" tabindex="-1"><a class="header-anchor" href="#_2-源码构建安装"><span>2. 源码构建安装</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token assign-left variable">version</span><span class="token operator">=</span><span class="token number">3.28</span></span>
<span class="line"><span class="token assign-left variable">build</span><span class="token operator">=</span><span class="token number">3</span></span>
<span class="line"><span class="token comment">## don't modify from here</span></span>
<span class="line"><span class="token function">mkdir</span> ~/temp</span>
<span class="line"><span class="token builtin class-name">cd</span> ~/temp</span>
<span class="line"><span class="token function">wget</span> https://cmake.org/files/v<span class="token variable">$version</span>/cmake-<span class="token variable">$version</span><span class="token builtin class-name">.</span><span class="token variable">$build</span>.tar.gz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xzvf</span> cmake-<span class="token variable">$version</span><span class="token builtin class-name">.</span><span class="token variable">$build</span>.tar.gz</span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">cd</span> cmake-<span class="token variable">$version</span><span class="token builtin class-name">.</span><span class="token variable">$build</span>/</span>
<span class="line">./bootstrap</span>
<span class="line"><span class="token function">make</span> -j<span class="token variable"><span class="token variable">$(</span>nproc<span class="token variable">)</span></span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">make</span> <span class="token function">install</span></span>
<span class="line"></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">ln</span> <span class="token parameter variable">-fs</span> /usr/local/bin/cmake /usr/bin/cmake</span>
<span class="line"></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-fr</span> ~/temp</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-二进制安装" tabindex="-1"><a class="header-anchor" href="#_3-二进制安装"><span>3. 二进制安装</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token assign-left variable">version</span><span class="token operator">=</span><span class="token number">3.28</span></span>
<span class="line"><span class="token assign-left variable">build</span><span class="token operator">=</span><span class="token number">3</span></span>
<span class="line"><span class="token comment">## don't modify from here</span></span>
<span class="line"><span class="token assign-left variable">limit</span><span class="token operator">=</span><span class="token number">3.20</span></span>
<span class="line"><span class="token assign-left variable">result</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">"<span class="token variable">$version</span> >= <span class="token variable">$limit</span>"</span> <span class="token operator">|</span> <span class="token function">bc</span> <span class="token parameter variable">-l</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">os</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token punctuation">[</span> <span class="token string">"<span class="token variable">$result</span>"</span> <span class="token operator">==</span> <span class="token number">1</span> <span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">echo</span> <span class="token string">"linux"</span> <span class="token operator">||</span> <span class="token builtin class-name">echo</span> <span class="token string">"Linux"</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token function">mkdir</span> ~/temp</span>
<span class="line"><span class="token builtin class-name">cd</span> ~/temp</span>
<span class="line"><span class="token function">wget</span> https://cmake.org/files/v<span class="token variable">$version</span>/cmake-<span class="token variable">$version</span><span class="token builtin class-name">.</span><span class="token variable">$build</span>-<span class="token variable">$os</span>-x86_64.sh </span>
<span class="line"><span class="token function">sudo</span> <span class="token function">mkdir</span> /opt/cmake</span>
<span class="line"><span class="token function">sudo</span> <span class="token function">sh</span> cmake-<span class="token variable">$version</span><span class="token builtin class-name">.</span><span class="token variable">$build</span>-<span class="token variable">$os</span>-x86_64.sh <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/opt/cmake</span>
<span class="line"></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">ln</span> <span class="token parameter variable">-fs</span> /opt/cmake/cmake-<span class="token variable">$version</span><span class="token builtin class-name">.</span><span class="token variable">$build</span>-<span class="token variable">$os</span>-x86_64/bin/cmake /usr/local/bin/cmake</span>
<span class="line"><span class="token function">sudo</span> <span class="token function">ln</span> <span class="token parameter variable">-fs</span> /usr/local/bin/cmake /usr/bin/cmake</span>
<span class="line"></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-fr</span> ~/temp</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://askubuntu.com/questions/355565/how-do-i-install-the-latest-version-of-cmake-from-the-command-line" target="_blank" rel="noopener noreferrer">How do I install the latest version of cmake from the command line?</a></li>
</ul>
</div></template>



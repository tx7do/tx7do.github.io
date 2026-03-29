<template><div><h1 id="git-submodule" tabindex="-1"><a class="header-anchor" href="#git-submodule"><span>git submodule</span></a></h1>
<h2 id="添加子模块" tabindex="-1"><a class="header-anchor" href="#添加子模块"><span>添加子模块</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> submodule <span class="token function">add</span> <span class="token operator">&lt;</span>url<span class="token operator">></span> <span class="token operator">&lt;</span>path<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>将会在<code v-pre>.gitmodules</code>添加类似的配置：</p>
<div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre v-pre><code><span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">submodule "zstd"</span><span class="token punctuation">]</span></span></span>
<span class="line">	<span class="token key attr-name">path</span> <span class="token punctuation">=</span> <span class="token value attr-value">ext/zstd</span></span>
<span class="line">	<span class="token key attr-name">url</span> <span class="token punctuation">=</span> <span class="token value attr-value">https://github.com/facebook/zstd.git</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>加入分支名：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> submodule <span class="token function">add</span> <span class="token parameter variable">-b</span> <span class="token operator">&lt;</span>branch<span class="token operator">></span> <span class="token operator">&lt;</span>url<span class="token operator">></span> <span class="token operator">&lt;</span>path<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>将会在<code v-pre>.gitmodules</code>添加类似的配置：</p>
<div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre v-pre><code><span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">submodule "zstd"</span><span class="token punctuation">]</span></span></span>
<span class="line">	<span class="token key attr-name">path</span> <span class="token punctuation">=</span> <span class="token value attr-value">ext/zstd</span></span>
<span class="line">	<span class="token key attr-name">url</span> <span class="token punctuation">=</span> <span class="token value attr-value">https://github.com/facebook/zstd.git</span></span>
<span class="line">	<span class="token key attr-name">branch</span> <span class="token punctuation">=</span> <span class="token value attr-value">v1.2.0</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="删除子模块" tabindex="-1"><a class="header-anchor" href="#删除子模块"><span>删除子模块</span></a></h2>
<ol>
<li>首先删除掉子模块文件夹</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> <span class="token function">rm</span> <span class="token parameter variable">-fr</span> <span class="token punctuation">{</span>子模块路径<span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ol start="2">
<li>移除子模块的缓存</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> <span class="token function">rm</span> <span class="token parameter variable">--cached</span> <span class="token punctuation">{</span>子模块路径<span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ol start="3">
<li>移除子模块</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">rm</span> <span class="token parameter variable">-rf</span> .git/modules/<span class="token punctuation">{</span>子模块路径<span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>最后提交修改。</p>
<h2 id="更新子模块" tabindex="-1"><a class="header-anchor" href="#更新子模块"><span>更新子模块</span></a></h2>
<p>clone项目之后，子模块目录下是没有任何内容的，需要在项目的根目录下执行以下命令完成子模块的下载：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> submodule update <span class="token parameter variable">--init</span> <span class="token parameter variable">--recursive</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>或者</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> submodule init</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>从远端git仓库更新子模块，所谓的远端就是<code v-pre>url</code>描述的源git仓库。</p>
<p>该命令将会：</p>
<ol>
<li>把子模块的分支Hash更新；</li>
<li>从远端下载代码。</li>
</ol>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> submodule update <span class="token parameter variable">--remote</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>这条命令不会执行上面命令的第二步，也就是不会下载代码，仅仅更新分支Hash。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> submodule update <span class="token parameter variable">--remote</span> --no-fetch</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>上面的命令是包括全部子模块，如果要单独针对某一个子模块，则可以在后面跟子模块的路径名：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> submodule update <span class="token parameter variable">--remote</span> third_party/abseil-cpp</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>update之前，需要先把项目根目录下的<code v-pre>.git\module</code>以及子模块目录删除掉。</p>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://www.cnblogs.com/jyroy/p/14367776.html" target="_blank" rel="noopener noreferrer">git submodule添加、更新和删除</a></li>
<li><a href="https://segmentfault.com/a/1190000040338658" target="_blank" rel="noopener noreferrer">5步删除git submodule</a></li>
<li><a href="https://stackoverflow.com/questions/1260748/how-do-i-remove-a-submodule" target="_blank" rel="noopener noreferrer">How do I remove a submodule?</a></li>
<li><a href="https://blog.longwin.com.tw/2015/05/git-submodule-add-remove-2015/" target="_blank" rel="noopener noreferrer">Git Submodule 新增、使用 與 移除</a></li>
</ul>
</div></template>



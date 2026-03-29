<template><div><h1 id="怎么样在windows下使用make编译golang程序" tabindex="-1"><a class="header-anchor" href="#怎么样在windows下使用make编译golang程序"><span>怎么样在Windows下使用Make编译Golang程序</span></a></h1>
<p>GNU的Make是一个又古老又强大的构建工具，在我们的开发当中用得普遍。就Makefile的语法而言也不算复杂，没有特别复杂的需求的话，很容易就上手了，维护起来也容易，拿Make来做程序构建是一个好主意。</p>
<p>更复杂一点的项目构建可以选择Google的<a href="https://bazel.build/" target="_blank" rel="noopener noreferrer">Bazel</a>，但是通常的项目(至少70%-80%的项目)都没有这么复杂的需求。</p>
<p>在Unix、Linux、BSD、macOS等xNix下面使用Make是很方便的，很自然的，因为是出厂自带。</p>
<p>可是，在Windows下面却不是这么一回事儿。Windows毕竟和xNix不是一路人。首先不预装，安装就存在着巨大的阻碍——太费劲了——网上一搜，大部分人都告诉你，你得先装一个MinGW，然后又要搞环境变量，然后才能用。</p>
<p>其次，还存在着兼容性的问题，在其他操作系统可以顺利执行的Makefile，在Windows却跑不了。这体验很糟糕。虽然微软在努力解决不兼容的问题，比如最新的PowerShell，比如提供了Linux的子系统WSL，但是操作系统毕竟还是存在着巨大的差异，要完全解决几乎是不可能完成的任务。所以，在Makefile多少也需要做一些适配。</p>
<p>另外，还需要知道的是，Make要用起来，也不是说，就是一个Make而已，xNix下面有一个很大的软软包做支撑，Make才会那么的好用，grep awk sed touch……这些，在Windows下也都是需要自行去安装的。</p>
<h2 id="安装make" tabindex="-1"><a class="header-anchor" href="#安装make"><span>安装Make</span></a></h2>
<p>常规的做法，大家都是使用安装MinGW包的方法来安装Make，但是这很繁琐，我并不推荐，我推荐使用<a href="https://chocolatey.org/" target="_blank" rel="noopener noreferrer">Choco</a>或者<a href="https://scoop.sh/" target="_blank" rel="noopener noreferrer">Scoop</a>这两个软件包管理器的其中一个来安装管理和Make。</p>
<h3 id="choco" tabindex="-1"><a class="header-anchor" href="#choco"><span>Choco</span></a></h3>
<p>PowerShell安装Choco：</p>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell"><pre v-pre><code><span class="line"><span class="token function">Set-ExecutionPolicy</span> Bypass <span class="token operator">-</span>Scope <span class="token keyword">Process</span> <span class="token operator">-</span>Force<span class="token punctuation">;</span> <span class="token function">iex</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token function">New-Object</span> System<span class="token punctuation">.</span>Net<span class="token punctuation">.</span>WebClient<span class="token punctuation">)</span><span class="token punctuation">.</span>DownloadString<span class="token punctuation">(</span><span class="token string">'https://chocolatey.org/install.ps1'</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><strong>管理员权限</strong>启动PowerShell，然后运行以下命令进行安装：</p>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell"><pre v-pre><code><span class="line">choco install make</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>安装其他有用的工具：</p>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell"><pre v-pre><code><span class="line">choco install grep awk sed touch</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="scoop" tabindex="-1"><a class="header-anchor" href="#scoop"><span>scoop</span></a></h3>
<p>安装Scoop：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">irm get.scoop.sh <span class="token operator">|</span> iex</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell"><pre v-pre><code><span class="line">scoop install make</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>安装其他有用的工具：</p>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell"><pre v-pre><code><span class="line">scoop install grep gawk sed touch</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="mingw" tabindex="-1"><a class="header-anchor" href="#mingw"><span>MinGW</span></a></h3>
<p>下载安装MinGW：<a href="https://www.mingw-w64.org/downloads/" target="_blank" rel="noopener noreferrer">https://www.mingw-w64.org/downloads/</a></p>
<p>下载好之后，解压，把bin文件夹加入到Windows的环境变量里面，使之可以全局运行。</p>
<p>然后，把<code v-pre>mingw32-make.exe</code>文件改名或者拷贝一个备份为<code v-pre>make.exe</code>。</p>
<p>此方法比较繁琐，不如使用软件包管理器去直接安装make还方便多了。</p>
<p>另，通过软件包管理也能够安装mingw：</p>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell"><pre v-pre><code><span class="line">choco install mingw</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>或者</p>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell"><pre v-pre><code><span class="line">scoop install mingw</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="windows和linux之间使用make的区别" tabindex="-1"><a class="header-anchor" href="#windows和linux之间使用make的区别"><span>Windows和Linux之间使用Make的区别</span></a></h2>
<p>在Windows下使用Make和在Linux下面使用Make是有区别的，而这个差异性倒不是来自于Make，而是来自于依赖的命令。</p>
<p><code v-pre>Bash</code>里面很多的命令，在古老的<code v-pre>CMD</code>下都没有，<code v-pre>PowerShell</code>倒是增加了一些，像：<code v-pre>man</code>、<code v-pre>ls</code>、<code v-pre>rm</code>、<code v-pre>pwd</code>这些在xNix下常用的命令，有是有了，但是差异还是有，兼容性永远是个大问题，文件系统就是一个巨大的鸿沟。</p>
<p>日常开发中常用的Linux工具，像<code v-pre>grep</code>、<code v-pre>awk</code>、<code v-pre>sed</code>……这些，都可以通过上面踢到的两个软件管理器<code v-pre>choco</code>、<code v-pre>scoop</code>安装到。但是，像<code v-pre>uname</code>这些操作系统严重相关的命令是肯定没有办法的。</p>
<p>关于兼容性，我简单的举一些例子：</p>
<ol>
<li>文件路径分隔符，Windows是<code v-pre>\</code>，而Linux是<code v-pre>/</code>;</li>
<li>Windows的根目录是<code v-pre>C:\\</code>、<code v-pre>D:\\</code>……，而xNix是<code v-pre>/</code>；</li>
<li>Linux的<code v-pre>mkdir</code>是有<code v-pre>-p</code>选项的，而Windows没有。</li>
<li><code v-pre>echo</code>的行为也跟Linux的不同。</li>
</ol>
<p>现在PowerShell倒是在提高与Bash的兼容性，可毕竟系统差异性太大，所以兼容性是肯定存在的。</p>
<p>那么，怎么办呢？我们可以在Makefile里面判断操作系统的类型，然后根据操作系统来做差异化处理。</p>
<p>简单的探测系统类型的Makefile：</p>
<div class="language-makefile line-numbers-mode" data-highlighter="prismjs" data-ext="makefile"><pre v-pre><code><span class="line">detected_OS <span class="token operator">:=</span></span>
<span class="line"><span class="token keyword">ifeq</span> <span class="token punctuation">(</span><span class="token variable">$</span><span class="token punctuation">(</span>OS<span class="token punctuation">)</span>,Windows_NT<span class="token punctuation">)</span> </span>
<span class="line">    detected_OS <span class="token operator">:=</span> Windows</span>
<span class="line"><span class="token keyword">else</span></span>
<span class="line">    detected_OS <span class="token operator">:=</span> <span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> sh -c <span class="token string">'uname 2>/dev/null || echo Unknown'</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">endif</span></span>
<span class="line"></span>
<span class="line"><span class="token target symbol">all</span><span class="token punctuation">:</span></span>
<span class="line">	<span class="token operator">@</span>echo <span class="token variable">$</span><span class="token punctuation">(</span>detected_OS<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用makefile编译golang程序" tabindex="-1"><a class="header-anchor" href="#使用makefile编译golang程序"><span>使用Makefile编译Golang程序</span></a></h2>
<p>下面以一个简单的编译Golang程序的Makefile来讲解如何跨平台使用Makefile进行交叉编译：</p>
<div class="language-makefile line-numbers-mode" data-highlighter="prismjs" data-ext="makefile"><pre v-pre><code><span class="line">GOPATH<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> go env GOPATH<span class="token punctuation">)</span></span>
<span class="line">GOARCH<span class="token operator">?=</span><span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> go env GOARCH<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">ifeq</span> <span class="token punctuation">(</span><span class="token variable">$</span><span class="token punctuation">(</span>OS<span class="token punctuation">)</span>,Windows_NT<span class="token punctuation">)</span></span>
<span class="line">    IS_WINDOWS <span class="token operator">:=</span> 1</span>
<span class="line"><span class="token keyword">endif</span></span>
<span class="line"></span>
<span class="line">BUILD_CMD <span class="token operator">=</span> <span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">if</span> <span class="token variable">$</span><span class="token punctuation">(</span>IS_WINDOWS<span class="token punctuation">)</span>, \</span>
<span class="line">	SET CGO_ENABLED<span class="token operator">=</span>0&amp;SET GOOS<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span>1<span class="token punctuation">)</span>&amp;SET GOARCH<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span>2<span class="token punctuation">)</span>&amp;go build -o .\bin\<span class="token variable">$</span><span class="token punctuation">(</span>1<span class="token punctuation">)</span>_<span class="token variable">$</span><span class="token punctuation">(</span>2<span class="token punctuation">)</span>\<span class="token variable">$</span><span class="token punctuation">(</span>3<span class="token punctuation">)</span>, \</span>
<span class="line">	CGO_ENABLED<span class="token operator">=</span>0 GOOS<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span>1<span class="token punctuation">)</span> GOARCH<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span>2<span class="token punctuation">)</span> go build -o ./bin/<span class="token variable">$</span><span class="token punctuation">(</span>1<span class="token punctuation">)</span>_<span class="token variable">$</span><span class="token punctuation">(</span>2<span class="token punctuation">)</span>/<span class="token variable">$</span><span class="token punctuation">(</span>3<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token target symbol">linux</span><span class="token punctuation">:</span></span>
<span class="line">	<span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">call</span> BUILD_CMD,linux,<span class="token variable">$</span><span class="token punctuation">(</span>GOARCH<span class="token punctuation">)</span>,test<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token target symbol">windows</span><span class="token punctuation">:</span></span>
<span class="line">	echo <span class="token variable">$</span><span class="token punctuation">(</span>IS_WINDOWS<span class="token punctuation">)</span></span>
<span class="line">	<span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">call</span> BUILD_CMD,windows,<span class="token variable">$</span><span class="token punctuation">(</span>GOARCH<span class="token punctuation">)</span>,test.exe<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token target symbol">mac</span><span class="token punctuation">:</span></span>
<span class="line">	<span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">call</span> BUILD_CMD,darwin,<span class="token variable">$</span><span class="token punctuation">(</span>GOARCH<span class="token punctuation">)</span>,test<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面这段代码里，我们使用<code v-pre>ifeq ($(OS),Windows_NT)</code>来判断操作系统，得到一个<code v-pre>IS_WINDOWS</code>的变量。</p>
<p>然后，定义了一个<code v-pre>BUILD_CMD</code>的函数，它调用了内置的<code v-pre>if</code>函数，它的语法是：</p>
<div class="language-makefile line-numbers-mode" data-highlighter="prismjs" data-ext="makefile"><pre v-pre><code><span class="line"><span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">if</span> &lt;condition>,&lt;then-part>,&lt;<span class="token keyword">else</span>-part><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>第一个分支是走的Windows的编译，第二个分支是走的其他操作系统（xNix）的编译。</p>
<p>需要注意的是：路径分隔符，参数设置前面需要加<code v-pre>SET</code>，语句之间需要用<code v-pre>&amp;</code>间隔。</p>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://seisman.github.io/how-to-write-makefile/functions.html#if" target="_blank" rel="noopener noreferrer">跟我一起写Makefile</a></li>
<li><a href="https://chocolatey.org/" target="_blank" rel="noopener noreferrer">Choco</a></li>
<li><a href="https://scoop.sh/" target="_blank" rel="noopener noreferrer">Scoop</a></li>
<li><a href="https://www.mingw-w64.org/downloads/" target="_blank" rel="noopener noreferrer">mingw</a></li>
</ul>
</div></template>



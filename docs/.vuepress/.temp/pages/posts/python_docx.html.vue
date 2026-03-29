<template><div><h1 id="python如何操作docx文档" tabindex="-1"><a class="header-anchor" href="#python如何操作docx文档"><span>Python如何操作Docx文档</span></a></h1>
<p>python下面关于文档操作的工具倒是多的，比如：</p>
<ul>
<li><a href="https://pypi.org/project/pywin32/" target="_blank" rel="noopener noreferrer">win32com</a></li>
<li><a href="https://python-docx.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">python-docx</a></li>
<li><a href="https://pydocx.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">pydocx</a></li>
<li><a href="https://pypi.org/project/docx2pdf/" target="_blank" rel="noopener noreferrer">docx2pdf</a></li>
<li><a href="https://products.aspose.com/words/python-net/" target="_blank" rel="noopener noreferrer">Aspose.Words</a></li>
<li><a href="https://docxtpl.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">python-docx-template</a></li>
</ul>
<h2 id="读取docx文档" tabindex="-1"><a class="header-anchor" href="#读取docx文档"><span>读取docx文档</span></a></h2>
<p>读取docx文档，需要用到<code v-pre>python-docx</code>库：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">pip <span class="token function">install</span> python-docx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>使用上比较简单：</p>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line"><span class="token comment"># 打开文档</span></span>
<span class="line">document <span class="token operator">=</span> Document<span class="token punctuation">(</span>file_PATH<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">full_text<span class="token punctuation">:</span> <span class="token builtin">str</span> <span class="token operator">=</span> <span class="token string">''</span></span>
<span class="line"><span class="token keyword">for</span> paragraph <span class="token keyword">in</span> document<span class="token punctuation">.</span>paragraphs<span class="token punctuation">:</span></span>
<span class="line">    full_text <span class="token operator">+=</span> paragraph<span class="token punctuation">.</span>text</span>
<span class="line">    logger<span class="token punctuation">.</span>info<span class="token punctuation">(</span>paragraph<span class="token punctuation">.</span>text<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个库只支持docx，并不支持doc文档格式。</p>
<p>doc和docx是两个截然不同的格式，docx是基于XML的一个文档协议，而doc是一个二进制的文档协议。</p>
<p>如果遇到了doc的文档，我们要怎么办呢？我们可以使用<code v-pre>LibreOffice</code>来转换文档，然后再通过<code v-pre>python-docx</code>读取处理。</p>
<h2 id="docx模板处理" tabindex="-1"><a class="header-anchor" href="#docx模板处理"><span>docx模板处理</span></a></h2>
<p>可使用<code v-pre>python-docx-template</code>这个库</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">pip <span class="token function">install</span> docxtpl</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>它内部依赖了上面的<code v-pre>python-docx</code>库来操作docx文档。</p>
<p>使用它也是容易的：</p>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line"><span class="token keyword">from</span> docxtpl <span class="token keyword">import</span> DocxTemplate</span>
<span class="line"></span>
<span class="line">doc <span class="token operator">=</span> DocxTemplate<span class="token punctuation">(</span><span class="token string">"my_word_template.docx"</span><span class="token punctuation">)</span></span>
<span class="line">context <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token string">'company_name'</span> <span class="token punctuation">:</span> <span class="token string">"World company"</span> <span class="token punctuation">}</span></span>
<span class="line">doc<span class="token punctuation">.</span>render<span class="token punctuation">(</span>context<span class="token punctuation">)</span></span>
<span class="line">doc<span class="token punctuation">.</span>save<span class="token punctuation">(</span><span class="token string">"generated_doc.docx"</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它使用了一个类似于Python模板引擎<code v-pre>Jinja2</code>的模板语法，玩过各种服务器渲染的模板引擎的玩家对此种语法都不陌生，上手也是容易的。</p>
<h2 id="docx-转-pdf" tabindex="-1"><a class="header-anchor" href="#docx-转-pdf"><span>docx 转 pdf</span></a></h2>
<p>我看了一下这些库，本质上都是调用了第三方软件的功能实现的转换功能。</p>
<p>docx2pdf只能用于Windows和MacOs。而LibreOffice几乎是全平台。</p>
<h3 id="docx2pdf" tabindex="-1"><a class="header-anchor" href="#docx2pdf"><span>docx2pdf</span></a></h3>
<p>首先是docx2pdf：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">pip <span class="token function">install</span> docx2pdf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>使用起来倒是简单：</p>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line"><span class="token keyword">from</span> docx2pdf <span class="token keyword">import</span> convert</span>
<span class="line"></span>
<span class="line">convert<span class="token punctuation">(</span><span class="token string">"input.docx"</span><span class="token punctuation">)</span></span>
<span class="line">convert<span class="token punctuation">(</span><span class="token string">"input.docx"</span><span class="token punctuation">,</span> <span class="token string">"output.pdf"</span><span class="token punctuation">)</span></span>
<span class="line">convert<span class="token punctuation">(</span><span class="token string">"my_docx_folder/"</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>只是，这个库只支持Windows和MacoOS，不支持Linux。</p>
<h3 id="libreoffice" tabindex="-1"><a class="header-anchor" href="#libreoffice"><span>LibreOffice</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> add-apt-repository ppa:libreoffice</span>
<span class="line"></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> libreoffice <span class="token parameter variable">-y</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看是否安装好：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">libreoffice <span class="token parameter variable">--version</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>转换成PDF文件：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">libreoffice <span class="token parameter variable">--headless</span> --convert-to pdf demo.docx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>转换成DOCX文件：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">libreoffice <span class="token parameter variable">--headless</span> --convert-to docx demo.doc</span>
<span class="line">libreoffice <span class="token parameter variable">--headless</span> --convert-to docx demo.txt</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://www.tecmint.com/install-libreoffice-ubuntu/" target="_blank" rel="noopener noreferrer">How to Install LibreOffice in Ubuntu</a></li>
<li><a href="https://blog.csdn.net/weixin_41712499/article/details/107656792" target="_blank" rel="noopener noreferrer">Linux下使用LibreOffice+python将doc/docx/wps格式的文档转成html/txt/docx等格式</a></li>
<li><a href="https://medium.com/analytics-vidhya/starting-libreoffice-with-python-macro-programming-in-openoffice-libreoffice-with-using-10310f9e69f1" target="_blank" rel="noopener noreferrer">Starting LibreOffice with Python — Macro Programming in OpenOffice/LibreOffice with using Python[EN]-2</a></li>
<li><a href="https://medium.com/codex/libreoffice-on-docker-1a64245468c" target="_blank" rel="noopener noreferrer">LibreOffice on Docker</a></li>
<li><a href="https://www.libreofficehelp.com/batch-convert-writer-documents-pdf-libreoffice/" target="_blank" rel="noopener noreferrer">How to Batch Convert Writer Documents to PDF in LibreOffice</a></li>
</ul>
</div></template>



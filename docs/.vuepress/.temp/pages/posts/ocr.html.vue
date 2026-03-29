<template><div><h1 id="ocr" tabindex="-1"><a class="header-anchor" href="#ocr"><span>OCR</span></a></h1>
<ol>
<li>Tesseract <a href="https://github.com/tesseract-ocr/tesseract" target="_blank" rel="noopener noreferrer">https://github.com/tesseract-ocr/tesseract</a></li>
<li>PaddleOCR <a href="https://github.com/PaddlePaddle/PaddleOCR" target="_blank" rel="noopener noreferrer">https://github.com/PaddlePaddle/PaddleOCR</a></li>
<li>EasyOCR <a href="https://github.com/JaidedAI/EasyOCR" target="_blank" rel="noopener noreferrer">https://github.com/JaidedAI/EasyOCR</a></li>
<li>chineseocr <a href="https://github.com/chineseocr/chineseocr" target="_blank" rel="noopener noreferrer">https://github.com/chineseocr/chineseocr</a></li>
<li>chineseocr_lite <a href="https://github.com/DayBreak-u/chineseocr_lite" target="_blank" rel="noopener noreferrer">https://github.com/DayBreak-u/chineseocr_lite</a></li>
<li>CnOCR <a href="https://github.com/breezedeus/cnocr" target="_blank" rel="noopener noreferrer">https://github.com/breezedeus/cnocr</a></li>
<li>TrWebOCR <a href="https://github.com/alisen39/TrWebOCR" target="_blank" rel="noopener noreferrer">https://github.com/alisen39/TrWebOCR</a></li>
</ol>
<h2 id="tesseract" tabindex="-1"><a class="header-anchor" href="#tesseract"><span>Tesseract</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 安裝 Tesseract</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> tesseract-ocr</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安裝 Developer Tools</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> libtesseract-dev</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安裝Leptonica</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> libleptonica-dev</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安装语言包</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 英文</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> tesseract-ocr-eng</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 简体中文（vert为竖排）</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> tesseract-ocr-chi-sim tesseract-ocr-chi-sim-vert</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 繁体中文</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> tesseract-ocr-chi-tra tesseract-ocr-chi-tra-vert</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看包含的语言包</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">tesseract --list-langs</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>Golang 安装启动 OCR 服务</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">install</span> github.com/otiai10/ocrserver@latest</span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">PORT</span><span class="token operator">=</span><span class="token number">8080</span> ocrserver</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Docker 安装启动 OCR 服务</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> pull otiai10/ocrserver:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-p</span> <span class="token number">8080</span>:8080 otiai10/ocrserver</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>访问页面：</p>
<p><a href="http://localhost:8080" target="_blank" rel="noopener noreferrer">http://localhost:8080</a></p>
<h2 id="paddleocr" tabindex="-1"><a class="header-anchor" href="#paddleocr"><span>PaddleOCR</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> pull registry.baidubce.com/paddlepaddle/paddle:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--name</span> ppocr <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> <span class="token environment constant">$PWD</span>:/paddle <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--network</span><span class="token operator">=</span>host <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-it</span> registry.baidubce.com/paddlepaddle/paddle:latest /bin/bash</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="chineseocr-lite" tabindex="-1"><a class="header-anchor" href="#chineseocr-lite"><span>chineseocr_lite</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> clone https://github.com/DayBreak-u/chineseocr_lite</span>
<span class="line"></span>
<span class="line">pip3 <span class="token function">install</span> <span class="token parameter variable">-r</span> requirements.txt</span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">cd</span> chineseocr_lite</span>
<span class="line">python backend/main.py</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="onnx-runtime" tabindex="-1"><a class="header-anchor" href="#onnx-runtime"><span>ONNX Runtime</span></a></h2>
<p>下载 二进制：<a href="https://github.com/microsoft/onnxruntime/releases" target="_blank" rel="noopener noreferrer">https://github.com/microsoft/onnxruntime/releases</a></p>
<p>以1.14.0版本为例子：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">wget</span> https://github.com/microsoft/onnxruntime/releases/download/v1.14.0/onnxruntime-linux-x64-1.14.0.tgz</span>
<span class="line"></span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-zxvf</span> onnxruntime-linux-x64-1.14.0.tgz</span>
<span class="line"></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">mv</span> onnxruntime-linux-x64-1.14.0 /opt/onnxruntime</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://blog.csdn.net/qq_23091073/article/details/126495395" target="_blank" rel="noopener noreferrer">6款支持中文开源OCR软件的简单使用</a></li>
<li><a href="https://zhuanlan.zhihu.com/p/265359676" target="_blank" rel="noopener noreferrer">对比了最常见的几家开源OCR框架，我发现了最好的开源模型</a></li>
<li><a href="https://juejin.cn/post/6909366513124245511" target="_blank" rel="noopener noreferrer">它会不会成为 OCR 领域霸主？</a></li>
<li><a href="https://cloud.tencent.com/developer/article/2111779" target="_blank" rel="noopener noreferrer">Golang 和 Python 的 OCR 服务安装及使用</a></li>
<li><a href="https://datawhalechina.github.io/thorough-pytorch/%E7%AC%AC%E4%B9%9D%E7%AB%A0/9.1%20%E4%BD%BF%E7%94%A8ONNX%E8%BF%9B%E8%A1%8C%E9%83%A8%E7%BD%B2%E5%B9%B6%E6%8E%A8%E7%90%86.html" target="_blank" rel="noopener noreferrer">使用ONNX进行部署并推理</a></li>
</ul>
</div></template>



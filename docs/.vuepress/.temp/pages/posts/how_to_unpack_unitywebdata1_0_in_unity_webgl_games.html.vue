<template><div><h1 id="如何解压unity-webgl游戏的unitywebdata1-0资源包" tabindex="-1"><a class="header-anchor" href="#如何解压unity-webgl游戏的unitywebdata1-0资源包"><span>如何解压Unity WebGL游戏的UnityWebData1.0资源包</span></a></h1>
<h2 id="什么是-unitywebdata" tabindex="-1"><a class="header-anchor" href="#什么是-unitywebdata"><span>什么是 UnityWebData</span></a></h2>
<p>UnityWebData 文件是在 WebGL 游戏中与 WebAssembly 文件一起加载和使用的文件，主要是组合所有资产(Asset)、资源(Resource)和元数据(Meta)文件的文件。</p>
<p><img src="/assets/images/unity/unity_webdata_file_struct_image.png" alt="UnityWebData"></p>
<h2 id="unitywebdata的结构体" tabindex="-1"><a class="header-anchor" href="#unitywebdata的结构体"><span>UnityWebData的结构体</span></a></h2>
<p>本节介绍基于UnityWebData1.0的二进制文件的结构进行介绍。</p>
<p>需要注意：int值必须以Little Endian方式读取。</p>
<h3 id="文件头-file-header" tabindex="-1"><a class="header-anchor" href="#文件头-file-header"><span>文件头 (File Header)</span></a></h3>
<table>
<thead>
<tr>
<th>字段名</th>
<th>长度（字节）</th>
<th>类型</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>文件签名</td>
<td>16</td>
<td>string</td>
<td>“UnityWebData1.0\0”</td>
</tr>
<tr>
<td>文件体偏移</td>
<td>4</td>
<td>int</td>
<td>整个列出文件的起始位置，与第一个文件的位置相同</td>
</tr>
</tbody>
</table>
<h3 id="文件信息头-file-information-header" tabindex="-1"><a class="header-anchor" href="#文件信息头-file-information-header"><span>文件信息头 (File Information Header)</span></a></h3>
<p>该区块紧跟在文件头之后，处于文件体之前。</p>
<p>它是一张文件索引表，记录了文件读取的偏移量，文件名等信息，表项的字段如下：</p>
<table>
<thead>
<tr>
<th>字段名</th>
<th>长度（字节）</th>
<th>类型</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>文件偏移量</td>
<td>4</td>
<td>int</td>
<td>文件的起始偏移量</td>
</tr>
<tr>
<td>文件长度</td>
<td>4</td>
<td>int</td>
<td>文件大小</td>
</tr>
<tr>
<td>文件名长度</td>
<td>4</td>
<td>int</td>
<td>文件名长度</td>
</tr>
<tr>
<td>文件名</td>
<td>n</td>
<td>string</td>
<td>文件名</td>
</tr>
</tbody>
</table>
<h3 id="文件体-file-body" tabindex="-1"><a class="header-anchor" href="#文件体-file-body"><span>文件体 (File Body)</span></a></h3>
<p>文件索引表后面紧跟着的就是资源文件了。如果要读取某一个文件，可以先读取获取其在标头中的偏移量，然后从该位置读取到标头中记录的文件大小的文件数据。</p>
<h2 id="使用工具" tabindex="-1"><a class="header-anchor" href="#使用工具"><span>使用工具</span></a></h2>
<p>经过我的测试，有两个比较好使：</p>
<ul>
<li><a href="(https://pypi.org/project/uwdtool/)">UWDTool</a> - Python开发</li>
<li><a href="(https://github.com/jozsefsallai/unityweb)">unityweb</a> - Golang开发</li>
</ul>
<h3 id="uwdtool" tabindex="-1"><a class="header-anchor" href="#uwdtool"><span><a href="(https://pypi.org/project/uwdtool/)">UWDTool</a></span></a></h3>
<p>安装：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">pip <span class="token function">install</span> uwdtool</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>解包：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">python UWDTool.py <span class="token operator">&lt;</span>Control Option<span class="token operator">></span> <span class="token punctuation">[</span>-i input_path<span class="token punctuation">]</span> <span class="token punctuation">[</span>-o output_path<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="unityweb" tabindex="-1"><a class="header-anchor" href="#unityweb"><span><a href="(https://github.com/jozsefsallai/unityweb)">unityweb</a></span></a></h3>
<p>安装：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">go <span class="token function">install</span> github.com/jozsefsallai/unityweb/cmd/unityweb@latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>解包：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">unityweb unpack <span class="token parameter variable">-i</span> ./webdata.data <span class="token parameter variable">-o</span> ./unpack</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://blog.pasqualefiorillo.it/how-to-unpack-unitywebdata1-0-in-unity-webgl-games/" target="_blank" rel="noopener noreferrer">How to unpack UnityWebData1.0 in Unity WebGL games</a></li>
<li><a href="https://www.ptt.cc/bbs/Python/M.1597922907.A.FEF.html" target="_blank" rel="noopener noreferrer">[心得] unitypack 安裝問題</a></li>
<li><a href="https://blog.csdn.net/prog_6103/article/details/120518875" target="_blank" rel="noopener noreferrer">【笔记】MacOS/Linux下dump unity3d的资源</a></li>
<li><a href="(https://pypi.org/project/uwdtool/)">UWDTool</a></li>
<li><a href="(https://github.com/jozsefsallai/unityweb)">unityweb</a></li>
<li><a href="https://gist.github.com/ehwuts/44b06b8a576aff0d290dcf9824342a5c" target="_blank" rel="noopener noreferrer">extract.js</a></li>
<li><a href="https://gist.github.com/siddolo/9009bba4e78679a666fbb10adb92d748" target="_blank" rel="noopener noreferrer">unpack-unitywebdata1.0.py</a></li>
<li><a href="https://zhuanlan.zhihu.com/p/659958667" target="_blank" rel="noopener noreferrer">AssetStudio升级：支持到Unity 2022.3</a></li>
</ul>
</div></template>



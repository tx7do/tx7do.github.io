<template><div><h1 id="如何获取微信小程序的资源" tabindex="-1"><a class="header-anchor" href="#如何获取微信小程序的资源"><span>如何获取微信小程序的资源</span></a></h1>
<p>之前，都是找的Andriod的文件，但是，这很麻烦，因为需要Root，不然无法访问。找到文件，拷贝也是一件很麻烦的事情。</p>
<p>现在，电脑版的微信也是可以使用小程序的，所以，从电脑上去寻找小程序的资源就变得切实可行。</p>
<h2 id="小程序所在的位置" tabindex="-1"><a class="header-anchor" href="#小程序所在的位置"><span>小程序所在的位置</span></a></h2>
<p>首先，它有两个路径：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">C:<span class="token punctuation">\</span>Users<span class="token punctuation">\</span><span class="token punctuation">{</span>Windows用户名<span class="token punctuation">}</span><span class="token punctuation">\</span>Documents<span class="token punctuation">\</span>WeChat Files<span class="token punctuation">\</span>Applet<span class="token punctuation">\</span><span class="token punctuation">{</span>小程序ID<span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>和</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">C:<span class="token punctuation">\</span>Users<span class="token punctuation">\</span><span class="token punctuation">{</span>Windows用户名<span class="token punctuation">}</span><span class="token punctuation">\</span>Documents<span class="token punctuation">\</span>WeChat Files<span class="token punctuation">\</span><span class="token punctuation">{</span>微信用户名<span class="token punctuation">}</span><span class="token punctuation">\</span>Applet<span class="token punctuation">\</span><span class="token punctuation">{</span>小程序ID<span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>上面的那个路径存放的是小程序的程序实体。</p>
<p>下面的那个路径存放的是小程序运行时所产生的文件，比如：用户的Session啊，用户数据啊，网页中的各种资源啊……</p>
<h2 id="解包小程序的程序" tabindex="-1"><a class="header-anchor" href="#解包小程序的程序"><span>解包小程序的程序</span></a></h2>
<p>小程序的程序包就和apk差不多的，也就是把所有的资源包都打成一个或者若干个文件包，它的文件后缀是：wxapkg。看起来可能是这样的：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">└─wx***************</span>
<span class="line">    └─nn</span>
<span class="line">       └─ __APP__.wxapkg</span>
<span class="line">       └─ _subpackages_engine_.wxapkg</span>
<span class="line">       └─ _subpackages_framework_.wxapkg</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果只是需要拿到小程序的源代码，解开它就可以了。有一个流传很广的工具：<a href="https://github.com/qwerty472123/wxappUnpacker" target="_blank" rel="noopener noreferrer">wxappUnpacker</a>。但是，现在似乎被和谐了。</p>
<p>电脑上的小程序包是经过了加密处理的，所以，要解开电脑上面的小程序资源包，需要经过两步：</p>
<ol>
<li>解密资源包；</li>
<li>解开资源包。</li>
</ol>
<p>第一个步骤有两个工具可供使用：</p>
<ol>
<li><a href="https://github.com/BlackTrace/pc_wxapkg_decrypt" target="_blank" rel="noopener noreferrer">pc_wxapkg_decrypt</a></li>
<li><a href="https://github.com/halo951/mp-wxapkg-unpacker" target="_blank" rel="noopener noreferrer">mp-wxapkg-unpacker</a></li>
</ol>
<p>第二个步骤也有两个工具可供使用：</p>
<ol>
<li><a href="https://github.com/qwerty472123/wxappUnpacker" target="_blank" rel="noopener noreferrer">wxappUnpacker</a></li>
<li><a href="https://github.com/halo951/mp-wxapkg-unpacker" target="_blank" rel="noopener noreferrer">mp-wxapkg-unpacker</a></li>
</ol>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://juejin.cn/post/6888348237242040327" target="_blank" rel="noopener noreferrer">[node.js]PC端微信小程序包解密</a></li>
<li><a href="https://blog.51cto.com/xuedingmaojun/3183922" target="_blank" rel="noopener noreferrer">一起来探索下微信小程序包的魔数</a></li>
<li><a href="https://lrdcq.com/me/read.php/66.htm" target="_blank" rel="noopener noreferrer">微信小程序源码阅读笔记1</a></li>
<li><a href="https://github.com/halo951/mp-wxapkg-unpacker" target="_blank" rel="noopener noreferrer">微信小程序(小游戏) wxapkg 包 解包工具, 支持 pc 端加密包解包</a></li>
<li><a href="https://github.com/qwerty472123/wxappUnpacker" target="_blank" rel="noopener noreferrer">wxappUnpacker</a></li>
</ul>
</div></template>



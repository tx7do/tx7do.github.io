<template><div><h1 id="spine骨骼动画版本降级" tabindex="-1"><a class="header-anchor" href="#spine骨骼动画版本降级"><span>Spine骨骼动画版本降级</span></a></h1>
<h2 id="下载skeleton-viewer" tabindex="-1"><a class="header-anchor" href="#下载skeleton-viewer"><span>下载Skeleton Viewer</span></a></h2>
<p>下载页面：<a href="https://zh.esotericsoftware.com/spine-skeleton-viewer" target="_blank" rel="noopener noreferrer">https://zh.esotericsoftware.com/spine-skeleton-viewer</a></p>
<h2 id="打开界面" tabindex="-1"><a class="header-anchor" href="#打开界面"><span>打开界面</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">java</span> <span class="token parameter variable">-jar</span> skeletonViewer.jar</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="降级" tabindex="-1"><a class="header-anchor" href="#降级"><span>降级</span></a></h2>
<p>利用<code v-pre>skeletonViewer.jar</code>当中的<code v-pre>JsonRollback</code>来执行降级，需要注意的是，它只能够操作JSON配置文件：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">java</span> <span class="token parameter variable">-cp</span> skeletonViewer.jar com.esotericsoftware.spine.JsonRollback input.json <span class="token number">3.7</span> output.json</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://zh.esotericsoftware.com/forum/d/12419-%E6%80%A53855%E7%89%88%E6%9C%AC%E5%A6%82%E4%BD%95%E5%9B%9E%E9%80%80%E5%88%B03791%E7%89%88%E6%9C%AC/3" target="_blank" rel="noopener noreferrer">急！3.8.55版本如何回退到3.7.91版本</a></li>
<li><a href="https://zh.esotericsoftware.com/forum/d/12684-%E5%8A%A8%E7%94%BBjson%E6%96%87%E4%BB%B63860%E8%BD%AC2127" target="_blank" rel="noopener noreferrer">动画JSON文件3.8.60转2.1.27</a></li>
<li><a href="https://zh.esotericsoftware.com/forum/d/11458-open-project-in-an-older-version" target="_blank" rel="noopener noreferrer">Open project in an older version</a></li>
<li><a href="https://zh.esotericsoftware.com/forum/d/15149-editor-video-downgrade-the-project-from-38-to-37/3" target="_blank" rel="noopener noreferrer">[Editor] [Video] Downgrade the project from 3.8 to 3.7</a></li>
<li><a href="https://zh.esotericsoftware.com/forum/d/6534-spine-editor-and-runtime-version-management" target="_blank" rel="noopener noreferrer">Spine editor and runtime version management</a></li>
<li><a href="https://en.esotericsoftware.com/spine-command-line-interface" target="_blank" rel="noopener noreferrer">Spine User Guide - Command line interface</a></li>
</ul>
</div></template>



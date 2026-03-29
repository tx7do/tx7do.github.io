<template><div><h1 id="升级旧版本的unity项目" tabindex="-1"><a class="header-anchor" href="#升级旧版本的unity项目"><span>升级旧版本的Unity项目</span></a></h1>
<h2 id="unityengine-application-does-not-contain-a-definition-for-bundleidentifier" tabindex="-1"><a class="header-anchor" href="#unityengine-application-does-not-contain-a-definition-for-bundleidentifier"><span>UnityEngine.Application' does not contain a definition for bundleIdentifier'</span></a></h2>
<p>把 <code v-pre>Application.bundleIdentifier</code>修改为<code v-pre>Application.identifier</code>。</p>
<h2 id="升级粒子系统" tabindex="-1"><a class="header-anchor" href="#升级粒子系统"><span>升级粒子系统</span></a></h2>
<p>Unity2018.2.x之后，旧版 Particle System 相关API就完全移除掉了，这个升级器是Unity官方发布的，它可以<code v-pre>ParticleEmitter</code>, <code v-pre>ParticleAnimator</code>, <code v-pre>ParticleRenderer</code>等组件转换为<code v-pre>ParticleSystem</code> 和 <code v-pre>ParticleSystemRenderer</code>组件。</p>
<h2 id="guitexture替换为ui-image遇到的问题" tabindex="-1"><a class="header-anchor" href="#guitexture替换为ui-image遇到的问题"><span><code v-pre>GUITexture</code>替换为<code v-pre>UI.Image</code>遇到的问题</span></a></h2>
<h3 id="image-does-not-contain-a-definition-for-pixelinset" tabindex="-1"><a class="header-anchor" href="#image-does-not-contain-a-definition-for-pixelinset"><span>'Image' does not contain a definition for 'pixelInset'</span></a></h3>
<p>将代码：</p>
<div class="language-csharp line-numbers-mode" data-highlighter="prismjs" data-ext="cs"><pre v-pre><code><span class="line">uiImage<span class="token punctuation">.</span>pixelInset</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>修改为：</p>
<div class="language-csharp line-numbers-mode" data-highlighter="prismjs" data-ext="cs"><pre v-pre><code><span class="line">uiImage<span class="token punctuation">.</span>rectTransform<span class="token punctuation">.</span>rect</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="不存在-texture" tabindex="-1"><a class="header-anchor" href="#不存在-texture"><span>不存在<code v-pre>.texture</code></span></a></h2>
<p>把代码：</p>
<div class="language-csharp line-numbers-mode" data-highlighter="prismjs" data-ext="cs"><pre v-pre><code><span class="line">uiImage<span class="token punctuation">.</span>texture</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>修改为：</p>
<div class="language-csharp line-numbers-mode" data-highlighter="prismjs" data-ext="cs"><pre v-pre><code><span class="line">uiImage<span class="token punctuation">.</span>material<span class="token punctuation">.</span>mainTexture</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="找不到handles-circlecap" tabindex="-1"><a class="header-anchor" href="#找不到handles-circlecap"><span>找不到<code v-pre>Handles.CircleCap</code></span></a></h2>
<p>将</p>
<div class="language-csharp line-numbers-mode" data-highlighter="prismjs" data-ext="cs"><pre v-pre><code><span class="line">Handles<span class="token punctuation">.</span><span class="token function">CircleCap</span><span class="token punctuation">(</span> <span class="token number">0</span><span class="token punctuation">,</span> p1<span class="token punctuation">,</span> Quaternion<span class="token punctuation">.</span>identity<span class="token punctuation">,</span> <span class="token number">2.0f</span> <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>改为：</p>
<div class="language-csharp line-numbers-mode" data-highlighter="prismjs" data-ext="cs"><pre v-pre><code><span class="line">Handles<span class="token punctuation">.</span><span class="token function">CircleHandleCap</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> p1<span class="token punctuation">,</span> Quaternion<span class="token punctuation">.</span>identity<span class="token punctuation">,</span> <span class="token number">2.0f</span><span class="token punctuation">,</span> EventType<span class="token punctuation">.</span>Repaint<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="movietexture改为videoplayer" tabindex="-1"><a class="header-anchor" href="#movietexture改为videoplayer"><span><code v-pre>MovieTexture</code>改为<code v-pre>VideoPlayer</code></span></a></h2>
<div class="language-csharp line-numbers-mode" data-highlighter="prismjs" data-ext="cs"><pre v-pre><code><span class="line">movie<span class="token punctuation">.</span>loop <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>改为：</p>
<div class="language-csharp line-numbers-mode" data-highlighter="prismjs" data-ext="cs"><pre v-pre><code><span class="line">movie<span class="token punctuation">.</span>isLooping <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="unity-5的gameobject-guitext和gameobject-guitexture" tabindex="-1"><a class="header-anchor" href="#unity-5的gameobject-guitext和gameobject-guitexture"><span>Unity 5的<code v-pre>GameObject.guiText</code>和<code v-pre>GameObject.guiTexture</code></span></a></h2>
<div class="language-csharp line-numbers-mode" data-highlighter="prismjs" data-ext="cs"><pre v-pre><code><span class="line">guiText<span class="token punctuation">.</span>material<span class="token punctuation">.</span>color <span class="token operator">=</span> labelColor<span class="token punctuation">;</span></span>
<span class="line">guiTexture<span class="token punctuation">.</span>texture <span class="token operator">=</span> textOver<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>改为：</p>
<div class="language-csharp line-numbers-mode" data-highlighter="prismjs" data-ext="cs"><pre v-pre><code><span class="line"><span class="token generic-method"><span class="token function">GetComponent</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Text<span class="token punctuation">></span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>material<span class="token punctuation">.</span>color <span class="token operator">=</span> labelColor<span class="token punctuation">;</span></span>
<span class="line"><span class="token generic-method"><span class="token function">GetComponent</span><span class="token generic class-name"><span class="token punctuation">&lt;</span>Image<span class="token punctuation">></span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>material<span class="token punctuation">.</span>mainTexture <span class="token operator">=</span> textOver<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-csharp line-numbers-mode" data-highlighter="prismjs" data-ext="cs"><pre v-pre><code><span class="line">BlendWeights <span class="token keyword">is</span> <span class="token class-name">obsolete<span class="token punctuation">.</span> Use</span> <span class="token return-type class-name">SkinWeights</span> instead <span class="token punctuation">(</span>UnityUpgradable<span class="token punctuation">)</span> <span class="token operator">-></span> SkinWeights</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="http://blog.mangolovecarrot.net/2021/04/09/231" target="_blank" rel="noopener noreferrer">Unity导入旧版本游戏工程出现的问题集</a></li>
<li><a href="https://docs.unity3d.com/cn/2021.3/Manual/VideoPlayer-MigratingFromMovieTexture.html" target="_blank" rel="noopener noreferrer">从 MovieTexture 迁移到 VideoPlayer</a></li>
</ul>
</div></template>



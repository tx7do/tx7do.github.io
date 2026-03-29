<template><div><h1 id="flutter中父子widget之间如何进行高效通信" tabindex="-1"><a class="header-anchor" href="#flutter中父子widget之间如何进行高效通信"><span>Flutter中父子Widget之间如何进行高效通信</span></a></h1>
<p>Flutter 的 widget系统 允许 父widget 和 子widget 之间无缝通信。了解如何双向调用方法可以显著增强应用的架构和性能。在本文中，我们将探讨如何从 父widget 调用 子widget 的方法，反之亦然。</p>
<h2 id="从父部件调用子部件的方法" tabindex="-1"><a class="header-anchor" href="#从父部件调用子部件的方法"><span>从父部件调用子部件的方法</span></a></h2>
<p>在 Flutter 中，可以使用属于子<code v-pre>State</code>类型的全局键<code v-pre>GlobalKey</code>来从父级调用子Widget中定义的方法。</p>
<p>例如：假设我们有一个名为<code v-pre>ChildWidget</code>的子窗口小部件</p>
<div class="language-dart line-numbers-mode" data-highlighter="prismjs" data-ext="dart"><pre v-pre><code><span class="line"><span class="token keyword">class</span> <span class="token class-name">ChildWidget</span> <span class="token keyword">extends</span> <span class="token class-name">StatefulWidget</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">const</span> <span class="token class-name">ChildWidget</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token keyword">super</span><span class="token punctuation">.</span>key<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token metadata function">@override</span></span>
<span class="line">  <span class="token class-name">State</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ChildWidget</span><span class="token punctuation">></span></span> <span class="token function">createState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token class-name">ChildWidgetState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">ChildWidgetState</span> <span class="token keyword">extends</span> <span class="token class-name">State</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ChildWidget</span><span class="token punctuation">></span></span> <span class="token punctuation">{</span></span>
<span class="line">  int value <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token metadata function">@override</span></span>
<span class="line">  <span class="token class-name">Widget</span> <span class="token function">build</span><span class="token punctuation">(</span><span class="token class-name">BuildContext</span> context<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token class-name">Card</span><span class="token punctuation">(</span></span>
<span class="line">      elevation<span class="token punctuation">:</span> <span class="token number">10</span><span class="token punctuation">,</span></span>
<span class="line">      child<span class="token punctuation">:</span> <span class="token class-name">Container</span><span class="token punctuation">(</span></span>
<span class="line">        height<span class="token punctuation">:</span> <span class="token number">200</span><span class="token punctuation">,</span></span>
<span class="line">        decoration<span class="token punctuation">:</span> <span class="token class-name">BoxDecoration</span><span class="token punctuation">(</span></span>
<span class="line">          borderRadius<span class="token punctuation">:</span> <span class="token class-name">BorderRadius</span><span class="token punctuation">.</span><span class="token function">circular</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">          color<span class="token punctuation">:</span> <span class="token class-name">Colors</span><span class="token punctuation">.</span>green<span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">        child<span class="token punctuation">:</span> <span class="token class-name">Column</span><span class="token punctuation">(</span></span>
<span class="line">          children<span class="token punctuation">:</span> <span class="token punctuation">[</span></span>
<span class="line">            <span class="token keyword">const</span> <span class="token class-name">Text</span><span class="token punctuation">(</span></span>
<span class="line">              <span class="token string-literal"><span class="token string">"Child Widget"</span></span><span class="token punctuation">,</span></span>
<span class="line">              style<span class="token punctuation">:</span> <span class="token class-name">DemoTextStyle</span><span class="token punctuation">.</span>headline1<span class="token punctuation">,</span></span>
<span class="line">            <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token class-name">ElevatedButton</span><span class="token punctuation">(</span>onPressed<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> child<span class="token punctuation">:</span> <span class="token keyword">const</span> <span class="token class-name">Text</span><span class="token punctuation">(</span><span class="token string-literal"><span class="token string">"Call Parent"</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token class-name">Center</span><span class="token punctuation">(</span></span>
<span class="line">              child<span class="token punctuation">:</span> <span class="token class-name">Text</span><span class="token punctuation">(</span></span>
<span class="line">                <span class="token string-literal"><span class="token string">'Child value:  </span><span class="token interpolation"><span class="token punctuation">$</span><span class="token expression">value</span></span><span class="token string">'</span></span><span class="token punctuation">,</span></span>
<span class="line">                style<span class="token punctuation">:</span> <span class="token class-name">DemoTextStyle</span><span class="token punctuation">.</span><span class="token function">copyWith</span><span class="token punctuation">(</span></span>
<span class="line">                    fontSize<span class="token punctuation">:</span> <span class="token number">18</span><span class="token punctuation">,</span> fontWeight<span class="token punctuation">:</span> <span class="token class-name">FontWeight</span><span class="token punctuation">.</span>normal<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">              <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">void</span> <span class="token function">changeValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      value<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">void</span> <span class="token function">changeValueDynamic</span><span class="token punctuation">(</span>int val<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      value <span class="token operator">=</span> val<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是一个基本的<code v-pre>StatefulWidget</code>（有状态Widget），但这里最需要注意的是状态的名称。如您所见，<code v-pre>ChildWidgetState</code>前面没有下划线 (_) （通常有，这意味着Private）。</p>
<div class="language-dart line-numbers-mode" data-highlighter="prismjs" data-ext="dart"><pre v-pre><code><span class="line"><span class="token keyword">class</span> <span class="token class-name">ChildWidgetState</span> <span class="token keyword">extends</span> <span class="token class-name">State</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ChildWidget</span><span class="token punctuation">></span></span> <span class="token punctuation">{</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>这样我们就可以在我们的父Widget中引用这个类。</p>
<p>现在让我们看一下父窗口小部件<code v-pre>ParentWidget</code>，我们为 <code v-pre>ChildWidgetState</code> 创建一个键(Key)：</p>
<div class="language-dart line-numbers-mode" data-highlighter="prismjs" data-ext="dart"><pre v-pre><code><span class="line"><span class="token keyword">class</span> <span class="token class-name">ParentWidget</span> <span class="token keyword">extends</span> <span class="token class-name">StatefulWidget</span> <span class="token punctuation">{</span><span class="token keyword">const</span> <span class="token class-name">ParentWidget</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token keyword">super</span><span class="token punctuation">.</span>key<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token metadata function">@override</span></span>
<span class="line">  <span class="token class-name">State</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ParentWidget</span><span class="token punctuation">></span></span> <span class="token function">createState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token function">_ParentWidgetState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">class</span> _ParentWidgetState <span class="token keyword">extends</span> <span class="token class-name">State</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ParentWidget</span><span class="token punctuation">></span></span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">final</span> <span class="token class-name">GlobalKey</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ChildWidgetState</span><span class="token punctuation">></span></span> _childKey <span class="token operator">=</span> <span class="token class-name">GlobalKey</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ChildWidgetState</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token class-name">String</span> parentText <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Parent Text"</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token metadata function">@override</span></span>
<span class="line">  <span class="token class-name">Widget</span> <span class="token function">build</span><span class="token punctuation">(</span><span class="token class-name">BuildContext</span> context<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">Size</span> size <span class="token operator">=</span> <span class="token class-name">MediaQuery</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span>context<span class="token punctuation">)</span><span class="token punctuation">.</span>size<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token class-name">Scaffold</span><span class="token punctuation">(</span></span>
<span class="line">      appBar<span class="token punctuation">:</span> <span class="token class-name">AppBar</span><span class="token punctuation">(</span></span>
<span class="line">        title<span class="token punctuation">:</span> <span class="token keyword">const</span> <span class="token class-name">Text</span><span class="token punctuation">(</span><span class="token string-literal"><span class="token string">"Demo"</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      body<span class="token punctuation">:</span> <span class="token class-name">SizedBox</span><span class="token punctuation">(</span></span>
<span class="line">        height<span class="token punctuation">:</span> size<span class="token punctuation">.</span>height<span class="token punctuation">,</span></span>
<span class="line">        width<span class="token punctuation">:</span> size<span class="token punctuation">.</span>width<span class="token punctuation">,</span></span>
<span class="line">        child<span class="token punctuation">:</span> <span class="token class-name">Stack</span><span class="token punctuation">(</span></span>
<span class="line">          children<span class="token punctuation">:</span> <span class="token punctuation">[</span></span>
<span class="line">            <span class="token class-name">Container</span><span class="token punctuation">(</span></span>
<span class="line">              width<span class="token punctuation">:</span> size<span class="token punctuation">.</span>width<span class="token punctuation">,</span></span>
<span class="line">              color<span class="token punctuation">:</span> <span class="token class-name">Colors</span><span class="token punctuation">.</span>blue<span class="token punctuation">,</span></span>
<span class="line">              child<span class="token punctuation">:</span> <span class="token class-name">Center</span><span class="token punctuation">(</span></span>
<span class="line">                  child<span class="token punctuation">:</span> <span class="token class-name">Column</span><span class="token punctuation">(</span></span>
<span class="line">                mainAxisAlignment<span class="token punctuation">:</span> <span class="token class-name">MainAxisAlignment</span><span class="token punctuation">.</span>center<span class="token punctuation">,</span></span>
<span class="line">                children<span class="token punctuation">:</span> <span class="token punctuation">[</span></span>
<span class="line">                  <span class="token class-name">Text</span><span class="token punctuation">(</span></span>
<span class="line">                    <span class="token string-literal"><span class="token string">"Parent Widget"</span></span><span class="token punctuation">,</span></span>
<span class="line">                    style<span class="token punctuation">:</span> <span class="token class-name">DemoTextStyle</span><span class="token punctuation">.</span><span class="token function">copyWith</span><span class="token punctuation">(</span></span>
<span class="line">                        fontSize<span class="token punctuation">:</span> <span class="token number">20</span><span class="token punctuation">,</span> color<span class="token punctuation">:</span> <span class="token class-name">Colors</span><span class="token punctuation">.</span>black<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">                  <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">                  <span class="token class-name">ElevatedButton</span><span class="token punctuation">(</span></span>
<span class="line">                      onPressed<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                        _childKey<span class="token punctuation">.</span>currentState<span class="token operator">?</span><span class="token punctuation">.</span><span class="token function">changeValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">                      child<span class="token punctuation">:</span> <span class="token keyword">const</span> <span class="token class-name">Text</span><span class="token punctuation">(</span><span class="token string-literal"><span class="token string">"Call Child Function"</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">                  <span class="token class-name">Text</span><span class="token punctuation">(</span></span>
<span class="line">                    <span class="token string-literal"><span class="token string">'Parent data: </span><span class="token interpolation"><span class="token punctuation">$</span><span class="token expression">parentText</span></span><span class="token string">'</span></span><span class="token punctuation">,</span></span>
<span class="line">                    style<span class="token punctuation">:</span> <span class="token class-name">DemoTextStyle</span><span class="token punctuation">.</span><span class="token function">copyWith</span><span class="token punctuation">(</span></span>
<span class="line">                        fontSize<span class="token punctuation">:</span> <span class="token number">18</span><span class="token punctuation">,</span> fontWeight<span class="token punctuation">:</span> <span class="token class-name">FontWeight</span><span class="token punctuation">.</span>normal<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">                  <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">              <span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token class-name">ChildWidget</span><span class="token punctuation">(</span></span>
<span class="line">              key<span class="token punctuation">:</span> _childKey<span class="token punctuation">,</span></span>
<span class="line">            <span class="token punctuation">)</span></span>
<span class="line">          <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">void</span> <span class="token function">changeParentData</span><span class="token punctuation">(</span><span class="token class-name">String</span> text<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      parentText <span class="token operator">=</span> text<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>定义部分：</p>
<div class="language-dart line-numbers-mode" data-highlighter="prismjs" data-ext="dart"><pre v-pre><code><span class="line"><span class="token keyword">final</span> <span class="token class-name">GlobalKey</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ChildWidgetState</span><span class="token punctuation">></span></span> _childKey <span class="token operator">=</span> <span class="token class-name">GlobalKey</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ChildWidgetState</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>我们使用<code v-pre>_childKey</code>来调用子窗口小部件内的方法。如上所述，<code v-pre>ChildWidgetState</code>前没有下划线 (_) 的原因是，该类变为公共类，并且可以在<code v-pre>ParentWidget</code>内访问。如果名称为<code v-pre>_ChildWidgetState</code>，则该状态将无法在<code v-pre>ParentWidget</code>内访问。</p>
<p>现在<code v-pre>_childKey</code>已经初始化，接下来就很简单了。通过以下方式调用 <code v-pre>ChildWidget</code> 中的方法：</p>
<div class="language-dart line-numbers-mode" data-highlighter="prismjs" data-ext="dart"><pre v-pre><code><span class="line">_childKey<span class="token punctuation">.</span>currentState<span class="token operator">?</span><span class="token punctuation">.</span><span class="token function">changeValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>效果：</p>
<p><img src="/assets/images/flutter/flutter_parent_widget_call_child_widget.gif" alt=""></p>
<p>如果需要向子方法传递参数怎么办？</p>
<p>非常简单；只需定义一个接受参数的方法：</p>
<div class="language-dart line-numbers-mode" data-highlighter="prismjs" data-ext="dart"><pre v-pre><code><span class="line"><span class="token keyword">void</span> <span class="token function">changeValueDynamic</span><span class="token punctuation">(</span><span class="token keyword">dynamic</span> val<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    value <span class="token operator">=</span> val<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>并从父窗口小部件调用它，如下所示：</p>
<div class="language-dart line-numbers-mode" data-highlighter="prismjs" data-ext="dart"><pre v-pre><code><span class="line">_childKey<span class="token punctuation">.</span>currentState<span class="token operator">?</span><span class="token punctuation">.</span><span class="token function">changeValueDynamic</span><span class="token punctuation">(</span>yourValue<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>效果：</p>
<p><img src="/assets/images/flutter/flutter_parent_widget_call_child_widget_parameter.gif" alt=""></p>
<h2 id="从子窗口小部件调用父方法" tabindex="-1"><a class="header-anchor" href="#从子窗口小部件调用父方法"><span>从子窗口小部件调用父方法</span></a></h2>
<p>从子部件调用父部件的方法相当简单。我们只需将方法作为参数传递到子部件中即可。让我们看看<code v-pre>ChildWidgetTwo</code>，它接受两种类型的方法作为参数。</p>
<ul>
<li>
<p>函数（String）：这是调用以字符串作为参数的方法。</p>
</li>
<li>
<p>VoidCallback：这是一个简单的 void 函数，不需要任何参数。</p>
</li>
</ul>
<div class="language-dart line-numbers-mode" data-highlighter="prismjs" data-ext="dart"><pre v-pre><code><span class="line"><span class="token keyword">class</span> <span class="token class-name">ChildWidgetTwo</span> <span class="token keyword">extends</span> <span class="token class-name">StatefulWidget</span> <span class="token punctuation">{</span><span class="token keyword">final</span> <span class="token class-name">Function</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">)</span> callBackFunction<span class="token punctuation">;</span></span>
<span class="line">  <span class="token keyword">final</span> <span class="token class-name">VoidCallback</span> voidCallback<span class="token punctuation">;</span></span>
<span class="line">  <span class="token keyword">const</span> <span class="token class-name">ChildWidgetTwo</span><span class="token punctuation">(</span></span>
<span class="line">      <span class="token punctuation">{</span><span class="token keyword">super</span><span class="token punctuation">.</span>key<span class="token punctuation">,</span> required <span class="token keyword">this</span><span class="token punctuation">.</span>voidCallback<span class="token punctuation">,</span> required <span class="token keyword">this</span><span class="token punctuation">.</span>callBackFunction<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token metadata function">@override</span></span>
<span class="line">  <span class="token class-name">State</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ChildWidgetTwo</span><span class="token punctuation">></span></span> <span class="token function">createState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token function">_ChildWidgetTwoState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">class</span> _ChildWidgetTwoState <span class="token keyword">extends</span> <span class="token class-name">State</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ChildWidgetTwo</span><span class="token punctuation">></span></span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">  <span class="token metadata function">@override</span></span>
<span class="line">  <span class="token class-name">Widget</span> <span class="token function">build</span><span class="token punctuation">(</span><span class="token class-name">BuildContext</span> context<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token class-name">Container</span><span class="token punctuation">(</span></span>
<span class="line">      color<span class="token punctuation">:</span> <span class="token class-name">Colors</span><span class="token punctuation">.</span>yellow<span class="token punctuation">,</span></span>
<span class="line">      child<span class="token punctuation">:</span> <span class="token class-name">Center</span><span class="token punctuation">(</span></span>
<span class="line">          child<span class="token punctuation">:</span> <span class="token class-name">Column</span><span class="token punctuation">(</span></span>
<span class="line">        children<span class="token punctuation">:</span> <span class="token punctuation">[</span></span>
<span class="line">          <span class="token class-name">ElevatedButton</span><span class="token punctuation">(</span></span>
<span class="line">            onPressed<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">              widget<span class="token punctuation">.</span><span class="token function">callBackFunction</span><span class="token punctuation">(</span><span class="token string-literal"><span class="token string">"Function with parameter"</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">            child<span class="token punctuation">:</span> <span class="token keyword">const</span> <span class="token class-name">Text</span><span class="token punctuation">(</span><span class="token string-literal"><span class="token string">"Callback function"</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token keyword">const</span> <span class="token class-name">SizedBox</span><span class="token punctuation">(</span></span>
<span class="line">            height<span class="token punctuation">:</span> <span class="token number">10</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token class-name">ElevatedButton</span><span class="token punctuation">(</span></span>
<span class="line">            onPressed<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">              widget<span class="token punctuation">.</span><span class="token function">voidCallback</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">            child<span class="token punctuation">:</span> <span class="token keyword">const</span> <span class="token class-name">Text</span><span class="token punctuation">(</span><span class="token string-literal"><span class="token string">"Void callback"</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在我们只需将函数传递给<code v-pre>ParentWidget</code>内的子窗口小部件，如下所示：</p>
<div class="language-dart line-numbers-mode" data-highlighter="prismjs" data-ext="dart"><pre v-pre><code><span class="line"><span class="token class-name">ChildWidgetTwo</span><span class="token punctuation">(</span></span>
<span class="line">              callBackFunction<span class="token punctuation">:</span> changeParentData<span class="token punctuation">,</span></span>
<span class="line">              voidCallback<span class="token punctuation">:</span> changeParentData2<span class="token punctuation">,</span></span>
<span class="line">            <span class="token punctuation">)</span></span>
<span class="line">          <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">void</span> <span class="token function">changeParentData</span><span class="token punctuation">(</span><span class="token class-name">String</span> text<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      parentText <span class="token operator">=</span> text<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  <span class="token keyword">void</span> <span class="token function">changeParentData2</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      parentText <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Void Callback"</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="/assets/images/flutter/flutter_child_widget_call_parent_widget.gif.gif" alt=""></p>
<h2 id="翻译自" tabindex="-1"><a class="header-anchor" href="#翻译自"><span>翻译自</span></a></h2>
<p><a href="https://medium.com/@paalu.heing/efficient-communication-between-parent-and-child-widgets-in-flutter-c551f8e5dbeb" target="_blank" rel="noopener noreferrer">Efficient Communication Between Parent and Child Widgets in Flutter</a></p>
</div></template>



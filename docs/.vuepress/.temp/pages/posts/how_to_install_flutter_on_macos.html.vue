<template><div><h1 id="如何在macos下安装flutter开发环境" tabindex="-1"><a class="header-anchor" href="#如何在macos下安装flutter开发环境"><span>如何在MacOS下安装Flutter开发环境</span></a></h1>
<p>通过Google推出的Flutter framework，我们可以更为方便的开发跨平台APP，开发出来的APP能够在iOS、Android、Web、macOS、Windows和Linux上都可以执行。</p>
<p>在开发 Flutter App 之前，我们必须要先准备好开发环境，下面我将介绍如何在Mac环境下从零开始Flutter App的开发环境。</p>
<ul>
<li>安装Xcode；</li>
<li>安装Android Studio；</li>
<li>安装VS Code；</li>
<li>安装CocoaPods；</li>
</ul>
<h2 id="安装xcode" tabindex="-1"><a class="header-anchor" href="#安装xcode"><span>安装Xcode</span></a></h2>
<p>Xcode的安装比较简单，在<code v-pre>Apple Store</code>当中搜索<code v-pre>Xcode</code>即可。</p>
<p>第一次执行Xcode需要进行一些配置，我们可以在命令行当中输入如下几条命令：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">sh</span> <span class="token parameter variable">-c</span> <span class="token string">'xcode-select -s /Applications/Xcode.app/Contents/Developer &amp;&amp; xcodebuild -runFirstLaunch'</span></span>
<span class="line"><span class="token function">sudo</span> xcodebuild <span class="token parameter variable">-license</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安装android-studio" tabindex="-1"><a class="header-anchor" href="#安装android-studio"><span>安装Android Studio</span></a></h2>
<p>安装有以下几种途径可以安装：</p>
<ol>
<li>官网下载: <a href="https://developer.android.com/codelabs/basic-android-kotlin-compose-install-android-studio" target="_blank" rel="noopener noreferrer">https://developer.android.com/codelabs/basic-android-kotlin-compose-install-android-studio</a>;</li>
<li>通过<code v-pre>Jetbrains</code>的<code v-pre>Jetbrains Toolbox</code>来进行安装。</li>
<li><code v-pre>brew install --cask android-studio</code></li>
</ol>
<h2 id="安装vs-code" tabindex="-1"><a class="header-anchor" href="#安装vs-code"><span>安装VS Code</span></a></h2>
<ol>
<li><code v-pre>brew install --cask visual-studio-code</code></li>
<li>官网下载：<a href="https://code.visualstudio.com/download" target="_blank" rel="noopener noreferrer">https://code.visualstudio.com/download</a></li>
</ol>
<h2 id="安装flutter-sdk" tabindex="-1"><a class="header-anchor" href="#安装flutter-sdk"><span>安装Flutter SDK</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">brew <span class="token function">install</span> <span class="token parameter variable">--cask</span> flutter</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>它的路径在：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">/opt/homebrew/Caskroom/flutter/<span class="token punctuation">{</span>版本号<span class="token punctuation">}</span>/flutter</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>安装好之后，需要执行一次flutter：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">flutter</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>它会自动初始化下载安装Dart SDK和一些构建工具等，这些文件都在Flutter SDK下的<code v-pre>bin/cache</code>路径下。</p>
<p>现在，我们查看Flutter的版本号：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">flutter <span class="token parameter variable">--version</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>它将会输出大概下面这样的信息：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">Flutter <span class="token number">3.19</span>.6 • channel stable • https://github.com/flutter/flutter.git</span>
<span class="line">Framework • revision 54e66469a9 <span class="token punctuation">(</span><span class="token number">6</span> days ago<span class="token punctuation">)</span> • <span class="token number">2024</span>-04-17 <span class="token number">13</span>:08:03 <span class="token parameter variable">-0700</span></span>
<span class="line">Engine • revision c4cd48e186</span>
<span class="line">Tools • Dart <span class="token number">3.3</span>.4 • DevTools <span class="token number">2.31</span>.1</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这就代表着Flutter SDK安装成功了。</p>
<p>我使用的主力IDE是Android Studio，当Flutter SDK安装好之后，我们需要在：</p>
<blockquote>
<p>Android Studio -&gt; Preference -&gt; Languages &amp; Frameworks -&gt; Flutter</p>
</blockquote>
<p>填入Flutter SDK安装的路径即可初始化Flutter的IDE环境。</p>
<h2 id="安装cocoapods" tabindex="-1"><a class="header-anchor" href="#安装cocoapods"><span>安装CocoaPods</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">brew <span class="token function">install</span> cocoapods</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="测试开发环境" tabindex="-1"><a class="header-anchor" href="#测试开发环境"><span>测试开发环境</span></a></h2>
<p>Flutter的CLI提供了一个参数用于测试开发环境的完整度：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">flutter <span class="token function">docker</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="出现xcode-installation-is-incomplete错误" tabindex="-1"><a class="header-anchor" href="#出现xcode-installation-is-incomplete错误"><span>出现Xcode installation is incomplete错误</span></a></h3>
<p>执行以下两条命令既可以解决问题：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> xcode-select <span class="token parameter variable">--switch</span> /Applications/Xcode.app/Contents/Developer</span>
<span class="line"><span class="token function">sudo</span> xcodebuild <span class="token parameter variable">-runFirstLaunch</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="a-network-error-occurred" tabindex="-1"><a class="header-anchor" href="#a-network-error-occurred"><span>A network error occurred</span></a></h3>
<p>国内需要<code v-pre>$HOME/.bash_profile</code>或者<code v-pre>$HOME/.zshrc</code>里面添加：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">PUB_HOSTED_URL</span><span class="token operator">=</span>https://pub.flutter-io.cn <span class="token comment"># 国内用户需要设置</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">FLUTTER_STORAGE_BASE_URL</span><span class="token operator">=</span>https://storage.flutter-io.cn <span class="token comment"># 国内用户需要设置</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://docs.flutter.dev/get-started/install/macos/mobile-ios" target="_blank" rel="noopener noreferrer">Start building Flutter iOS apps on macOS</a></li>
<li><a href="https://medium.com/%E5%BD%BC%E5%BE%97%E6%BD%98%E7%9A%84-flutter-app-%E9%96%8B%E7%99%BC%E5%95%8F%E9%A1%8C%E8%A7%A3%E7%AD%94%E9%9B%86/%E5%9C%A8-mac-%E4%B8%8A%E6%BA%96%E5%82%99-flutter-app-%E7%9A%84%E9%96%8B%E7%99%BC%E7%92%B0%E5%A2%83-3ccebbd3a0bd" target="_blank" rel="noopener noreferrer">在 Mac 上準備 Flutter App 的開發環境</a></li>
</ul>
</div></template>



<template><div><h1 id="解决-flutter-项目更新至-android-studio-ladybug-2024-2-1-后出现的问题" tabindex="-1"><a class="header-anchor" href="#解决-flutter-项目更新至-android-studio-ladybug-2024-2-1-后出现的问题"><span>解决 Flutter 项目更新至 Android Studio Ladybug (2024.2.1) 后出现的问题</span></a></h1>
<p>升级到Android Studio Ladybug | 2024.2.1后，我在 Flutter 项目中遇到了一些问题。幸运的是，我通过修改一些配置文件找到了一个简单的解决方案。如果您面临类似的挑战，请按照以下步骤让您的项目重回正轨。</p>
<p>修改<code v-pre>settings.gradle</code>：</p>
<div class="language-gradle line-numbers-mode" data-highlighter="prismjs" data-ext="gradle"><pre v-pre><code><span class="line">id <span class="token interpolation-string"><span class="token string">"com.android.application"</span></span> version <span class="token interpolation-string"><span class="token string">"8.3.2"</span></span> <span class="token keyword">apply</span> <span class="token boolean">false</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>修改<code v-pre>gradle-wrapper.properties</code>:</p>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties"><pre v-pre><code><span class="line"><span class="token key attr-name">distributionUrl</span><span class="token punctuation">=</span><span class="token value attr-value">https\://services.gradle.org/distributions/gradle-8.4-all.zip</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="your-project-is-configured-with-android-ndk-23-1-7779620" tabindex="-1"><a class="header-anchor" href="#your-project-is-configured-with-android-ndk-23-1-7779620"><span>Your project is configured with Android NDK 23.1.7779620</span></a></h2>
<p>修改<code v-pre>build.gradle</code>:</p>
<div class="language-gradle line-numbers-mode" data-highlighter="prismjs" data-ext="gradle"><pre v-pre><code><span class="line">android <span class="token punctuation">{</span></span>
<span class="line">    <span class="token punctuation">...</span></span>
<span class="line"> <span class="token comment">//    ndkVersion flutter.ndkVersion</span></span>
<span class="line">    ndkVersion <span class="token operator">=</span> <span class="token interpolation-string"><span class="token string">"25.1.8937393"</span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="dependency-flutter-local-notifications-requires-core-library-desugaring-to-be-enabled" tabindex="-1"><a class="header-anchor" href="#dependency-flutter-local-notifications-requires-core-library-desugaring-to-be-enabled"><span>Dependency ':flutter_local_notifications' requires core library desugaring to be enabled</span></a></h2>
<p>修改<code v-pre>build.gradle</code>:</p>
<div class="language-gradle line-numbers-mode" data-highlighter="prismjs" data-ext="gradle"><pre v-pre><code><span class="line">android <span class="token punctuation">{</span></span>
<span class="line">    <span class="token punctuation">...</span></span>
<span class="line">    compileOptions <span class="token punctuation">{</span></span>
<span class="line">        <span class="token punctuation">...</span></span>
<span class="line">        coreLibraryDesugaringEnabled <span class="token boolean">true</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">...</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">dependencies</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token punctuation">...</span></span>
<span class="line">    coreLibraryDesugaring <span class="token string">'com.android.tools:desugar_jdk_libs:1.2.2'</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://fluttergyaan.medium.com/could-not-resolve-all-files-for-configuration-app-androidjdkimage-0096d0fdfe6e" target="_blank" rel="noopener noreferrer">Could not resolve all files for configuration ‘:app:androidJdkImage</a></li>
<li><a href="https://github.com/MaikuB/flutter_local_notifications/issues/2286" target="_blank" rel="noopener noreferrer">'flutter_local_notifications' requires core library desugaring to be enabled for app #2286</a></li>
<li><a href="https://stackoverflow.com/questions/79158012/dependency-flutter-local-notifications-requires-core-library-desugaring-to-be" target="_blank" rel="noopener noreferrer">Dependency ':flutter_local_notifications' requires core library desugaring to be enabled for :app</a></li>
</ul>
</div></template>



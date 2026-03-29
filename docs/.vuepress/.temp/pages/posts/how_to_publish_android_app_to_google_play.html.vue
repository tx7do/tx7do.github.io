<template><div><h1 id="如何发布android-app到google-play" tabindex="-1"><a class="header-anchor" href="#如何发布android-app到google-play"><span>如何发布Android APP到Google Play</span></a></h1>
<h2 id="生成签名" tabindex="-1"><a class="header-anchor" href="#生成签名"><span>生成签名</span></a></h2>
<p>在项目的android目录下执行以下命令：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">keytool  <span class="token parameter variable">-genkey</span> <span class="token parameter variable">-v</span> <span class="token parameter variable">-keystore</span> ./app_key.jks <span class="token parameter variable">-keyalg</span> RSA <span class="token parameter variable">-keysize</span> <span class="token number">4096</span> <span class="token parameter variable">-validity</span> <span class="token number">10000</span> <span class="token parameter variable">-alias</span> flutter_key</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li><code v-pre>-alias</code>参数，我们后面将要把它填写到下面的<code v-pre>keyAlias</code>字段。</li>
<li><code v-pre>-keysize</code>参数，设置密钥的位数，它必须大于2048，否则会报错：<code v-pre>您的 Android App Bundle 所使用的上传证书的密钥强度太低</code>。</li>
<li><code v-pre>-storepasswd</code>参数，密钥库的存储口令。</li>
<li><code v-pre>-keypasswd</code>参数，密钥口令。</li>
</ul>
<p>按照以下的提示词依次输入相关信息：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">输入密钥库口令:  </span>
<span class="line">再次输入新口令: </span>
<span class="line">您的名字与姓氏是什么?</span>
<span class="line">您的组织单位名称是什么?</span>
<span class="line">您的组织名称是什么?</span>
<span class="line">您所在的城市或区域名称是什么?</span>
<span class="line">您所在的省/市/自治区名称是什么?</span>
<span class="line">该单位的双字母国家/地区代码是什么?</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后会显示一条提示，输入<code v-pre>y</code>确认，这样，在当前目录下就成功生成了<code v-pre>app_key.jks</code>文件。</p>
<p>生成之后，使用以下命令查看生成的证书：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">keytool <span class="token parameter variable">-v</span> <span class="token parameter variable">-list</span> <span class="token parameter variable">-keystore</span> app_key.jks</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="创建key-properties" tabindex="-1"><a class="header-anchor" href="#创建key-properties"><span>创建key.properties</span></a></h2>
<p>将<code v-pre>key.properties</code>放置于<code v-pre>android</code>文件夹。</p>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties"><pre v-pre><code><span class="line"><span class="token key attr-name">storePassword</span><span class="token punctuation">=</span><span class="token value attr-value">123456</span></span>
<span class="line"><span class="token key attr-name">keyPassword</span><span class="token punctuation">=</span><span class="token value attr-value">123456</span></span>
<span class="line"><span class="token key attr-name">keyAlias</span><span class="token punctuation">=</span><span class="token value attr-value">flutter_key</span></span>
<span class="line"><span class="token key attr-name">storeFile</span><span class="token punctuation">=</span><span class="token value attr-value">../app_key.jks</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="修改build-gradle" tabindex="-1"><a class="header-anchor" href="#修改build-gradle"><span>修改build.gradle</span></a></h2>
<h3 id="app-build-gradle" tabindex="-1"><a class="header-anchor" href="#app-build-gradle"><span>app/build.gradle</span></a></h3>
<div class="language-gradle line-numbers-mode" data-highlighter="prismjs" data-ext="gradle"><pre v-pre><code><span class="line"></span>
<span class="line"><span class="token comment">//...</span></span>
<span class="line"><span class="token keyword">def</span> keystorePropertiesFile <span class="token operator">=</span> rootProject<span class="token punctuation">.</span><span class="token function">file</span><span class="token punctuation">(</span><span class="token string">'key.properties'</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">(</span>keystorePropertiesFile<span class="token punctuation">.</span><span class="token function">exists</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    localProperties<span class="token punctuation">.</span><span class="token function">load</span><span class="token punctuation">(</span>new <span class="token class-name">FileInputStream</span><span class="token punctuation">(</span>keystorePropertiesFile<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token comment">//...</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">android <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">//...</span></span>
<span class="line">    signingConfigs <span class="token punctuation">{</span></span>
<span class="line">        release <span class="token punctuation">{</span></span>
<span class="line">            keyAlias localProperties<span class="token punctuation">[</span><span class="token string">'keyAlias'</span><span class="token punctuation">]</span></span>
<span class="line">            keyPassword localProperties<span class="token punctuation">[</span><span class="token string">'keyPassword'</span><span class="token punctuation">]</span></span>
<span class="line">            storeFile <span class="token function">file</span><span class="token punctuation">(</span>localProperties<span class="token punctuation">[</span><span class="token string">'storeFile'</span><span class="token punctuation">]</span><span class="token punctuation">)</span></span>
<span class="line">            storePassword localProperties<span class="token punctuation">[</span><span class="token string">'storePassword'</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token comment">//...</span></span>
<span class="line"></span>
<span class="line">    buildTypes <span class="token punctuation">{</span></span>
<span class="line">        release <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">//...</span></span>
<span class="line">            signingConfig signingConfigs<span class="token punctuation">.</span>release</span>
<span class="line">            <span class="token comment">//...</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="app-build-gradle-kts" tabindex="-1"><a class="header-anchor" href="#app-build-gradle-kts"><span>app/build.gradle.kts</span></a></h3>
<div class="language-kotlin line-numbers-mode" data-highlighter="prismjs" data-ext="kt"><pre v-pre><code><span class="line"><span class="token comment">//...</span></span>
<span class="line"><span class="token keyword">import</span> java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>Properties</span>
<span class="line"></span>
<span class="line"><span class="token keyword">val</span> keystorePropertiesFile <span class="token operator">=</span> rootProject<span class="token punctuation">.</span><span class="token function">file</span><span class="token punctuation">(</span><span class="token string-literal singleline"><span class="token string">"key.properties"</span></span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">val</span> keystoreProperties <span class="token operator">=</span> <span class="token function">Properties</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">(</span>keystorePropertiesFile<span class="token punctuation">.</span><span class="token function">exists</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    keystoreProperties<span class="token punctuation">.</span><span class="token function">load</span><span class="token punctuation">(</span>keystorePropertiesFile<span class="token punctuation">.</span><span class="token function">inputStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token comment">//...</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">android <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">//...</span></span>
<span class="line">    signingConfigs <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">create</span><span class="token punctuation">(</span><span class="token string-literal singleline"><span class="token string">"release"</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            storeFile <span class="token operator">=</span> <span class="token function">file</span><span class="token punctuation">(</span>keystoreProperties<span class="token punctuation">[</span><span class="token string-literal singleline"><span class="token string">"storeFile"</span></span><span class="token punctuation">]</span> <span class="token keyword">as</span> String<span class="token punctuation">)</span></span>
<span class="line">            storePassword <span class="token operator">=</span> keystoreProperties<span class="token punctuation">[</span><span class="token string-literal singleline"><span class="token string">"storePassword"</span></span><span class="token punctuation">]</span> <span class="token keyword">as</span> String</span>
<span class="line">            keyAlias <span class="token operator">=</span> keystoreProperties<span class="token punctuation">[</span><span class="token string-literal singleline"><span class="token string">"keyAlias"</span></span><span class="token punctuation">]</span> <span class="token keyword">as</span> String</span>
<span class="line">            keyPassword <span class="token operator">=</span> keystoreProperties<span class="token punctuation">[</span><span class="token string-literal singleline"><span class="token string">"keyPassword"</span></span><span class="token punctuation">]</span> <span class="token keyword">as</span> String</span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token comment">//...</span></span>
<span class="line"></span>
<span class="line">    buildTypes <span class="token punctuation">{</span></span>
<span class="line">        release <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">//...</span></span>
<span class="line">            <span class="token comment">// Signing with the debug keys for now, so `flutter run --release` works.</span></span>
<span class="line">            signingConfig <span class="token operator">=</span> signingConfigs<span class="token punctuation">.</span><span class="token function">getByName</span><span class="token punctuation">(</span><span class="token string-literal singleline"><span class="token string">"release"</span></span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token comment">//...</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="提交google-play" tabindex="-1"><a class="header-anchor" href="#提交google-play"><span>提交Google Play</span></a></h2>
<p>有这么几个权限必须要关闭：</p>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line">    <span class="token comment">&lt;!-- 存储 --></span></span>
<span class="line">    <span class="token comment">&lt;!--&lt;uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />--></span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">&lt;!-- 相册 --></span></span>
<span class="line">    <span class="token comment">&lt;!--&lt;uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />--></span></span>
<span class="line">    <span class="token comment">&lt;!--&lt;uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />--></span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">&lt;!--允许获取精确位置，精准定位必选--></span></span>
<span class="line">    <span class="token comment">&lt;!--&lt;uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />--></span></span>
<span class="line">    <span class="token comment">&lt;!--允许获取粗略位置，粗略定位必选--></span></span>
<span class="line">    <span class="token comment">&lt;!--&lt;uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />--></span></span>
<span class="line">    <span class="token comment">&lt;!--&lt;uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />--></span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">&lt;!--(如果需要上架到google store ,不能添加这个权限 , 也无法使用应用内更新功能)--></span></span>
<span class="line">    <span class="token comment">&lt;!--&lt;uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />--></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要提供一个隐私政策的链接，隐私政策的内容通过下面的网站生成：</p>
<p><a href="https://app-privacy-policy-generator.firebaseapp.com/" target="_blank" rel="noopener noreferrer">隐私政策声明生成</a></p>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
</div></template>



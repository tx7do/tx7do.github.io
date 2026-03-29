<template><div><h1 id="修复flutter一些ios编译错误" tabindex="-1"><a class="header-anchor" href="#修复flutter一些ios编译错误"><span>修复Flutter一些iOS编译错误</span></a></h1>
<h2 id="сocoapods-trunk-url-couldn-t-be-downloaded" tabindex="-1"><a class="header-anchor" href="#сocoapods-trunk-url-couldn-t-be-downloaded"><span>Сocoapods trunk URL couldn’t be downloaded</span></a></h2>
<p>逐行运行此命令</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">gem uninstall cocoapods </span>
<span class="line">arch <span class="token parameter variable">-x86_64</span> brew <span class="token function">install</span> cocoapods </span>
<span class="line">arch <span class="token parameter variable">-x86_64</span> brew reinstall cocoapods </span>
<span class="line"><span class="token builtin class-name">cd</span> ios </span>
<span class="line">pod cache clean <span class="token parameter variable">--all</span> </span>
<span class="line">pod <span class="token function">install</span> （如果m1 macOS 运行这个“arch <span class="token parameter variable">-x86_64</span> pod install”）</span>
<span class="line">pod update</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="cocoapods-did-not-set-the-base-configuration" tabindex="-1"><a class="header-anchor" href="#cocoapods-did-not-set-the-base-configuration"><span>CocoaPods did not set the base configuration</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token punctuation">[</span><span class="token operator">!</span><span class="token punctuation">]</span> CocoaPods did not <span class="token builtin class-name">set</span> the base configuration of your project because your project already has a custom config set. In order <span class="token keyword">for</span> CocoaPods integration to work at all, please either <span class="token builtin class-name">set</span> the base configurations of the target <span class="token variable"><span class="token variable">`</span>Runner<span class="token variable">`</span></span> to <span class="token variable"><span class="token variable">`</span>Target Support Files/Pods-Runner/Pods-Runner.profile.xcconfig<span class="token variable">`</span></span> or include the <span class="token variable"><span class="token variable">`</span>Target Support Files/Pods-Runner/Pods-Runner.profile.xcconfig<span class="token variable">`</span></span> <span class="token keyword">in</span> your build configuration <span class="token punctuation">(</span><span class="token variable"><span class="token variable">`</span>Flutter/Release.xcconfig<span class="token variable">`</span></span><span class="token punctuation">)</span>.'</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ol>
<li>我们首先用Xcode打开<code v-pre>ios/Runner.xcworkspace</code>；</li>
<li>然后选中<code v-pre>Project Navigator</code>下的<code v-pre>Runner</code>项目，再选中<code v-pre>PROJECT</code>下面的<code v-pre>Runner</code>，再然后选中<code v-pre>Info</code>；</li>
<li>我们找到<code v-pre>Configurations</code>，把<code v-pre>Debug</code>、<code v-pre>Release</code>和<code v-pre>Profile</code>下面的<code v-pre>Runner/Runner</code>全部选为<code v-pre>None</code>;</li>
<li>再一次运行<code v-pre>pod update</code>，警告消息。</li>
</ol>
<p><img src="/assets/images/xcode/xcode_set_base_configurations.png" alt=""></p>
<p>需要注意的是，如果运行了<code v-pre>pod update</code>之后，选项会被自动勾选为<code v-pre>Pods-Runner.debug</code>或者<code v-pre>Pods-Runner.release</code>，在这个选项之下，会报错：</p>
<blockquote>
<p>Command PhaseScriptExecution failed with a nonzero exit code</p>
</blockquote>
<p>如果需要解决这个报错，只需要修改为<code v-pre>Debug</code>或者<code v-pre>Release</code>即可消除。</p>
<h2 id="framework-pods-runner-not-found" tabindex="-1"><a class="header-anchor" href="#framework-pods-runner-not-found"><span>Framework 'Pods_Runner' not found</span></a></h2>
<ol>
<li>删除掉<code v-pre>ios</code>文件夹下面的<code v-pre>Podfile</code>文件；</li>
<li>在项目的文件夹下，按顺序运行<code v-pre>flutter clean</code>和<code v-pre>flutter pub get</code>命令，它将会重新生成<code v-pre>Podfile</code>文件；</li>
<li>在新的<code v-pre>Podfile</code>文件中的<code v-pre># platform :ios, '12.0'</code>的版本号修改为<code v-pre>14.0</code>，并取消掉注释：<code v-pre>platform :ios, '14.0'</code>;</li>
<li>在<code v-pre>ios</code>文件夹下运行<code v-pre>pod install</code>命令。</li>
</ol>
<blockquote>
<p>根据我实际的测试，我发现这个问题很奇怪，实际上，不需要上面步骤那么复杂，只要触发了这个编译错误，你只需要执行一次 步骤2和4即可，再编译就不会出现这个错误了。</p>
</blockquote>
<p>这个时候，一切就都正常了。</p>
<p>我在Intel芯片的Macbook上没有问题，但是在ARM的M2芯片下碰到的这个问题。</p>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://medium.com/vector-com-mm/fix-flutter-all-pod-errors-issue-04a1e44d892e" target="_blank" rel="noopener noreferrer">Fix Flutter All Pod Errors issue</a></li>
<li><a href="https://stackoverflow.com/questions/77304874/framework-pods-runner-not-found" target="_blank" rel="noopener noreferrer">Framework 'Pods_Runner' not found</a></li>
</ul>
</div></template>



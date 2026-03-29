<template><div><h1 id="使用bazel构建golang程序" tabindex="-1"><a class="header-anchor" href="#使用bazel构建golang程序"><span>使用Bazel构建Golang程序</span></a></h1>
<p>在这篇简短的文章中，我们将介绍如何将 Golang 与 Bazel 构建系统结合使用。</p>
<p>具体来说，我们将讨论三个场景：</p>
<ol>
<li>从头开始一个 Golang 项目；</li>
<li>将一个现有的 Golang 项目转换为 Bazel 构建；</li>
<li>以及将一个第三方 Golang 项目引入到您的 Bazel 构建系统。</li>
</ol>
<h2 id="从头开始一个-golang-项目" tabindex="-1"><a class="header-anchor" href="#从头开始一个-golang-项目"><span>从头开始一个 Golang 项目</span></a></h2>
<p>让我们从将 Go 与 Bazel 结合使用的基础知识开始。</p>
<p>为此，我们需要从 <a href="https://github.com/bazelbuild/rules_go" target="_blank" rel="noopener noreferrer">https://github.com/bazelbuild/rules_go</a> 获取 Go 语言的官方构建规则。</p>
<p>在配置部分，您会发现：我们需要将以下这段 <code v-pre>Starlark</code> 语言代码，放入名为 <code v-pre>WORKSPACE</code> 的配置文件里面：</p>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line">load<span class="token punctuation">(</span><span class="token string">"@bazel_tools//tools/build_defs/repo:http.bzl"</span><span class="token punctuation">,</span> <span class="token string">"http_archive"</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">http_archive<span class="token punctuation">(</span></span>
<span class="line">    name <span class="token operator">=</span> <span class="token string">"io_bazel_rules_go"</span><span class="token punctuation">,</span></span>
<span class="line">    sha256 <span class="token operator">=</span> <span class="token string">"8e968b5fcea1d2d64071872b12737bbb5514524ee5f0a4f54f5920266c261acb"</span><span class="token punctuation">,</span></span>
<span class="line">    urls <span class="token operator">=</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token string">"https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.28.0/rules_go-v0.28.0.zip"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"https://github.com/bazelbuild/rules_go/releases/download/v0.28.0/rules_go-v0.28.0.zip"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">load<span class="token punctuation">(</span><span class="token string">"@io_bazel_rules_go//go:deps.bzl"</span><span class="token punctuation">,</span> <span class="token string">"go_register_toolchains"</span><span class="token punctuation">,</span> <span class="token string">"go_rules_dependencies"</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">go_rules_dependencies<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">go_register_toolchains<span class="token punctuation">(</span>version <span class="token operator">=</span> <span class="token string">"1.16.5"</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>让我们逐步了解这段代码所做的事情。</p>
<p>首先，我们使用<code v-pre>load</code>指令来加载并提取新功能，以在 Bazel 文件当中能够使用该功能。我们调用了两次<code v-pre>load</code>指令，第一次用于导入下载 HTTP 代码库的能力，第二次则是从刚下载的代码库中加载特定于 Go 的命令。</p>
<p>对于导入本身，我们需要提供一个导入名称。通常的命名方案是：逆反域名，后面跟命名空间和项目名称；并需将<code v-pre>/</code>和<code v-pre>.</code>全部都转换为下划线<code v-pre>_</code>。例如：<code v-pre>github.com/user/project</code>变成<code v-pre>com_github_user_project</code>。<code v-pre>io_bazel_rules_go</code>这个项目由于是Bazel官方项目中的一部分，所以它使用的是<code v-pre>bazel.io</code>而不是<code v-pre>github.com</code>。</p>
<p>如果您并不熟悉 Bazel，那么，您需要了解到：实际的构建配置是通过<code v-pre>BUILD</code>文件完成的。我们可以将 Go 视为任何其他语言，并使用遵循相同结构的构建规则：<code v-pre>go_binary</code>、<code v-pre>go_library</code>和<code v-pre>go_test</code>。我在我的 Github 上准备了一个最小化的例子：<a href="https://github.com/HappyCerberus/bazel-golang-minimal-example" target="_blank" rel="noopener noreferrer">https://github.com/HappyCerberus/bazel-golang-minimal-example</a>。您会注意到，我们需要从导入的<code v-pre>io_bazel_rules_go</code>代码库中加载这些规则，以使其在<code v-pre>BUILD</code>文件中可用。</p>
<h2 id="将现有项目转换为-bazel-构建" tabindex="-1"><a class="header-anchor" href="#将现有项目转换为-bazel-构建"><span>将现有项目转换为 Bazel 构建</span></a></h2>
<p>现在我们知道，从头全新开始是很容易。但是，如果您已经有一个 Golang 项目，并且需要将其转换为 使用 Bazel 构建怎么办？为此，我们需要使用 Bazel 官方项目中提供的另一个工具 <code v-pre>Gazelle</code> ( <a href="https://github.com/bazelbuild/bazel-gazelle" target="_blank" rel="noopener noreferrer">https://github.com/bazelbuild/bazel-gazelle</a> )。</p>
<p>为了演示，我将使用一个第三方项目 ( <a href="https://github.com/aler9/rtsp-simple-server" target="_blank" rel="noopener noreferrer">https://github.com/aler9/rtsp-simple-server</a> )，我目前正在为即将到来的系统设计课程修改该项目。</p>
<p>首先，我们需要创建一个<code v-pre>WORKSPACE</code>文件，并从 <code v-pre>Gazelle</code> 代码库的设置部分复制粘贴代码。</p>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line">load<span class="token punctuation">(</span><span class="token string">"@bazel_tools//tools/build_defs/repo:http.bzl"</span><span class="token punctuation">,</span> <span class="token string">"http_archive"</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">http_archive<span class="token punctuation">(</span></span>
<span class="line">    name <span class="token operator">=</span> <span class="token string">"io_bazel_rules_go"</span><span class="token punctuation">,</span></span>
<span class="line">    sha256 <span class="token operator">=</span> <span class="token string">"8e968b5fcea1d2d64071872b12737bbb5514524ee5f0a4f54f5920266c261acb"</span><span class="token punctuation">,</span></span>
<span class="line">    urls <span class="token operator">=</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token string">"https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.28.0/rules_go-v0.28.0.zip"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"https://github.com/bazelbuild/rules_go/releases/download/v0.28.0/rules_go-v0.28.0.zip"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">http_archive<span class="token punctuation">(</span></span>
<span class="line">    name <span class="token operator">=</span> <span class="token string">"bazel_gazelle"</span><span class="token punctuation">,</span></span>
<span class="line">    sha256 <span class="token operator">=</span> <span class="token string">"62ca106be173579c0a167deb23358fdfe71ffa1e4cfdddf5582af26520f1c66f"</span><span class="token punctuation">,</span></span>
<span class="line">    urls <span class="token operator">=</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token string">"https://mirror.bazel.build/github.com/bazelbuild/bazel-gazelle/releases/download/v0.23.0/bazel-gazelle-v0.23.0.tar.gz"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token string">"https://github.com/bazelbuild/bazel-gazelle/releases/download/v0.23.0/bazel-gazelle-v0.23.0.tar.gz"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">load<span class="token punctuation">(</span><span class="token string">"@io_bazel_rules_go//go:deps.bzl"</span><span class="token punctuation">,</span> <span class="token string">"go_register_toolchains"</span><span class="token punctuation">,</span> <span class="token string">"go_rules_dependencies"</span><span class="token punctuation">)</span></span>
<span class="line">load<span class="token punctuation">(</span><span class="token string">"@bazel_gazelle//:deps.bzl"</span><span class="token punctuation">,</span> <span class="token string">"gazelle_dependencies"</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">go_rules_dependencies<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">go_register_toolchains<span class="token punctuation">(</span>version <span class="token operator">=</span> <span class="token string">"1.16.5"</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">gazelle_dependencies<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>您会注意到，上述代码也导入了上一节中所提到的规则。</p>
<p>现在，要真正运行 Gazelle，我们需要将以下代码添加到我们的主<code v-pre>BUILD</code>文件中：</p>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line">load<span class="token punctuation">(</span><span class="token string">"@bazel_gazelle//:def.bzl"</span><span class="token punctuation">,</span> <span class="token string">"gazelle"</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># gazelle:prefix github.com/aler9/rtsp-simple-server </span></span>
<span class="line">gazelle<span class="token punctuation">(</span>name <span class="token operator">=</span> <span class="token string">"gazelle"</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>gazelle:prefix</code>注释后面的路径是整个项目所使用的 Go 导入路径。例如，<code v-pre>main.go</code>中有以下包的导入：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre v-pre><code><span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">    <span class="token string">"os"</span></span>
<span class="line">    <span class="token string">"github.com/aler9/rtsp-simple-server/internal/core"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至此，我们终于可以真正运行Gazelle，让它<code v-pre>BUILD</code>为我们的项目生成文件了。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">bazel run //:gazelle</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>之后，我们应该<code v-pre>BUILD</code>自动生成项目的所有文件：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">git</span> status</span>
<span class="line"></span>
<span class="line">On branch main</span>
<span class="line">Your branch is up to <span class="token function">date</span> with <span class="token string">'origin/main'</span><span class="token builtin class-name">.</span></span>
<span class="line"></span>
<span class="line">Untracked files:</span>
<span class="line">  <span class="token punctuation">(</span>use <span class="token string">"git add &lt;file>..."</span> to include <span class="token keyword">in</span> what will be committed<span class="token punctuation">)</span></span>
<span class="line"> BUILD</span>
<span class="line"> WORKSPACE</span>
<span class="line"> bazel-bin</span>
<span class="line"> bazel-out</span>
<span class="line"> bazel-test</span>
<span class="line"> bazel-testlogs</span>
<span class="line"> internal/aac/BUILD.bazel</span>
<span class="line"> internal/conf/BUILD.bazel</span>
<span class="line"> internal/confenv/BUILD.bazel</span>
<span class="line"> internal/confwatcher/BUILD.bazel</span>
<span class="line"> internal/core/BUILD.bazel</span>
<span class="line"> internal/externalcmd/BUILD.bazel</span>
<span class="line"> internal/h264/BUILD.bazel</span>
<span class="line"> internal/hls/BUILD.bazel</span>
<span class="line"> internal/logger/BUILD.bazel</span>
<span class="line"> internal/rlimit/BUILD.bazel</span>
<span class="line"> internal/rtcpsenderset/BUILD.bazel</span>
<span class="line"> internal/rtmp/BUILD.bazel</span>
<span class="line">nothing added to commit but untracked files present <span class="token punctuation">(</span>use <span class="token string">"git add"</span> to track<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是，如果您尝试使用<code v-pre>bazel build //...</code>命令构建项目，实际上您会看到许多关于未定义代码库的错误。这是因为我们仍然缺少项目依赖项的定义。然而，Gazelle 连这件事也可以为我们办好（<code v-pre>to_macro</code>参数是可选的）：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">bazel run //:gazelle -- update-repos <span class="token parameter variable">-from_file</span><span class="token operator">=</span>go.mod <span class="token parameter variable">-to_macro</span><span class="token operator">=</span>deps.bzl%go_dependencies</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>此命令将生成一个文件名为<code v-pre>deps.bzl</code>的新文件（如果我们在<code v-pre>WORKSPACE</code>中有使用<code v-pre>repository_macro</code>指令定义过，那么我们省略该<code v-pre>to_macro</code>指令），加载该文件，以导入构建项目所需的所有代码库。</p>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line">load<span class="token punctuation">(</span><span class="token string">"@bazel_gazelle//:deps.bzl"</span><span class="token punctuation">,</span> <span class="token string">"go_repository"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">def</span> <span class="token function">go_dependencies</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">    go_repository<span class="token punctuation">(</span></span>
<span class="line">        name <span class="token operator">=</span> <span class="token string">"com_github_alecthomas_template"</span><span class="token punctuation">,</span></span>
<span class="line">        importpath <span class="token operator">=</span> <span class="token string">"github.com/alecthomas/template"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token builtin">sum</span> <span class="token operator">=</span> <span class="token string">"h1:JYp7IbQjafoB+tBA3gMyHYHrpOtNuDiK/uB5uXxq5wM="</span><span class="token punctuation">,</span></span>
<span class="line">        version <span class="token operator">=</span> <span class="token string">"v0.0.0-20190718012654-fb15b899a751"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line">    go_repository<span class="token punctuation">(</span></span>
<span class="line">        name <span class="token operator">=</span> <span class="token string">"com_github_alecthomas_units"</span><span class="token punctuation">,</span></span>
<span class="line">        importpath <span class="token operator">=</span> <span class="token string">"github.com/alecthomas/units"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token builtin">sum</span> <span class="token operator">=</span> <span class="token string">"h1:UQZhZ2O0vMHr2cI+DC1Mbh0TJxzA3RcLoMsFw+aXw7E="</span><span class="token punctuation">,</span></span>
<span class="line">        version <span class="token operator">=</span> <span class="token string">"v0.0.0-20190924025748-f65c72e2690d"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line">    go_repository<span class="token punctuation">(</span></span>
<span class="line">        name <span class="token operator">=</span> <span class="token string">"com_github_aler9_gortsplib"</span><span class="token punctuation">,</span></span>
<span class="line">        importpath <span class="token operator">=</span> <span class="token string">"github.com/aler9/gortsplib"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token builtin">sum</span> <span class="token operator">=</span> <span class="token string">"h1:Bf0hzdN1jUWsb5Mzezq1pd18EIBeKXxk5clIpHZJ1Lk="</span><span class="token punctuation">,</span></span>
<span class="line">        version <span class="token operator">=</span> <span class="token string">"v0.0.0-20210724151831-dae5a1f04033"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line">    go_repository<span class="token punctuation">(</span></span>
<span class="line"><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这个代码库里，我实际上遇到了一个小问题。构建仍然是失败的，因为它导入的<code v-pre>org_golang_x_tools</code>被错误地推断为依赖项（通过从<code v-pre>deps.bzl</code>中删除它来修复这个问题）。您可以在我的项目分支：<a href="https://github.com/HappyCerberus/rtsp-simple-server" target="_blank" rel="noopener noreferrer">https://github.com/HappyCerberus/rtsp-simple-server</a>上看到<code v-pre>rtsp-simple-server</code>的最终结果。</p>
<p>您可以在后续继续使用 Gazelle 来管理依赖项，这也是您可以将代码库引入基于 Bazel 的项目而无需实际转换它的方法：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">bazel run //:gazelle -- update-repos github.com/some/repo</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="密封测试-hermetic-tests" tabindex="-1"><a class="header-anchor" href="#密封测试-hermetic-tests"><span>密封测试（Hermetic tests）</span></a></h2>
<p>您可能会遇到的最后一个问题是密封测试。如果您看到测试因访问被拒绝、文件未找到或操作不允许失败而失败，那是因为 Bazel 强制执行密封测试。这意味着每个测试都必须完全独立并且独立于任何其他测试。</p>
<p>对于单元测试，任何文件都需要作为测试的依赖项提供并通过运行文件机制访问（<a href="https://github.com/bazelbuild/rules_go/blob/master/go/tools/bazel/runfiles.go" target="_blank" rel="noopener noreferrer">https://github.com/bazelbuild/rules_go/blob/master/go/tools/bazel/runfiles.go</a>）。</p>
<p>环境变量中提供了每个测试的临时目录，您将使用<code v-pre>TEST_TMPDIR</code>而不是传统的<code v-pre>os.TempDir()</code>函数。</p>
<p>密封集成和系统测试需要从一开始就仔细设计，因此转换现有的此类测试可能很棘手。遗憾的是，我在这里没有放之四海而皆准的建议。</p>
<p>虽然将您的测试转换为密封测试可能很烦人，但这是一项值得的努力，它将为您带来更好的测试可重复性和更低的易碎性。</p>
<h2 id="感谢您阅读" tabindex="-1"><a class="header-anchor" href="#感谢您阅读"><span>感谢您阅读</span></a></h2>
<p>感谢您阅读本文。你喜欢吗？</p>
<p>我还在 YouTube 上发布视频：<a href="https://youtube.com/c/simontoth" target="_blank" rel="noopener noreferrer">https://youtube.com/c/simontoth</a></p>
<p>如果您想聊天，请在 Twitter <code v-pre>@SimonToth83</code> 或 LinkedIn <a href="https://linkedin.com/in/simontoth" target="_blank" rel="noopener noreferrer">https://linkedin.com/in/simontoth</a>上联系我。</p>
<h2 id="原文" tabindex="-1"><a class="header-anchor" href="#原文"><span>原文</span></a></h2>
<p>翻译自：<a href="https://medium.com/@simontoth/golang-with-bazel-2b5310d4ce48" target="_blank" rel="noopener noreferrer">Golang With Bazel</a></p>
</div></template>



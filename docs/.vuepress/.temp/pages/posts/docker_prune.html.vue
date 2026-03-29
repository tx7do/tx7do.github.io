<template><div><h1 id="docker修剪未使用对象" tabindex="-1"><a class="header-anchor" href="#docker修剪未使用对象"><span>Docker修剪未使用对象</span></a></h1>
<p>Docker 采用保守的方法来清理未使用的对象，例如镜像(Image)、容器(Container)、数据卷(volume)和网络(Network)。也就是说，除非您明确告诉 Docker 这样做，否则每个对象都永远不会被删除。结果导致了 Docker 最终使用了大量的磁盘空间。对于每种类型的对象，Docker 都提供了一个 prune（删除）命令。此外，您可以一次清理多个对象类型。本主题介绍如何使用每个命令。</p>
<h2 id="镜像-image-修剪" tabindex="-1"><a class="header-anchor" href="#镜像-image-修剪"><span>镜像(Image)修剪</span></a></h2>
<p><code v-pre>docker image prune</code>该命令可以清理未使用的镜像。默认情况下，该命令仅删除挂起的镜像。挂起的镜像是没有标签且不被其他容器引用的镜像。要删除挂起的镜像，只需要键入：<code v-pre>docker image prune</code></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">$ <span class="token function">docker</span> image prune</span>
<span class="line"></span>
<span class="line">WARNING<span class="token operator">!</span> This will remove all dangling images.</span>
<span class="line">Are you sure you want to continue? <span class="token punctuation">[</span>y/N<span class="token punctuation">]</span> y</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>加<code v-pre>--a</code>参数，可以删除掉所有未使用的镜像。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">$ <span class="token function">docker</span> image prune <span class="token parameter variable">-a</span></span>
<span class="line"></span>
<span class="line">WARNING<span class="token operator">!</span> This will remove all images without at least one container associated to them.</span>
<span class="line">Are you sure you want to continue? <span class="token punctuation">[</span>y/N<span class="token punctuation">]</span> y</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>默认情况下，它会询问您是否要继续。要跳过此检查，请使用<code v-pre>-f</code>或<code v-pre>--force</code>参数。</p>
<p>您可以使用带有<code v-pre>--filter</code>参数的过滤表达式来选择性删除不需要的镜像。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">$ <span class="token function">docker</span> image prune <span class="token parameter variable">-a</span> <span class="token parameter variable">--filter</span> <span class="token string">"until=24h"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>还可以使用其他过滤表达式。相关的更多示例，请参阅 <a href="https://docs.docker.jp/engine/reference/commandline/image_prune.html" target="_blank" rel="noopener noreferrer">docker image prune 参考</a>。</p>
<h2 id="容器-container-修剪" tabindex="-1"><a class="header-anchor" href="#容器-container-修剪"><span>容器(Container)修剪</span></a></h2>
<p>当您停止容器时，它不会自动删除，除非您使用<code v-pre>--rm</code>参数来启动它。所以，当您使用<code v-pre>docker ps -a</code>命令查看 Docker 主机上的所有容器（包括已停止的容器），您会对容器的数量感到惊讶。尤其是在开发系统上！停止的容器中的Overlay将会继续消耗磁盘空间。这时候，请使用<code v-pre>docker container prune</code>命令来清理它们。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">$ <span class="token function">docker</span> container prune</span>
<span class="line"></span>
<span class="line">WARNING<span class="token operator">!</span> This will remove all stopped containers.</span>
<span class="line">Are you sure you want to continue? <span class="token punctuation">[</span>y/N<span class="token punctuation">]</span> y</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="数据卷-volume-修剪" tabindex="-1"><a class="header-anchor" href="#数据卷-volume-修剪"><span>数据卷(volume)修剪</span></a></h2>
<p>数据卷由一个或多个容器使用，并占用 Docker 主机上的磁盘空间。删除卷会使得数据破坏，所以它并不会自动删除。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">$ <span class="token function">docker</span> volume prune</span>
<span class="line"></span>
<span class="line">WARNING<span class="token operator">!</span> This will remove all volumes not used by at least one container.</span>
<span class="line">Are you sure you want to continue? <span class="token punctuation">[</span>y/N<span class="token punctuation">]</span> y</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>默认情况下，它会显示确认提示。如果您不想使用此提示，请使用<code v-pre>-f</code>或<code v-pre>--force</code>标志。</p>
<p>默认情况下，所有未使用的卷都会被删除。</p>
<p><code v-pre>--filter</code>参数可以用来限制删除的范围。例如，以下命令中的<code v-pre>keep</code>意味着将仅删除未标记的卷。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">$ <span class="token function">docker</span> volume prune <span class="token parameter variable">--filter</span> <span class="token string">"label!=keep"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>还可以使用其他过滤表达式。相关的更多示例，请参阅<a href="">docker volume prune 参考</a>。</p>
<h2 id="网络-network-修剪" tabindex="-1"><a class="header-anchor" href="#网络-network-修剪"><span>网络(Network)修剪</span></a></h2>
<p>Docker 网络不消耗磁盘空间，但它会创建iptables防火墙规则、桥接网络设备和路由表条目。要清理它们，请使用<code v-pre>docker network prune</code>命令从容器中清理未使用的网络。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">$ <span class="token function">docker</span> network prune</span>
<span class="line"></span>
<span class="line">WARNING<span class="token operator">!</span> This will remove all networks not used by at least one container.</span>
<span class="line">Are you sure you want to continue? <span class="token punctuation">[</span>y/N<span class="token punctuation">]</span> y</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>默认情况下，它会显示确认提示。如果您不想使用此提示，请使用<code v-pre>-f</code>或<code v-pre>--force</code>参数。</p>
<p>默认情况下，所有未使用的网络都会被删除。</p>
<p><code v-pre>--filter</code>参数可以用来限制删除的范围。例如，以下命令将仅删除超过 24 小时的网络。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">$ <span class="token function">docker</span> network prune <span class="token parameter variable">--filter</span> <span class="token string">"until=24h"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>您还可以使用其他过滤表达式。相关的更多示例，请参阅<a href="https://docs.docker.jp/engine/reference/commandline/network_prune.html" target="_blank" rel="noopener noreferrer">docker network prune 参考</a>。</p>
<h2 id="修剪所有" tabindex="-1"><a class="header-anchor" href="#修剪所有"><span>修剪所有</span></a></h2>
<p><code v-pre>docker system prune</code>命令是修剪镜像、容器和网络的快捷方式。默认情况下不会删除卷，因此您必须在<code v-pre>docker system prune</code>命令当中使用<code v-pre>--volumes</code>来删除它们。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">$ <span class="token function">docker</span> system prune</span>
<span class="line"></span>
<span class="line">WARNING<span class="token operator">!</span> This will remove:</span>
<span class="line">        - all stopped containers</span>
<span class="line">        - all networks not used by at least one container</span>
<span class="line">        - all dangling images</span>
<span class="line">        - all build cache</span>
<span class="line">Are you sure you want to continue? <span class="token punctuation">[</span>y/N<span class="token punctuation">]</span> y</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果您还想删除该卷，请使用<code v-pre>--volumes</code>参数。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">$ <span class="token function">docker</span> system prune <span class="token parameter variable">--volumes</span></span>
<span class="line"></span>
<span class="line">WARNING<span class="token operator">!</span> This will remove:</span>
<span class="line">        - all stopped containers</span>
<span class="line">        - all networks not used by at least one container</span>
<span class="line">        - all volumes not used by at least one container</span>
<span class="line">        - all dangling images</span>
<span class="line">        - all build cache</span>
<span class="line">Are you sure you want to continue? <span class="token punctuation">[</span>y/N<span class="token punctuation">]</span> y</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>默认情况下，它会显示确认提示。如果您不想使用此提示，请使用<code v-pre>-f</code>或<code v-pre>--force</code>参数。</p>
<h2 id="原文地址" tabindex="-1"><a class="header-anchor" href="#原文地址"><span>原文地址</span></a></h2>
<p><a href="https://docs.docker.jp/config/pruning.html" target="_blank" rel="noopener noreferrer">使用していない Docker オブジェクトの削除（prune）</a></p>
</div></template>



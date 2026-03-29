<template><div><h1 id="gowind-admin-风行-—-开箱即用的企业级全栈中后台框架-用户表从简单到租户的演进" tabindex="-1"><a class="header-anchor" href="#gowind-admin-风行-—-开箱即用的企业级全栈中后台框架-用户表从简单到租户的演进"><span>GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：用户表从简单到租户的演进</span></a></h1>
<p>先解决有没有，再解决好不好</p>
<h2 id="极简user" tabindex="-1"><a class="header-anchor" href="#极简user"><span>极简User</span></a></h2>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> users <span class="token punctuation">(</span></span>
<span class="line">    id <span class="token keyword">BIGINT</span> <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span><span class="token punctuation">,</span></span>
<span class="line">    authority <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">50</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    password <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>密码和权限都简单处理，一股脑全部都放在<code v-pre>users</code>表中。</p>
<h2 id="分离出usercredential表" tabindex="-1"><a class="header-anchor" href="#分离出usercredential表"><span>分离出UserCredential表</span></a></h2>
<p>如果只是密码登录，按照之前的设计倒是够用，可是现在需要支持微信、飞书登录，这时候就不够用了。</p>
<h2 id="增加role表" tabindex="-1"><a class="header-anchor" href="#增加role表"><span>增加Role表</span></a></h2>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> roles <span class="token punctuation">(</span></span>
<span class="line">  code <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">50</span><span class="token punctuation">)</span> <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span><span class="token punctuation">,</span></span>
<span class="line">  display_name <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">  description <span class="token keyword">TEXT</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="增加organization、department表" tabindex="-1"><a class="header-anchor" href="#增加organization、department表"><span>增加Organization、Department表</span></a></h2>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h2 id="增加tenant表" tabindex="-1"><a class="header-anchor" href="#增加tenant表"><span>增加Tenant表</span></a></h2>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h2 id="分离membership、orgunit表" tabindex="-1"><a class="header-anchor" href="#分离membership、orgunit表"><span>分离Membership、OrgUnit表</span></a></h2>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> memberships <span class="token punctuation">(</span></span>
<span class="line">  id <span class="token keyword">BIGINT</span> <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span><span class="token punctuation">,</span></span>
<span class="line">  user_id <span class="token keyword">BIGINT</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span><span class="token punctuation">,</span></span>
<span class="line">  tenant_id <span class="token keyword">BIGINT</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token number">0</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token keyword">status</span> <span class="token keyword">TINYINT</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span> <span class="token keyword">DEFAULT</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>



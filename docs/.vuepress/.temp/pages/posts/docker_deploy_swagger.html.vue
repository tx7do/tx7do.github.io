<template><div><h1 id="用docker轻松搭建swagger环境" tabindex="-1"><a class="header-anchor" href="#用docker轻松搭建swagger环境"><span>用Docker轻松搭建Swagger环境</span></a></h1>
<h2 id="概要" tabindex="-1"><a class="header-anchor" href="#概要"><span>概要</span></a></h2>
<p>我将介绍如何构建运行在 Docker 上的 Swagger 环境。</p>
<h2 id="成果" tabindex="-1"><a class="header-anchor" href="#成果"><span>成果</span></a></h2>
<h3 id="swagger-editor" tabindex="-1"><a class="header-anchor" href="#swagger-editor"><span>Swagger Editor</span></a></h3>
<p>网页的左侧是编辑器，右侧是Swagger UI，可以实时查看notation和查看定义文档。
如果将稍后描述的示例复制并粘贴到左侧，结果将显示在右侧，所以请尝试一下。</p>
<p><img src="/assets/images/swagger/swagger_editor.png" alt="swagger_editor"></p>
<h3 id="swagger-ui" tabindex="-1"><a class="header-anchor" href="#swagger-ui"><span>Swagger UI</span></a></h3>
<p><img src="/assets/images/swagger/swagger_ui.png" alt="swagger_ui"></p>
<h3 id="api" tabindex="-1"><a class="header-anchor" href="#api"><span>API</span></a></h3>
<p>访问网址：<a href="http://localhost:8003/users" target="_blank" rel="noopener noreferrer">http://localhost:8003/users</a></p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">[</span><span class="token punctuation">{</span><span class="token property">"id"</span><span class="token operator">:</span><span class="token number">100</span><span class="token punctuation">,</span><span class="token property">"name"</span><span class="token operator">:</span><span class="token string">"Taro"</span><span class="token punctuation">,</span><span class="token property">"status"</span><span class="token operator">:</span><span class="token string">"pending"</span><span class="token punctuation">}</span><span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="测试环境" tabindex="-1"><a class="header-anchor" href="#测试环境"><span>测试环境</span></a></h2>
<ul>
<li>macOS Big Sur 11.4</li>
<li>Docker 20.10.7</li>
<li>Docker Compose version v2.0.0-beta.6</li>
</ul>
<h2 id="所需文件" tabindex="-1"><a class="header-anchor" href="#所需文件"><span>所需文件</span></a></h2>
<p>这次只准备了以下2个文件！</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">.</span></span>
<span class="line">├── api</span>
<span class="line">│   └── openapi.yaml</span>
<span class="line">└── docker-compose.yml</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="步骤" tabindex="-1"><a class="header-anchor" href="#步骤"><span>步骤</span></a></h2>
<h3 id="_1-创建docker-compose-yml" tabindex="-1"><a class="header-anchor" href="#_1-创建docker-compose-yml"><span>1.创建docker-compose.yml</span></a></h3>
<p>这一次，我们将为 swagger 编辑器、UI 和 API 模拟准备容器。</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">'3.9'</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">swagger-editor</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> swaggerapi/swagger<span class="token punctuation">-</span>editor</span>
<span class="line">    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> <span class="token string">"swagger-editor"</span></span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"8001:8080"</span></span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">swagger-ui</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> swaggerapi/swagger<span class="token punctuation">-</span>ui</span>
<span class="line">    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> <span class="token string">"swagger-ui"</span></span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"8002:8080"</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> ./api/openapi.yaml<span class="token punctuation">:</span>/openapi.yaml</span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">SWAGGER_JSON</span><span class="token punctuation">:</span> /openapi.yaml</span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">swagger-api</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> stoplight/prism<span class="token punctuation">:</span><span class="token number">3</span></span>
<span class="line">    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> <span class="token string">"swagger-api"</span></span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"8003:4010"</span></span>
<span class="line">    <span class="token key atrule">command</span><span class="token punctuation">:</span> mock <span class="token punctuation">-</span>h 0.0.0.0 /openapi.yaml</span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> ./api/openapi.yaml<span class="token punctuation">:</span>/openapi.yaml</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-创建openapi-yaml" tabindex="-1"><a class="header-anchor" href="#_2-创建openapi-yaml"><span>2.创建openapi.yaml</span></a></h3>
<p>为示例准备 API 设计文档。
基于此</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">openapi</span><span class="token punctuation">:</span> 3.0.0</span>
<span class="line"><span class="token key atrule">info</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">version</span><span class="token punctuation">:</span> 1.0.0</span>
<span class="line">  <span class="token key atrule">title</span><span class="token punctuation">:</span> Sample API</span>
<span class="line">  <span class="token key atrule">description</span><span class="token punctuation">:</span> <span class="token punctuation">></span><span class="token punctuation">-</span></span>
<span class="line">    A sample API that uses a sample<span class="token punctuation">-</span>site as an example to demonstrate features in</span>
<span class="line">    the OpenAPI 3.0 specification</span>
<span class="line"><span class="token key atrule">servers</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">url</span><span class="token punctuation">:</span> <span class="token string">'http://localhost:8003'</span></span>
<span class="line"><span class="token key atrule">paths</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">/users</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">get</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">description</span><span class="token punctuation">:</span> <span class="token punctuation">></span><span class="token scalar string"></span>
<span class="line">        Returns all users</span></span>
<span class="line">      <span class="token key atrule">operationId</span><span class="token punctuation">:</span> findUsers</span>
<span class="line">      <span class="token key atrule">parameters</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> tags</span>
<span class="line">          <span class="token key atrule">in</span><span class="token punctuation">:</span> query</span>
<span class="line">          <span class="token key atrule">description</span><span class="token punctuation">:</span> tags to filter by</span>
<span class="line">          <span class="token key atrule">required</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line">          <span class="token key atrule">style</span><span class="token punctuation">:</span> form</span>
<span class="line">          <span class="token key atrule">schema</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">type</span><span class="token punctuation">:</span> array</span>
<span class="line">            <span class="token key atrule">items</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">type</span><span class="token punctuation">:</span> string</span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> limit</span>
<span class="line">          <span class="token key atrule">in</span><span class="token punctuation">:</span> query</span>
<span class="line">          <span class="token key atrule">description</span><span class="token punctuation">:</span> maximum number of results to return</span>
<span class="line">          <span class="token key atrule">required</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line">          <span class="token key atrule">schema</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">type</span><span class="token punctuation">:</span> integer</span>
<span class="line">            <span class="token key atrule">format</span><span class="token punctuation">:</span> int32</span>
<span class="line">      <span class="token key atrule">responses</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">'200'</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">description</span><span class="token punctuation">:</span> user response</span>
<span class="line">          <span class="token key atrule">content</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">application/json</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">schema</span><span class="token punctuation">:</span></span>
<span class="line">                <span class="token key atrule">type</span><span class="token punctuation">:</span> array</span>
<span class="line">                <span class="token key atrule">items</span><span class="token punctuation">:</span></span>
<span class="line">                  <span class="token key atrule">$ref</span><span class="token punctuation">:</span> <span class="token string">'#/components/schemas/User'</span></span>
<span class="line">        <span class="token key atrule">default</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">description</span><span class="token punctuation">:</span> unexpected error</span>
<span class="line">          <span class="token key atrule">content</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">application/json</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">schema</span><span class="token punctuation">:</span></span>
<span class="line">                <span class="token key atrule">$ref</span><span class="token punctuation">:</span> <span class="token string">'#/components/schemas/Error'</span></span>
<span class="line"><span class="token key atrule">components</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">schemas</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">User</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">type</span><span class="token punctuation">:</span> <span class="token string">"object"</span></span>
<span class="line">      <span class="token key atrule">required</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token string">"name"</span></span>
<span class="line">      <span class="token key atrule">properties</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">id</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">type</span><span class="token punctuation">:</span> <span class="token string">"integer"</span></span>
<span class="line">          <span class="token key atrule">format</span><span class="token punctuation">:</span> <span class="token string">"int64"</span></span>
<span class="line">          <span class="token key atrule">example</span><span class="token punctuation">:</span> <span class="token number">100</span></span>
<span class="line">        <span class="token key atrule">name</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">type</span><span class="token punctuation">:</span> <span class="token string">"string"</span></span>
<span class="line">          <span class="token key atrule">example</span><span class="token punctuation">:</span> <span class="token string">"Taro"</span></span>
<span class="line">        <span class="token key atrule">status</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">type</span><span class="token punctuation">:</span> <span class="token string">"string"</span></span>
<span class="line">          <span class="token key atrule">description</span><span class="token punctuation">:</span> <span class="token string">"user status"</span></span>
<span class="line">          <span class="token key atrule">enum</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token punctuation">-</span> <span class="token string">"pending"</span></span>
<span class="line">            <span class="token punctuation">-</span> <span class="token string">"active"</span></span>
<span class="line">            <span class="token punctuation">-</span> <span class="token string">"inactive"</span></span>
<span class="line">    <span class="token key atrule">Error</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">type</span><span class="token punctuation">:</span> <span class="token string">"object"</span></span>
<span class="line">      <span class="token key atrule">properties</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">code</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">type</span><span class="token punctuation">:</span> <span class="token string">"integer"</span></span>
<span class="line">          <span class="token key atrule">format</span><span class="token punctuation">:</span> <span class="token string">"int32"</span></span>
<span class="line">        <span class="token key atrule">type</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">type</span><span class="token punctuation">:</span> <span class="token string">"string"</span></span>
<span class="line">        <span class="token key atrule">message</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">type</span><span class="token punctuation">:</span> <span class="token string">"string"</span></span>
<span class="line"><span class="token key atrule">externalDocs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">description</span><span class="token punctuation">:</span> <span class="token string">"Find out more about Swagger"</span></span>
<span class="line">  <span class="token key atrule">url</span><span class="token punctuation">:</span> <span class="token string">"http://swagger.io"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="启动" tabindex="-1"><a class="header-anchor" href="#启动"><span>启动</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker-compose</span> up <span class="token parameter variable">-d</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>确认用URL</p>
<table>
<thead>
<tr>
<th>名称</th>
<th>网址</th>
</tr>
</thead>
<tbody>
<tr>
<td>Swagger Editor</td>
<td>http://localhost:8001/</td>
</tr>
<tr>
<td>Swagger UI</td>
<td>http://localhost:8002/</td>
</tr>
<tr>
<td>Swagger API 模拟访问</td>
<td>http://localhost:8003/users</td>
</tr>
</tbody>
</table>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://qiita.com/teinen_qiita/items/e440ca7b1b52ec918f1b#components" target="_blank" rel="noopener noreferrer">OpenAPI (Swagger) 超入門</a></li>
<li><a href="https://system.blog.uuum.jp/entry/2020/02/26/185753" target="_blank" rel="noopener noreferrer">Swagger OpenAPIでAPI Referenceを書く</a></li>
</ul>
<h2 id="原文" tabindex="-1"><a class="header-anchor" href="#原文"><span>原文</span></a></h2>
<p>翻译自：<a href="https://qiita.com/A-Kira/items/3d17396c7cc98873e29d" target="_blank" rel="noopener noreferrer">DockerでSwagger環境簡単構築！</a></p>
</div></template>



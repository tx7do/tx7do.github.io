<template><div><h1 id="gowind-admin-风行-—-开箱即用的企业级全栈中后台框架-如何进行docker部署后端" tabindex="-1"><a class="header-anchor" href="#gowind-admin-风行-—-开箱即用的企业级全栈中后台框架-如何进行docker部署后端"><span>GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：如何进行Docker部署后端</span></a></h1>
<p>Docker 部署具备环境一致性、可移植性强、部署高效等优势，是企业级应用落地的优选方案。风行·GoWind Admin 后端已将所有Docker部署相关操作封装至 Makefile 中，实现极简部署体验。本文将详细介绍两种核心部署方式、服务增减时的配置调整方法，助力开发者快速完成后端服务的容器化部署。</p>
<h2 id="一、部署前提" tabindex="-1"><a class="header-anchor" href="#一、部署前提"><span>一、部署前提</span></a></h2>
<ul>
<li>本地环境已安装 Docker（建议版本 20.10+）及 Docker Compose（建议版本 2.10+），可通过 <code v-pre>docker -v``、docker compose version</code> 命令验证安装。</li>
<li>已获取 GoWind Admin 项目源码，进入后端项目根目录（即 <code v-pre>backend</code> 目录），所有部署命令均在此目录执行（特殊说明除外）。</li>
<li>确保部署环境网络通畅，可正常拉取 Docker Hub 公共镜像（如 postgres、redis 等依赖组件）。</li>
</ul>
<h2 id="二、核心部署方式" tabindex="-1"><a class="header-anchor" href="#二、核心部署方式"><span>二、核心部署方式</span></a></h2>
<h3 id="方式一-使用-docker-compose-一键部署-推荐-全量服务" tabindex="-1"><a class="header-anchor" href="#方式一-使用-docker-compose-一键部署-推荐-全量服务"><span>方式一：使用 docker-compose 一键部署（推荐，全量服务）</span></a></h3>
<p>该方式通过 <code v-pre>docker-compose</code> 编排所有依赖组件（postgres、redis、minio、consul 等）和 GoWind Admin 后端服务，实现“一键部署全量服务”，无需手动配置依赖关联，适合生产环境全量部署或开发环境快速搭建。</p>
<h4 id="_1-部署命令" tabindex="-1"><a class="header-anchor" href="#_1-部署命令"><span>1. 部署命令</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">make</span> <span class="token function">docker-compose</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="_2-命令执行逻辑" tabindex="-1"><a class="header-anchor" href="#_2-命令执行逻辑"><span>2. 命令执行逻辑</span></a></h4>
<ul>
<li>自动解析项目根目录下的 docker-compose.yaml 配置文件，拉取配置中声明的所有依赖组件镜像。</li>
<li>基于项目内的 Dockerfile 构建 GoWind Admin 各后端服务镜像（如 admin-service 等）。</li>
<li>按依赖顺序启动所有容器（先启动 postgres、redis 等中间件，再启动后端业务服务），并自动配置容器间网络互联。</li>
</ul>
<h4 id="_3-验证部署" tabindex="-1"><a class="header-anchor" href="#_3-验证部署"><span>3. 验证部署</span></a></h4>
<p>部署完成后，执行以下命令查看容器运行状态：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> compose <span class="token function">ps</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>若所有容器状态均为 Up，则部署成功。可进一步通过后端 Swagger 文档地址（<code v-pre>http://部署主机IP:7788/docs/</code>）验证服务可用性。</p>
<h3 id="方式二-使用-docker-run-单独部署-灵活部署-适合调试-增量部署" tabindex="-1"><a class="header-anchor" href="#方式二-使用-docker-run-单独部署-灵活部署-适合调试-增量部署"><span>方式二：使用 docker run 单独部署（灵活部署，适合调试/增量部署）</span></a></h3>
<p>该方式先通过 Makefile 构建服务镜像，再通过<code v-pre>docker run</code> 命令单独启动单个服务，适合开发调试、增量部署单个服务或自定义部署拓扑的场景。</p>
<h4 id="_1-第一步-构建服务镜像" tabindex="-1"><a class="header-anchor" href="#_1-第一步-构建服务镜像"><span>1. 第一步：构建服务镜像</span></a></h4>
<p>通过 make docker 命令构建镜像，支持两种构建场景，按需选择：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 场景1：在后端项目根目录执行 → 构建所有后端服务的镜像（如 admin-service、gateway-service 等）</span></span>
<span class="line"><span class="token function">make</span> <span class="token function">docker</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 场景2：在单个服务目录执行（路径：app/{服务名}/service）→ 仅构建当前服务的镜像</span></span>
<span class="line"><span class="token comment"># 示例：仅构建 admin 服务镜像</span></span>
<span class="line"><span class="token builtin class-name">cd</span> app/admin/service</span>
<span class="line"><span class="token function">make</span> <span class="token function">docker</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-第二步-单独启动服务容器" tabindex="-1"><a class="header-anchor" href="#_2-第二步-单独启动服务容器"><span>2. 第二步：单独启动服务容器</span></a></h4>
<p>使用<code v-pre>docker run</code> 命令启动构建好的镜像，需指定网络、端口映射、中间件链接等参数。以下是 <code v-pre>admin-service</code>（核心后台管理服务）的启动示例：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-itd</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> admin-server <span class="token punctuation">\</span>          <span class="token comment"># 容器名称，自定义，便于识别</span></span>
<span class="line">  <span class="token parameter variable">--network</span><span class="token operator">=</span>app-tier <span class="token punctuation">\</span>           <span class="token comment"># 加入自定义网络（需提前创建，或使用已存在的网络）</span></span>
<span class="line">  <span class="token parameter variable">-p</span> <span class="token number">7788</span>:7788 <span class="token punctuation">\</span>                 <span class="token comment"># 端口映射：主机端口:容器端口（容器内默认 7788，可通过配置修改）</span></span>
<span class="line">  <span class="token parameter variable">--link</span> postgres:postgres <span class="token punctuation">\</span>     <span class="token comment"># 链接 postgres 容器（格式：--link 中间件容器名:容器别名）</span></span>
<span class="line">  <span class="token parameter variable">--link</span> redis:redis <span class="token punctuation">\</span>           <span class="token comment"># 链接 redis 容器</span></span>
<span class="line">  <span class="token parameter variable">--link</span> consul:consul <span class="token punctuation">\</span>         <span class="token comment"># 链接 consul 容器</span></span>
<span class="line">  go-wind-admin/admin-service:latest  <span class="token comment"># 镜像名称（构建时自动生成的格式）</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-关键注意事项-中间件地址配置" tabindex="-1"><a class="header-anchor" href="#_3-关键注意事项-中间件地址配置"><span>3. 关键注意事项：中间件地址配置</span></a></h4>
<p>若微服务配置文件中，中间件（postgres、redis 等）的地址填写为 <code v-pre>127.0.0.1</code> 或<code v-pre>localhost</code>，启动容器后会出现“无法连接中间件”的问题。原因是容器内的 <code v-pre>localhost</code> 指向容器自身，而非主机或中间件容器。
解决方案：</p>
<ul>
<li>修改微服务配置文件：将中间件地址改为对应的中间件容器名称（如 postgres、redis）。</li>
<li>启动容器时添加 <code v-pre>--link</code> 参数：将业务服务容器与中间件容器链接，Docker 会自动在业务容器的 hosts 文件中添加中间件容器名的映射，实现直接访问。</li>
</ul>
<h2 id="三、服务增减时的-docker-配置调整" tabindex="-1"><a class="header-anchor" href="#三、服务增减时的-docker-配置调整"><span>三、服务增减时的 Docker 配置调整</span></a></h2>
<p>GoWind Admin 对 Docker 配置做了高度适配，多数情况下无需修改 Dockerfile，仅需根据“是否使用 docker-compose 部署”调整对应配置文件。</p>
<h3 id="_1-无需修改-dockerfile-的原因" tabindex="-1"><a class="header-anchor" href="#_1-无需修改-dockerfile-的原因"><span>1. 无需修改 Dockerfile 的原因</span></a></h3>
<p>项目内置的 Dockerfile 采用通用化设计，通过构建参数（如 <code v-pre>SERVICE_NAME</code>、<code v-pre>APP_VERSION</code>）动态适配不同服务，Makefile 中的 <code v-pre>make docker</code> 命令会自动识别当前服务目录，填充对应的构建参数，因此增减服务时无需修改 Dockerfile。</p>
<h3 id="_2-使用-docker-compose-部署时的配置调整" tabindex="-1"><a class="header-anchor" href="#_2-使用-docker-compose-部署时的配置调整"><span>2. 使用 docker-compose 部署时的配置调整</span></a></h3>
<p>若通过 docker-compose 管理服务，增减服务时需修改项目根目录下的 <code v-pre>docker-compose.yaml</code> 文件，新增服务时添加对应的服务节点，删除服务时移除对应节点即可。以下是新增/修改服务的配置示例（以 admin-service 为例）：</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line">  <span class="token comment"># 服务节点名称，自定义（建议与服务名一致）</span></span>
<span class="line">  <span class="token key atrule">admin-service</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> go<span class="token punctuation">-</span>wind<span class="token punctuation">-</span>admin/admin<span class="token punctuation">-</span>service  <span class="token comment"># 镜像名称（与 make docker 构建的镜像名一致）</span></span>
<span class="line">    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always  <span class="token comment"># 容器退出时自动重启，保障服务可用性</span></span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> app<span class="token punctuation">-</span>tier  <span class="token comment"># 加入统一网络，与其他服务/中间件互联</span></span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">"7788:7788"</span>  <span class="token comment"># 端口映射：主机端口:容器端口（需确保主机端口未被占用）</span></span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span>  <span class="token comment"># 依赖的中间件/其他服务，确保启动顺序</span></span>
<span class="line">      <span class="token punctuation">-</span> postgres</span>
<span class="line">      <span class="token punctuation">-</span> redis</span>
<span class="line">      <span class="token punctuation">-</span> minio</span>
<span class="line">      <span class="token punctuation">-</span> consul</span>
<span class="line">      <span class="token punctuation">-</span> jaeger</span>
<span class="line">    <span class="token key atrule">build</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">context</span><span class="token punctuation">:</span> ./  <span class="token comment"># 构建上下文路径（项目根目录，Dockerfile 所在位置）</span></span>
<span class="line">      <span class="token key atrule">args</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">SERVICE_NAME</span><span class="token punctuation">:</span> admin  <span class="token comment"># 关键参数：对应服务路径 app/{SERVICE_NAME}/service 中的 SERVICE_NAME</span></span>
<span class="line">        <span class="token key atrule">APP_VERSION</span><span class="token punctuation">:</span> 1.0.0  <span class="token comment"># 应用版本，可自定义</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>配置调整核心要点</strong></p>
<ul>
<li>服务节点名称：建议与 <code v-pre>SERVICE_NAME</code> 一致，便于识别和管理。</li>
<li>ports：确保主机端口未被占用，若需修改主机端口，调整冒号前的数值（如 <code v-pre>7789:7788</code>表示主机 7789 端口映射容器 7788 端口）。</li>
<li>depends_on：按实际依赖添加中间件/服务，Docker 会优先启动依赖的容器。</li>
<li>SERVICE_NAME：必须与服务所在路径 <code v-pre>app/{SERVICE_NAME}/service</code> 中的 <code v-pre>{SERVICE_NAME}</code> 完全一致，否则无法正确构建镜像。</li>
</ul>
<h2 id="四、常见问题与解决方案" tabindex="-1"><a class="header-anchor" href="#四、常见问题与解决方案"><span>四、常见问题与解决方案</span></a></h2>
<h3 id="问题1-执行-make-docker-compose-时拉取镜像失败" tabindex="-1"><a class="header-anchor" href="#问题1-执行-make-docker-compose-时拉取镜像失败"><span>问题1：执行 make docker-compose 时拉取镜像失败</span></a></h3>
<p>解决方案：检查网络连接，若无法访问 Docker Hub，可配置 Docker 镜像加速器（如阿里云、网易云加速器）；若依赖的私有镜像，需先执行 <code v-pre>docker login</code> 登录私有镜像仓库。</p>
<h3 id="问题2-容器启动后-业务服务无法连接中间件" tabindex="-1"><a class="header-anchor" href="#问题2-容器启动后-业务服务无法连接中间件"><span>问题2：容器启动后，业务服务无法连接中间件</span></a></h3>
<p>解决方案：① 检查中间件容器是否正常运行（<code v-pre>docker ps | grep 中间件容器名</code>）；② 确认业务服务配置中的中间件地址为容器名；③ 确认容器已加入同一网络（<code v-pre>docker network inspect 网络名 查看容器列表</code>）。</p>
<h3 id="问题3-构建镜像时提示-找不到服务目录" tabindex="-1"><a class="header-anchor" href="#问题3-构建镜像时提示-找不到服务目录"><span>问题3：构建镜像时提示“找不到服务目录”</span></a></h3>
<p>解决方案：检查执行 <code v-pre>make docker</code> 的目录是否正确（项目根目录或 <code v-pre>app/{服务名}/service</code> 目录）；确认 <code v-pre>docker-compose.yaml</code> 中 <code v-pre>SERVICE_NAME</code> 与服务路径一致。</p>
<h2 id="项目源码" tabindex="-1"><a class="header-anchor" href="#项目源码"><span>项目源码</span></a></h2>
<p>获取完整项目源码，查看最新部署文档：</p>
<ul>
<li><a href="https://gitee.com/tx7do/go-wind-admin" target="_blank" rel="noopener noreferrer">go-wind-admin Gitee</a></li>
<li><a href="https://github.com/tx7do/go-wind-admin" target="_blank" rel="noopener noreferrer">go-wind-admin Github</a></li>
</ul>
</div></template>



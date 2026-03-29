<template><div><h1 id="gowind-admin-风行-—-开箱即用的企业级全栈中后台框架-后端项目结构说明" tabindex="-1"><a class="header-anchor" href="#gowind-admin-风行-—-开箱即用的企业级全栈中后台框架-后端项目结构说明"><span>GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：后端项目结构说明</span></a></h1>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">├─.docker</span>
<span class="line">│  └─compose</span>
<span class="line">├─api</span>
<span class="line">│  ├─gen</span>
<span class="line">│  │  └─go</span>
<span class="line">│  │      ├─admin</span>
<span class="line">│  │      │  └─service</span>
<span class="line">│  │      │      └─v1</span>
<span class="line">│  │      ├─file</span>
<span class="line">│  │      │  └─service</span>
<span class="line">│  │      │      └─v1</span>
<span class="line">│  │      ├─system</span>
<span class="line">│  │      │  └─service</span>
<span class="line">│  │      │      └─v1</span>
<span class="line">│  │      └─user</span>
<span class="line">│  │          └─service</span>
<span class="line">│  │              └─v1</span>
<span class="line">│  └─protos</span>
<span class="line">│      ├─admin</span>
<span class="line">│      │  └─service</span>
<span class="line">│      │      └─v1</span>
<span class="line">│      ├─file</span>
<span class="line">│      │  └─service</span>
<span class="line">│      │      └─v1</span>
<span class="line">│      ├─system</span>
<span class="line">│      │  └─service</span>
<span class="line">│      │      └─v1</span>
<span class="line">│      └─user</span>
<span class="line">│          └─service</span>
<span class="line">│              └─v1</span>
<span class="line">├─app</span>
<span class="line">│  └─admin</span>
<span class="line">│      └─service</span>
<span class="line">│          ├─cmd</span>
<span class="line">│          │  └─server</span>
<span class="line">│          │      └─assets</span>
<span class="line">│          ├─configs</span>
<span class="line">│          └─internal</span>
<span class="line">│              ├─data</span>
<span class="line">│              │  └─ent</span>
<span class="line">│              ├─server</span>
<span class="line">│              └─service</span>
<span class="line">├─pkg</span>
<span class="line">├─script</span>
<span class="line">└─sql</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol>
<li><code v-pre>.docker</code>：存放 Docker 相关配置文件</li>
<li><code v-pre>api</code>：存放 API 相关代码，API使用Protobuf定义，使用Buf进行编译管理。
<ul>
<li><code v-pre>gen</code>：存放 API 服务生成的代码，目前只有 Go 语言的代码；</li>
<li><code v-pre>protos</code>：存放 API 服务的 Protobuf的 proto 文件，它的目录结构是<code v-pre>{服务名}/service/{版本号}</code>。</li>
<li><code v-pre>buf.gen.yaml</code>：buf 配置文件，用于生成 API 服务的 Go 代码。</li>
<li><code v-pre>buf.admin.openapi.gen.yaml</code> buf 配置文件，用于生成 Admin 服务的 OpenAPI 文档。</li>
<li><code v-pre>buf.admin.typescript.gen.yaml</code> buf 配置文件，用于生成 Admin 服务的 TypeScript 代码。</li>
<li><code v-pre>buf.yaml</code> buf 配置文件。</li>
</ul>
</li>
<li><code v-pre>app</code>：存放应用服务相关代码，它的目录结构是<code v-pre>{服务名/service}</code>，目前只有 Admin 服务。
<ul>
<li><code v-pre>admin/service</code>：存放 Admin 服务相关代码
<ul>
<li><code v-pre>Makefile</code>：Makefile 文件，调用项目根目录下的<code v-pre>app.mk</code>，用于构建、运行、测试 Admin 服务。</li>
<li><code v-pre>cmd</code>：存放 Admin 服务的命令行代码
<ul>
<li><code v-pre>server</code>：存放 Admin 服务的入口代码
<ul>
<li><code v-pre>assets</code>：存放 Admin 服务的静态资源文件，现在只存放了OpenAPI的静态资源文件。</li>
</ul>
</li>
</ul>
</li>
<li><code v-pre>configs</code>：存放 Admin 服务的配置文件</li>
<li><code v-pre>internal</code>：存放 Admin 服务的内部代码，使用internal目录是为了避免被外部代码引用。
<ul>
<li><code v-pre>data</code>：存放 Admin 服务的数据访问代码
<ul>
<li><code v-pre>ent</code>：存放 Admin 服务的 数据库 Ent ORM 代码</li>
<li><code v-pre>gorm</code>：存放 Admin 服务的 数据库 GORM ORM 代码</li>
</ul>
</li>
<li><code v-pre>server</code>：存放 Admin 服务的服务端代码</li>
<li><code v-pre>service</code>：存放 Admin 服务的服务代码</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li><code v-pre>pkg</code>：存放通用代码</li>
<li><code v-pre>script</code>：存放Shell脚本代码，用于项目的构建、部署等，如果系统新装，需要执行<code v-pre>prepare_{OS}.sh</code>脚本，安装依赖软件；以及
<code v-pre>install_docker_dependences.sh</code>安装第三方Docker中间件的容器；平时就使用<code v-pre>build_install.sh</code>安装项目的服务，使用PM2进行进程管理。</li>
<li><code v-pre>sql</code>：存放 SQL 文件，里面存放了数据库的初始化 SQL 文件，以及一些测试数据的 SQL 文件。</li>
<li><code v-pre>app.mk</code>：存放应用服务使用的 Makefile 文件，它由<code v-pre>app/{服务名}/service</code>下的<code v-pre>Makefile</code>调用，用于构建、运行、测试应用服务。</li>
<li><code v-pre>Makefile</code>：项目根目录下的 Makefile 文件，可以用来安装cli，生成api代码等。</li>
<li><code v-pre>README.md</code>：项目后端的说明文档。</li>
</ol>
<h2 id="项目代码" tabindex="-1"><a class="header-anchor" href="#项目代码"><span>项目代码</span></a></h2>
<ul>
<li><a href="https://gitee.com/tx7do/go-wind-admin" target="_blank" rel="noopener noreferrer">go-wind-admin Gitee</a></li>
<li><a href="https://github.com/tx7do/go-wind-admin" target="_blank" rel="noopener noreferrer">go-wind-admin Github</a></li>
</ul>
</div></template>



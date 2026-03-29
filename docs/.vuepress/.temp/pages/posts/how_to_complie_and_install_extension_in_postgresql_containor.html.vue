<template><div><h1 id="怎样编译postgresql扩展并安装到容器中去" tabindex="-1"><a class="header-anchor" href="#怎样编译postgresql扩展并安装到容器中去"><span>怎样编译PostgreSQL扩展并安装到容器中去</span></a></h1>
<p>通常PostgreSQL容器当中会内置一些扩展，一般存放在：<code v-pre>/usr/lib/postgresql/{PostgreSQL版本号}/lib</code>，扩展的实体都是<code v-pre>.so</code>文件，如果容器当中存在着扩展的so文件，那么就可以顺利的通过SQL语句进行安装，否则，则不能够顺利的安装，这时候，就需要编译扩展并拷贝进容器。</p>
<p>https://yum.postgresql.org/repopackages/</p>
</div></template>



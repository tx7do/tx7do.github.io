<template><div><h1 id="地理空间搜索" tabindex="-1"><a class="header-anchor" href="#地理空间搜索"><span>地理空间搜索</span></a></h1>
<h2 id="redis" tabindex="-1"><a class="header-anchor" href="#redis"><span>Redis</span></a></h2>
<p>Redis 3.2.0版本开始，提供了<code v-pre>GEO</code>系列命令，可以用搜索、索引地理位置信息。</p>
<h3 id="索引地理位置信息" tabindex="-1"><a class="header-anchor" href="#索引地理位置信息"><span>索引地理位置信息</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">GEOADD Sicily <span class="token number">13.361389</span> <span class="token number">38.115556</span> <span class="token string">"Palermo"</span> <span class="token number">15.087269</span> <span class="token number">37.502669</span> <span class="token string">"Catania"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="获取geohash值" tabindex="-1"><a class="header-anchor" href="#获取geohash值"><span>获取GeoHash值</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">GEOHASH Sicily Palermo Catania</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>在线GeoHash工具：</p>
<ul>
<li><a href="http://geohash.co/" target="_blank" rel="noopener noreferrer">http://geohash.co/</a></li>
<li><a href="https://www.movable-type.co.uk/scripts/geohash.html" target="_blank" rel="noopener noreferrer">https://www.movable-type.co.uk/scripts/geohash.html</a></li>
</ul>
<h3 id="求两点距离" tabindex="-1"><a class="header-anchor" href="#求两点距离"><span>求两点距离</span></a></h3>
<p>单位默认为：米，也可以在命令最后面跟单位：</p>
<ul>
<li>m 米</li>
<li>km 千米</li>
<li>mi 英里</li>
<li>ft 英尺</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">GEODIST Sicily Palermo Catania</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>如果不存在两点，则返回nil。</p>
<h3 id="返回经纬度坐标点" tabindex="-1"><a class="header-anchor" href="#返回经纬度坐标点"><span>返回经纬度坐标点</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">GEOPOS Sicily Palermo Catania NonExisting</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="区域搜索" tabindex="-1"><a class="header-anchor" href="#区域搜索"><span>区域搜索</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 圆形范围</span></span>
<span class="line">GEOSEARCH Sicily FROMLONLAT <span class="token number">15</span> <span class="token number">37</span> BYRADIUS <span class="token number">200</span> km ASC</span>
<span class="line"><span class="token comment"># 矩形范围</span></span>
<span class="line">GEOSEARCH Sicily FROMLONLAT <span class="token number">15</span> <span class="token number">37</span> BYBOX <span class="token number">400</span> <span class="token number">400</span> km ASC WITHCOORD WITHDIST</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="postgis" tabindex="-1"><a class="header-anchor" href="#postgis"><span>PostGIS</span></a></h2>
<h3 id="安装postgis插件" tabindex="-1"><a class="header-anchor" href="#安装postgis插件"><span>安装PostGIS插件</span></a></h3>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token comment">-- 安装插件</span></span>
<span class="line"><span class="token keyword">CREATE</span> extension postgis<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">-- 查看插件版本</span></span>
<span class="line"><span class="token keyword">SELECT</span> postgis_version<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">SELECT</span> postgis_full_version<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建测试表" tabindex="-1"><a class="header-anchor" href="#创建测试表"><span>创建测试表</span></a></h3>
<p>创建泛空间类型<code v-pre>geometry</code>的表，另外还有 Point / MultiPoint / Linestring / MultiLinestring / Polygon / MultiPolygon 等类型可供选择：</p>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">create</span> <span class="token keyword">table</span> testg <span class="token punctuation">(</span> id <span class="token keyword">int</span><span class="token punctuation">,</span> geom <span class="token keyword">geometry</span><span class="token punctuation">)</span> </span>
<span class="line"><span class="token keyword">distributed</span> <span class="token keyword">by</span> <span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="插入测试数据" tabindex="-1"><a class="header-anchor" href="#插入测试数据"><span>插入测试数据</span></a></h3>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token comment">-- without srid</span></span>
<span class="line"><span class="token keyword">insert</span> <span class="token keyword">into</span> testg <span class="token keyword">values</span> <span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> ST_GeomFromText<span class="token punctuation">(</span><span class="token string">'point(116 39)'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">-- with srid</span></span>
<span class="line"><span class="token keyword">insert</span> <span class="token keyword">into</span> test <span class="token keyword">values</span> <span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> ST_GeomFromText<span class="token punctuation">(</span><span class="token string">'point(116 39)'</span><span class="token punctuation">,</span> <span class="token number">4326</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="典型空间查询sql" tabindex="-1"><a class="header-anchor" href="#典型空间查询sql"><span>典型空间查询SQL</span></a></h3>
<ul>
<li>矩形范围查询</li>
</ul>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token comment">-- without srid</span></span>
<span class="line"><span class="token keyword">select</span> st_astext<span class="token punctuation">(</span>geom<span class="token punctuation">)</span> <span class="token keyword">from</span> testg</span>
<span class="line"><span class="token keyword">where</span> ST_Contains<span class="token punctuation">(</span>ST_MakeBox2D<span class="token punctuation">(</span>ST_Point<span class="token punctuation">(</span><span class="token number">116</span><span class="token punctuation">,</span> <span class="token number">39</span><span class="token punctuation">)</span><span class="token punctuation">,</span>ST_Point<span class="token punctuation">(</span><span class="token number">117</span><span class="token punctuation">,</span> <span class="token number">40</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> geom<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">-- with srid</span></span>
<span class="line"><span class="token keyword">select</span> st_astext<span class="token punctuation">(</span>geom<span class="token punctuation">)</span> <span class="token keyword">from</span> test </span>
<span class="line"><span class="token keyword">where</span> ST_Contains<span class="token punctuation">(</span>ST_SetSRID<span class="token punctuation">(</span>ST_MakeBox2D<span class="token punctuation">(</span>ST_Point<span class="token punctuation">(</span><span class="token number">116</span><span class="token punctuation">,</span> <span class="token number">39</span><span class="token punctuation">)</span><span class="token punctuation">,</span>ST_Point<span class="token punctuation">(</span><span class="token number">117</span><span class="token punctuation">,</span> <span class="token number">40</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">4326</span><span class="token punctuation">)</span><span class="token punctuation">,</span> geom<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>几何缓冲范围查询</li>
</ul>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token comment">-- without srid</span></span>
<span class="line"><span class="token keyword">select</span> st_astext<span class="token punctuation">(</span>geom<span class="token punctuation">)</span> <span class="token keyword">from</span> testg</span>
<span class="line"><span class="token keyword">where</span> ST_DWithin<span class="token punctuation">(</span>ST_GeomFromText<span class="token punctuation">(</span><span class="token string">'POINT(116 39)'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> geom<span class="token punctuation">,</span> <span class="token number">0.01</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">-- with srid</span></span>
<span class="line"><span class="token keyword">select</span> st_astext<span class="token punctuation">(</span>geom<span class="token punctuation">)</span> <span class="token keyword">from</span> test </span>
<span class="line"><span class="token keyword">where</span> ST_DWithin<span class="token punctuation">(</span>ST_GeomFromText<span class="token punctuation">(</span><span class="token string">'POINT(116 39)'</span><span class="token punctuation">,</span> <span class="token number">4326</span><span class="token punctuation">)</span><span class="token punctuation">,</span> geom<span class="token punctuation">,</span> <span class="token number">0.01</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>多边形相交判定（在内部或在边界上）</li>
</ul>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token comment">-- without srid</span></span>
<span class="line"><span class="token keyword">select</span> st_astext<span class="token punctuation">(</span>geom<span class="token punctuation">)</span> <span class="token keyword">from</span> testg</span>
<span class="line"><span class="token keyword">where</span> ST_Intersects<span class="token punctuation">(</span>ST_GeomFromText<span class="token punctuation">(</span><span class="token string">'POLYGON((116 39, 116.1 39, 116.1 39.1, 116 39.1, 116 39))'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> geom<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">-- with srid</span></span>
<span class="line"><span class="token keyword">select</span> st_astext<span class="token punctuation">(</span>geom<span class="token punctuation">)</span> <span class="token keyword">from</span> test </span>
<span class="line"><span class="token keyword">where</span> ST_Intersects<span class="token punctuation">(</span>ST_GeomFromText<span class="token punctuation">(</span><span class="token string">'POLYGON((116 39, 116.1 39, 116.1 39.1, 116 39.1, 116 39))'</span><span class="token punctuation">,</span> <span class="token number">4326</span><span class="token punctuation">)</span><span class="token punctuation">,</span> geom<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="clickhouse" tabindex="-1"><a class="header-anchor" href="#clickhouse"><span>ClickHouse</span></a></h2>
<h2 id="elasticsearch" tabindex="-1"><a class="header-anchor" href="#elasticsearch"><span>Elasticsearch</span></a></h2>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://help.aliyun.com/document_detail/127419.html" target="_blank" rel="noopener noreferrer">使用PostGIS</a></li>
<li><a href="https://zhuanlan.zhihu.com/p/62034688" target="_blank" rel="noopener noreferrer">PostGIS介绍</a></li>
<li><a href="https://clickhouse.com/docs/zh/sql-reference/functions/geo/coordinates" target="_blank" rel="noopener noreferrer">ClickHouse GEO</a></li>
</ul>
</div></template>



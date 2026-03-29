<template><div><h1 id="使用高德地图实现地理围栏" tabindex="-1"><a class="header-anchor" href="#使用高德地图实现地理围栏"><span>使用高德地图实现地理围栏</span></a></h1>
<h2 id="什么是地理围栏-geo-fencing" tabindex="-1"><a class="header-anchor" href="#什么是地理围栏-geo-fencing"><span>什么是地理围栏(Geo-fencing)?</span></a></h2>
<p>地理围栏（Geo-fencing）是LBS的一种新应用，就是用一个虚拟的栅栏围出一个虚拟地理边界。当手机进入、离开某个特定地理区域，或在该区域内活动时，手机可以接收自动通知和警告。有了地理围栏技术，位置社交网站就可以帮助用户在进入某一地区时自动登记。</p>
<h2 id="地理坐标系" tabindex="-1"><a class="header-anchor" href="#地理坐标系"><span>地理坐标系</span></a></h2>
<p>我们通常用经纬度来表示一个地理位置，但是由于一些原因，我们从不同渠道得到的经纬度信息可能并不是在同一个坐标系下。</p>
<ul>
<li>高德地图、腾讯地图以及谷歌中国区地图使用的是<strong>GCJ-02</strong>坐标系</li>
<li>百度地图使用的是<strong>BD-09</strong>坐标系</li>
<li>底层接口(HTML5 Geolocation或ios、安卓API)通过GPS设备获取的坐标使用的是<strong>WGS-84</strong>坐标系</li>
</ul>
<p>不同的坐标系之间可能有几十到几百米的偏移，所以在开发基于地图的产品，或者做地理数据可视化时，我们需要修正不同坐标系之间的偏差。</p>
<h3 id="wgs-84-世界大地测量系统" tabindex="-1"><a class="header-anchor" href="#wgs-84-世界大地测量系统"><span>WGS-84 - 世界大地测量系统</span></a></h3>
<p>WGS-84（World Geodetic System, WGS）是使用最广泛的坐标系，也是世界通用的坐标系，GPS设备得到的经纬度就是在WGS84坐标系下的经纬度。通常通过底层接口得到的定位信息都是WGS84坐标系。</p>
<h3 id="gcj-02-国测局坐标" tabindex="-1"><a class="header-anchor" href="#gcj-02-国测局坐标"><span>GCJ-02 - 国测局坐标</span></a></h3>
<p>GCJ-02（G-Guojia国家，C-Cehui测绘，J-Ju局），又被称为火星坐标系，是一种基于WGS-84制定的大地测量系统，由中国国测局制定。此坐标系所采用的混淆算法会在经纬度中加入随机的偏移。</p>
<p>国家规定，<strong>中国大陆所有公开地理数据都需要至少用GCJ-02进行加密</strong>，也就是说我们从国内公司的产品中得到的数据，一定是经过了加密的。绝大部分国内互联网地图提供商都是使用GCJ-02坐标系，包括高德地图，谷歌地图中国区等。</p>
<h3 id="bd-09-百度坐标系" tabindex="-1"><a class="header-anchor" href="#bd-09-百度坐标系"><span>BD-09 - 百度坐标系</span></a></h3>
<p>BD-09（Baidu, BD）是百度地图使用的地理坐标系，其在GCJ-02上多增加了一次变换，用来保护用户隐私。从百度产品中得到的坐标都是BD-09坐标系。</p>
<p align="center">
  <img src="https://tx7do.github.io/assets/images/iot/map_offset.jpg"/>
  <p align="center">不同坐标系下的点在百度地图上会有偏移</p>
</p>
<h3 id="地理坐标系列表" tabindex="-1"><a class="header-anchor" href="#地理坐标系列表"><span>地理坐标系列表</span></a></h3>
<table>
<thead>
<tr>
<th>坐标系</th>
<th>坐标格式</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>WGS84</td>
<td>[lng,lat]</td>
<td>WGS-84坐标系，GPS设备获取的经纬度坐标</td>
</tr>
<tr>
<td>GCJ02</td>
<td>[lng,lat]</td>
<td>GCJ-02坐标系，google中国地图、SoSo地图、AliYun地图、MapAbc地图和高德地图所用的经纬度坐标</td>
</tr>
<tr>
<td>BD09</td>
<td>[lng,lat]</td>
<td>BD-09坐标系，百度地图采用的经纬度坐标</td>
</tr>
<tr>
<td>BD09LL</td>
<td>[lng,lat]</td>
<td>同BD09</td>
</tr>
<tr>
<td>BD09MC</td>
<td>[x,y]</td>
<td>BD-09米制坐标，百度地图采用的米制坐标，单位：米</td>
</tr>
<tr>
<td>BD09Meter</td>
<td>[x,y]</td>
<td>同BD09MC</td>
</tr>
<tr>
<td>Baidu</td>
<td>[lng,lat]</td>
<td>百度坐标系，BD-09坐标系别名，同BD-09</td>
</tr>
<tr>
<td>BMap</td>
<td>[lng,lat]</td>
<td>百度地图，BD-09坐标系别名，同BD-09</td>
</tr>
<tr>
<td>AMap</td>
<td>[lng,lat]</td>
<td>高德地图，同GCJ-02</td>
</tr>
<tr>
<td>WebMercator</td>
<td>[x,y]</td>
<td>Web Mercator投影，墨卡托投影，同EPSG3857，单位：米</td>
</tr>
<tr>
<td>WGS1984</td>
<td>[lng,lat]</td>
<td>WGS-84坐标系别名，同WGS-84</td>
</tr>
<tr>
<td>EPSG4326</td>
<td>[lng,lat]</td>
<td>WGS-84坐标系别名，同WGS-84</td>
</tr>
<tr>
<td>EPSG3857</td>
<td>[x,y]</td>
<td>Web Mercator投影，同WebMercator，单位：米</td>
</tr>
<tr>
<td>EPSG900913</td>
<td>[x,y]</td>
<td>Web Mercator投影，同WebMercator，单位：米</td>
</tr>
</tbody>
</table>
<h2 id="地理围栏-geojson-数据" tabindex="-1"><a class="header-anchor" href="#地理围栏-geojson-数据"><span><a name="geofencing-geojson-data"></a>地理围栏 GeoJSON 数据</span></a></h2>
<p>地理围栏或地理围栏集的数据由 <a href="https://tools.ietf.org/html/rfc7946" target="_blank" rel="noopener noreferrer">rfc7946</a> 中定义的、采用 <code v-pre>GeoJSON</code> 格式的 <code v-pre>Feature</code> 对象和 <code v-pre>FeatureCollection</code> 对象表示。 除此之外：</p>
<ul>
<li>GeoJSON 对象类型可以是 <code v-pre>Feature</code> 对象或 <code v-pre>FeatureCollection</code> 对象。</li>
<li>几何对象类型可以是 <code v-pre>Point</code>、<code v-pre>MultiPoint</code>、<code v-pre>LineString</code>、<code v-pre>MultiLineString</code>、<code v-pre>Polygon</code>、<code v-pre>MultiPolygon</code> 和 <code v-pre>GeometryCollection</code>。</li>
<li>所有特征属性应该包含用于标识地理围栏的 <code v-pre>geometryId</code>。</li>
<li>具有 <code v-pre>Point</code>、<code v-pre>MultiPoint</code>、<code v-pre>LineString</code>、<code v-pre>MultiLineString</code> 的特征必须在属性中包含 <code v-pre>radius</code>。 <code v-pre>radius</code> 值的计量单位为米，<code v-pre>radius</code> 值的范围为 1 到 10000。</li>
<li>具有 <code v-pre>polygon</code> 和 <code v-pre>multipolygon</code> 几何类型的特征没有半径属性。</li>
<li><code v-pre>validityTime</code> 是可选属性，可让用户为地理围栏数据设置过期时间和有效时间。 如果未指定该属性，则数据永不过期，而是一直有效。</li>
<li><code v-pre>expiredTime</code> 是地理围栏数据的过期日期和时间。 如果请求中 <code v-pre>userTime</code> 的值晚于此值，则将相应的地理围栏数据视为过期的数据，且不会查询这些数据。 基于这一点，此地理围栏数据的 geometryId 将包含在地理围栏响应中的 <code v-pre>expiredGeofenceGeometryId</code> 数组内。</li>
<li><code v-pre>validityPeriod</code> 是地理围栏有效时段的列表。 如果请求中 <code v-pre>userTime</code> 的值超出有效时段，则将相应的地理围栏数据视为无效，且不会查询这些数据。 此地理围栏数据的 geometryId 包含在地理围栏响应中的 <code v-pre>invalidPeriodGeofenceGeometryId</code> 数组内。 下表显示了 validityPeriod 元素的属性。</li>
</ul>
<table>
<thead>
<tr>
<th style="text-align:left">名称</th>
<th style="text-align:center">类型</th>
<th style="text-align:center">必需</th>
<th style="text-align:left">说明</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">startTime</td>
<td style="text-align:center">datetime</td>
<td style="text-align:center">是</td>
<td style="text-align:left">有效时段的开始日期时间。</td>
</tr>
<tr>
<td style="text-align:left">endTime</td>
<td style="text-align:center">datetime</td>
<td style="text-align:center">是</td>
<td style="text-align:left">有效时段的结束日期时间。</td>
</tr>
<tr>
<td style="text-align:left">recurrenceType</td>
<td style="text-align:center">字符串</td>
<td style="text-align:center">false</td>
<td style="text-align:left">时段的重复类型。 值可为 <code v-pre>Daily</code>、<code v-pre>Weekly</code>、<code v-pre>Monthly</code> 或 <code v-pre>Yearly</code>。 默认值为 <code v-pre>Daily</code>。</td>
</tr>
<tr>
<td style="text-align:left">businessDayOnly</td>
<td style="text-align:center">Boolean</td>
<td style="text-align:center">false</td>
<td style="text-align:left">指示数据是否仅在工作日有效。 默认值为 <code v-pre>false</code>。</td>
</tr>
</tbody>
</table>
<ul>
<li>所有坐标值都表示为中定义的 &quot;经度，纬度&quot; <code v-pre>WGS84</code> 。</li>
<li>对于包含 <code v-pre>MultiPoint</code>、<code v-pre>MultiLineString</code>、<code v-pre>MultiPolygon</code> 或 <code v-pre>GeometryCollection</code> 的每个特征，属性将应用到所有元素。 例如：中的所有点 <code v-pre>MultiPoint</code> 都将使用相同的半径形成多个圆形地域隔离区内。</li>
</ul>
<h3 id="标准geojson" tabindex="-1"><a class="header-anchor" href="#标准geojson"><span>标准GeoJSON</span></a></h3>
<p><a href="https://tools.ietf.org/html/rfc7946" target="_blank" rel="noopener noreferrer">GeoJSON 规范</a>仅支持以下几何图形：</p>
<ul>
<li>点 (Point)</li>
<li>线 (LineString)</li>
<li>多边形 (Polygon)</li>
<li>点集合 (MultiPoint)</li>
<li>线集合 (MultiLineString)</li>
<li>多边形集合 (MultiPolygon)</li>
<li>空间数据集合 (GeometryCollection)</li>
</ul>
<h4 id="点-point" tabindex="-1"><a class="header-anchor" href="#点-point"><span><a name="point"></a>点 (Point)</span></a></h4>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"Feature"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"geometry"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"Point"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"coordinates"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">125.6</span><span class="token punctuation">,</span> <span class="token number">10.1</span><span class="token punctuation">]</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"properties"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"Dinagat Islands"</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="线-linestring" tabindex="-1"><a class="header-anchor" href="#线-linestring"><span><a name="line-string"></a>线 (LineString)</span></a></h4>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"LineString"</span><span class="token punctuation">,</span> </span>
<span class="line">    <span class="token property">"coordinates"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token punctuation">[</span><span class="token number">30.0</span><span class="token punctuation">,</span> <span class="token number">10.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">10.0</span><span class="token punctuation">,</span> <span class="token number">30.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">40.0</span><span class="token punctuation">,</span> <span class="token number">40.0</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="多边形-polygon" tabindex="-1"><a class="header-anchor" href="#多边形-polygon"><span><a name="polygon"></a>多边形 (Polygon)</span></a></h4>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"Polygon"</span><span class="token punctuation">,</span> </span>
<span class="line">    <span class="token property">"coordinates"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">30.0</span><span class="token punctuation">,</span> <span class="token number">10.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">40.0</span><span class="token punctuation">,</span> <span class="token number">40.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">20.0</span><span class="token punctuation">,</span> <span class="token number">40.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">10.0</span><span class="token punctuation">,</span> <span class="token number">20.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">30.0</span><span class="token punctuation">,</span> <span class="token number">10.0</span><span class="token punctuation">]</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"Polygon"</span><span class="token punctuation">,</span> </span>
<span class="line">    <span class="token property">"coordinates"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">35.0</span><span class="token punctuation">,</span> <span class="token number">10.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">45.0</span><span class="token punctuation">,</span> <span class="token number">45.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">15.0</span><span class="token punctuation">,</span> <span class="token number">40.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">10.0</span><span class="token punctuation">,</span> <span class="token number">20.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">35.0</span><span class="token punctuation">,</span> <span class="token number">10.0</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">,</span> </span>
<span class="line">        <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">20.0</span><span class="token punctuation">,</span> <span class="token number">30.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">35.0</span><span class="token punctuation">,</span> <span class="token number">35.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">30.0</span><span class="token punctuation">,</span> <span class="token number">20.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">20.0</span><span class="token punctuation">,</span> <span class="token number">30.0</span><span class="token punctuation">]</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="点集合-multipoint" tabindex="-1"><a class="header-anchor" href="#点集合-multipoint"><span><a name="multi-point"></a>点集合 (MultiPoint)</span></a></h4>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"MultiPoint"</span><span class="token punctuation">,</span> </span>
<span class="line">    <span class="token property">"coordinates"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token punctuation">[</span><span class="token number">10.0</span><span class="token punctuation">,</span> <span class="token number">40.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">40.0</span><span class="token punctuation">,</span> <span class="token number">30.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">20.0</span><span class="token punctuation">,</span> <span class="token number">20.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">30.0</span><span class="token punctuation">,</span> <span class="token number">10.0</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="线集合-multilinestring" tabindex="-1"><a class="header-anchor" href="#线集合-multilinestring"><span><a name="multi-line-string"></a>线集合 (MultiLineString)</span></a></h4>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"MultiLineString"</span><span class="token punctuation">,</span> </span>
<span class="line">    <span class="token property">"coordinates"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">10.0</span><span class="token punctuation">,</span> <span class="token number">10.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">20.0</span><span class="token punctuation">,</span> <span class="token number">20.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">10.0</span><span class="token punctuation">,</span> <span class="token number">40.0</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">,</span> </span>
<span class="line">        <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">40.0</span><span class="token punctuation">,</span> <span class="token number">40.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">30.0</span><span class="token punctuation">,</span> <span class="token number">30.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">40.0</span><span class="token punctuation">,</span> <span class="token number">20.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">30.0</span><span class="token punctuation">,</span> <span class="token number">10.0</span><span class="token punctuation">]</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="多边形集合-multipolygon" tabindex="-1"><a class="header-anchor" href="#多边形集合-multipolygon"><span><a name="multi-polygon"></a>多边形集合 (MultiPolygon)</span></a></h4>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"MultiPolygon"</span><span class="token punctuation">,</span> </span>
<span class="line">    <span class="token property">"coordinates"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token punctuation">[</span></span>
<span class="line">            <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">30.0</span><span class="token punctuation">,</span> <span class="token number">20.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">45.0</span><span class="token punctuation">,</span> <span class="token number">40.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">10.0</span><span class="token punctuation">,</span> <span class="token number">40.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">30.0</span><span class="token punctuation">,</span> <span class="token number">20.0</span><span class="token punctuation">]</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token punctuation">]</span><span class="token punctuation">,</span> </span>
<span class="line">        <span class="token punctuation">[</span></span>
<span class="line">            <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">15.0</span><span class="token punctuation">,</span> <span class="token number">5.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">40.0</span><span class="token punctuation">,</span> <span class="token number">10.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">10.0</span><span class="token punctuation">,</span> <span class="token number">20.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">5.0</span><span class="token punctuation">,</span> <span class="token number">10.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">15.0</span><span class="token punctuation">,</span> <span class="token number">5.0</span><span class="token punctuation">]</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"MultiPolygon"</span><span class="token punctuation">,</span> </span>
<span class="line">    <span class="token property">"coordinates"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token punctuation">[</span></span>
<span class="line">            <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">40.0</span><span class="token punctuation">,</span> <span class="token number">40.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">20.0</span><span class="token punctuation">,</span> <span class="token number">45.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">45.0</span><span class="token punctuation">,</span> <span class="token number">30.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">40.0</span><span class="token punctuation">,</span> <span class="token number">40.0</span><span class="token punctuation">]</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token punctuation">]</span><span class="token punctuation">,</span> </span>
<span class="line">        <span class="token punctuation">[</span></span>
<span class="line">            <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">20.0</span><span class="token punctuation">,</span> <span class="token number">35.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">10.0</span><span class="token punctuation">,</span> <span class="token number">30.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">10.0</span><span class="token punctuation">,</span> <span class="token number">10.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">30.0</span><span class="token punctuation">,</span> <span class="token number">5.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">45.0</span><span class="token punctuation">,</span> <span class="token number">20.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">20.0</span><span class="token punctuation">,</span> <span class="token number">35.0</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">,</span> </span>
<span class="line">            <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">30.0</span><span class="token punctuation">,</span> <span class="token number">20.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">20.0</span><span class="token punctuation">,</span> <span class="token number">15.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">20.0</span><span class="token punctuation">,</span> <span class="token number">25.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">30.0</span><span class="token punctuation">,</span> <span class="token number">20.0</span><span class="token punctuation">]</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="空间数据集合-geometrycollection" tabindex="-1"><a class="header-anchor" href="#空间数据集合-geometrycollection"><span><a name="geometry-collection"></a>空间数据集合 (GeometryCollection)</span></a></h4>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"GeometryCollection"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"geometries"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"Point"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"coordinates"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">40.0</span><span class="token punctuation">,</span> <span class="token number">10.0</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"LineString"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"coordinates"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">                <span class="token punctuation">[</span><span class="token number">10.0</span><span class="token punctuation">,</span> <span class="token number">10.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">20.0</span><span class="token punctuation">,</span> <span class="token number">20.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">10.0</span><span class="token punctuation">,</span> <span class="token number">40.0</span><span class="token punctuation">]</span></span>
<span class="line">            <span class="token punctuation">]</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"Polygon"</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">"coordinates"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">                <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">40.0</span><span class="token punctuation">,</span> <span class="token number">40.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">20.0</span><span class="token punctuation">,</span> <span class="token number">45.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">45.0</span><span class="token punctuation">,</span> <span class="token number">30.0</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">40.0</span><span class="token punctuation">,</span> <span class="token number">40.0</span><span class="token punctuation">]</span><span class="token punctuation">]</span></span>
<span class="line">            <span class="token punctuation">]</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="扩展geojson" tabindex="-1"><a class="header-anchor" href="#扩展geojson"><span>扩展GeoJSON</span></a></h3>
<h4 id="圆形-circle" tabindex="-1"><a class="header-anchor" href="#圆形-circle"><span><a name="circle"></a>圆形 (Circle)</span></a></h4>
<p><code v-pre>Circle</code> <a href="https://tools.ietf.org/html/rfc7946" target="_blank" rel="noopener noreferrer">GeoJSON 规范</a>不支持该几何图形。我们使用 <code v-pre>GeoJSON Point Feature</code> 对象来表示圆。</p>
<p><code v-pre>Circle</code>使用对象表示的几何图形 <code v-pre>GeoJSON Feature</code> <strong>必须</strong> 包含以下坐标和属性：</p>
<ul>
<li>
<p>圆心 (Center)</p>
<p>圆心使用 <code v-pre>GeoJSON Point</code> 对象表示。</p>
</li>
<li>
<p>半径 (Radius)</p>
<p>圆形的半径 <code v-pre>radius</code> 使用 <code v-pre>GeoJSON Feature</code> 的属性表示。 半径值以米为单位，并且其类型必须为 <code v-pre>double</code> 。</p>
</li>
<li>
<p>子类型 (subType)</p>
<p>圆形几何图形还必须包含 <code v-pre>subType</code> 属性。 此属性必须是的属性的一部分 <code v-pre>GeoJSON Feature</code> ，并且其值应为 <em>Circle</em></p>
</li>
</ul>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"Feature"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"geometry"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"Point"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"coordinates"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">-122.126986</span><span class="token punctuation">,</span> <span class="token number">47.639754</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"properties"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token property">"subType"</span><span class="token operator">:</span> <span class="token string">"Circle"</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token property">"radius"</span><span class="token operator">:</span> <span class="token number">500</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="矩形-rectangle" tabindex="-1"><a class="header-anchor" href="#矩形-rectangle"><span><a name="rectangle"></a>矩形 (Rectangle)</span></a></h4>
<p><code v-pre>Rectangle</code> <a href="https://tools.ietf.org/html/rfc7946" target="_blank" rel="noopener noreferrer">GeoJSON 规范</a>不支持该几何图形。我们使用 <code v-pre>GeoJSON Polygon Feature</code> 对象来表示矩形。 矩形扩展主要由 Web SDK 的 &quot;绘图工具&quot; 模块使用。</p>
<p><code v-pre>Rectangle</code>使用对象表示的几何图形 <code v-pre>GeoJSON Polygon Feature</code> <strong>必须</strong> 包含以下坐标和属性：</p>
<ul>
<li>
<p>内角</p>
<p>使用对象的坐标表示矩形的角 <code v-pre>GeoJSON Polygon</code> 。 应该有五个坐标，每个角一个。 与第五个坐标相同，用于关闭多边形环。 假定这些坐标对齐，开发人员可以根据需要对其进行旋转。</p>
</li>
<li>
<p>子类型</p>
<p>矩形几何图形还必须包含 <code v-pre>subType</code> 属性。 此属性必须是的属性的一部分 <code v-pre>GeoJSON Feature</code> ，并且其值应为 <em>Rectangle</em></p>
</li>
</ul>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"Feature"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"geometry"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"Polygon"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">"coordinates"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span><span class="token number">25</span><span class="token punctuation">]</span><span class="token punctuation">,</span><span class="token punctuation">[</span><span class="token number">14</span><span class="token punctuation">,</span><span class="token number">25</span><span class="token punctuation">]</span><span class="token punctuation">,</span><span class="token punctuation">[</span><span class="token number">14</span><span class="token punctuation">,</span><span class="token number">29</span><span class="token punctuation">]</span><span class="token punctuation">,</span><span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span><span class="token number">29</span><span class="token punctuation">]</span><span class="token punctuation">,</span><span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span><span class="token number">25</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">]</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">"properties"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">"subType"</span><span class="token operator">:</span> <span class="token string">"Rectangle"</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="高德地图" tabindex="-1"><a class="header-anchor" href="#高德地图"><span>高德地图</span></a></h2>
<p>高德地图提供了以下几组API可用于地理围栏:</p>
<ol>
<li>GeoJSON工具类 <code v-pre>AMap.GeoJSON</code></li>
<li>编辑器工具类 <code v-pre>AMap.PolyEditor</code> <code v-pre>AMap.PolygonEditor</code> <code v-pre>AMap.CircleEditor</code> <code v-pre>AMap.RectangleEditor</code> <code v-pre>AMap.EllipseEditor</code> <code v-pre>AMap.BezierCurveEditor</code></li>
<li>鼠标工具插件 <code v-pre>AMap.MouseTool</code></li>
</ol>
<h3 id="_1-geojson工具类" tabindex="-1"><a class="header-anchor" href="#_1-geojson工具类"><span>1. GeoJSON工具类</span></a></h3>
<p>它可以用来解析标准的GeoJSON,但是需要注意的是:它只支持<code v-pre>FeatureCollection</code>形式的数据.</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code><span class="line">    <span class="token keyword">const</span> geoJson <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AMap</span><span class="token punctuation">.</span><span class="token function">GeoJSON</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">      geoJSON<span class="token operator">:</span> geoJsonObject<span class="token punctuation">,</span></span>
<span class="line">      <span class="token function-variable function">getMarker</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>geoJson<span class="token punctuation">,</span> lngLats<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'点'</span><span class="token punctuation">,</span> lngLats<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function-variable function">getPolyline</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>geoJson<span class="token punctuation">,</span> lngLats<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'线'</span><span class="token punctuation">,</span> lngLats<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token function-variable function">getPolygon</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>geoJson<span class="token punctuation">,</span> lngLats<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'面'</span><span class="token punctuation">,</span> lngLats<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-矢量图形类" tabindex="-1"><a class="header-anchor" href="#_2-矢量图形类"><span>2. 矢量图形类</span></a></h3>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code><span class="line">  <span class="token keyword">function</span> <span class="token function">createPolygon</span><span class="token punctuation">(</span>path<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> addToMap<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">,</span> fitView<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> polygon <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AMap</span><span class="token punctuation">.</span><span class="token function">Polygon</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">      path<span class="token operator">:</span> path<span class="token punctuation">,</span></span>
<span class="line">      strokeColor<span class="token operator">:</span> <span class="token string">'#FF33FF'</span><span class="token punctuation">,</span></span>
<span class="line">      strokeWeight<span class="token operator">:</span> <span class="token number">6</span><span class="token punctuation">,</span></span>
<span class="line">      strokeOpacity<span class="token operator">:</span> <span class="token number">0.2</span><span class="token punctuation">,</span></span>
<span class="line">      fillOpacity<span class="token operator">:</span> <span class="token number">0.4</span><span class="token punctuation">,</span></span>
<span class="line">      fillColor<span class="token operator">:</span> <span class="token string">'#1791fc'</span><span class="token punctuation">,</span></span>
<span class="line">      zIndex<span class="token operator">:</span> <span class="token number">50</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    polygon<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">'mouseover'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">      polygon<span class="token punctuation">.</span><span class="token function">setOptions</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">        fillOpacity<span class="token operator">:</span> <span class="token number">0.7</span><span class="token punctuation">,</span></span>
<span class="line">        fillColor<span class="token operator">:</span> <span class="token string">'#7bccc4'</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    polygon<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">'mouseout'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">      polygon<span class="token punctuation">.</span><span class="token function">setOptions</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">        fillOpacity<span class="token operator">:</span> <span class="token number">0.5</span><span class="token punctuation">,</span></span>
<span class="line">        fillColor<span class="token operator">:</span> <span class="token string">'#ccebc5'</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>addToMap<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      map<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>polygon<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>fitView<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">setFitView</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    currentGeofence <span class="token operator">=</span> polygon<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> polygon<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-编辑器工具类" tabindex="-1"><a class="header-anchor" href="#_3-编辑器工具类"><span>3. 编辑器工具类</span></a></h3>
<p>它支持:圆形,折线,多边形,贝瑟尔曲线,椭圆,矩形.</p>
<p>虽然说,圆形,矩形绘制简单.但是,真正实用的只有:<strong>多边形</strong>.</p>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre v-pre><code><span class="line">  <span class="token comment">// 编辑多边形</span></span>
<span class="line">  <span class="token keyword">function</span> <span class="token function">editPolygon</span><span class="token punctuation">(</span>path<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> open<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">closePolygonEditor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 创建编辑器</span></span>
<span class="line">    polygonEditor <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AMap</span><span class="token punctuation">.</span><span class="token function">PolyEditor</span><span class="token punctuation">(</span>map<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>path<span class="token punctuation">.</span>length <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">const</span> polygon <span class="token operator">=</span> <span class="token function">createPolygon</span><span class="token punctuation">(</span>path<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">      <span class="token comment">// 吸附功能</span></span>
<span class="line">      polygonEditor<span class="token punctuation">.</span><span class="token function">addAdsorbPolygons</span><span class="token punctuation">(</span>polygon<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token comment">// 设置编辑目标</span></span>
<span class="line">      polygonEditor<span class="token punctuation">.</span><span class="token function">setTarget</span><span class="token punctuation">(</span>polygon<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">      polygon<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">'dblclick'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">        polygonEditor<span class="token punctuation">.</span><span class="token function">setTarget</span><span class="token punctuation">(</span>polygon<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        polygonEditor<span class="token punctuation">.</span><span class="token function">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">      polygonEditor<span class="token punctuation">.</span><span class="token function">setTarget</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    polygonEditor<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">'add'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>event<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">const</span> polygon <span class="token operator">=</span> event<span class="token punctuation">.</span>target<span class="token punctuation">;</span></span>
<span class="line">      polygonEditor<span class="token punctuation">.</span><span class="token function">addAdsorbPolygons</span><span class="token punctuation">(</span>polygon<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      polygon<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">'dblclick'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">        polygonEditor<span class="token punctuation">.</span><span class="token function">setTarget</span><span class="token punctuation">(</span>polygon<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        polygonEditor<span class="token punctuation">.</span><span class="token function">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    polygonEditor<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">'end'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>event<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">const</span> paths <span class="token operator">=</span> event<span class="token punctuation">.</span>target<span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'结束多边形编辑'</span><span class="token punctuation">,</span> event<span class="token punctuation">.</span>target<span class="token punctuation">,</span> paths<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 打开编辑</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>open<span class="token punctuation">)</span> polygonEditor<span class="token punctuation">.</span><span class="token function">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>需要注意的是:</strong></p>
<ol>
<li>绘制出来的路径需要倒序读取,因为标准GeoJson使用的是右手法则.</li>
<li>绘制出来的路径并没有封口,即起始点和结束点必须是同一个点.</li>
<li>如果需要被<code v-pre>AMap.GeoJSON</code>所解析,GeoJson的数据必须封装成<code v-pre>FeatureCollection</code>.</li>
</ol>
<h3 id="_3-鼠标工具插件" tabindex="-1"><a class="header-anchor" href="#_3-鼠标工具插件"><span>3. 鼠标工具插件</span></a></h3>
<p>并不实用,弃用.</p>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://baike.baidu.com/item/%E5%9C%B0%E7%90%86%E5%9C%8D%E6%AC%84%E6%8A%80%E8%A1%93/6249371" target="_blank" rel="noopener noreferrer">地理围栏技术</a></li>
<li><a href="https://en.wikipedia.org/wiki/GeoJSON" target="_blank" rel="noopener noreferrer">GeoJSON Wiki</a></li>
<li><a href="https://geojsonlint.com/" target="_blank" rel="noopener noreferrer">GeoJSON Viewer</a></li>
<li><a href="https://geojson.io/#map=2/3.0/16.2" target="_blank" rel="noopener noreferrer">geojson.io</a></li>
<li><a href="https://lbs.amap.com/api/javascript-api/reference/" target="_blank" rel="noopener noreferrer">高德参考手册</a></li>
<li><a href="https://lbs.amap.com/demo/javascript-api/example/overlayers/polygon-draw-and-edit" target="_blank" rel="noopener noreferrer">高德JS API 示例</a></li>
</ul>
</div></template>



import{_ as s,c as a,e,o as i}from"./app-QoGjbdPI.js";const l={};function t(p,n){return i(),a("div",null,[...n[0]||(n[0]=[e(`<h1 id="npm-pnpm-yarn切换源" tabindex="-1"><a class="header-anchor" href="#npm-pnpm-yarn切换源"><span>npm/pnpm/yarn切换源</span></a></h1><ul><li>国内镜像</li></ul><table><thead><tr><th>提供商</th><th>搜索地址</th><th>registry地址</th></tr></thead><tbody><tr><td>淘宝</td><td>https://npmmirror.com/</td><td>https://registry.npmmirror.com</td></tr><tr><td>腾讯云</td><td></td><td>http://mirrors.cloud.tencent.com/npm/</td></tr><tr><td>华为云</td><td></td><td>https://mirrors.huaweicloud.com/repository/npm</td></tr><tr><td>浙江大学</td><td></td><td>http://mirrors.zju.edu.cn/npm/</td></tr><tr><td>南京邮电</td><td></td><td>https://mirrors.njupt.edu.cn/nexus/repository/npm/</td></tr></tbody></table><h2 id="npm" tabindex="-1"><a class="header-anchor" href="#npm"><span>npm</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 查看源</span></span>
<span class="line"><span class="token function">npm</span> get registry</span>
<span class="line"><span class="token function">npm</span> config get registry</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 临时修改</span></span>
<span class="line"><span class="token function">npm</span> <span class="token parameter variable">--registry</span> https://registry.npmmirror.com <span class="token function">install</span> any-touch</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 永久修改</span></span>
<span class="line"><span class="token function">npm</span> config <span class="token builtin class-name">set</span> registry https://registry.npmmirror.com</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 还原</span></span>
<span class="line"><span class="token function">npm</span> config <span class="token builtin class-name">set</span> registry https://registry.npmjs.org</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nrm" tabindex="-1"><a class="header-anchor" href="#nrm"><span>NRM</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 安装 nrm</span></span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> nrm</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 列出当前可用的所有镜像源</span></span>
<span class="line">nrm <span class="token function">ls</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用淘宝镜像源</span></span>
<span class="line">nrm use taobao</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试访问速度</span></span>
<span class="line">nrm <span class="token builtin class-name">test</span> taobao</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="pnpm" tabindex="-1"><a class="header-anchor" href="#pnpm"><span>pnpm</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 查看源</span></span>
<span class="line"><span class="token function">pnpm</span> get registry</span>
<span class="line"><span class="token function">pnpm</span> config get registry</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 临时修改</span></span>
<span class="line"><span class="token function">pnpm</span> <span class="token parameter variable">--registry</span> https://registry.npmmirror.com <span class="token function">install</span> any-touch</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 永久修改</span></span>
<span class="line"><span class="token function">pnpm</span> config <span class="token builtin class-name">set</span> registry https://registry.npmmirror.com</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 还原</span></span>
<span class="line"><span class="token function">pnpm</span> config <span class="token builtin class-name">set</span> registry https://registry.npmjs.org</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="yarn" tabindex="-1"><a class="header-anchor" href="#yarn"><span>yarn</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 查看源</span></span>
<span class="line"><span class="token function">yarn</span> config get registry</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 临时修改</span></span>
<span class="line"><span class="token function">yarn</span> <span class="token function">add</span> any-touch@latest <span class="token parameter variable">--registry</span><span class="token operator">=</span>https://registry.npmjs.org/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 永久修改</span></span>
<span class="line"><span class="token function">yarn</span> config <span class="token builtin class-name">set</span> registry https://registry.npmmirror.com/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 还原</span></span>
<span class="line"><span class="token function">yarn</span> config <span class="token builtin class-name">set</span> registry https://registry.yarnpkg.com</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="yrm" tabindex="-1"><a class="header-anchor" href="#yrm"><span>YRM</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 安装 yrm</span></span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> yrm</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 列出当前可用的所有镜像源</span></span>
<span class="line">yrm <span class="token function">ls</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用淘宝镜像源</span></span>
<span class="line">yrm use taobao</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试访问速度</span></span>
<span class="line">yrm <span class="token builtin class-name">test</span> taobao</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13)])])}const c=s(l,[["render",t]]),d=JSON.parse('{"path":"/posts/npm_yarn_pnpm_change_source.html","title":"npm/pnpm/yarn切换源","lang":"zh-CN","frontmatter":{"date":"2020-01-01T00:00:00.000Z","category":["编程技术"],"tag":["npm","pnpm","yarn"],"sticky":10},"headers":[{"level":2,"title":"npm","slug":"npm","link":"#npm","children":[{"level":3,"title":"NRM","slug":"nrm","link":"#nrm","children":[]}]},{"level":2,"title":"pnpm","slug":"pnpm","link":"#pnpm","children":[]},{"level":2,"title":"yarn","slug":"yarn","link":"#yarn","children":[{"level":3,"title":"YRM","slug":"yrm","link":"#yrm","children":[]}]}],"git":{"updatedTime":1774788457000,"contributors":[{"name":"tx7do","username":"tx7do","email":"yanglinbo@gmail.com","commits":1,"url":"https://github.com/tx7do"},{"name":"Bobo","username":"Bobo","email":"yanglinbo@gmail.com","commits":1,"url":"https://github.com/Bobo"}],"changelog":[{"hash":"a3e88b19cfead00baa606aa5110b2802dac32768","time":1774788457000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: REBUILD."},{"hash":"2ae6e31606480686389b7bb87acb1c1f9f648e4c","time":1663724831000,"email":"yanglinbo@gmail.com","author":"tx7do","message":"feat: add post"}]},"filePathRelative":"posts/npm_yarn_pnpm_change_source.md","excerpt":"\\n<ul>\\n<li>国内镜像</li>\\n</ul>\\n<table>\\n<thead>\\n<tr>\\n<th>提供商</th>\\n<th>搜索地址</th>\\n<th>registry地址</th>\\n</tr>\\n</thead>\\n<tbody>\\n<tr>\\n<td>淘宝</td>\\n<td>https://npmmirror.com/</td>\\n<td>https://registry.npmmirror.com</td>\\n</tr>\\n<tr>\\n<td>腾讯云</td>\\n<td></td>\\n<td>http://mirrors.cloud.tencent.com/npm/</td>\\n</tr>\\n<tr>\\n<td>华为云</td>\\n<td></td>\\n<td>https://mirrors.huaweicloud.com/repository/npm</td>\\n</tr>\\n<tr>\\n<td>浙江大学</td>\\n<td></td>\\n<td>http://mirrors.zju.edu.cn/npm/</td>\\n</tr>\\n<tr>\\n<td>南京邮电</td>\\n<td></td>\\n<td>https://mirrors.njupt.edu.cn/nexus/repository/npm/</td>\\n</tr>\\n</tbody>\\n</table>"}');export{c as comp,d as data};

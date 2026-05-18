import{_ as s,c as a,e,o as l}from"./app-CgyMFFh0.js";const i={};function t(p,n){return l(),a("div",null,[...n[0]||(n[0]=[e(`<h1 id="kratos-微服务轻松对接-cfg-日志系统" tabindex="-1"><a class="header-anchor" href="#kratos-微服务轻松对接-cfg-日志系统"><span>Kratos 微服务轻松对接 CFG 日志系统</span></a></h1><ul><li><a href="https://clickhouse.com/" target="_blank" rel="noopener noreferrer">ClickHouse</a></li><li><a href="https://fluentbit.io/" target="_blank" rel="noopener noreferrer">Fluent Bit</a></li><li><a href="https://grafana.com/" target="_blank" rel="noopener noreferrer">Grafana</a></li></ul><h2 id="部署-cfg" tabindex="-1"><a class="header-anchor" href="#部署-cfg"><span>部署 CFG</span></a></h2><p>我们使用 Docker 来部署 EFK，首先，让我们先编写一个 Docker-Compose 的配置文件：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code><span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&quot;3&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">app-tier</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">driver</span><span class="token punctuation">:</span> bridge</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">clickhouse</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> docker.io/bitnami/clickhouse<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> app<span class="token punctuation">-</span>tier</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;8123:8123&quot;</span> <span class="token comment"># HTTP port</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;9000:9000&quot;</span> <span class="token comment"># TCP port</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;9004:9004&quot;</span> <span class="token comment"># MySQL port</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;9005:9005&quot;</span> <span class="token comment"># PostgreSQL port</span></span>
<span class="line">    <span class="token key atrule">expose</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token number">9009</span> <span class="token comment"># Inter-server HTTP port</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> /root/app/clickhouse<span class="token punctuation">:</span>/bitnami/clickhouse</span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> ALLOW_EMPTY_PASSWORD=yes</span>
<span class="line"><span class="token comment">#      - CLICKHOUSE_ADMIN_PASSWORD=password123</span></span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">fluentbit</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> docker.io/bitnami/fluent<span class="token punctuation">-</span>bit<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> app<span class="token punctuation">-</span>tier</span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> /root/app/fluentbit/fluent<span class="token punctuation">-</span>bit.conf<span class="token punctuation">:</span>/fluent<span class="token punctuation">-</span>bit/etc/fluent<span class="token punctuation">-</span>bit.conf</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;24224:24224&quot;</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;24224:24224/udp&quot;</span></span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">grafana</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> docker.io/bitnami/grafana<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">networks</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> app<span class="token punctuation">-</span>tier</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;3000:3000&quot;</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> GF_SECURITY_ADMIN_PASSWORD=pass</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="clickhouse配置" tabindex="-1"><a class="header-anchor" href="#clickhouse配置"><span>ClickHouse配置</span></a></h2><p>为了准备日志，我们需要在 ClickHouse 中创建表。</p><p>如果还没有创建数据库，那么需要先创建数据库：</p><div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre><code><span class="line"><span class="token keyword">CREATE</span> <span class="token keyword">DATABASE</span> fluentbit</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>创建数据库后，我们需要通过实验标志启用 JSON 对象类型<code>allow_experimental_object_type</code>，或者使用SQL打开：</p><div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre><code><span class="line"><span class="token keyword">SET</span> allow_experimental_object_type <span class="token operator">=</span> <span class="token number">1</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>设置完成后，我们可以使用上面的数据库来创建表。</p><div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre><code><span class="line"><span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> fluentbit<span class="token punctuation">.</span>kratos</span>
<span class="line"><span class="token punctuation">(</span></span>
<span class="line">    <span class="token keyword">timestamp</span> <span class="token keyword">DateTime</span><span class="token punctuation">,</span></span>
<span class="line">    log JSON</span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">Engine</span> <span class="token operator">=</span> MergeTree <span class="token keyword">ORDER</span> <span class="token keyword">BY</span> tuple<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建后，我们可以部署 Fluent Bit 来发送微服务的应用日志。</p><h2 id="fluent-bit配置" tabindex="-1"><a class="header-anchor" href="#fluent-bit配置"><span>Fluent Bit配置</span></a></h2><div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre><code><span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">INPUT</span><span class="token punctuation">]</span></span></span>
<span class="line">    name tail</span>
<span class="line">    path /var/log/access.log</span>
<span class="line">    read_from_head true</span>
<span class="line">    parser nginx_access</span>
<span class="line"></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">FILTER</span><span class="token punctuation">]</span></span></span>
<span class="line">    Name nest</span>
<span class="line">    Match *</span>
<span class="line">    Operation nest</span>
<span class="line">    Wildcard *</span>
<span class="line">    Nest_under log </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 采集业务服务日志到 clickhouse</span></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">OUTPUT</span><span class="token punctuation">]</span></span></span>
<span class="line">    name http</span>
<span class="line">    tls on</span>
<span class="line">    match *</span>
<span class="line">    host </span>
<span class="line">    port 8123</span>
<span class="line">    <span class="token key attr-name">URI /?query</span><span class="token punctuation">=</span><span class="token value attr-value">INSERT+INTO+fluentbit.kratos+FORMAT+JSONEachRow</span></span>
<span class="line">    format json_stream</span>
<span class="line">    json_date_key timestamp</span>
<span class="line">    json_date_format epoch</span>
<span class="line">    http_user default</span>
<span class="line">    http_passwd </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 采集业务服务日志到 kafka</span></span>
<span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">OUTPUT</span><span class="token punctuation">]</span></span></span>
<span class="line">    Name kafka</span>
<span class="line">    Match *</span>
<span class="line">    Brokers localhost:9092</span>
<span class="line">    Topics fluent-logs</span>
<span class="line">    Timestamp_Key _time_</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2><ul><li><a href="https://clickhouse.com/blog/nginx-logs-to-clickhouse-fluent-bit" target="_blank" rel="noopener noreferrer">Sending Nginx logs to ClickHouse with Fluent Bit</a></li><li><a href="https://clickhouse.com/blog/kubernetes-logs-to-clickhouse-fluent-bit" target="_blank" rel="noopener noreferrer">Sending Kubernetes logs To ClickHouse with Fluent Bit</a></li><li><a href="https://juejin.cn/post/7278984693008564284" target="_blank" rel="noopener noreferrer">使用fluent-bit采集服务日志</a></li></ul>`,18)])])}const o=s(i,[["render",t]]),r=JSON.parse('{"path":"/posts/kratos_cfg.html","title":"Kratos 微服务轻松对接 CFG 日志系统","lang":"zh-CN","frontmatter":{"date":"2020-01-01T00:00:00.000Z","category":["Go编程"],"tag":["Golang","Go-Kratos"],"sticky":10},"headers":[{"level":2,"title":"部署 CFG","slug":"部署-cfg","link":"#部署-cfg","children":[]},{"level":2,"title":"ClickHouse配置","slug":"clickhouse配置","link":"#clickhouse配置","children":[]},{"level":2,"title":"Fluent Bit配置","slug":"fluent-bit配置","link":"#fluent-bit配置","children":[]},{"level":2,"title":"参考资料","slug":"参考资料","link":"#参考资料","children":[]}],"git":{"updatedTime":1774788457000,"contributors":[{"name":"tx7do","username":"tx7do","email":"yanglinbo@gmail.com","commits":1,"url":"https://github.com/tx7do"},{"name":"Bobo","username":"Bobo","email":"yanglinbo@gmail.com","commits":1,"url":"https://github.com/Bobo"}],"changelog":[{"hash":"a3e88b19cfead00baa606aa5110b2802dac32768","time":1774788457000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: REBUILD."},{"hash":"af4a74c11eaefd9723828d1bdc5a73f70b7a9703","time":1700700822000,"email":"yanglinbo@gmail.com","author":"tx7do","message":"fet: edit posts."}]},"filePathRelative":"posts/kratos_cfg.md","excerpt":"\\n<ul>\\n<li><a href=\\"https://clickhouse.com/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">ClickHouse</a></li>\\n<li><a href=\\"https://fluentbit.io/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">Fluent Bit</a></li>\\n<li><a href=\\"https://grafana.com/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">Grafana</a></li>\\n</ul>"}');export{o as comp,r as data};

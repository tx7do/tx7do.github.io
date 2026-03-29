<template><div><h1 id="代码特殊注释完整规范-ide-支持、使用示例与团队协作指南" tabindex="-1"><a class="header-anchor" href="#代码特殊注释完整规范-ide-支持、使用示例与团队协作指南"><span>代码特殊注释完整规范：IDE 支持、使用示例与团队协作指南</span></a></h1>
<h2 id="一、完整注释表格" tabindex="-1"><a class="header-anchor" href="#一、完整注释表格"><span>一、完整注释表格</span></a></h2>
<table>
<thead>
<tr>
<th>注释名</th>
<th>核心作用说明</th>
<th>适用场景细分</th>
<th>VSC</th>
<th>VS</th>
<th>JetBrains</th>
<th>优先级建议</th>
</tr>
</thead>
<tbody>
<tr>
<td>TODO</td>
<td>功能未实现（尚未启动开发）</td>
<td>新需求、未动工的模块 / 接口</td>
<td>[x]</td>
<td>[x]</td>
<td>[x]</td>
<td>中 - 高</td>
</tr>
<tr>
<td>TODO:HIGH/MID/LOW</td>
<td>带优先级的未实现功能</td>
<td>需区分紧急程度（如 HIGH = 迭代必做，LOW = 后续优化）</td>
<td>[]</td>
<td>[]</td>
<td>[x]</td>
<td>自定义</td>
</tr>
<tr>
<td>UNDONE</td>
<td>功能未完成（已开发部分，待收尾）</td>
<td>开发中被打断、需补充细节 / 边界处理的功能</td>
<td>[]</td>
<td>[x]</td>
<td>[]</td>
<td>中</td>
</tr>
<tr>
<td>FIXME</td>
<td>已发现明确 Bug，需修复</td>
<td>可复现、定位清晰的缺陷（含潜在风险未复现的问题）</td>
<td>[]</td>
<td>[]</td>
<td>[x]</td>
<td>高</td>
</tr>
<tr>
<td>FIXME:URGENT</td>
<td>紧急 Bug 修复</td>
<td>线上故障、阻塞测试的核心流程缺陷</td>
<td>[]</td>
<td>[]</td>
<td>[x]</td>
<td>最高</td>
</tr>
<tr>
<td>BUG</td>
<td>已确认的具体缺陷</td>
<td>区别于 FIXME：更侧重 “已复现 + 影响范围明确” 的 Bug（如 “用户 ID&gt;1000 时查询失败”）</td>
<td>[]</td>
<td>[]</td>
<td>[]</td>
<td>高</td>
</tr>
<tr>
<td>HACK</td>
<td>临时解决方案 / 取巧实现</td>
<td>功能可用，但代码不优雅（如硬编码、规避框架限制），待重构</td>
<td>[]</td>
<td>[x]</td>
<td>[]</td>
<td>中</td>
</tr>
<tr>
<td>XXX</td>
<td>待优化问题（设计 / 实现不规范）</td>
<td>非紧急缺陷，如命名不规范、冗余代码、逻辑可简化（优先级低于 HACK/FIXME）</td>
<td>[]</td>
<td>[]</td>
<td>[]</td>
<td>低 - 中</td>
</tr>
<tr>
<td>UnresolvedMergeConflict</td>
<td>未解决的代码合并冲突</td>
<td>Git 合并分支时产生的冲突，需手动对比处理</td>
<td>[]</td>
<td>[x]</td>
<td>[]</td>
<td>最高</td>
</tr>
<tr>
<td>NOTE</td>
<td>重要说明 / 备注</td>
<td>记录设计思路、依赖条件、使用限制（如 “依赖第三方 SDK v2.3.0，升级需改签名”）</td>
<td>[]</td>
<td>[]</td>
<td>[x]</td>
<td>-</td>
</tr>
<tr>
<td>DEPRECATED</td>
<td>已废弃的代码 / 接口</td>
<td>不建议继续使用，后续版本会删除（需标注替代方案）</td>
<td>[]</td>
<td>[]</td>
<td>[x]</td>
<td>-</td>
</tr>
<tr>
<td>REVIEW</td>
<td>需代码审查 / 复核</td>
<td>复杂逻辑、高风险模块（如权限控制、支付流程），需团队复核</td>
<td>[]</td>
<td>[]</td>
<td>[]</td>
<td>中</td>
</tr>
<tr>
<td>OPTIMIZE</td>
<td>性能 / 结构优化</td>
<td>代码可运行，但效率低（如 O (n²) 循环）或结构混乱，需重构</td>
<td>[]</td>
<td>[]</td>
<td>[]</td>
<td>低 - 中</td>
</tr>
</tbody>
</table>
<blockquote>
<p>注：IDE 支持标记说明</p>
<ul>
<li>
<p>[x]：原生自带识别（无需额外配置）</p>
</li>
<li>
<p>[]：需通过插件 / 自定义配置实现识别（下文附配置方法）</p>
</li>
</ul>
</blockquote>
<h2 id="二、规范使用示例-c-通用语法" tabindex="-1"><a class="header-anchor" href="#二、规范使用示例-c-通用语法"><span>二、规范使用示例（C++/ 通用语法）</span></a></h2>
<div class="language-cpp line-numbers-mode" data-highlighter="prismjs" data-ext="cpp"><pre v-pre><code><span class="line"><span class="token comment">// TODO:HIGH 实现用户登录的短信验证码校验（截止2025-12-15，依赖短信SDK集成）</span></span>
<span class="line"><span class="token keyword">void</span> <span class="token function">userLogin</span><span class="token punctuation">(</span><span class="token keyword">const</span> std<span class="token double-colon punctuation">::</span>string<span class="token operator">&amp;</span> phone<span class="token punctuation">,</span> <span class="token keyword">const</span> std<span class="token double-colon punctuation">::</span>string<span class="token operator">&amp;</span> code<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// UNDONE 补充验证码过期时间校验（已实现发送逻辑，待加时效判断）</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>code<span class="token punctuation">.</span><span class="token function">empty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// FIXME:URGENT 空字符串导致崩溃，需添加参数非空校验（线上已反馈3例）</span></span>
<span class="line">        <span class="token keyword">throw</span> std<span class="token double-colon punctuation">::</span><span class="token function">invalid_argument</span><span class="token punctuation">(</span><span class="token string">"code is empty"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// BUG 当phone长度>11位时，数据库查询返回空指针（复现步骤：输入12位手机号）</span></span>
<span class="line">    <span class="token keyword">auto</span> user <span class="token operator">=</span> db<span class="token punctuation">.</span><span class="token function">queryUser</span><span class="token punctuation">(</span>phone<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// HACK 临时用sleep规避并发问题，后续需改用互斥锁（TODO:MID 优化并发控制）</span></span>
<span class="line">    std<span class="token double-colon punctuation">::</span>this_thread<span class="token double-colon punctuation">::</span><span class="token function">sleep_for</span><span class="token punctuation">(</span>std<span class="token double-colon punctuation">::</span>chrono<span class="token double-colon punctuation">::</span><span class="token function">milliseconds</span><span class="token punctuation">(</span><span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// XXX 硬编码"admin"，需改为配置项（config.h中添加ADMIN_ROLE常量）</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>user<span class="token operator">-></span>role <span class="token operator">==</span> <span class="token string">"admin"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// NOTE 管理员登录无需二次验证（产品需求：见文档P12）</span></span>
<span class="line">        <span class="token function">skipSecondAuth</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// DEPRECATED 该接口将在v2.0删除，替代方案：UserService::newGetUserInfo(phone)</span></span>
<span class="line">    <span class="token keyword">auto</span> oldInfo <span class="token operator">=</span> <span class="token function">getUserInfo</span><span class="token punctuation">(</span>phone<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// REVIEW 权限判断逻辑较复杂，需复核是否存在越权风险（涉及用户角色、资源所有权）</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">checkPermission</span><span class="token punctuation">(</span>user<span class="token punctuation">,</span> resourceId<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> FORBIDDEN<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// OPTIMIZE 循环遍历全量用户效率低，需添加索引+分页查询（数据量>1万时卡顿）</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">auto</span><span class="token operator">&amp;</span> u <span class="token operator">:</span> allUsers<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>u<span class="token punctuation">.</span>id <span class="token operator">==</span> targetId<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// UnresolvedMergeConflict 合并feature/pay分支时冲突：支付回调地址配置（需确认用测试/正式地址）</span></span>
<span class="line"><span class="token comment">// const std::string callbackUrl = "https://test-pay.example.com/callback";</span></span>
<span class="line"><span class="token comment">// const std::string callbackUrl = "https://pay.example.com/callback";</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、各-ide-高效使用指南-查看-自定义配置" tabindex="-1"><a class="header-anchor" href="#三、各-ide-高效使用指南-查看-自定义配置"><span>三、各 IDE 高效使用指南（查看 + 自定义配置）</span></a></h2>
<h3 id="_1-原生查看方式-无需配置" tabindex="-1"><a class="header-anchor" href="#_1-原生查看方式-无需配置"><span>1. 原生查看方式（无需配置）</span></a></h3>
<table>
<thead>
<tr>
<th>IDE</th>
<th>查看入口</th>
<th>支持的默认注释</th>
</tr>
</thead>
<tbody>
<tr>
<td>VS Code</td>
<td>终端 → 运行任务 → 任务：显示任务</td>
<td>TODO</td>
</tr>
<tr>
<td>Visual Studio</td>
<td>视图 → 任务列表（默认 “注释” 分类）</td>
<td>TODO、UNDONE、HACK、UnresolvedMergeConflict</td>
</tr>
<tr>
<td>JetBrains</td>
<td>视图 → 工具窗口 → TODO（可筛选优先级）</td>
<td>TODO、FIXME、NOTE、DEPRECATED、带后缀的 TODO/FIXME</td>
</tr>
</tbody>
</table>
<h3 id="_2-自定义配置-扩展支持更多注释" tabindex="-1"><a class="header-anchor" href="#_2-自定义配置-扩展支持更多注释"><span>2. 自定义配置（扩展支持更多注释）</span></a></h3>
<h4 id="_1-vs-code-推荐插件-todo-tree" tabindex="-1"><a class="header-anchor" href="#_1-vs-code-推荐插件-todo-tree"><span>（1）VS Code（推荐插件：Todo Tree）</span></a></h4>
<ul>
<li>安装插件：搜索 <code v-pre>Todo Tree</code>（支持高亮、侧边栏筛选、自定义规则）</li>
<li>配置自定义注释（文件 → 首选项 → 设置 → 搜索 <code v-pre>Todo Tree: Pattern</code>）：<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre v-pre><code><span class="line"><span class="token property">"todo-tree.highlights.customHighlight"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line"><span class="token property">"BUG"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token property">"icon"</span><span class="token operator">:</span> <span class="token string">"bug"</span><span class="token punctuation">,</span> <span class="token property">"color"</span><span class="token operator">:</span> <span class="token string">"#ff0000"</span><span class="token punctuation">,</span> <span class="token property">"backgroundColor"</span><span class="token operator">:</span> <span class="token string">"#ffebee"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token property">"REVIEW"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token property">"icon"</span><span class="token operator">:</span> <span class="token string">"check-circle"</span><span class="token punctuation">,</span> <span class="token property">"color"</span><span class="token operator">:</span> <span class="token string">"#ff9900"</span><span class="token punctuation">,</span> <span class="token property">"backgroundColor"</span><span class="token operator">:</span> <span class="token string">"#fff3e0"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token property">"OPTIMIZE"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token property">"icon"</span><span class="token operator">:</span> <span class="token string">"rocket"</span><span class="token punctuation">,</span> <span class="token property">"color"</span><span class="token operator">:</span> <span class="token string">"#0099ff"</span><span class="token punctuation">,</span> <span class="token property">"backgroundColor"</span><span class="token operator">:</span> <span class="token string">"#e3f2fd"</span> <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>效果：侧边栏生成 Todo Tree 面板，可按注释类型 / 颜色筛选。</li>
</ul>
<h4 id="_2-visual-studio-添加自定义任务令牌" tabindex="-1"><a class="header-anchor" href="#_2-visual-studio-添加自定义任务令牌"><span>（2）Visual Studio（添加自定义任务令牌）</span></a></h4>
<ul>
<li>
<p>步骤：工具 → 选项 → 环境 → 任务列表 → 点击 “添加”</p>
</li>
<li>
<p>配置示例：</p>
<p>|令牌	|	说明|
|-----|-------|
|BUG|已确认的具体缺陷|
|REVIEW|需代码审查|
|OPTIMIZE	|性能 / 结构优化|</p>
</li>
<li>
<p>效果：<code v-pre>// BUG xxx</code> 会显示在 “任务列表” 的 “注释” 分类中。</p>
</li>
</ul>
<h4 id="_3-jetbrains-添加-todo-模式" tabindex="-1"><a class="header-anchor" href="#_3-jetbrains-添加-todo-模式"><span>（3）JetBrains（添加 TODO 模式）</span></a></h4>
<ul>
<li>步骤：File → Settings → Tools → TODO → 点击 “+”</li>
<li>配置示例（正则表达式）：
<table>
<thead>
<tr>
<th>模式</th>
<th>描述</th>
<th>颜色</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>BUG\s*:</code></td>
<td>已确认的 Bug</td>
<td>红色</td>
</tr>
<tr>
<td><code v-pre>REVIEW\s*:</code></td>
<td>需代码审查</td>
<td>橙色</td>
</tr>
<tr>
<td><code v-pre>OPTIMIZE\s*:</code></td>
<td>性能优化</td>
<td>蓝色</td>
</tr>
</tbody>
</table>
</li>
<li>效果：<code v-pre>// BUG: xxx</code> 会在 TODO 面板中单独分类，支持筛选。</li>
</ul>
<h2 id="四、团队协作核心规则-避免混乱" tabindex="-1"><a class="header-anchor" href="#四、团队协作核心规则-避免混乱"><span>四、团队协作核心规则（避免混乱）</span></a></h2>
<h3 id="_1-明确使用边界" tabindex="-1"><a class="header-anchor" href="#_1-明确使用边界"><span>1. 明确使用边界：</span></a></h3>
<ul>
<li>不混用 <code v-pre>TODO</code> 和 <code v-pre>UNDONE</code>：未动工用 TODO，开发中未完成用 UNDONE；</li>
<li>不滥用 <code v-pre>FIXME</code> 和 <code v-pre>BUG</code>：可复现 + 影响明确用 BUG，潜在风险 / 未复现用 FIXME。</li>
<li>注释必须包含 3 要素：</li>
</ul>
<h3 id="_2-做什么-明确目标" tabindex="-1"><a class="header-anchor" href="#_2-做什么-明确目标"><span>2. 做什么（明确目标）；</span></a></h3>
<ul>
<li>优先级 / 截止时间（如 <code v-pre>TODO:HIGH 截止2025-12-20</code>）；</li>
<li>依赖条件（如 <code v-pre>依赖订单模块接口</code>）。</li>
</ul>
<h3 id="_3-定期清理注释" tabindex="-1"><a class="header-anchor" href="#_3-定期清理注释"><span>3. 定期清理注释：</span></a></h3>
<ul>
<li>迭代发布前：删除已完成的 TODO/UNDONE，修复所有 FIXME/BUG；</li>
<li>废弃代码：用 <code v-pre>DEPRECATED</code> 标记，而非直接删除（便于回滚）。</li>
</ul>
<h3 id="_4-跨-ide-兼容" tabindex="-1"><a class="header-anchor" href="#_4-跨-ide-兼容"><span>4. 跨 IDE 兼容：</span></a></h3>
<ul>
<li>团队统一使用原生支持的注释（TODO、FIXME、NOTE），或同步自定义配置（如共享 VS Code 的 settings.json、JetBrains 的 TODO
模式导出文件）。</li>
</ul>
<h2 id="五、补充说明" tabindex="-1"><a class="header-anchor" href="#五、补充说明"><span>五、补充说明</span></a></h2>
<ul>
<li><strong>语言兼容性</strong>：上述注释语法适用于 C++、Java、Python、JavaScript 等大部分编程语言（仅注释符号差异，如 Python 用 <code v-pre># TODO</code>）；</li>
<li><strong>工具集成</strong>：可结合项目管理工具（如 Jira），通过插件将 TODO 注释同步为任务（如 VS Code 的Jira Todo插件）；</li>
<li><strong>避免过度注释</strong>：仅标记关键待办 / 问题，代码本身可自解释的逻辑无需额外注释。</li>
</ul>
<p>通过以上规范，可实现 “代码注释→任务跟踪→团队协作” 的闭环，提升项目管理效率。</p>
</div></template>



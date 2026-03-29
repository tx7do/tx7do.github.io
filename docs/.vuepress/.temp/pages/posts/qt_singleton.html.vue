<template><div><h1 id="qt-优雅实现线程安全单例模式-模板化-自动清理" tabindex="-1"><a class="header-anchor" href="#qt-优雅实现线程安全单例模式-模板化-自动清理"><span>Qt 优雅实现线程安全单例模式（模板化 + 自动清理）</span></a></h1>
<p>在 Qt 开发中，单例模式是高频使用的设计模式，用于全局共享一个实例（如配置管理、网络服务、日志系统等）。一个健壮的 Qt 单例需要满足 <strong>线程安全、自动清理、通用性强、支持任意构造参数</strong> 等核心需求。本文将基于模板封装 + 管理器的设计思路，实现一套可直接复用的单例框架，并详细讲解其设计原理与最佳实践。</p>
<h2 id="一、单例模式的核心诉求" tabindex="-1"><a class="header-anchor" href="#一、单例模式的核心诉求"><span>一、单例模式的核心诉求</span></a></h2>
<p>在 Qt 环境中，单例的设计需要解决以下关键问题：</p>
<ol>
<li><strong>线程安全：</strong> 多线程并发调用时避免创建多个实例；</li>
<li><strong>自动清理：</strong> 程序退出时自动释放资源，避免内存泄漏（尤其配合 Qt 的 QCoreApplication::aboutToQuit 机制）；</li>
<li><strong>通用性：</strong> 支持任意类作为单例，无需重复编写单例逻辑；</li>
<li><strong>灵活构造：</strong> 支持带参数的构造函数，且不丢失参数语义；</li>
<li><strong>安全校验：</strong> 避免未初始化就调用实例的错误；</li>
<li><strong>可手动控制：</strong> 支持主动初始化 / 销毁单例。</li>
</ol>
<p>本文实现的单例框架完全满足以上需求，且兼容 Qt 控制台程序、桌面程序等所有场景。</p>
<h2 id="二、实现架构设计" tabindex="-1"><a class="header-anchor" href="#二、实现架构设计"><span>二、实现架构设计</span></a></h2>
<p>整体架构分为两层：</p>
<ol>
<li><strong>Singleton<T> 模板类：</strong> 负责单例的实例创建、线程安全保护、初始化 / 销毁逻辑，通过模板实现通用性；</li>
<li><strong>SingletonManager 单例管理器：</strong> 负责注册所有单例的清理回调，程序退出时统一执行销毁，避免内存泄漏。</li>
</ol>
<p>核心设计思路：</p>
<ul>
<li>模板化封装单例逻辑，避免重复编码；</li>
<li>用 <code v-pre>QMutex</code> 保证多线程下的实例创建 / 访问安全；</li>
<li>完美转发（<code v-pre>std::forward</code>）支持任意构造参数；</li>
<li>清理回调注册到管理器，利用 Qt 的 <code v-pre>aboutToQuit</code> 统一触发；</li>
<li>断言（<code v-pre>Q_ASSERT</code>）+ 宏定义简化使用，同时提供安全校验。</li>
</ul>
<h2 id="三、完整代码详解" tabindex="-1"><a class="header-anchor" href="#三、完整代码详解"><span>三、完整代码详解</span></a></h2>
<h3 id="_3-1-单例管理器-singletonmanager-h" tabindex="-1"><a class="header-anchor" href="#_3-1-单例管理器-singletonmanager-h"><span>3.1 单例管理器：<code v-pre>SingletonManager.h</code></span></a></h3>
<p>管理器的核心作用是「集中管理所有单例的清理逻辑」，避免每个单例单独处理销毁，确保退出时资源释放的一致性。</p>
<div class="language-cpp line-numbers-mode" data-highlighter="prismjs" data-ext="cpp"><pre v-pre><code><span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">ifndef</span> <span class="token expression">SINGLETONMANAGER_H</span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">SINGLETONMANAGER_H</span></span></span>
<span class="line"></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;QMutex></span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;functional></span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;map></span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;QObject></span> <span class="token comment">// 确保 Q_DISABLE_COPY_MOVE 可用</span></span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 单例管理器：统一注册/注销/执行单例清理回调</span></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">SingletonManager</span> <span class="token punctuation">{</span></span>
<span class="line"><span class="token keyword">public</span><span class="token operator">:</span></span>
<span class="line">    <span class="token comment">// 管理器自身是单例（懒加载，线程安全）</span></span>
<span class="line">    <span class="token keyword">static</span> SingletonManager <span class="token operator">&amp;</span><span class="token function">instance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">static</span> SingletonManager inst<span class="token punctuation">;</span> <span class="token comment">// C++11 后静态局部变量初始化线程安全</span></span>
<span class="line">        <span class="token keyword">return</span> inst<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">/**</span>
<span class="line">     * @brief 注册单例清理回调</span>
<span class="line">     * @param fn 清理函数（通常是删除单例实例的 lambda）</span>
<span class="line">     * @return 注册 ID（用于后续注销），ID > 0</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">int</span> <span class="token function">registerCleanup</span><span class="token punctuation">(</span>std<span class="token double-colon punctuation">::</span>function<span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">></span> fn<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        QMutexLocker <span class="token function">locker</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>m_mutex<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 加锁保证线程安全</span></span>
<span class="line">        <span class="token keyword">int</span> id <span class="token operator">=</span> m_nextId<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">        m_funcs<span class="token punctuation">.</span><span class="token function">emplace</span><span class="token punctuation">(</span>id<span class="token punctuation">,</span> std<span class="token double-colon punctuation">::</span><span class="token function">move</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 转移函数所有权，避免拷贝开销</span></span>
<span class="line">        <span class="token keyword">return</span> id<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">/**</span>
<span class="line">     * @brief 注销清理回调（支持重复调用，安全可重入）</span>
<span class="line">     * @param id 注册时返回的 ID</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">void</span> <span class="token function">unregisterCleanup</span><span class="token punctuation">(</span><span class="token keyword">const</span> <span class="token keyword">int</span> id<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        QMutexLocker <span class="token function">locker</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>m_mutex<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        m_funcs<span class="token punctuation">.</span><span class="token function">erase</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 不存在的 ID 无副作用</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">/**</span>
<span class="line">     * @brief 执行所有注册的清理回调（程序退出时调用）</span>
<span class="line">     * 特点：拷贝回调列表后再执行，避免回调中操作管理器导致死锁</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">void</span> <span class="token function">cleanupAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        std<span class="token double-colon punctuation">::</span>map<span class="token operator">&lt;</span><span class="token keyword">int</span><span class="token punctuation">,</span> std<span class="token double-colon punctuation">::</span>function<span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">>></span> copyFuncs<span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">// 局部作用域：释放锁后再执行回调，提高并发效率</span></span>
<span class="line">            QMutexLocker <span class="token function">locker</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>m_mutex<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            copyFuncs <span class="token operator">=</span> m_funcs<span class="token punctuation">;</span> <span class="token comment">// 拷贝回调列表</span></span>
<span class="line">            m_funcs<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>     <span class="token comment">// 清空原列表，避免重复执行</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// 按注册顺序执行回调（map 是有序容器，key 递增）</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">auto</span> <span class="token operator">&amp;</span><span class="token punctuation">[</span>id<span class="token punctuation">,</span> func<span class="token punctuation">]</span> <span class="token operator">:</span> copyFuncs<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>func<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token function">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 执行清理逻辑</span></span>
<span class="line">                <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token comment">// 捕获所有异常，避免单个单例清理失败影响其他</span></span>
<span class="line">                    <span class="token function">qWarning</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">"[SingletonManager] Cleanup failed for id:"</span> <span class="token operator">&lt;&lt;</span> id<span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">private</span><span class="token operator">:</span></span>
<span class="line">    <span class="token comment">// 私有构造/析构：禁止外部创建实例</span></span>
<span class="line">    <span class="token function">SingletonManager</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token keyword">default</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token operator">~</span><span class="token function">SingletonManager</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token keyword">default</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 禁用拷贝/移动：确保管理器全局唯一</span></span>
<span class="line">    <span class="token function">Q_DISABLE_COPY_MOVE</span><span class="token punctuation">(</span>SingletonManager<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">    QMutex m_mutex<span class="token punctuation">;</span>                          <span class="token comment">// 保护回调列表的线程安全</span></span>
<span class="line">    std<span class="token double-colon punctuation">::</span>map<span class="token operator">&lt;</span><span class="token keyword">int</span><span class="token punctuation">,</span> std<span class="token double-colon punctuation">::</span>function<span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">>></span> m_funcs<span class="token punctuation">;</span> <span class="token comment">// 存储清理回调（有序）</span></span>
<span class="line">    <span class="token keyword">int</span> m_nextId<span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">}</span><span class="token punctuation">;</span>                         <span class="token comment">// 回调注册 ID 生成器（从 1 开始，0 为无效 ID）</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span> <span class="token comment">// SINGLETONMANAGER_H</span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>设计亮点：</strong></p>
<ul>
<li><strong>自身是单例：</strong> 静态局部变量初始化（C++11 线程安全），无需额外加锁；</li>
<li><strong>线程安全：</strong> 所有对回调列表的操作都通过 <code v-pre>QMutex</code> 保护；</li>
<li><strong>安全清理：</strong> 拷贝回调列表后释放锁，避免回调中调用 <code v-pre>unregisterCleanup</code> 导致死锁；</li>
<li><strong>异常隔离：</strong> 单个单例清理失败不影响其他，提高程序稳定性；</li>
<li><strong>有序执行：</strong> <code v-pre>std::map</code> 保证清理顺序与注册顺序一致，解决单例依赖问题。</li>
</ul>
<h3 id="_3-2-单例模板类-singleton-h" tabindex="-1"><a class="header-anchor" href="#_3-2-单例模板类-singleton-h"><span>3.2 单例模板类：<code v-pre>Singleton.h</code></span></a></h3>
<p>模板类是单例框架的核心，通过泛型封装通用逻辑，支持任意类作为单例，无需修改目标类代码。</p>
<div class="language-cpp line-numbers-mode" data-highlighter="prismjs" data-ext="cpp"><pre v-pre><code><span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">ifndef</span> <span class="token expression">SINGLETON_H</span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">SINGLETON_H</span></span></span>
<span class="line"></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;QMutexLocker></span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;QCoreApplication></span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;QDebug></span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;type_traits></span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;utility></span> <span class="token comment">// 用于 std::forward</span></span></span>
<span class="line"></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">"SingletonManager.h"</span></span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 静态断言：确保 T 是可构造的（避免抽象类作为单例）</span></span>
<span class="line"><span class="token keyword">template</span><span class="token operator">&lt;</span><span class="token keyword">typename</span> <span class="token class-name">T</span><span class="token operator">></span></span>
<span class="line"><span class="token keyword">constexpr</span> <span class="token keyword">bool</span> is_singleton_valid_v <span class="token operator">=</span> <span class="token operator">!</span>std<span class="token double-colon punctuation">::</span>is_abstract_v<span class="token operator">&lt;</span>T<span class="token operator">></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 单例模板类：支持带参数构造、自动注册清理、线程安全访问</span></span>
<span class="line"><span class="token keyword">template</span><span class="token operator">&lt;</span><span class="token keyword">typename</span> <span class="token class-name">T</span><span class="token operator">></span></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">Singleton</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 编译期校验：若 T 不可构造或为抽象类，直接报错</span></span>
<span class="line">    <span class="token keyword">static_assert</span><span class="token punctuation">(</span>is_singleton_valid_v<span class="token operator">&lt;</span>T<span class="token operator">></span><span class="token punctuation">,</span> </span>
<span class="line">                  <span class="token string">"Singleton&lt;T> requires T to be constructible and non-abstract"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">public</span><span class="token operator">:</span></span>
<span class="line">    <span class="token comment">/**</span>
<span class="line">     * @brief 初始化单例（必须在调用 instance() 前执行）</span>
<span class="line">     * @tparam Args 构造函数参数类型</span>
<span class="line">     * @param args 构造函数参数（完美转发，支持左值/右值）</span>
<span class="line">     * 特点：自动注册清理回调到 SingletonManager，支持重复调用（仅首次有效）</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">template</span><span class="token operator">&lt;</span><span class="token keyword">typename</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> Args<span class="token operator">></span></span>
<span class="line">    <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">init</span><span class="token punctuation">(</span>Args <span class="token operator">&amp;&amp;</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">static_assert</span><span class="token punctuation">(</span>std<span class="token double-colon punctuation">::</span>is_constructible_v<span class="token operator">&lt;</span>T<span class="token punctuation">,</span> Args<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token operator">></span><span class="token punctuation">,</span></span>
<span class="line">                      <span class="token string">"Singleton&lt;T>::init requires T to be constructible with the provided arguments"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        QMutexLocker <span class="token function">lockerInit</span><span class="token punctuation">(</span><span class="token operator">&amp;</span><span class="token function">mutex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 加锁保证初始化线程安全</span></span>
<span class="line">        </span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">nullptr</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">qWarning</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">"[Singleton] "</span> <span class="token operator">&lt;&lt;</span> <span class="token keyword">typeid</span><span class="token punctuation">(</span>T<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">" has already been initialized"</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">return</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// 完美转发参数，创建单例实例（支持任意构造参数）</span></span>
<span class="line">        <span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token function">T</span><span class="token punctuation">(</span>std<span class="token double-colon punctuation">::</span><span class="token generic-function"><span class="token function">forward</span><span class="token generic class-name"><span class="token operator">&lt;</span>Args<span class="token operator">></span></span></span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// 注册清理回调（仅首次初始化时注册）</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">regIdRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">regIdRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token class-name">SingletonManager</span><span class="token double-colon punctuation">::</span><span class="token function">instance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">registerCleanup</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span></span>
<span class="line">                QMutexLocker <span class="token function">lockerCleanup</span><span class="token punctuation">(</span><span class="token operator">&amp;</span><span class="token function">mutex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token keyword">delete</span> <span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 释放单例实例</span></span>
<span class="line">                <span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token keyword">nullptr</span><span class="token punctuation">;</span> <span class="token comment">// 重置指针，避免野指针</span></span>
<span class="line">                <span class="token function">qDebug</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">"[Singleton] "</span> <span class="token operator">&lt;&lt;</span> <span class="token keyword">typeid</span><span class="token punctuation">(</span>T<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">" cleaned up"</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">/**</span>
<span class="line">     * @brief 获取单例实例指针（线程安全）</span>
<span class="line">     * @return T* 单例指针（非空，调试模式下为空会触发断言）</span>
<span class="line">     * 注意：必须先调用 init() 初始化，否则调试模式断言失败，release 模式可能崩溃</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">static</span> T <span class="token operator">*</span><span class="token function">instance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        QMutexLocker <span class="token function">locker</span><span class="token punctuation">(</span><span class="token operator">&amp;</span><span class="token function">mutex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">Q_ASSERT_X</span><span class="token punctuation">(</span><span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">nullptr</span><span class="token punctuation">,</span> </span>
<span class="line">                   <span class="token string">"Singleton::instance()"</span><span class="token punctuation">,</span> </span>
<span class="line">                   <span class="token function">qPrintable</span><span class="token punctuation">(</span><span class="token function">QString</span><span class="token punctuation">(</span><span class="token string">"%1 not initialized! Call Singleton&lt;%1>::init() first."</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">arg</span><span class="token punctuation">(</span><span class="token keyword">typeid</span><span class="token punctuation">(</span>T<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">/**</span>
<span class="line">     * @brief 手动销毁单例（主动释放资源）</span>
<span class="line">     * 特点：销毁后可重新调用 init() 再次初始化，支持动态启停</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        QMutexLocker <span class="token function">locker</span><span class="token punctuation">(</span><span class="token operator">&amp;</span><span class="token function">mutex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">nullptr</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">delete</span> <span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token keyword">nullptr</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token function">qDebug</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">"[Singleton] "</span> <span class="token operator">&lt;&lt;</span> <span class="token keyword">typeid</span><span class="token punctuation">(</span>T<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">" shut down manually"</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// 注销清理回调（避免重复销毁）</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">regIdRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">SingletonManager</span><span class="token double-colon punctuation">::</span><span class="token function">instance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">unregisterCleanup</span><span class="token punctuation">(</span><span class="token function">regIdRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token function">regIdRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 禁用默认构造/析构：禁止创建 Singleton 实例（仅通过静态方法访问）</span></span>
<span class="line">    <span class="token function">Singleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token keyword">delete</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token operator">~</span><span class="token function">Singleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token keyword">delete</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 禁用拷贝/移动：确保单例唯一性</span></span>
<span class="line">    <span class="token function">Q_DISABLE_COPY_MOVE</span><span class="token punctuation">(</span>Singleton<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">private</span><span class="token operator">:</span></span>
<span class="line">    <span class="token comment">/**</span>
<span class="line">     * @brief 获取单例实例引用（静态局部变量，懒加载）</span>
<span class="line">     * 注意：静态局部变量初始化线程安全（C++11 标准）</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">static</span> T <span class="token operator">*</span><span class="token operator">&amp;</span><span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">static</span> T <span class="token operator">*</span>inst <span class="token operator">=</span> <span class="token keyword">nullptr</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> inst<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">/**</span>
<span class="line">     * @brief 获取互斥锁引用（静态局部变量，懒加载）</span>
<span class="line">     * 每个单例类拥有独立的互斥锁，避免不同单例间锁竞争</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">static</span> QMutex <span class="token operator">&amp;</span><span class="token function">mutex</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">static</span> QMutex m<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> m<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">/**</span>
<span class="line">     * @brief 获取清理回调注册 ID 引用</span>
<span class="line">     * 用于跟踪是否已注册清理回调，避免重复注册</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">static</span> <span class="token keyword">int</span> <span class="token operator">&amp;</span><span class="token function">regIdRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">static</span> <span class="token keyword">int</span> id <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> id<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">/**</span>
<span class="line"> * @def GET_SINGLETON(Type)</span>
<span class="line"> * @brief 获取单例指针（可能为 nullptr，需自行判空）</span>
<span class="line"> * 适用场景：允许单例未初始化的场景（如可选功能模块）</span>
<span class="line"> */</span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name function">GET_SINGLETON</span><span class="token expression"><span class="token punctuation">(</span>Type<span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token class-name">Singleton</span><span class="token operator">&lt;</span>Type<span class="token operator">></span><span class="token double-colon punctuation">::</span><span class="token function">instance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span></span></span>
<span class="line"></span>
<span class="line"><span class="token comment">/**</span>
<span class="line"> * @def GET_SINGLETON_REF(Type)</span>
<span class="line"> * @brief 获取单例引用（调试模式下未初始化会触发断言）</span>
<span class="line"> * 适用场景：确保单例必须存在的核心模块（如配置管理）</span>
<span class="line"> */</span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name function">GET_SINGLETON_REF</span><span class="token expression"><span class="token punctuation">(</span>Type<span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> Type <span class="token operator">&amp;</span> <span class="token punctuation">{</span> </span><span class="token punctuation">\</span></span>
<span class="line">    <span class="token expression">Type <span class="token operator">*</span>p <span class="token operator">=</span> <span class="token class-name">Singleton</span><span class="token operator">&lt;</span>Type<span class="token operator">></span><span class="token double-colon punctuation">::</span><span class="token function">instance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>       </span><span class="token punctuation">\</span></span>
<span class="line">    <span class="token expression"><span class="token function">Q_ASSERT_X</span><span class="token punctuation">(</span>p <span class="token operator">!=</span> <span class="token keyword">nullptr</span><span class="token punctuation">,</span> </span><span class="token string">"GET_SINGLETON_REF"</span><span class="token expression"><span class="token punctuation">,</span> </span><span class="token string">"Singleton not initialized"</span><span class="token expression"><span class="token punctuation">)</span><span class="token punctuation">;</span> </span><span class="token punctuation">\</span></span>
<span class="line">    <span class="token expression"><span class="token keyword">return</span> <span class="token operator">*</span>p<span class="token punctuation">;</span>                                   </span><span class="token punctuation">\</span></span>
<span class="line"><span class="token expression"><span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span></span></span>
<span class="line"></span>
<span class="line"><span class="token comment">/**</span>
<span class="line"> * @def GET_SINGLETON_OR(Type, alt)</span>
<span class="line"> * @brief 获取单例指针，若未初始化则返回替代值</span>
<span class="line"> * 适用场景：需要降级策略的场景（如备用服务）</span>
<span class="line"> */</span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name function">GET_SINGLETON_OR</span><span class="token expression"><span class="token punctuation">(</span>Type<span class="token punctuation">,</span> alt<span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token class-name">Singleton</span><span class="token operator">&lt;</span>Type<span class="token operator">></span><span class="token double-colon punctuation">::</span><span class="token function">instance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token class-name">Singleton</span><span class="token operator">&lt;</span>Type<span class="token operator">></span><span class="token double-colon punctuation">::</span><span class="token function">instance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token punctuation">(</span>alt<span class="token punctuation">)</span><span class="token punctuation">)</span></span></span></span>
<span class="line"></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span> <span class="token comment">// SINGLETON_H</span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>设计亮点：</strong></p>
<ul>
<li><strong>编译期校验：</strong> 通过 <code v-pre>static_assert</code> 禁止抽象类、不可构造类作为单例，提前暴露错误；</li>
<li><strong>完美转发：</strong> <code v-pre>std::forward</code> 保留构造参数的左值 / 右值属性，支持任意构造参数（包括临时对象）；</li>
<li><strong>独立锁机制：</strong> 每个单例类拥有自己的 <code v-pre>QMutex</code>，避免不同单例间的锁竞争，提高并发效率；</li>
<li><strong>灵活控制：</strong> 支持 <code v-pre>init()</code> 重复调用（幂等性）、<code v-pre>shutdown()</code> 手动销毁后重新初始化；</li>
<li><strong>安全宏定义：</strong> 提供三种访问宏，适配不同使用场景，调试模式下有明确断言提示。</li>
</ul>
<h3 id="_3-3-目标单例类示例-myservice-h" tabindex="-1"><a class="header-anchor" href="#_3-3-目标单例类示例-myservice-h"><span>3.3 目标单例类示例：<code v-pre>MyService.h</code></span></a></h3>
<p>为了让示例更完整，这里提供一个典型的 Qt 单例类实现（支持信号槽、带参数构造）：</p>
<div class="language-cpp line-numbers-mode" data-highlighter="prismjs" data-ext="cpp"><pre v-pre><code><span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">ifndef</span> <span class="token expression">MYSERVICE_H</span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">MYSERVICE_H</span></span></span>
<span class="line"></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;QObject></span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;QString></span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;QDebug></span></span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 示例单例类：网络服务管理（支持信号槽，带参数构造）</span></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">MyService</span> <span class="token operator">:</span> <span class="token base-clause"><span class="token keyword">public</span> <span class="token class-name">QObject</span></span> <span class="token punctuation">{</span></span>
<span class="line">    Q_OBJECT</span>
<span class="line"><span class="token keyword">public</span><span class="token operator">:</span></span>
<span class="line">    <span class="token comment">/**</span>
<span class="line">     * @brief 带参数构造函数（单例的构造参数通过 Singleton::init() 传递）</span>
<span class="line">     * @param serverUrl 服务端地址</span>
<span class="line">     * @param port 服务端口</span>
<span class="line">     * @param parent 父对象（建议设为 nullptr，避免生命周期冲突）</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">explicit</span> <span class="token function">MyService</span><span class="token punctuation">(</span><span class="token keyword">const</span> QString <span class="token operator">&amp;</span>serverUrl<span class="token punctuation">,</span> <span class="token keyword">int</span> port<span class="token punctuation">,</span> QObject <span class="token operator">*</span>parent <span class="token operator">=</span> <span class="token keyword">nullptr</span><span class="token punctuation">)</span> </span>
<span class="line">        <span class="token operator">:</span> <span class="token function">QObject</span><span class="token punctuation">(</span>parent<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">m_serverUrl</span><span class="token punctuation">(</span>serverUrl<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">m_port</span><span class="token punctuation">(</span>port<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">qDebug</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">"[MyService] Initialized with URL:"</span> <span class="token operator">&lt;&lt;</span> serverUrl <span class="token operator">&lt;&lt;</span> <span class="token string">", port:"</span> <span class="token operator">&lt;&lt;</span> port<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token operator">~</span><span class="token function">MyService</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">override</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">qDebug</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">"[MyService] Destructor called"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 示例业务方法</span></span>
<span class="line">    <span class="token keyword">void</span> <span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">qDebug</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">"[MyService] Doing something with"</span> <span class="token operator">&lt;&lt;</span> m_serverUrl <span class="token operator">&lt;&lt;</span> <span class="token string">":"</span> <span class="token operator">&lt;&lt;</span> m_port<span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">// 实际业务逻辑：如网络请求、数据处理等</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">signals<span class="token operator">:</span></span>
<span class="line">    <span class="token comment">// 示例信号：如服务状态变化</span></span>
<span class="line">    <span class="token keyword">void</span> <span class="token function">serviceReady</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">private</span><span class="token operator">:</span></span>
<span class="line">    QString m_serverUrl<span class="token punctuation">;</span> <span class="token comment">// 服务端地址</span></span>
<span class="line">    <span class="token keyword">int</span> m_port<span class="token punctuation">;</span>          <span class="token comment">// 服务端口</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span> <span class="token comment">// MYSERVICE_H</span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注意事项：</strong></p>
<ul>
<li>单例类若继承 <code v-pre>QObject</code>，建议将父对象设为 <code v-pre>nullptr</code>，避免 Qt 父子对象生命周期管理与单例冲突；</li>
<li>构造函数需为 <code v-pre>public</code> 或 <code v-pre>protected</code>（若为 <code v-pre>protected</code>，需将 <code v-pre>Singleton&lt;T&gt;</code> 设为友元）；</li>
<li>避免在构造函数中执行耗时操作（如网络连接），可提供 <code v-pre>initService()</code> 等方法延迟初始化。</li>
</ul>
<h3 id="完整使用示例-main-函数" tabindex="-1"><a class="header-anchor" href="#完整使用示例-main-函数"><span>完整使用示例（main 函数）</span></a></h3>
<div class="language-cpp line-numbers-mode" data-highlighter="prismjs" data-ext="cpp"><pre v-pre><code><span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;QCoreApplication></span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;QTimer></span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">"SingletonManager.h"</span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">"Singleton.h"</span></span></span>
<span class="line"><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">"MyService.h"</span></span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token keyword">int</span> argc<span class="token punctuation">,</span> <span class="token keyword">char</span> <span class="token operator">*</span>argv<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 1. 必须先创建 QCoreApplication（QMutex、QObject 等依赖 Qt 环境初始化）</span></span>
<span class="line">    QCoreApplication <span class="token function">app</span><span class="token punctuation">(</span>argc<span class="token punctuation">,</span> argv<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 2. 连接 aboutToQuit 信号，程序退出时统一清理单例</span></span>
<span class="line">    <span class="token class-name">QObject</span><span class="token double-colon punctuation">::</span><span class="token function">connect</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>app<span class="token punctuation">,</span> <span class="token operator">&amp;</span>QCoreApplication<span class="token double-colon punctuation">::</span>aboutToQuit<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">qDebug</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">"\n[Main] Starting singleton cleanup..."</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">SingletonManager</span><span class="token double-colon punctuation">::</span><span class="token function">instance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">cleanupAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">qDebug</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">"[Main] Singleton cleanup finished"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 3. 初始化单例（传递构造参数，自动注册清理回调）</span></span>
<span class="line">    <span class="token class-name">Singleton</span><span class="token operator">&lt;</span>MyService<span class="token operator">></span><span class="token double-colon punctuation">::</span><span class="token function">init</span><span class="token punctuation">(</span><span class="token string">"http://example.com"</span><span class="token punctuation">,</span> <span class="token number">8080</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 4. 三种访问单例的方式</span></span>
<span class="line">    <span class="token comment">// 方式1：获取指针（需手动判空，适合可选模块）</span></span>
<span class="line">    MyService <span class="token operator">*</span>svcPtr <span class="token operator">=</span> <span class="token function">GET_SINGLETON</span><span class="token punctuation">(</span>MyService<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>svcPtr<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        svcPtr<span class="token operator">-></span><span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 方式2：获取引用（调试模式断言非空，适合核心模块）</span></span>
<span class="line">    MyService <span class="token operator">&amp;</span>svcRef <span class="token operator">=</span> <span class="token function">GET_SINGLETON_REF</span><span class="token punctuation">(</span>MyService<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    svcRef<span class="token punctuation">.</span><span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 方式3：获取指针或替代值（适合降级策略）</span></span>
<span class="line">    MyService <span class="token operator">*</span>svcOr <span class="token operator">=</span> <span class="token function">GET_SINGLETON_OR</span><span class="token punctuation">(</span>MyService<span class="token punctuation">,</span> <span class="token keyword">nullptr</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>svcOr<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        svcOr<span class="token operator">-></span><span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 5. 示例：手动销毁单例（可选）</span></span>
<span class="line">    <span class="token class-name">QTimer</span><span class="token double-colon punctuation">::</span><span class="token function">singleShot</span><span class="token punctuation">(</span><span class="token number">2000</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">qDebug</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">"\n[Main] Shutting down MyService manually..."</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">Singleton</span><span class="token operator">&lt;</span>MyService<span class="token operator">></span><span class="token double-colon punctuation">::</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">// 销毁后可重新初始化</span></span>
<span class="line">        <span class="token function">qDebug</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">"[Main] Reinitializing MyService..."</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">Singleton</span><span class="token operator">&lt;</span>MyService<span class="token operator">></span><span class="token double-colon punctuation">::</span><span class="token function">init</span><span class="token punctuation">(</span><span class="token string">"http://new-example.com"</span><span class="token punctuation">,</span> <span class="token number">9090</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">GET_SINGLETON_REF</span><span class="token punctuation">(</span>MyService<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 6. 3秒后退出程序（触发 aboutToQuit 清理）</span></span>
<span class="line">    <span class="token class-name">QTimer</span><span class="token double-colon punctuation">::</span><span class="token function">singleShot</span><span class="token punctuation">(</span><span class="token number">3000</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>app<span class="token punctuation">,</span> <span class="token operator">&amp;</span>QCoreApplication<span class="token double-colon punctuation">::</span>quit<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">return</span> app<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>运行输出：</strong></p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">[MyService] Initialized with URL: "http://example.com" , port: 8080</span>
<span class="line">[MyService] Doing something with "http://example.com" : 8080</span>
<span class="line">[MyService] Doing something with "http://example.com" : 8080</span>
<span class="line">[MyService] Doing something with "http://example.com" : 8080</span>
<span class="line"></span>
<span class="line">[Main] Shutting down MyService manually...</span>
<span class="line">[MyService] Destructor called</span>
<span class="line">[Singleton] MyService cleaned up</span>
<span class="line">[Main] Reinitializing MyService...</span>
<span class="line">[MyService] Initialized with URL: "http://new-example.com" , port: 9090</span>
<span class="line">[MyService] Doing something with "http://new-example.com" : 9090</span>
<span class="line"></span>
<span class="line">[Main] Starting singleton cleanup...</span>
<span class="line">[MyService] Destructor called</span>
<span class="line">[Singleton] MyService cleaned up</span>
<span class="line">[Main] Singleton cleanup finished</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、核心注意事项" tabindex="-1"><a class="header-anchor" href="#四、核心注意事项"><span>四、核心注意事项</span></a></h2>
<h3 id="_4-1-初始化顺序" tabindex="-1"><a class="header-anchor" href="#_4-1-初始化顺序"><span>4.1 初始化顺序</span></a></h3>
<ol>
<li><strong>必须先创建 <code v-pre>QCoreApplication</code>：</strong> <code v-pre>QMutex</code>、<code v-pre>QObject</code> 等 Qt 组件依赖 Qt 环境初始化，因此 <code v-pre>QCoreApplication</code> 必须在 <code v-pre>Singleton::init()</code> 之前创建；</li>
<li><strong>单例依赖顺序：</strong> 若单例 A 依赖单例 B，需先初始化 B 再初始化 A（清理顺序与注册顺序一致，即先清理 A 再清理 B，避免依赖失效）。</li>
</ol>
<h3 id="_4-2-线程安全" tabindex="-1"><a class="header-anchor" href="#_4-2-线程安全"><span>4.2 线程安全</span></a></h3>
<ol>
<li><strong>初始化线程安全：</strong> <code v-pre>init()</code> 方法通过 <code v-pre>QMutex</code> 保护，多线程并发调用仅首次初始化有效；</li>
<li><strong>访问线程安全：</strong> <code v-pre>instance()</code> 方法通过 <code v-pre>QMutex</code> 保护，避免多线程同时访问未初始化的实例；</li>
<li><strong>单例内部线程安全：</strong> 本文框架仅保证实例创建 / 销毁的线程安全，单例类自身的成员函数需根据业务需求添加锁（如 <code v-pre>QMutex</code>）。</li>
</ol>
<h3 id="_4-3-禁止拷贝移动" tabindex="-1"><a class="header-anchor" href="#_4-3-禁止拷贝移动"><span>4.3 禁止拷贝移动</span></a></h3>
<ul>
<li>单例类必须禁用拷贝构造、赋值运算符（通过 <code v-pre>Q_DISABLE_COPY_MOVE</code> 或手动删除），否则可能通过拷贝创建多个实例；</li>
<li><code v-pre>Singleton&lt;T&gt;</code> 模板已禁用拷贝移动，目标单例类需自行禁用（如示例 <code v-pre>MyService</code> 虽未显式禁用，但继承 <code v-pre>QObject</code> 后自动禁用）。</li>
</ul>
<h3 id="_4-4-内存泄漏防护" tabindex="-1"><a class="header-anchor" href="#_4-4-内存泄漏防护"><span>4.4 内存泄漏防护</span></a></h3>
<ul>
<li>必须连接 <code v-pre>QCoreApplication::aboutToQuit</code> 到 <code v-pre>SingletonManager::cleanupAll()</code>，否则程序异常退出时可能导致内存泄漏；</li>
<li>若单例类继承 <code v-pre>QObject</code>，禁止将其设为其他 <code v-pre>QObject</code> 的子对象（否则 Qt 可能自动销毁实例，导致二次释放）。</li>
</ul>
<h3 id="_4-5-调试与-release-模式差异" tabindex="-1"><a class="header-anchor" href="#_4-5-调试与-release-模式差异"><span>4.5 调试与 Release 模式差异</span></a></h3>
<ul>
<li>调试模式（Debug）：<code v-pre>instance()</code>、<code v-pre>GET_SINGLETON_REF</code> 会触发断言，快速定位未初始化的错误；</li>
<li>发布模式（Release）：断言失效，<code v-pre>instance()</code> 可能返回 <code v-pre>nullptr</code>，需自行判空（建议核心模块使用 <code v-pre>GET_SINGLETON_REF</code>，非核心模块使用 <code v-pre>GET_SINGLETON</code> 并判空）。</li>
</ul>
<h2 id="五、进阶用法" tabindex="-1"><a class="header-anchor" href="#五、进阶用法"><span>五、进阶用法</span></a></h2>
<h3 id="_5-1-懒加载单例-无需手动-init" tabindex="-1"><a class="header-anchor" href="#_5-1-懒加载单例-无需手动-init"><span>5.1 懒加载单例（无需手动 init）</span></a></h3>
<p>默认实现需要手动调用 <code v-pre>init()</code>，若需懒加载（首次调用 <code v-pre>instance()</code> 时自动初始化），可修改 <code v-pre>instance()</code> 方法：</p>
<div class="language-cpp line-numbers-mode" data-highlighter="prismjs" data-ext="cpp"><pre v-pre><code><span class="line"><span class="token keyword">static</span> T <span class="token operator">*</span><span class="token function">instance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    QMutexLocker <span class="token function">locker</span><span class="token punctuation">(</span><span class="token operator">&amp;</span><span class="token function">mutex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">nullptr</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 无参构造（若需带参数，需调整设计，如全局配置）</span></span>
<span class="line">        <span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token function">T</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">// 自动注册清理回调</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">regIdRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">regIdRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token class-name">SingletonManager</span><span class="token double-colon punctuation">::</span><span class="token function">instance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">registerCleanup</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span></span>
<span class="line">                QMutexLocker <span class="token function">locker</span><span class="token punctuation">(</span><span class="token operator">&amp;</span><span class="token function">mutex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token keyword">delete</span> <span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token keyword">nullptr</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注意：</strong> 懒加载模式仅支持无参构造，若需带参数，需通过全局配置或其他方式传递参数。</p>
<h3 id="_5-2-单例销毁优先级" tabindex="-1"><a class="header-anchor" href="#_5-2-单例销毁优先级"><span>5.2 单例销毁优先级</span></a></h3>
<p>若需控制单例的销毁顺序（如先销毁依赖方，再销毁被依赖方），可扩展 <code v-pre>SingletonManager</code> 支持优先级：</p>
<div class="language-cpp line-numbers-mode" data-highlighter="prismjs" data-ext="cpp"><pre v-pre><code><span class="line"><span class="token comment">// 修改 SingletonManager 的注册接口，增加优先级参数</span></span>
<span class="line"><span class="token keyword">int</span> <span class="token function">registerCleanup</span><span class="token punctuation">(</span>std<span class="token double-colon punctuation">::</span>function<span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">></span> fn<span class="token punctuation">,</span> <span class="token keyword">int</span> priority <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    QMutexLocker <span class="token function">locker</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>m_mutex<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">int</span> id <span class="token operator">=</span> m_nextId<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">// 用 pair&lt;priority, id> 作为 key，按优先级降序排序（优先级高的先清理）</span></span>
<span class="line">    m_funcs<span class="token punctuation">.</span><span class="token function">emplace</span><span class="token punctuation">(</span>std<span class="token double-colon punctuation">::</span><span class="token function">make_pair</span><span class="token punctuation">(</span><span class="token operator">-</span>priority<span class="token punctuation">,</span> id<span class="token punctuation">)</span><span class="token punctuation">,</span> std<span class="token double-colon punctuation">::</span><span class="token function">move</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> id<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 对应的 map 类型修改为：</span></span>
<span class="line">std<span class="token double-colon punctuation">::</span>map<span class="token operator">&lt;</span>std<span class="token double-colon punctuation">::</span>pair<span class="token operator">&lt;</span><span class="token keyword">int</span><span class="token punctuation">,</span> <span class="token keyword">int</span><span class="token operator">></span><span class="token punctuation">,</span> std<span class="token double-colon punctuation">::</span>function<span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">>></span> m_funcs<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用时指定优先级：</p>
<div class="language-cpp line-numbers-mode" data-highlighter="prismjs" data-ext="cpp"><pre v-pre><code><span class="line"><span class="token comment">// 高优先级（先清理）</span></span>
<span class="line"><span class="token class-name">Singleton</span><span class="token operator">&lt;</span>MyService<span class="token operator">></span><span class="token double-colon punctuation">::</span><span class="token function">initWithPriority</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">,</span> <span class="token string">"http://example.com"</span><span class="token punctuation">,</span> <span class="token number">8080</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-线程局部单例-tls" tabindex="-1"><a class="header-anchor" href="#_5-3-线程局部单例-tls"><span>5.3 线程局部单例（TLS）</span></a></h3>
<p>若需每个线程拥有独立的单例实例（如线程局部缓存），可修改 <code v-pre>instanceRef()</code> 为线程局部变量：</p>
<div class="language-cpp line-numbers-mode" data-highlighter="prismjs" data-ext="cpp"><pre v-pre><code><span class="line"><span class="token keyword">static</span> T <span class="token operator">*</span><span class="token operator">&amp;</span><span class="token function">instanceRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">thread_local</span> T <span class="token operator">*</span>inst <span class="token operator">=</span> <span class="token keyword">nullptr</span><span class="token punctuation">;</span> <span class="token comment">// 线程局部变量，每个线程独立</span></span>
<span class="line">    <span class="token keyword">return</span> inst<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">static</span> QMutex <span class="token operator">&amp;</span><span class="token function">mutex</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">thread_local</span> QMutex m<span class="token punctuation">;</span> <span class="token comment">// 每个线程独立的锁</span></span>
<span class="line">    <span class="token keyword">return</span> m<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：线程局部单例的清理需在线程退出时手动调用 <code v-pre>shutdown()</code>，避免线程泄漏。</p>
<h2 id="六、常见问题排查" tabindex="-1"><a class="header-anchor" href="#六、常见问题排查"><span>六、常见问题排查</span></a></h2>
<h3 id="_6-1-断言失败-singleton-not-initialized" tabindex="-1"><a class="header-anchor" href="#_6-1-断言失败-singleton-not-initialized"><span>6.1 断言失败：Singleton not initialized</span></a></h3>
<ul>
<li>原因：未调用 <code v-pre>Singleton::init()</code> 就调用 <code v-pre>instance()</code> 或 <code v-pre>GET_SINGLETON_REF</code>；</li>
<li>解决：确保 <code v-pre>init()</code> 在 <code v-pre>instance()</code> 之前调用，且 <code v-pre>QCoreApplication</code> 已创建。</li>
</ul>
<h3 id="_6-2-内存泄漏-valgrind-检测到泄漏" tabindex="-1"><a class="header-anchor" href="#_6-2-内存泄漏-valgrind-检测到泄漏"><span>6.2 内存泄漏（Valgrind 检测到泄漏）</span></a></h3>
<ul>
<li>原因：未连接 <code v-pre>QCoreApplication::aboutToQuit</code> 到 <code v-pre>SingletonManager::cleanupAll()</code>；</li>
<li>解决：在 <code v-pre>main</code> 函数中添加连接代码。</li>
</ul>
<h3 id="_6-3-二次释放崩溃" tabindex="-1"><a class="header-anchor" href="#_6-3-二次释放崩溃"><span>6.3 二次释放崩溃</span></a></h3>
<ul>
<li>原因：单例类被 Qt 父子对象管理（如设置了父对象），导致 Qt 自动销毁后，<code v-pre>SingletonManager</code> 再次销毁；</li>
<li>解决：单例类构造时父对象设为 <code v-pre>nullptr</code>，禁止将单例设为其他 <code v-pre>QObject</code> 的子对象。</li>
</ul>
<h3 id="_6-4-多线程并发初始化导致崩溃" tabindex="-1"><a class="header-anchor" href="#_6-4-多线程并发初始化导致崩溃"><span>6.4 多线程并发初始化导致崩溃</span></a></h3>
<ul>
<li>原因：使用了 C++11 之前的编译器（静态局部变量初始化非线程安全）；</li>
<li>解决：升级编译器到支持 C++11 及以上标准，或手动为 <code v-pre>instanceRef()</code> 加锁。</li>
</ul>
<h2 id="七、框架优势总结" tabindex="-1"><a class="header-anchor" href="#七、框架优势总结"><span>七、框架优势总结</span></a></h2>
<p>本文实现的单例框架相比传统单例（如饿汉式、懒汉式），具有以下优势：</p>
<ol>
<li><strong>通用性强：</strong> 模板化设计，支持任意可构造类，无需修改目标类代码；</li>
<li><strong>线程安全：</strong> 基于 <code v-pre>QMutex</code> 实现初始化 / 访问安全，兼容 Qt 多线程环境；</li>
<li><strong>自动清理：</strong> 通过 <code v-pre>SingletonManager</code> 统一管理，避免内存泄漏；</li>
<li><strong>灵活构造：</strong> 支持带参数构造（完美转发），适配复杂单例类；</li>
<li><strong>安全易用：</strong> 提供断言校验、宏定义快捷访问，降低使用成本；</li>
<li><strong>可扩展：</strong> 支持手动销毁、优先级清理、线程局部单例等进阶需求。</li>
</ol>
<p>该框架可直接用于 Qt 控制台程序、桌面程序（QWidget）、移动程序（Qt Quick）等所有场景，是 Qt 开发中单例模式的优选实现方案。</p>
</div></template>



import{_ as s,c as a,e,o as i}from"./app-QoGjbdPI.js";const l={};function t(p,n){return i(),a("div",null,[...n[0]||(n[0]=[e(`<h1 id="搜索算法实现-golang版" tabindex="-1"><a class="header-anchor" href="#搜索算法实现-golang版"><span>搜索算法实现 - Golang版</span></a></h1><hr><h2 id="算法列表" tabindex="-1"><a class="header-anchor" href="#算法列表"><span>算法列表</span></a></h2><ul><li>[X] <a href="#SequentialSearch">顺序查找（Sequential Search）</a></li><li>[X] <a href="#BinarySearch">二叉树查找（Binary Search）</a></li><li>[X] <a href="#TernarySearch">三叉树查找（Ternary Search）</a></li><li>[X] <a href="#InterpolationSearch">插值查找（Interpolation Search）</a></li><li>[X] <a href="#FibonacciSearch">斐波那契查找（Fibonacci Search）</a></li><li>[X] <a href="#ExponentialSearch">指数查找（Exponential Search）</a></li><li>[X] <a href="#TreeTableSearch">树表查找（Tree table lookup）</a></li><li>[X] <a href="#BlockingSearch">分块查找（Blocking Search）</a></li><li>[ ] <a href="#HashSearch">哈希查找（Hash Search）</a></li></ul><h2 id="算法实现" tabindex="-1"><a class="header-anchor" href="#算法实现"><span>算法实现</span></a></h2><h3 id="顺序查找-sequential-search" tabindex="-1"><a class="header-anchor" href="#顺序查找-sequential-search"><span><span id="SequentialSearch">顺序查找（Sequential Search）</span></span></a></h3><div class="language-golang line-numbers-mode" data-highlighter="prismjs" data-ext="golang"><pre><code><span class="line">func SequentialSearch(array []int, target int) int {</span>
<span class="line">	if array == nil || len(array) == 0 {</span>
<span class="line">		return -1</span>
<span class="line">	}</span>
<span class="line">	for i := 0; i &lt; len(array); i++ {</span>
<span class="line">		if array[i] == target {</span>
<span class="line">			return i</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line">	return -1</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="二叉树查找-binary-search" tabindex="-1"><a class="header-anchor" href="#二叉树查找-binary-search"><span><span id="BinarySearch">二叉树查找（Binary Search）</span></span></a></h3><h4 id="基本二分查找" tabindex="-1"><a class="header-anchor" href="#基本二分查找"><span>基本二分查找</span></a></h4><div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre><code><span class="line"><span class="token keyword">func</span> <span class="token function">BinarySearch</span><span class="token punctuation">(</span>array <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">,</span> target <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token builtin">int</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">if</span> array <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token operator">||</span> <span class="token function">len</span><span class="token punctuation">(</span>array<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	low <span class="token operator">:=</span> <span class="token number">0</span></span>
<span class="line">	high <span class="token operator">:=</span> <span class="token function">len</span><span class="token punctuation">(</span>array<span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">1</span></span>
<span class="line">	mid <span class="token operator">:=</span> <span class="token number">0</span></span>
<span class="line">	<span class="token keyword">for</span> low <span class="token operator">&lt;=</span> high <span class="token punctuation">{</span></span>
<span class="line">		<span class="token comment">//mid = low + (high-low)/2</span></span>
<span class="line">		mid <span class="token operator">=</span> low <span class="token operator">+</span> <span class="token punctuation">(</span>high<span class="token operator">-</span>low<span class="token punctuation">)</span><span class="token operator">&gt;&gt;</span><span class="token number">1</span></span>
<span class="line">		<span class="token keyword">if</span> array<span class="token punctuation">[</span>mid<span class="token punctuation">]</span> <span class="token operator">&gt;</span> target <span class="token punctuation">{</span></span>
<span class="line">			high <span class="token operator">=</span> mid <span class="token operator">-</span> <span class="token number">1</span></span>
<span class="line">		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> array<span class="token punctuation">[</span>mid<span class="token punctuation">]</span> <span class="token operator">&lt;</span> target <span class="token punctuation">{</span></span>
<span class="line">			low <span class="token operator">=</span> mid <span class="token operator">+</span> <span class="token number">1</span></span>
<span class="line">		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">			<span class="token keyword">return</span> mid</span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="二分查找第一个元素的位置" tabindex="-1"><a class="header-anchor" href="#二分查找第一个元素的位置"><span>二分查找第一个元素的位置</span></a></h4><div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre><code><span class="line"><span class="token keyword">func</span> <span class="token function">LowerBound</span><span class="token punctuation">(</span>array <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">,</span> target <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token builtin">int</span> <span class="token punctuation">{</span></span>
<span class="line">	low<span class="token punctuation">,</span> high<span class="token punctuation">,</span> mid <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token function">len</span><span class="token punctuation">(</span>array<span class="token punctuation">)</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">0</span></span>
<span class="line">	<span class="token keyword">for</span> low <span class="token operator">&lt;=</span> high <span class="token punctuation">{</span></span>
<span class="line">		<span class="token comment">//mid = low + (high-low)/2</span></span>
<span class="line">		mid <span class="token operator">=</span> low <span class="token operator">+</span> <span class="token punctuation">(</span>high<span class="token operator">-</span>low<span class="token punctuation">)</span><span class="token operator">&gt;&gt;</span><span class="token number">1</span></span>
<span class="line">		<span class="token keyword">if</span> array<span class="token punctuation">[</span>mid<span class="token punctuation">]</span> <span class="token operator">&gt;=</span> target <span class="token punctuation">{</span></span>
<span class="line">			high <span class="token operator">=</span> mid <span class="token operator">-</span> <span class="token number">1</span></span>
<span class="line">		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">			low <span class="token operator">=</span> mid <span class="token operator">+</span> <span class="token number">1</span></span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token keyword">return</span> low</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="二分查找第一个大于该元素的位置" tabindex="-1"><a class="header-anchor" href="#二分查找第一个大于该元素的位置"><span>二分查找第一个大于该元素的位置</span></a></h4><div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre><code><span class="line"><span class="token keyword">func</span> <span class="token function">UpperBound</span><span class="token punctuation">(</span>array <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">,</span> target <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token builtin">int</span> <span class="token punctuation">{</span></span>
<span class="line">	low<span class="token punctuation">,</span> high<span class="token punctuation">,</span> mid <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token function">len</span><span class="token punctuation">(</span>array<span class="token punctuation">)</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">0</span></span>
<span class="line">	<span class="token keyword">for</span> low <span class="token operator">&lt;=</span> high <span class="token punctuation">{</span></span>
<span class="line">		<span class="token comment">//mid = low + (high-low)/2</span></span>
<span class="line">		mid <span class="token operator">=</span> low <span class="token operator">+</span> <span class="token punctuation">(</span>high<span class="token operator">-</span>low<span class="token punctuation">)</span><span class="token operator">&gt;&gt;</span><span class="token number">1</span></span>
<span class="line">		<span class="token keyword">if</span> array<span class="token punctuation">[</span>mid<span class="token punctuation">]</span> <span class="token operator">&gt;</span> target <span class="token punctuation">{</span></span>
<span class="line">			high <span class="token operator">=</span> mid <span class="token operator">-</span> <span class="token number">1</span></span>
<span class="line">		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">			low <span class="token operator">=</span> mid <span class="token operator">+</span> <span class="token number">1</span></span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token keyword">return</span> low</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="三叉树查找-ternary-search" tabindex="-1"><a class="header-anchor" href="#三叉树查找-ternary-search"><span><span id="TernarySearch">三叉树查找（Ternary Search）</span></span></a></h3><div class="language-golang line-numbers-mode" data-highlighter="prismjs" data-ext="golang"><pre><code><span class="line">func TernarySearch(array []int, target int) int {</span>
<span class="line">	if array == nil || len(array) == 0 {</span>
<span class="line">		return -1</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	low, high := 0, len(array)-2</span>
<span class="line">	mid1, mid2 := 0, 0</span>
<span class="line">	for low &lt;= high {</span>
<span class="line">		mid1 = low + (high-low)/3</span>
<span class="line">		mid2 = high + (high-low)/3</span>
<span class="line"></span>
<span class="line">		if array[mid1] == target {</span>
<span class="line">			return mid1</span>
<span class="line">		} else if array[mid2] == target {</span>
<span class="line">			return mid2</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		if target &lt; array[mid1] {</span>
<span class="line">			high = mid1 - 1</span>
<span class="line">		} else if target &gt; array[mid2] {</span>
<span class="line">			low = mid2 + 1</span>
<span class="line">		} else {</span>
<span class="line">			low = mid1 + 1</span>
<span class="line">			high = mid2 - 1</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	return -1</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="插值查找-interpolation-search" tabindex="-1"><a class="header-anchor" href="#插值查找-interpolation-search"><span><span id="InterpolationSearch">插值查找（Interpolation Search）</span></span></a></h3><div class="language-golang line-numbers-mode" data-highlighter="prismjs" data-ext="golang"><pre><code><span class="line">func InterpolationSearch(array []int, target int) int {</span>
<span class="line">	if array == nil || len(array) == 0 {</span>
<span class="line">		return -1</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	low, high := 0, len(array)-1</span>
<span class="line"></span>
<span class="line">	var mid = 0</span>
<span class="line">	for array[low] &lt; target &amp;&amp; array[high] &gt; target {</span>
<span class="line">		//mid = low + (high-low)/2</span>
<span class="line">		mid = low + (high-low)&gt;&gt;1</span>
<span class="line"></span>
<span class="line">		if array[mid] &lt; target {</span>
<span class="line">			low = mid + 1</span>
<span class="line">		} else if array[mid] &gt; target {</span>
<span class="line">			high = mid - 1</span>
<span class="line">		} else {</span>
<span class="line">			return mid</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	if array[low] == target {</span>
<span class="line">		return low</span>
<span class="line">	} else if array[high] == target {</span>
<span class="line">		return high</span>
<span class="line">	} else {</span>
<span class="line">		return -1</span>
<span class="line">	}</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="斐波那契查找-fibonacci-search" tabindex="-1"><a class="header-anchor" href="#斐波那契查找-fibonacci-search"><span><span id="FibonacciSearch">斐波那契查找（Fibonacci Search）</span></span></a></h3><p>在是二分查找的一种提升算法，通过运用黄金比例的概念在数列中选择查找点进行查找，提高查找效率。注意同时属于一种有序查找算法</p><div class="language-golang line-numbers-mode" data-highlighter="prismjs" data-ext="golang"><pre><code><span class="line">// FibonacciSearch 斐波那查找</span>
<span class="line">func FibonacciSearch(array []int, target int) int {</span>
<span class="line">	if array == nil || len(array) == 0 {</span>
<span class="line">		return -1</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	high := len(array) - 1</span>
<span class="line">	max := array[high]</span>
<span class="line"></span>
<span class="line">	fibMMm2 := 0              // (m-2)&#39;th Fibonacci No.</span>
<span class="line">	fibMMm1 := 1              // (m-1)&#39;th Fibonacci No.</span>
<span class="line">	fibM := fibMMm2 + fibMMm1 // m&#39;th Fibonacci</span>
<span class="line"></span>
<span class="line">	for fibM &lt; max {</span>
<span class="line">		fibMMm2 = fibMMm1</span>
<span class="line">		fibMMm1 = fibM</span>
<span class="line">		fibM = fibMMm2 + fibMMm1</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	var mid, offset = 0, -1</span>
<span class="line">	for fibM &gt; 1 {</span>
<span class="line">		mid = algorithm.Min(offset+fibMMm2, high)</span>
<span class="line"></span>
<span class="line">		if array[mid] &lt; target {</span>
<span class="line">			fibM = fibMMm1</span>
<span class="line">			fibMMm1 = fibMMm2</span>
<span class="line">			fibMMm2 = fibM - fibMMm1</span>
<span class="line">			offset = mid</span>
<span class="line">		} else if array[mid] &gt; target {</span>
<span class="line">			fibM = fibMMm2</span>
<span class="line">			fibMMm1 = fibMMm1 - fibMMm2</span>
<span class="line">			fibMMm2 = fibM - fibMMm1</span>
<span class="line">		} else {</span>
<span class="line">			return mid</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	if offset &lt; high &amp;&amp; (array[offset+1] == target) {</span>
<span class="line">		return offset + 1</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	return -1</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// fibonacciRecursion 递归求斐波那数</span>
<span class="line">// f(n) = f(n-1) + f(n-2), n &gt;= 2</span>
<span class="line">func fibonacciRecursion(n int) int {</span>
<span class="line">	if n == 0 {</span>
<span class="line">		return 0</span>
<span class="line">	} else if n == 1 {</span>
<span class="line">		return 1</span>
<span class="line">	}</span>
<span class="line">	return fibonacciRecursion(n-1) + fibonacciRecursion(n-2)</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// fibonacci 求斐波那数</span>
<span class="line">func fibonacci(n int) int {</span>
<span class="line">	a := 0</span>
<span class="line">	b := 1</span>
<span class="line">	for i := 0; i &lt; n; i++ {</span>
<span class="line">		temp := a</span>
<span class="line">		a = b</span>
<span class="line">		b = temp + a</span>
<span class="line">	}</span>
<span class="line">	return a</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="指数查找-exponential-search" tabindex="-1"><a class="header-anchor" href="#指数查找-exponential-search"><span><span id="ExponentialSearch">指数查找（Exponential Search）</span></span></a></h3><div class="language-golang line-numbers-mode" data-highlighter="prismjs" data-ext="golang"><pre><code><span class="line">func ExponentialSearch(array []int, target int) int {</span>
<span class="line">	if array == nil || len(array) == 0 {</span>
<span class="line">		return -1</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	if array[0] == target {</span>
<span class="line">		return 0</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	length := len(array)</span>
<span class="line"></span>
<span class="line">	if array[length-1] == target {</span>
<span class="line">		return length - 1</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	searchRange := 1</span>
<span class="line">	for searchRange &lt; length &amp;&amp; array[searchRange] &lt;= target {</span>
<span class="line">		//searchRange = searchRange * 2</span>
<span class="line">		searchRange = searchRange &lt;&lt; 1</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	//startIndex := searchRange / 2</span>
<span class="line">	startIndex := searchRange &gt;&gt; 1</span>
<span class="line">	endIndex := algorithm.Min(searchRange, length)</span>
<span class="line">	bi := BinarySearch(array[startIndex:endIndex], target)</span>
<span class="line">	if bi == -1 {</span>
<span class="line">		return -1</span>
<span class="line">	} else {</span>
<span class="line">		return bi + startIndex</span>
<span class="line">	}</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="树表查找-tree-table-lookup" tabindex="-1"><a class="header-anchor" href="#树表查找-tree-table-lookup"><span><span id="TreeTableSearch">树表查找（Tree table lookup）</span></span></a></h3><div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre><code><span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"></div></div><h3 id="分块查找-blocking-search" tabindex="-1"><a class="header-anchor" href="#分块查找-blocking-search"><span><span id="BlockingSearch">分块查找（Blocking Search）</span></span></a></h3><div class="language-golang line-numbers-mode" data-highlighter="prismjs" data-ext="golang"><pre><code><span class="line">func JumpSearch(array []int, target int) int {</span>
<span class="line">	if array == nil || len(array) == 0 {</span>
<span class="line">		return -1</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	length := len(array)</span>
<span class="line">	step := int(math.Sqrt(float64(length)))</span>
<span class="line"></span>
<span class="line">	prev := 0</span>
<span class="line">	for array[algorithm.Min(step, length)-1] &lt; target {</span>
<span class="line">		prev = step</span>
<span class="line">		step += int(math.Sqrt(float64(length)))</span>
<span class="line">		if prev &gt;= length {</span>
<span class="line">			return -1</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	for array[prev] &lt; target {</span>
<span class="line">		prev++</span>
<span class="line">		if prev == algorithm.Min(step, length) {</span>
<span class="line">			return -1</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	if array[prev] == target {</span>
<span class="line">		return prev</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	return -1</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="哈希查找-hash-search" tabindex="-1"><a class="header-anchor" href="#哈希查找-hash-search"><span><span id="HashSearch">哈希查找（Hash Search）</span></span></a></h3><div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre><code><span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"></div></div>`,29)])])}const r=s(l,[["render",t]]),d=JSON.parse('{"path":"/posts/go_algorithm_search.html","title":"搜索算法实现 - Golang版","lang":"zh-CN","frontmatter":{"date":"2020-01-01T00:00:00.000Z","category":["Go编程"],"tag":["Golang","算法"],"sticky":10},"headers":[{"level":2,"title":"算法列表","slug":"算法列表","link":"#算法列表","children":[]},{"level":2,"title":"算法实现","slug":"算法实现","link":"#算法实现","children":[{"level":3,"title":"顺序查找（Sequential Search）","slug":"顺序查找-sequential-search","link":"#顺序查找-sequential-search","children":[]},{"level":3,"title":"二叉树查找（Binary Search）","slug":"二叉树查找-binary-search","link":"#二叉树查找-binary-search","children":[]},{"level":3,"title":"三叉树查找（Ternary Search）","slug":"三叉树查找-ternary-search","link":"#三叉树查找-ternary-search","children":[]},{"level":3,"title":"插值查找（Interpolation Search）","slug":"插值查找-interpolation-search","link":"#插值查找-interpolation-search","children":[]},{"level":3,"title":"斐波那契查找（Fibonacci Search）","slug":"斐波那契查找-fibonacci-search","link":"#斐波那契查找-fibonacci-search","children":[]},{"level":3,"title":"指数查找（Exponential Search）","slug":"指数查找-exponential-search","link":"#指数查找-exponential-search","children":[]},{"level":3,"title":"树表查找（Tree table lookup）","slug":"树表查找-tree-table-lookup","link":"#树表查找-tree-table-lookup","children":[]},{"level":3,"title":"分块查找（Blocking Search）","slug":"分块查找-blocking-search","link":"#分块查找-blocking-search","children":[]},{"level":3,"title":"哈希查找（Hash Search）","slug":"哈希查找-hash-search","link":"#哈希查找-hash-search","children":[]}]}],"git":{"updatedTime":1774788457000,"contributors":[{"name":"tx7do","username":"tx7do","email":"yanglinbo@gmail.com","commits":4,"url":"https://github.com/tx7do"},{"name":"Bobo","username":"Bobo","email":"yanglinbo@gmail.com","commits":1,"url":"https://github.com/Bobo"}],"changelog":[{"hash":"a3e88b19cfead00baa606aa5110b2802dac32768","time":1774788457000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: REBUILD."},{"hash":"b9257ef8529f1e0dbc8d30d9a732504a42877230","time":1646811438000,"email":"yanglinbo@gmail.com","author":"tx7do","message":"feat: add post"},{"hash":"f494514c18d249772483f78ab696efde7095ba5d","time":1646637948000,"email":"yanglinbo@gmail.com","author":"tx7do","message":"feat: add anchor"},{"hash":"79ba9a13d1f1270a8853a27c6fce476a065c77ed","time":1646636493000,"email":"yanglinbo@gmail.com","author":"tx7do","message":"feat: add post"},{"hash":"d6f9884c963ffe83d7e69ba10969f895a59e05e3","time":1645497880000,"email":"yanglinbo@gmail.com","author":"tx7do","message":"feat: add edit post"}]},"filePathRelative":"posts/go_algorithm_search.md","excerpt":"\\n<hr>\\n<h2>算法列表</h2>\\n<ul>\\n<li>[X] <a href=\\"#SequentialSearch\\">顺序查找（Sequential Search）</a></li>\\n<li>[X] <a href=\\"#BinarySearch\\">二叉树查找（Binary Search）</a></li>\\n<li>[X] <a href=\\"#TernarySearch\\">三叉树查找（Ternary Search）</a></li>\\n<li>[X] <a href=\\"#InterpolationSearch\\">插值查找（Interpolation Search）</a></li>\\n<li>[X] <a href=\\"#FibonacciSearch\\">斐波那契查找（Fibonacci Search）</a></li>\\n<li>[X] <a href=\\"#ExponentialSearch\\">指数查找（Exponential Search）</a></li>\\n<li>[X] <a href=\\"#TreeTableSearch\\">树表查找（Tree table lookup）</a></li>\\n<li>[X] <a href=\\"#BlockingSearch\\">分块查找（Blocking Search）</a></li>\\n<li>[ ] <a href=\\"#HashSearch\\">哈希查找（Hash Search）</a></li>\\n</ul>"}');export{r as comp,d as data};

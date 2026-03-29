<template><div><h1 id="破解-wifi-密码" tabindex="-1"><a class="header-anchor" href="#破解-wifi-密码"><span>破解 WiFi 密码</span></a></h1>
<h2 id="查看网卡名称" tabindex="-1"><a class="header-anchor" href="#查看网卡名称"><span>查看网卡名称</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">ifconfig</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>Windows下面是：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">ipconfig</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="使用airport监听无线网络" tabindex="-1"><a class="header-anchor" href="#使用airport监听无线网络"><span>使用airport监听无线网络</span></a></h2>
<p>给 <code v-pre>airport</code> 做一个软链接：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">ln</span> <span class="token parameter variable">-s</span> /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport /usr/local/bin/airport</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>现在就可以直接使用 <code v-pre>airport</code> 查看一下附近的 WiFi 信号：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">airport <span class="token parameter variable">-s</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li><strong>SSID</strong>: Wi-Fi 名称</li>
<li><strong>BSSID</strong>: Wi-Fi 设备的硬件地址</li>
<li><strong>RSSI</strong>: 信号强度，值是负数，绝对值越小信号越强</li>
<li><strong>CHANNEL</strong>: Wi-Fi 信道</li>
<li><strong>HT</strong>: 吞吐量模式，一般都为 Y</li>
<li><strong>CC</strong>: 国家，中国为 CN</li>
<li><strong>SECURITY</strong>: 加密方式</li>
</ul>
<h2 id="使用airport进行抓包" tabindex="-1"><a class="header-anchor" href="#使用airport进行抓包"><span>使用airport进行抓包</span></a></h2>
<p>使用以下命令进行抓包，<code v-pre>1</code>是指定抓取的信道，如果省略则默认为全部信道。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">airport en1 sniff <span class="token number">1</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>一段时间后<code v-pre>Ctr+c</code>停止抓包，会生成一个.cap包，看到如下提示</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">Session saved to /tmp/airportSniff0RjCAO.cap</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="安装-aircrack-ng" tabindex="-1"><a class="header-anchor" href="#安装-aircrack-ng"><span>安装 Aircrack-ng</span></a></h2>
<h3 id="windows" tabindex="-1"><a class="header-anchor" href="#windows"><span>Windows</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">scoop <span class="token function">install</span> aircrack-ng</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="ubuntu" tabindex="-1"><a class="header-anchor" href="#ubuntu"><span>Ubuntu</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token function">install</span> aircrack-ng</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="macos" tabindex="-1"><a class="header-anchor" href="#macos"><span>MacOS</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">brew <span class="token function">install</span> aircrack-ng</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="字典" tabindex="-1"><a class="header-anchor" href="#字典"><span>字典</span></a></h2>
<p>破解都是使用最蠢的暴力破解。因此，需要有密码字典。</p>
<ul>
<li><a href="(https://github.com/conwnet/wpa-dictionary)">wpa-dictionary</a></li>
</ul>
<h2 id="开始破解" tabindex="-1"><a class="header-anchor" href="#开始破解"><span>开始破解</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">aircrack-ng <span class="token parameter variable">-w</span> common.txt /tmp/airportSniff0RjCAO.cap</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://github.com/brannondorsey/wifi-cracking" target="_blank" rel="noopener noreferrer">Wi-Fi Cracking</a></li>
<li><a href="https://github.com/derv82/wifite2" target="_blank" rel="noopener noreferrer">Wifite</a></li>
<li><a href="https://www.aircrack-ng.org/downloads.html" target="_blank" rel="noopener noreferrer">Aircrack-ng</a></li>
<li><a href="https://imlifengfeng.github.io/article/15/" target="_blank" rel="noopener noreferrer">教你破解隔壁妹子的 wifi 密码，成功率高达 90%</a></li>
<li><a href="https://www.vuln.cn/2674" target="_blank" rel="noopener noreferrer">aircrack-ng 无线网 WIFI 破解教程(上) – WIFI 破解原理</a></li>
<li><a href="https://blog.csdn.net/qq_27198345/article/details/108425823" target="_blank" rel="noopener noreferrer">macOS 上使用 aircrack-ng 暴力破解 Wi-Fi 密码</a></li>
<li><a href="https://github.com/ZoraZora59/Get_Wifi_Password_On_MacOS" target="_blank" rel="noopener noreferrer">通过 Aircrack-ng 等工具获取 Wifi 密码</a></li>
<li><a href="https://sysin.org/blog/macos-turn-off-monitor-mode/" target="_blank" rel="noopener noreferrer">Mac 如何关闭 Wi-Fi 监视模式（Monitor Mode）</a></li>
</ul>
</div></template>



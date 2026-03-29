<template><div><h1 id="firefly-roc-rk3588s-pc" tabindex="-1"><a class="header-anchor" href="#firefly-roc-rk3588s-pc"><span>Firefly ROC-RK3588S-PC</span></a></h1>
<p>默认安装的是Android系统，我们不需要，我们需要一个Ubuntu Desktop。</p>
<h2 id="安装工具" tabindex="-1"><a class="header-anchor" href="#安装工具"><span>安装工具</span></a></h2>
<ul>
<li>安装RK USB驱动 DriverAssistant</li>
<li>安装运行 RKDevTool</li>
<li>下载固件：Ubuntu、Debian、Buildroot……</li>
</ul>
<h2 id="开发板进入到loader模式" tabindex="-1"><a class="header-anchor" href="#开发板进入到loader模式"><span>开发板进入到Loader模式</span></a></h2>
<ol>
<li>先断开电源；</li>
<li>USB线一端插入到OTG口，另外一端插入到电脑；</li>
<li>按住<code v-pre>RECOVERY 键</code>（需要注意，为了防止误触，它的按钮被隐藏在侧面，手指头探下，将黑色的按钮往白色的按钮基座抠）；</li>
<li>接通电源；</li>
<li><code v-pre>RECOVERY 键</code>持续摁住大约2秒。</li>
</ol>
<p><img src="https://wiki.t-firefly.com/zh_CN/ROC-RK3588S-PC/_images/upgrade_otg_interface.jpg" alt="OTG口说明"></p>
<p><img src="https://wiki.t-firefly.com/zh_CN/ROC-RK3588S-PC/_images/upgrade_recovery_reset.jpg" alt="RECOVER按钮说明"></p>
<h2 id="rkdevtool安装ubuntu固件" tabindex="-1"><a class="header-anchor" href="#rkdevtool安装ubuntu固件"><span>RKDevTool安装Ubuntu固件</span></a></h2>
<p>如果成功启动了<code v-pre>LOADER模式</code>，则软件界面最下方会显示：<code v-pre>Found One LOADER Device</code>或者<code v-pre>发现一个LOADER设备</code>。</p>
<p><img src="https://wiki.t-firefly.com/zh_CN/ROC-RK3588S-PC/_images/upgrade_firmware_androidtool_zh.png" alt="LOADER模式"></p>
<p>固件是一个<code v-pre>img</code>后缀的文件，比如：<code v-pre>ROC-RK3588S-PC_Ubuntu22.04-Xfce-r31153_v1.4.0g_250114.img</code>。它是一个<code v-pre>统一固件</code>，所谓的统一固件，就是由由分区表、bootloader、uboot、kernel、system等所有文件打包合并成的单个文件。</p>
<p>升级Ubuntu固件的步骤如下：</p>
<ol>
<li>点击切换至 <code v-pre>Upgrade Firmware</code> / <code v-pre>升级固件</code> 页。</li>
<li>点击 <code v-pre>Firmware</code> / <code v-pre>固件</code> 按钮，打开要升级的固件文件。升级工具会显示详细的固件信息。</li>
<li>点击 <code v-pre>Upgrade</code> / <code v-pre>升级</code> 按钮，开始安装Ubuntu固件。</li>
</ol>
<p><img src="https://wiki.t-firefly.com/zh_CN/ROC-RK3588S-PC/_images/upgrade_firmware_download_fail.png" alt="安装Ubuntu固件"></p>
<p>安装完之后，只要连接上网络就可以直接登录操作系统了。它带有WiFi，但是显然无线网络肯定是需要配置的，所以，我们一开始可以用一条网线连接到路由器上。</p>
<p>系统预设了账号名：</p>
<ul>
<li><strong>Ubuntu Desktop 系统</strong>：默认的账号名密码为：<code v-pre>firefly</code>和<code v-pre>firefly</code>；</li>
<li><strong>Ubuntu Minimal 系统</strong>：：默认的账号名密码为：<code v-pre>root</code>和<code v-pre>firefly</code>。</li>
</ul>
<h2 id="docker" tabindex="-1"><a class="header-anchor" href="#docker"><span>Docker</span></a></h2>
<p>安装Docker：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> docker.io</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>设置为开机启动：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> systemctl <span class="token builtin class-name">enable</span> <span class="token function">docker</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="vnc" tabindex="-1"><a class="header-anchor" href="#vnc"><span>VNC</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 更新软件源</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> update</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装TightVNC服务器</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> tightvncserver</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装Xfce桌面环境（若未安装）</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> xfce4 xfce4-goodies</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="xrdp" tabindex="-1"><a class="header-anchor" href="#xrdp"><span>XRDP</span></a></h2>
<p>安装</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> xrdp</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>启动服务</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> systemctl start xrdp</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>开机自启动</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> systemctl <span class="token builtin class-name">enable</span> xrdp</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="vino" tabindex="-1"><a class="header-anchor" href="#vino"><span>Vino</span></a></h2>
<p>安装</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> vino</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">gsettings <span class="token builtin class-name">set</span> org.gnome.Vino require-encryption <span class="token boolean">false</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>sudo systemctl enable vino
sudo systemctl start vino</p>
<h2 id="连接wifi" tabindex="-1"><a class="header-anchor" href="#连接wifi"><span>连接WiFi</span></a></h2>
<p>查看WiFi列表</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">nmcli device wifi list</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>连接WiFi（必须要管理员权限）</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> nmcli device wifi connect <span class="token string">"SSID"</span> password <span class="token string">"密码"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="gnome" tabindex="-1"><a class="header-anchor" href="#gnome"><span>GNOME</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> ubuntu-gnome-desktop</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>安装的时候选择显示管理器，选择<code v-pre>gdm3</code>。</p>
<p>查看配置文件<code v-pre>/etc/pam.d/gdm-password</code>：</p>
<p>如果以下配置是注释的，那么桌面系统是禁止使用root账号登录的，如果希望能够使用root账号登录，则请取消注释：</p>
<div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre v-pre><code><span class="line"><span class="token comment">#auth   required        pam_succeed_if.so user != root quiet_success</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>现在就可以启用Wayland了：</p>
<ol>
<li><strong>注销当前用户</strong>（回到登录界面）</li>
<li>在登录界面，点击用户名旁边的 齿轮图标（设置按钮）或者屏幕右上角的一个圆形图标按钮。</li>
<li>在弹出的菜单中选择 <strong>&quot;Ubuntu on Wayland&quot;</strong> 选项</li>
<li>输入密码登录，系统会以 Wayland 模式启动</li>
</ol>
<p>如果无法正常启动Wayland，使用下面的命令恢复到xfce：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> dpkg-reconfigure lightdm</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="docker-1" tabindex="-1"><a class="header-anchor" href="#docker-1"><span>Docker</span></a></h2>
<p>如果需要进入容器：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> <span class="token operator">&lt;</span>容器名或ID<span class="token operator">></span> <span class="token function">sh</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>检查容器是否有网络相关的限制</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> inspect <span class="token parameter variable">-f</span> <span class="token string">'{{.HostConfig.CapAdd}} {{.HostConfig.NetworkMode}}'</span> <span class="token operator">&lt;</span>容器名或ID<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>若是网络不通，有可能是网关缺失，</p>
<p>手动添加临时路由：（需替换为宿主机网关，通常是172.17.0.1）</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> <span class="token operator">&lt;</span>容器名或ID<span class="token operator">></span> <span class="token function">sh</span></span>
<span class="line"></span>
<span class="line"><span class="token function">ip</span> route <span class="token function">add</span> default via <span class="token number">172.17</span>.0.1 dev eth0</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>永久性添加路由：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> <span class="token operator">&lt;</span>容器名或ID<span class="token operator">></span> <span class="token function">sh</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 编写路由配置脚本</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">></span> /system/etc/init/route-config.rc <span class="token operator">&lt;&lt;</span> <span class="token string">'EOF'</span>
<span class="line"># 等待 Android 系统完全启动（sys.boot_completed=1 表示启动完成）</span>
<span class="line">on property:sys.boot_completed=1</span>
<span class="line">  # 切换到 root 用户执行命令（确保权限）</span>
<span class="line">  exec - root root -- /system/bin/sh -c "</span>
<span class="line">    # 检查默认路由是否已存在，不存在则添加</span>
<span class="line">    if ! ip route show | grep -q 'default via 172.17.0.1 dev eth0'; then</span>
<span class="line">      ip route add default via 172.17.0.1 dev eth0</span>
<span class="line">    fi</span>
<span class="line"></span>
<span class="line">    # （可选）添加其他自定义路由</span>
<span class="line">    # if ! ip route show | grep -q '192.168.1.0/24 via 172.17.0.1 dev eth0'; then</span>
<span class="line">    #   ip route add 192.168.1.0/24 via 172.17.0.1 dev eth0</span>
<span class="line">    # fi</span>
<span class="line">  "</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 赋予执行权限</span></span>
<span class="line"><span class="token function">chmod</span> +x /etc/profile.d/auto-route.sh</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="https://wiki.t-firefly.com/zh_CN/ROC-RK3588S-PC/upgrade_firmware.html#shao-xie-gu-jian" target="_blank" rel="noopener noreferrer">ROC-RK3588S-PC 使用USB线缆升级固件</a></li>
<li><a href="https://www.t-firefly.com/product/industry/rocrk3588spc#spec" target="_blank" rel="noopener noreferrer">ROC-RK3588S-PC 产品规格</a></li>
<li><a href="https://www.t-firefly.com/doc/download/164.html" target="_blank" rel="noopener noreferrer">ROC-RK3588S-PC SDK工具等下载</a></li>
</ul>
</div></template>



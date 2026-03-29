<template><div><h1 id="unity-assetbundle文件" tabindex="-1"><a class="header-anchor" href="#unity-assetbundle文件"><span>Unity AssetBundle文件</span></a></h1>
<h2 id="什么是assetbundle" tabindex="-1"><a class="header-anchor" href="#什么是assetbundle"><span>什么是AssetBundle</span></a></h2>
<p>AssetBundle 为资源的集合，可包含贴图(Textures)，材质(Materials)，声音(Audio)，动画资源(Animation Clips &amp; Animator controllers)，文字(Text assets)，甚至场景(Scenes) 等各式资源，允许游戏在运行时向远端服务器(Remote server)，要求载入AssetBundle 并且使用里头的资源。</p>
<p>因此可以利用AssetBundle 功能来制作关卡更新资源包，下载新的关卡资源，即是DLC (Downloadable content)。亦可用来更新游戏，例如特殊节庆时，更新游戏贴图材质，让游戏与玩家一同过节。</p>
<p>最常使用AssetBundle 机制莫过于是手机游戏，手机游戏发布APP 平台(eg Google Play &amp; Apple Store) 有容量限制，使用AssetBundle 机制切分游戏程序框架与游戏资源，让玩家先下载安装容量小的APP，APP启动之后，在游戏开始前再按需下载游戏资源，有效达到游戏APP 容量减量。</p>
<p>唯一要注意的是，AssetBundle 无法包含程序代码，即是没办法使用AssetBundle 做到程序代码更新，意味着改游戏资源时，玩家重新下载AssetBundles 即可。但若是修改游戏程序BUG时，得重新发布APP 到APP 平台，让玩家重新下载更新其游戏APP。</p>
<p>要如何做到更新新游戏内容而不改程序代码，如何设计程序代码成合适的组件(Components)，让关卡策划可以用既有的代码组件，新增/调整参数就能制作出新内容(eg 新关卡)。</p>
<h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2>
<ul>
<li><a href="(https://dupouyer.github.io/2020/06/24/AssetBundle%E7%A0%94%E7%A9%B6%E6%8A%A5%E5%91%8A/)">AssetBundle研究报告</a></li>
<li><a href="(https://www.cnblogs.com/pinkfloyd/p/6489979.html)">AssetBundle文件结构浅析</a></li>
<li><a href="(https://blog.codingnow.com/2014/08/unity3d_asset_bundle.html)">Unity3D asset bundle 格式简析</a></li>
<li><a href="(https://docs.unity3d.com/Manual/ClassIDReference.html)">Unity3D YAML Class ID Reference</a></li>
<li><a href="(https://dev.twsiyuan.com/2017/04/unity-assetbundles.html)">在Unity 使用AssetBundles 实作简易的游戏资源打包以及更新机制</a></li>
</ul>
</div></template>



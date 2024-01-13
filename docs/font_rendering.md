# 字体渲染

## 位图字体(Bitmap Font)

最简单的文本渲染方式是：`点阵字体 (Dot-matrix-fonts)` 也叫`位图字体 (Bitmap-fonts)`，即将用到的字符，预先输出到一张贴图中，使用的时候再找到对应的字符的 UV，再绘制文本。

![位图字体(Bitmap Font)](/assets/images/font_rendering/bitmapfont.png)

这种方法的缺点很明显：字符集、字体的样式、字号等，在输出完贴图后就固定了。

## 矢量字体 (Vector Font)

`矢量字体(Vector font)`中每一个字形是通过数学曲线来描述的，它包含了字形边界上的关键点，连线的导数信息等，字体的渲染引擎通过读取这些数学矢量，然后进行一定的数学运算来进行渲染。这类字体的优点是字体实际尺寸可以任意缩放而不变形、变色。

字体文件中存放的是每个字符绘制的样条曲线控制点，可以使用 [Glyph Inspector (在线字形查看器)](https://opentype.js.org/glyph-inspector.html) 来查看对应字体文件中字符的信息：

![Glyph Inspector (在线字形查看器)](/assets/images/font_rendering/ttf_file_content.png)

不同字号，斜体、粗体的字模光栅化后都会存储在字体贴图中，其原理大致跟 Bitmap Font 类似，只是字符的贴图是通过加载矢量字体，动态增加到贴图中。

字体格式类型主要有几个大分类：TrueType、Embedded Open Type 、OpenType、WOFF 、SVG。

### TTF：TrueType

TTF文件基于TrueType规范字体技术。早些时候，它是由Apple Computer，Inc for Mac OS发起的，后来是由Microsoft Windows操作系统采用的。

TrueType字体可在打印机和计算机屏幕上提供最佳的质量显示，而没有任何分辨率。所有最近的应用程序都可以使用TTF文件来处理字体。 TTF字体文件是不含成本的，可以通过Internet获得。

它是Windows和Mac系统最常用的字体格式，其最大的特点就是它是由一种数学模式来进行定义的基于轮廓技术的字体，这使得它们比基于矢量的字体更容易处理，保证了屏幕与打印输出的一致性。同时，这类字体和矢量字体一样可以随意缩放、旋转而不必担心会出现锯齿。

### EOT ：Embedded Open Type

EOT文件格式包含一个单个嵌入式结构，该结构可以表示有关字体名称和支持字符的足够基本信息。此信息的包装迫使用户代理避免解压缩，解开包装或安装字体，如果它已经在计算机上安装。这些字体广泛用于网页。它是由Microsoft开发的，并得到其产品的支持，例如PowerPoint演示文稿.pps文件。

### OTF：OpenType

OTF文件称为OpenType字体格式。 OTF字体格式扩展了TTF格式的现有特征，并且比TTF更可具扩展性。它是由Adobe和Microsoft开发的。

OTF结合了TrueType字体格式和PostScript的功能，这使OTF格式义务了多数写作系统和无关。

OpenType字体格式由Windows 2000或更高版本和Mac OS X支持。

### WOFF：Web Open Font Format

WOFF字体格式压缩与字体数据相关的基于表的SFNT结构，这些结构用于各种字体类型，例如Opentype或TrueType格式。它充当各种字体类型的容器，可以构成字体的元数据和私人数据。 SFNT文件被转换器转换为沃夫格式的文件，用户代理恢复了可与Web文档一起使用的编码文件。请注意，恢复的字体数据与输入字体格式完全匹配而不会丢失任何方面。

### SVG：Scalable Vector Graphics

SVG是由W3C制定的开放标准的图形格式。SVG字体就是使用SVG技术来呈现字体，还有使用gzip压缩格式的SVG字体。

### 特别的TTC格式字体

TTC字体是TrueType字体集成文件(.TTC文件)，是在一单独文件结构中包含多种字体,以便更有效地共享轮廓数据,当多种字体共享同一笔画时,TTC技术可有效地减小字体文件的大小。

TTC是几个TTF合成的字库，安装后字体列表中会看到两个以上的字体。两个字体中大部分字都一样时，可以将两种字体做成一个TTC文件，常见的TTC字体，因为共享笔划数据，所以大多这个集合中的字体区别只是字符宽度不一样，以便适应不同的版面排版要求。

## SDF Font

所谓的SDF就是 `Signed Distance Field` 的缩写，它是一种算法，翻译成中文叫做：`有向距离场算法`。

该算法，由 Valve 的 Chris Green 在 SIGGRAPH 2007 论文：[《Improved Alpha-Tested Magnification for Vector Textures and Special Effects》](https://steamcdn-a.akamaihd.net/apps/valve/2007/SIGGRAPH2007_AlphaTestedMagnification.pdf) 当中提出。当时主要用于渲染图片，之后被广泛的运用于其他技术领域中，字体渲染，只是其中之一。

相比原本的 ttf 字体，使用了 SDF 的文本，在任意距离、缩放尺寸下，都能渲染出清晰的文本，而 ttf 则可能出现毛边，失真的情况。

SDF也需要贴图，但是，它里面存储的不再是像素数据，而是存储每一个点到边缘的距离：

![Glyph Inspector (在线字形查看器)](/assets/images/font_rendering/ttf_texture_1.png)

场中每个坐标对应一个到物体表面的最近距离，如果坐标点在物体内部则距离为负。

SDF的贴图，可以实时生成，也可以离线生成。

### SDF 生成算法

- 欧几里得距离转换 (Euclidean Distance Transform, EDT)
- 8点有向按序欧几里得距离转换 (8-point Signed Sequential Euclidean Distance Transform, 8SSEDT)
- 4SSEDT
- Chamfer3x3 DT
- Dead Reckoning

目前 8SSEDT (8-points Signed Sequential Euclidean Distance Transform) 算法是比较流行的解法。

## 参考资料

- [文本渲染](https://learnopengl-cn.github.io/06%20In%20Practice/02%20Text%20Rendering/)
- [光栅化、字体渲染和SDF](https://arthas.me/posts/rasterization-fonts-rendering-and-sdf)
- [动态 SDF 字体渲染方法](https://www.xianlongok.site/post/4625ed6a/)
- [尝试在Web上用SDF替代IconFont](https://lrdcq.com/me/read.php/136.htm)
- [字体文件ttf、otf、woff、ttc等格式有什么区别？](https://ziyouziti.com/art-23.html)
- [A Closer Look At Font Rendering](https://www.smashingmagazine.com/2012/04/a-closer-look-at-font-rendering/)
- [字体文件格式的分类 - 全面知识](https://blog.fileformat.com/zh/font/classification-of-font-file-formats-a-comprehensive-knowledge/)
- [rendering super-smooth scalable bitmap fonts](https://libgdx.com/wiki/graphics/2d/fonts/distance-field-fonts)
- [2D distance functions](https://iquilezles.org/articles/distfunctions2d/)
- [基于SDF渲染字体](https://www.jianshu.com/p/ba183ee21a4e)
- [Raymarching SDF](https://iquilezles.org/articles/raymarchingdf/)
- [Tech-Artist 学习笔记：Signed Distance Field 8SSEDT 算法](https://zhuanlan.zhihu.com/p/518292475)
- [8-points Signed Sequential Euclidean Distance Transform](https://github.com/Lisapple/8SSEDT)
- [有向距離場 Signed Distance Filed](https://mine-clever.art/2022/04/26/SignedDistanceFiled/)
- [有符号距离场原理及实现](http://www.bimant.com/blog/signed-distance-field-implementation/)
- [使用Compute Shader计算有向距离场](https://zznewclear13.github.io/posts/calculate-signed-distance-field-using-compute-shader/)
- [Dead Reckoning算法生成有向距离场](https://segmentfault.com/a/1190000041250697)
- [The “dead reckoning” signed distance transform](https://www.sciencedirect.com/science/article/abs/pii/S1077314204000682)

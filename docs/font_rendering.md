# 字体渲染

## 位图字体(Bitmap Font)

最简单的文本渲染方式是：`点阵字体 (Dot-matrix-fonts)` 也叫`位图字体 (Bitmap-fonts)`。

位图字体通过将所需的独特字形光栅化为单个纹理（称为 [纹理图集(Texture atlas)](https://en.wikipedia.org/wiki/Texture_atlas)），使用的时候再找到对应的字符的 UV，再绘制文本。

![位图字体(Bitmap Font)](/assets/images/font_rendering/bitmap_font_sampling.png)

这种方法的缺点很明显：放大缩小的时候，会呈现像素化且模糊的效果。

这里有一些创建位图字体的工具：

- [Angelcode 的 bmfont](https://www.angelcode.com/products/bmfont/) – 这是位图格式的创建者。
- [Hiero](https://github.com/libgdx/libgdx/wiki/Hiero) – 这是一个 Java 开源工具。它与 Anglecode 的 bmfont 非常相似，但它允许您添加文本效果。
- [Glyphs Designer](https://www.71squared.com/glyphdesigner) – 这是一款付费 MacOS 应用程序。
- [ShoeBox](https://renderhjs.net/shoebox/) – 这是一个处理精灵的工具，包括位图字体。

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

该算法，由 Valve 的 Chris Green 在 SIGGRAPH 2007 论文：[《Improved Alpha-Tested Magnification for Vector Textures and Special Effects》](https://steamcdn-a.akamaihd.net/apps/valve/2007/SIGGRAPH2007_AlphaTestedMagnification.pdf) 当中提出。当时主要用于渲染图片，之后被广泛的运用于其他技术领域中，比如它也常用于：[光线追踪](http://jamie-wong.com/2016/07/15/ray-marching-signed-distance-functions/)和[体积渲染](https://www.iquilezles.org/www/articles/sdfbounding/sdfbounding.htm)。字体渲染，只是其中的一个应用。

与位图字体非常相似，有符号距离场 ( SDF ) 字体也是纹理图集。但不是像位图字体那样将光栅化字形存储在纹理上，而是生成并存储字形的 SDF ，从而允许从低分辨率图像生成高分辨率形状。

SDF上的每个像素都存储到最近表面的距离。当像素位于形状内部或外部时，该符号就会指示出来。如果符号为负，则该像素在内部；如果为正，则该像素位于外部。该[视频](https://www.youtube.com/watch?v=-O0-HEZAwg8&t=1752s)很好地说明了这个概念。

由于SDF存储每个像素的距离，因此原始图片看起来像是原始字形的模糊版本。

![SDF Font](/assets/images/font_rendering/ttf_texture_1.png)

如果想要输出去清晰的字符，您需要在0.5处（也就是字形的边界）对其进行Alpha测试。让我们以字母"A"来看看常规的SDF与常规的光栅化图像的比较：

![SDF Font](/assets/images/font_rendering/compare_raster_sdf.png)

正如我之前提到的， SDF的一大好处是能够从低分辨率SDF渲染高分辨率形状。这意味着您可以创建 16pt 字体SDF并将文本缩放至 100pt 或更高，而不会损失太多清晰度。

SDF擅长缩放，因为您几乎可以通过双线性插值完美地重建距离，这是一种奇特的方式来表示我们可以获取两点之间的值。在这种情况下，常规位图字体上的两个像素之间的双线性插值为我们提供了中间颜色，从而导致线性模糊。

在SDF上，两个像素之间的双线性插值提供了到最近边缘的中间距离。由于这两个像素距离与开始时相似，因此结果值不会丢失太多有关字形的信息。这也意味着SDF越大，信息就越准确，丢失的信息就越少。

然而，需要知道的是，如果像素之间的速率变化不是线性的（例如尖角的情况），则双线性插值会给出不准确的值，从而在将SDF缩放到远高于其原始大小时导致出现缺口或圆角。

![SDF Font](/assets/images/font_rendering/sdf_rounded_corners.png)

### SDF 生成算法

- 欧几里得距离转换 (Euclidean Distance Transform, EDT)
- 8点有向按序欧几里得距离转换 (8-point Signed Sequential Euclidean Distance Transform, 8SSEDT)
- 4SSEDT
- Chamfer3x3 DT
- Dead Reckoning

目前 8SSEDT (8-points Signed Sequential Euclidean Distance Transform) 算法是比较流行的解法。

## MSDF Font

多通道符号距离场 (Multi-channel Signed Distance Field, MSDF) 字体有点拗口，它是SDF的最新变体，能够通过使用所有三个颜色通道产生近乎完美的尖角。

多通道带符号距离场的字体纹理文件乍一看可能有点令人毛骨悚然：

![MSDF Font](/assets/images/font_rendering/msdf_font_file.png)

使用所有三个颜色通道确实会产生较重的图像，但这就是 MSDF 比常规SDF具有更好的质量空间比的原因。下图显示了放大至 50 像素的字体的SDF和MSDF之间的差异。

![MSDF Font](/assets/images/font_rendering/compare_msdf_sdf.png)

与常规SDF一样，MSDF 存储到最近边缘的距离，但每当发现尖角时就会更改颜色通道。

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
- [Techniques for Rendering Text with WebGL](https://css-tricks.com/techniques-for-rendering-text-with-webgl/)
- [《空梦》的字体渲染系统以及SDF和MSDF在中文渲染上的取舍对比](https://zhuanlan.zhihu.com/p/407611759?utm_id=0)

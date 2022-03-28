# 使用高德地图实现地理围栏

## 什么是地理围栏(Geo-fencing)?

地理围栏（Geo-fencing）是LBS的一种新应用，就是用一个虚拟的栅栏围出一个虚拟地理边界。当手机进入、离开某个特定地理区域，或在该区域内活动时，手机可以接收自动通知和警告。有了地理围栏技术，位置社交网站就可以帮助用户在进入某一地区时自动登记。

## 地理坐标系

我们通常用经纬度来表示一个地理位置，但是由于一些原因，我们从不同渠道得到的经纬度信息可能并不是在同一个坐标系下。

* 高德地图、腾讯地图以及谷歌中国区地图使用的是**GCJ-02**坐标系
* 百度地图使用的是**BD-09**坐标系
* 底层接口(HTML5 Geolocation或ios、安卓API)通过GPS设备获取的坐标使用的是**WGS-84**坐标系

不同的坐标系之间可能有几十到几百米的偏移，所以在开发基于地图的产品，或者做地理数据可视化时，我们需要修正不同坐标系之间的偏差。

### WGS-84 - 世界大地测量系统

WGS-84（World Geodetic System, WGS）是使用最广泛的坐标系，也是世界通用的坐标系，GPS设备得到的经纬度就是在WGS84坐标系下的经纬度。通常通过底层接口得到的定位信息都是WGS84坐标系。

### GCJ-02 - 国测局坐标

GCJ-02（G-Guojia国家，C-Cehui测绘，J-Ju局），又被称为火星坐标系，是一种基于WGS-84制定的大地测量系统，由中国国测局制定。此坐标系所采用的混淆算法会在经纬度中加入随机的偏移。

国家规定，**中国大陆所有公开地理数据都需要至少用GCJ-02进行加密**，也就是说我们从国内公司的产品中得到的数据，一定是经过了加密的。绝大部分国内互联网地图提供商都是使用GCJ-02坐标系，包括高德地图，谷歌地图中国区等。

### BD-09 - 百度坐标系

BD-09（Baidu, BD）是百度地图使用的地理坐标系，其在GCJ-02上多增加了一次变换，用来保护用户隐私。从百度产品中得到的坐标都是BD-09坐标系。

<p align="center">
  <img src="https://raw.githubusercontent.com/hujiulong/gcoord/HEAD/crs.jpg"/>
  <p align="center">不同坐标系下的点在百度地图上会有偏移</p>
</p>

### 地理坐标系列表

| 坐标系         | 坐标格式      | 说明                                                         |
|-------------|-----------|------------------------------------------------------------|
| WGS84       | [lng,lat] | WGS-84坐标系，GPS设备获取的经纬度坐标                                    |
| GCJ02       | [lng,lat] | GCJ-02坐标系，google中国地图、SoSo地图、AliYun地图、MapAbc地图和高德地图所用的经纬度坐标 |
| BD09        | [lng,lat] | BD-09坐标系，百度地图采用的经纬度坐标                                      |
| BD09LL      | [lng,lat] | 同BD09                                                      |
| BD09MC      | [x,y]     | BD-09米制坐标，百度地图采用的米制坐标，单位：米                                 |
| BD09Meter   | [x,y]     | 同BD09MC                                                    |
| Baidu       | [lng,lat] | 百度坐标系，BD-09坐标系别名，同BD-09                                    |
| BMap        | [lng,lat] | 百度地图，BD-09坐标系别名，同BD-09                                     |
| AMap        | [lng,lat] | 高德地图，同GCJ-02                                               |
| WebMercator | [x,y]     | Web Mercator投影，墨卡托投影，同EPSG3857，单位：米                        |
| WGS1984     | [lng,lat] | WGS-84坐标系别名，同WGS-84                                        |
| EPSG4326    | [lng,lat] | WGS-84坐标系别名，同WGS-84                                        |
| EPSG3857    | [x,y]     | Web Mercator投影，同WebMercator，单位：米                           |
| EPSG900913  | [x,y]     | Web Mercator投影，同WebMercator，单位：米                           |

## <a name="geofencing-geojson-data"></a>地理围栏 GeoJSON 数据

地理围栏或地理围栏集的数据由 [rfc7946](https://tools.ietf.org/html/rfc7946) 中定义的、采用 `GeoJSON` 格式的 `Feature` 对象和 `FeatureCollection` 对象表示。 除此之外：

* GeoJSON 对象类型可以是 `Feature` 对象或 `FeatureCollection` 对象。
* 几何对象类型可以是 `Point`、`MultiPoint`、`LineString`、`MultiLineString`、`Polygon`、`MultiPolygon` 和 `GeometryCollection`。
* 所有特征属性应该包含用于标识地理围栏的 `geometryId`。
* 具有 `Point`、`MultiPoint`、`LineString`、`MultiLineString` 的特征必须在属性中包含 `radius`。 `radius` 值的计量单位为米，`radius` 值的范围为 1 到 10000。
* 具有 `polygon` 和 `multipolygon` 几何类型的特征没有半径属性。
* `validityTime` 是可选属性，可让用户为地理围栏数据设置过期时间和有效时间。 如果未指定该属性，则数据永不过期，而是一直有效。
* `expiredTime` 是地理围栏数据的过期日期和时间。 如果请求中 `userTime` 的值晚于此值，则将相应的地理围栏数据视为过期的数据，且不会查询这些数据。 基于这一点，此地理围栏数据的 geometryId 将包含在地理围栏响应中的 `expiredGeofenceGeometryId` 数组内。
* `validityPeriod` 是地理围栏有效时段的列表。 如果请求中 `userTime` 的值超出有效时段，则将相应的地理围栏数据视为无效，且不会查询这些数据。 此地理围栏数据的 geometryId 包含在地理围栏响应中的 `invalidPeriodGeofenceGeometryId` 数组内。 下表显示了 validityPeriod 元素的属性。

| 名称              |    类型    |  必需   | 说明                                                                |
|:----------------|:--------:|:-----:|:------------------------------------------------------------------|
| startTime       | datetime |   是   | 有效时段的开始日期时间。                                                      |
| endTime         | datetime |   是   | 有效时段的结束日期时间。                                                      |
| recurrenceType  |   字符串    | false | 时段的重复类型。 值可为 `Daily`、`Weekly`、`Monthly` 或 `Yearly`。 默认值为 `Daily`。 |
| businessDayOnly | Boolean  | false | 指示数据是否仅在工作日有效。 默认值为 `false`。                                      |

* 所有坐标值都表示为中定义的 "经度，纬度" `WGS84` 。
* 对于包含 `MultiPoint`、`MultiLineString`、`MultiPolygon` 或 `GeometryCollection` 的每个特征，属性将应用到所有元素。 例如：中的所有点 `MultiPoint` 都将使用相同的半径形成多个圆形地域隔离区内。

### 标准GeoJSON

[GeoJSON 规范][1]仅支持以下几何图形：

* 点 (Point)
* 线 (LineString)
* 多边形 (Polygon)
* 点集合 (MultiPoint)
* 线集合 (MultiLineString)
* 多边形集合 (MultiPolygon)
* 空间数据集合 (GeometryCollection)

#### <a name="point"></a>点 (Point)

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [125.6, 10.1]
  },
  "properties": {
    "name": "Dinagat Islands"
  }
}
```

#### <a name="line-string"></a>线 (LineString)

```json
{
    "type": "LineString", 
    "coordinates": [
        [30.0, 10.0], [10.0, 30.0], [40.0, 40.0]
    ]
}
```

#### <a name="polygon"></a>多边形 (Polygon)

```json
{
    "type": "Polygon", 
    "coordinates": [
        [[30.0, 10.0], [40.0, 40.0], [20.0, 40.0], [10.0, 20.0], [30.0, 10.0]]
    ]
}
```

```json
{
    "type": "Polygon", 
    "coordinates": [
        [[35.0, 10.0], [45.0, 45.0], [15.0, 40.0], [10.0, 20.0], [35.0, 10.0]], 
        [[20.0, 30.0], [35.0, 35.0], [30.0, 20.0], [20.0, 30.0]]
    ]
}
```

#### <a name="multi-point"></a>点集合 (MultiPoint)

```json
{
    "type": "MultiPoint", 
    "coordinates": [
        [10.0, 40.0], [40.0, 30.0], [20.0, 20.0], [30.0, 10.0]
    ]
}
```

#### <a name="multi-line-string"></a>线集合 (MultiLineString)

```json
{
    "type": "MultiLineString", 
    "coordinates": [
        [[10.0, 10.0], [20.0, 20.0], [10.0, 40.0]], 
        [[40.0, 40.0], [30.0, 30.0], [40.0, 20.0], [30.0, 10.0]]
    ]
}
```

#### <a name="multi-polygon"></a>多边形集合 (MultiPolygon)

```json
{
    "type": "MultiPolygon", 
    "coordinates": [
        [
            [[30.0, 20.0], [45.0, 40.0], [10.0, 40.0], [30.0, 20.0]]
        ], 
        [
            [[15.0, 5.0], [40.0, 10.0], [10.0, 20.0], [5.0, 10.0], [15.0, 5.0]]
        ]
    ]
}
```

```json
{
    "type": "MultiPolygon", 
    "coordinates": [
        [
            [[40.0, 40.0], [20.0, 45.0], [45.0, 30.0], [40.0, 40.0]]
        ], 
        [
            [[20.0, 35.0], [10.0, 30.0], [10.0, 10.0], [30.0, 5.0], [45.0, 20.0], [20.0, 35.0]], 
            [[30.0, 20.0], [20.0, 15.0], [20.0, 25.0], [30.0, 20.0]]
        ]
    ]
}
```

#### <a name="geometry-collection"></a>空间数据集合 (GeometryCollection)

```json
{
    "type": "GeometryCollection",
    "geometries": [
        {
            "type": "Point",
            "coordinates": [40.0, 10.0]
        },
        {
            "type": "LineString",
            "coordinates": [
                [10.0, 10.0], [20.0, 20.0], [10.0, 40.0]
            ]
        },
        {
            "type": "Polygon",
            "coordinates": [
                [[40.0, 40.0], [20.0, 45.0], [45.0, 30.0], [40.0, 40.0]]
            ]
        }
    ]
}
```

### 扩展GeoJSON

#### <a name="circle"></a>圆形 (Circle)

`Circle` [GeoJSON 规范][1]不支持该几何图形。我们使用 `GeoJSON Point Feature` 对象来表示圆。

`Circle`使用对象表示的几何图形 `GeoJSON Feature` __必须__ 包含以下坐标和属性：

- 圆心 (Center)

  圆心使用 `GeoJSON Point` 对象表示。

- 半径 (Radius)

  圆形的半径 `radius` 使用 `GeoJSON Feature` 的属性表示。 半径值以米为单位，并且其类型必须为 `double` 。

- 子类型 (subType)

  圆形几何图形还必须包含 `subType` 属性。 此属性必须是的属性的一部分 `GeoJSON Feature` ，并且其值应为 _Circle_

```json
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-122.126986, 47.639754]
    },
    "properties": {
        "subType": "Circle",
        "radius": 500
    }
}
```

#### <a name="rectangle"></a>矩形 (Rectangle)

`Rectangle` [GeoJSON 规范][1]不支持该几何图形。我们使用 `GeoJSON Polygon Feature` 对象来表示矩形。 矩形扩展主要由 Web SDK 的 "绘图工具" 模块使用。

`Rectangle`使用对象表示的几何图形 `GeoJSON Polygon Feature` __必须__ 包含以下坐标和属性：

- 内角

  使用对象的坐标表示矩形的角 `GeoJSON Polygon` 。 应该有五个坐标，每个角一个。 与第五个坐标相同，用于关闭多边形环。 假定这些坐标对齐，开发人员可以根据需要对其进行旋转。

- 子类型

  矩形几何图形还必须包含 `subType` 属性。 此属性必须是的属性的一部分 `GeoJSON Feature` ，并且其值应为 _Rectangle_

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[5,25],[14,25],[14,29],[5,29],[5,25]]]
  },
  "properties": {
    "subType": "Rectangle"
  }
}
```

## 高德地图

高德地图提供了以下几组API可用于地理围栏:

1. GeoJSON工具类 `AMap.GeoJSON`
2. 编辑器工具类 `AMap.PolyEditor` `AMap.CircleEditor` `AMap.RectangleEditor` `AMap.EllipseEditor` `AMap.BezierCurveEditor`
3. 鼠标工具插件 `AMap.MouseTool`

### 1. GeoJSON工具类

它可以用来解析标准的GeoJSON,但是需要注意的是:它只支持`FeatureCollection`形式的数据.

```typescript
    const geoJson = new AMap.GeoJSON({
      geoJSON: geoJsonObject,
      getMarker: function (geoJson, lngLats) {
        console.log('点', lngLats);
      },
      getPolyline: function (geoJson, lngLats) {
        console.log('线', lngLats);
      },
      getPolygon: function (geoJson, lngLats) {
        console.log('面', lngLats);
      },
    });
```

### 2. 编辑器工具类

它支持:圆形,折线,多边形,贝瑟尔曲线,椭圆,矩形.

虽然说,圆形,矩形绘制简单.但是,真正实用的只有:**多边形**.  

```typescript
  // 编辑多边形
  function editPolygon(path: any, open: boolean) {
    closePolygonEditor();

    const polygon = createPolygon(path);

    // 缩放地图到合适的视野级别
    map.setFitView();

    // 创建编辑器
    polygonEditor = new AMap.PolyEditor(map, polygon);

    // 吸附功能
    polygonEditor.addAdsorbPolygons(polygon);
    // 设置编辑目标
    polygonEditor.setTarget(polygon);

    // 监听事件
    // polygonEditor.on('addnode', function (event) {});
    // polygonEditor.on('adjust', function (event) {});
    // polygonEditor.on('removenode', function (event) {});
    polygonEditor.on('end', function (event) {
        const paths = event.target.getPath();
        console.log('结束多边形编辑', event.target, paths);
    });

    // 打开编辑
    if (open) polygonEditor.open();
  }
```

**需要注意的是:**

1. 绘制出来的路径需要倒序读取,因为标准GeoJson使用的是右手法则.
2. 绘制出来的路径并没有封口,即起始点和结束点必须是同一个点.
3. 如果需要被`AMap.GeoJSON`所解析,GeoJson的数据必须封装成`FeatureCollection`.

### 3. 鼠标工具插件

并不实用,弃用.

## 参考资料

* [地理围栏技术](https://baike.baidu.com/item/%E5%9C%B0%E7%90%86%E5%9C%8D%E6%AC%84%E6%8A%80%E8%A1%93/6249371)
* [GeoJSON Wiki](https://en.wikipedia.org/wiki/GeoJSON)
* [GeoJSON Viewer](https://geojsonlint.com/)
* [geojson.io](https://geojson.io/#map=2/3.0/16.2)
* [高德参考手册](https://lbs.amap.com/api/javascript-api/reference/)
* [高德JS API 示例](https://lbs.amap.com/demo/javascript-api/example/overlayers/polygon-draw-and-edit)

[1]: https://tools.ietf.org/html/rfc7946

# 升级旧版本的Unity项目

## UnityEngine.Application' does not contain a definition for bundleIdentifier'

把 `Application.bundleIdentifier`修改为`Application.identifier`。

## 升级粒子系统

Unity2018.2.x之后，旧版 Particle System 相关API就完全移除掉了，这个升级器是Unity官方发布的，它可以`ParticleEmitter`, `ParticleAnimator`, `ParticleRenderer`等组件转换为`ParticleSystem` 和 `ParticleSystemRenderer`组件。

## `GUITexture`替换为`UI.Image`遇到的问题

### 'Image' does not contain a definition for 'pixelInset'

将代码：

```csharp
uiImage.pixelInset
```

修改为：

```csharp
uiImage.rectTransform.rect
```

## 不存在`.texture`

把代码：

```csharp
uiImage.texture
```

修改为：

```csharp
uiImage.material.mainTexture
```

## 找不到`Handles.CircleCap`

将

```csharp
Handles.CircleCap( 0, p1, Quaternion.identity, 2.0f );
```

改为：

```csharp
Handles.CircleHandleCap(0, p1, Quaternion.identity, 2.0f, EventType.Repaint);
```

## `MovieTexture`改为`VideoPlayer`

```csharp
movie.loop = true;
```

改为：

```csharp
movie.isLooping = true;
```

## Unity 5的`GameObject.guiText`和`GameObject.guiTexture`

```csharp
guiText.material.color = labelColor;
guiTexture.texture = textOver;
```

改为：

```csharp
GetComponent<Text>().material.color = labelColor;
GetComponent<Image>().material.mainTexture = textOver;
```

```csharp
BlendWeights is obsolete. Use SkinWeights instead (UnityUpgradable) -> SkinWeights
```

## 参考资料

- [Unity导入旧版本游戏工程出现的问题集](http://blog.mangolovecarrot.net/2021/04/09/231)
- [从 MovieTexture 迁移到 VideoPlayer](https://docs.unity3d.com/cn/2021.3/Manual/VideoPlayer-MigratingFromMovieTexture.html)

# Spine骨骼动画版本降级

## 下载Skeleton Viewer

下载页面：<https://zh.esotericsoftware.com/spine-skeleton-viewer>

## 打开界面

```bash
java -jar skeletonViewer.jar
```

## 降级

利用`skeletonViewer.jar`当中的`JsonRollback`来执行降级，需要注意的是，它只能够操作JSON配置文件：

```bash
java -cp skeletonViewer.jar com.esotericsoftware.spine.JsonRollback input.json 3.7 output.json
```

## 参考资料

- [急！3.8.55版本如何回退到3.7.91版本](https://zh.esotericsoftware.com/forum/d/12419-%E6%80%A53855%E7%89%88%E6%9C%AC%E5%A6%82%E4%BD%95%E5%9B%9E%E9%80%80%E5%88%B03791%E7%89%88%E6%9C%AC/3)
- [动画JSON文件3.8.60转2.1.27](https://zh.esotericsoftware.com/forum/d/12684-%E5%8A%A8%E7%94%BBjson%E6%96%87%E4%BB%B63860%E8%BD%AC2127)
- [Open project in an older version](https://zh.esotericsoftware.com/forum/d/11458-open-project-in-an-older-version)
- [[Editor] [Video] Downgrade the project from 3.8 to 3.7](https://zh.esotericsoftware.com/forum/d/15149-editor-video-downgrade-the-project-from-38-to-37/3)
- [Spine editor and runtime version management](https://zh.esotericsoftware.com/forum/d/6534-spine-editor-and-runtime-version-management)

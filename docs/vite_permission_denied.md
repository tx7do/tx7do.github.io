# Vite permission denied 问题

```bash
 ERROR  error when starting dev server:                                                                                                                                                                                                                                11:51:39  
Error: listen EACCES: permission denied 0.0.0.0:3100
    at Server.setupListenHandle [as _listen2] (node:net:1723:21)
    at listenInCluster (node:net:1788:12)
    at Server.listen (node:net:1876:7)
```

有时候，使用`pnpm run dev`启动服务的时候，会报上面的错误，网上查了一下，说把`node_modules`删掉了就可以了，文章在这里：<https://stackoverflow.com/questions/75322932/sh-1-vite-permission-denied>，但是事实上，这个方法并没有用。

后来，我想可能是低位端口号的缘故，可是，Linux下面的话都是1024以下Root无权限，我这个是Windows11，也不该有这个问题吧，抱着试一试的心态，我就改成了改为高位的端口号：`31000`，没想到居然没问题了。

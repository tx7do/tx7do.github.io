# git submodule

## 添加子模块

```bash
git submodule add <url> <path>
```

将会在`.gitmodules`添加类似的配置：

```ini
[submodule "zstd"]
	path = ext/zstd
	url = https://github.com/facebook/zstd.git
```


加入分支名：

```bash
git submodule add -b <branch> <url> <path>
```

将会在`.gitmodules`添加类似的配置：

```ini
[submodule "zstd"]
	path = ext/zstd
	url = https://github.com/facebook/zstd.git
	branch = v1.2.0
```

## 删除子模块

1. 首先删除掉子模块文件夹

```bash
git rm -fr {子模块路径}
```

2. 移除子模块的缓存

```bash
git rm --cached {子模块路径}
```

3. 移除子模块

```bash
rm -rf .git/modules/{子模块路径}
```

最后提交修改。

## 更新子模块

clone项目之后，子模块目录下是没有任何内容的，需要在项目的根目录下执行以下命令完成子模块的下载：

```bash
git submodule update --init --recursive
```

或者

```bash
git submodule init
```

从远端git仓库更新子模块，所谓的远端就是`url`描述的源git仓库。

该命令将会：

1. 把子模块的分支Hash更新；
2. 从远端下载代码。

```bash
git submodule update --remote
```

这条命令不会执行上面命令的第二步，也就是不会下载代码，仅仅更新分支Hash。

```bash
git submodule update --remote --no-fetch
```

上面的命令是包括全部子模块，如果要单独针对某一个子模块，则可以在后面跟子模块的路径名：

```bash
git submodule update --remote third_party/abseil-cpp
```

update之前，需要先把项目根目录下的`.git\module`以及子模块目录删除掉。

## 参考资料

- [git submodule添加、更新和删除](https://www.cnblogs.com/jyroy/p/14367776.html)
- [5步删除git submodule](https://segmentfault.com/a/1190000040338658)
- [How do I remove a submodule?](https://stackoverflow.com/questions/1260748/how-do-i-remove-a-submodule)
- [Git Submodule 新增、使用 與 移除](https://blog.longwin.com.tw/2015/05/git-submodule-add-remove-2015/)

# Golang模块版本管理

## GO模块版本号

模块的开发人员使用模块版本号的每个部分来表示版本的稳定性和向后兼容性。对于每个新版本，模块的发布版本号具体反映了自上一版本以来模块更改的性质。

当您开发使用外部模块的代码时，您可以在考虑升级时使用版本号来了解外部模块的稳定性。当您开发自己的模块时，您的版本号将向其他开发人员表明您的模块的稳定性和向后兼容性。

发布的模块在语义版本控制模型中使用版本号发布，如下图所示：

![version-number](/assets/images/golang/version-number.png)

下表描述了版本号的各个部分如何表示模块的稳定性和向后兼容性。

|        版本阶段              | 示例                                    | 给开发者的消息 |
| ----------------------- | -------------------------------------- | ----- |
|开发中（In development）    |  自动伪版本号 v0.xx  |表示模块仍在**开发中且不稳定**。此版本不提供向后兼容性或稳定性保证。 |
|主版本（Major version）    |  v**1**.x.x  |**向后不兼容的公共 API 更改**。此版本不保证它将向后兼容以前的主要版本。 |
|次版本（Minor version）    |  vx.**4**.x  |**向后兼容的公共 API 更改**。此版本保证向后兼容性和稳定性。 |
|补丁版本（Patch version）    |  vx.x.**1**  |**不影响模块的公共 API或其依赖项的更改**。此版本保证向后兼容性和稳定性。 |
|预发布版本（Pre-release version）    |  vx.x.x-**beta.2**  |**表明这是预发布里程碑，例如 alpha 或 beta**。此版本不提供稳定性保证。 |

### 开发中（In development）

表示模块仍在开发中且不稳定的信号。此版本不提供向后兼容性或稳定性保证。

版本号可以采用以下形式之一：

#### 伪版本号形式

```text
v0.0.0-20170915032832-14c0d48ead0c
```

当模块未在其存储库中打标签(Tag)时，Go 工具将生成一个伪版本号，供调用模块中函数的代码的 go.mod 文件使用。

**注意：** 作为最佳实践，始终允许 Go 工具生成伪版本号，而不是创建自己的版本号。

当使用模块功能的代码开发人员需要针对尚未使用语义版本标签标记的提交进行开发时，伪版本非常有用。

伪版本号由破折号`-`分隔的三部分组成，如下表所示：

```txt
{baseVersionPrefix}-{timestamp}-{revisionIdentifier}
```

- baseVersionPrefix（vX.0.0 或 vX.YZ-0）是从修订之前的语义版本标记或从 vX.0.0（如果没有此类标记）派生的值。
- timestamp (yymmddhhmmss) 是创建修订版的 UTC 时间。在 Git 中，这是提交时间，而不是创作时间。
- revisionIdentifier (abcdefabcdef) 是Git提交哈希的 12 个字符前缀，或者在 Subversion 中，是一个零填充的修订号。

#### v0 版本号形式

```bash
v0.xx
```

用 v0 号发布的模块将有一个正式的语义版本号，包括主要、次要和补丁部分，以及一个可选的预发布标识符。

虽然 v0 版本可以在生产中使用，但它不能保证稳定性或向后兼容性。此外，允许 v1 及更高版本破坏使用 v0 版本的代码的向后兼容性。因此，在 v0 模块中具有代码消费功能的开发人员负责适应不兼容的更改，直到 v1 发布。

### 预发布版本（Pre-release version）

表示这是一个预发布里程碑，例如 alpha 或 beta。此版本不提供稳定性保证。

比如：

```bash
vx.x.x-beta.2
```

模块的开发人员可以通过附加连字符和预发布标识符来将预发布标识符与任何 major.minor.patch 组合一起使用。

### 主版本（Major version）

在模块的公共 API 中发出向后不兼容的更改信号。此版本不保证将向后兼容之前的主要版本。

比如：

```bash
v1.xx
```

v1 或更高版本号表明该模块可以稳定使用（其预发布版本除外）。

请注意，由于版本 0 不提供稳定性或向后兼容性保证，因此将模块从 v0 升级到 v1 的开发人员负责适应破坏向后兼容性的更改。

模块开发人员应仅在必要时将此数字增加到 v1 以上，因为版本升级对代码使用升级模块中功能的开发人员来说意味着重大中断。这种中断包括对公共 API 的向后不兼容更改，以及使用该模块的开发人员需要在他们从模块导入包的任何地方更新包路径。

高于 v1 的大版本更新也会有新的模块路径。这是因为模块路径将附加主版本号，如以下示例所示：

```bash
module example.com/mymodule/v2 v2.0.0
```

主要版本更新使它成为一个新模块，与模块的先前版本具有不同的历史记录。

### 次版本（Minor version）

向模块的公共 API 发出向后兼容更改的信号。此版本保证向后兼容性和稳定性。

例如：

```bash
vx.4.x
```

此版本更改了模块的公共 API，但不会破坏调用代码。这可能包括对模块自身依赖项的更改或添加新函数、方法、结构字段或类型。

换句话说，此版本可能包括通过其他开发人员可能想要使用的新功能进行的增强。但是，使用以前次要版本的开发人员不需要更改他们的代码。

### 补丁版本（Patch version）

表示不影响模块的公共 API 或其依赖项的更改。此版本保证向后兼容性和稳定性。

例如：

```bash
vx.x.1
```

增加此数字的更新仅适用于较小的更改，例如错误修复。使用代码的开发者可以安全地升级到这个版本，而无需更改他们的代码。

## Git管理模块版本号

在Git当中给GO模块打版本号是通过打标签（Tag）的方式实现的。

git操作标签的命令：

```bash
# 创建一个标签
git tag <your_tag_name>

# 创建一个带有注释的标签
git tag -a <your_tag_name> -m 'your_tag_description'

# 列出所有的标签
git tag --list

# 创建一个标签
git tag <your_tag_name>

# 删除一个标签
git tag -d <your_tag_name>

# 删除远程仓库的标签
git push --delete origin <your_tag_name>

# 推送一个标签到远程
git push origin <your_tag_name>

# 推送多个本地标签到远程
git push origin --tags
```

当没有打过标签的版本号将是伪版本号：

```bash
golang.org/x/lint v0.0.0-20200302205851-738671d3881b
```

当我们通过Git打标签之后，可能会是这样的：

```bash
golang.org/x/lint v0.0.1
```

我们有时候会需要在一个模块下创建若干个子模块，也就是在某一个子文件夹下创建go.mod文件。

我们单独更新这一个子模块的时候，它的版本号不是主模块的版本号，而是伪版本号。

那么，我们怎么给子模块打一个版本号呢？

假如，在我们的项目下有一个api文件夹，并且它是一个子模块，我们只需要创建一个标签：

```bash
api/v0.0.1
```

当我们再去go get更新这一个子模块的时候，版本号就已经是刚才我们打的标签的版本号了。

或者编写Makefile打标签：

```makefile
APP_VERSION=v0.0.1

PACKAGE_LIST = broker/kafka/

.PHONY: tag
tag:
	git tag -f $(APP_VERSION) && $(foreach item, $(PACKAGE_LIST), git tag -f $(item)$(APP_VERSION) && ) git push --tags --force
```

## 参考资料

- [搞清楚 Go Mod的版本和伪版本，下次别乱用了](https://www.51cto.com/article/715820.html)
- [Module version numbering](https://go.dev/doc/modules/version-numbers)
- [Working with Go Modules – Versioning](https://blog.jetbrains.com/go/2020/03/25/working-with-go-modules-versioning/)

# Kratos微服务框架实现权鉴 - Zanzibar

Zanzibar 是 Google 专门构建的授权系统。它是一个集中式授权数据库，用于从高流量应用程序获取授权查询并返回授权决策。Zanzibar的一个实例托管权限列表并响应来自许多应用程序的查询。

Zanzibar 实例由服务器集群、分布式 SQL 数据库、索引系统、快照系统和定期作业系统组成。

Google 有许多高流量应用程序，例如搜索、文档、表格和 Gmail。Google 帐户在这些系统之间共享，因此需要协调授权决策（即 Google 帐户可以执行的操作）。这些应用程序的运行规模很大，因此持续的服务间通信是不切实际的。他们的授权系统需要处理数十亿用户共享的数十亿对象，并且需要以极低的延迟返回结果。此外，他们的系统需要处理过滤问题，例如“该用户可以看到哪些文档？”

特别是，他们的授权系统需要：

- 没有错误。错误的授权决定可能会让某人看到不适合他们的文档。
- 快速地。所有其他应用程序将等待 Zanzibar 的授权决定。Google 的目标是每次查询 <10 毫秒。
- 高度可用。授权必须至少与依赖它的应用一样可用。
- 高吞吐量。Google 每天处理数十亿次查询。


以上的各个特性中除了灵活性之外都是性能或算法上的特点，性能和可靠性上也有很大一部分得益于底层的[Spanner](https://research.google/pubs/pub39966/)数据库。如果有兴趣可以阅读以下这篇论文：[Zanzibar: Google’s Consistent, Global Authorization System对Zanzibar](https://research.google/pubs/pub48190/)进行更深入的了解。下面我们就灵活性这一特点看一下Zanzibar是如何定义鉴权模型的。

## 参考资料

- [Zanzibar: Google’s Consistent, Global Authorization System](https://research.google/pubs/pub48190/)
- [My Reading on Google Zanzibar: Consistent, Global Authorization System](https://pushpalanka.medium.com/my-reading-on-google-zanzibar-consistent-global-authorization-system-f4a12df85cbb)
- [AuthZ: Carta’s highly scalable permissions system](https://medium.com/building-carta/authz-cartas-highly-scalable-permissions-system-782a7f2c840f)
- [Zanzibar-style ACLs with OPA Rego](https://gruchalski.com/posts/2022-05-07-zanzibar-style-acls-with-opa-rego/)
- [Zanzibar: A Global Authorization System - Presented by Auth0](https://zanzibar.academy/)
- [The Evolution of Ory Keto: A Global Scale Authorization System](https://www.ory.sh/keto-zanzibar-evolution/)
- [Building Zanzibar from Scratch](https://www.osohq.com/post/zanzibar)
- [OpenFGA : Auth0’s an open-source authorization solution](https://openfga.dev/)
- [What is Zanzibar?](https://authzed.com/blog/what-is-zanzibar/)
- [ZANZIBAR与ORY/KETO: 权限管理服务简介](https://chennima.github.io/keto-permission-manager-introduction)
- [What is Relationship Based Access Control (ReBAC)?](https://www.ubisecure.com/access-management/what-is-relationship-based-access-control-rebac/)
- [Relationship-Based Access Control (ReBAC)](https://www.osohq.com/academy/relationship-based-access-control-rebac)
- [详解微服务中的三种授权模式](https://www.infoq.cn/article/rl6g3buvaal8aiwvugdf)
- [Announcing OpenFGA - Auth0’s Open Source Fine Grained Authorization System](https://auth0.com/blog/auth0s-openfga-open-source-fine-grained-authorization-system/)
- [如何使用 Ory Kratos 和 Ory Keto 保护您的烧瓶应用程序](https://devpress.csdn.net/python/62f99ab8c6770329307fef6d.html)
- [Google Zanzibar In A Nutshell](https://www.permify.co/post/google-zanzibar-in-a-nutshell)

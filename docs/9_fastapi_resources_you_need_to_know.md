# 9 个 FastAPI 的必知资源

FastAPI 是 Python 开发人员最新、最流行的 API 框架之一。我们的工程师一次又一次需要将一个或多个第三方库与我们的 API 结合使用，以附加额外的功能和特性来丰富我们的项目。

在今天的这篇文章中，我想与您分享一些对于常规 FastAPI 从业者非常有用的资源。我已经在自己的项目中使用了其中的大部分，并且还包括我计划在不久的将来使用的一些。

那么让我们深入看看吧！

## FastAPI-pagination

该库允许您从 API 路由发送简单的分页响应。这在main.py中的几行代码中使用非常方便，而不是自己编写整个分页逻辑。

在此处查看库： <https://uriyyo-fastapi-pagination.netlify.app/>

## FastAPI-MVC

这是一个极其方便的 Python 开发人员生产力工具，可从单个 shell 命令开始制作高质量的 FastAPI 生产就绪 API。

您可以获得 MVC Python 项目的所有样板设置，并且可以利用该库中定义的生成器直接编写项目特定代码。

您开箱即用的东西包括：

- Python Poetry 依赖管理
- Makefile、GitHub 操作和 Docker 设置
- 现成的 Sphinx 文档

以及更多。

在此处查看库： <https://github.com/fastapi-mvc/fastapi-mvc>

## FastAPI-Mail

正如您可能已经从名称中猜到的，这是一个轻量级库，可帮助您轻松地从 FastAPI 项目发送邮件，并且内置对后台任务管理的支持。

您可以使用此库发送基于文本和文件的电子邮件，从而使您不必自己重新发明轮子来编写逻辑。

在此处查看该库：<https://github.com/sabuhish/fastapi-mail>

## Tortoise-ORM

如果您像我一样非常习惯 Django 中的内置 ORM，并且在 FastAPI 中工作感到措手不及，那么在查看这个库后您不会失望的。

这是一个受 Django 启发的 ORM，可帮助您以 Django 式的方式使用您选择的关系数据库。

在此处查看该库：<https://tortoise.github.io/#why-was-tortoise-orm-b​​uilt>

## FastAPI-Cache

构建生产级 API 需要许多额外的要求，例如工作缓存。该库允许您集成 Redis 和 memcache 等缓存，以非常方便地缓存 FastAPI 响应和函数结果。

此外，它甚至还支持 AWS Dynamo-DB 来存储缓存！

在此处查看该库： <https://github.com/long2ice/fastapi-cache>

## FastAPI-Limiter

防止滥用生产 API 路由的最简单方法之一是通过速率限制过程。该库允许您通过简单的 Python 装饰器在 FastAPI 路由中轻松集成速率限制。

它还支持 Web 套接字，这是一项附加功能，它对通过套接字交换的数据进行速率限制。

在此处查看该库： <https://github.com/long2ice/fastapi-limiter>

## FastAPI-Admin

Django 的管理界面是最酷的开箱即用功能之一，但 FastAPI 中再次缺少该功能。正如您可能已经猜到的，这个库很好地满足了这一要求。

它使用 Bootstrap HTML 模板作为管理/仪表板 UI 来为 FastAPI 项目制作管理界面。

在此处查看库： <https://github.com/fastapi-admin/fastapi-admin>

## FastAPI Best Practises

任何生产就绪系统中的最佳实践都可能包括需要完成的大量检查。自己收集这些要求可能会很乏味，而且很可能会错过该过程中的一些关键步骤。

该存储库是一组全面的最佳实践的集合，您可以选择在 FastAPI 项目中使用它们。

在此处查看存储库：<https://github.com/zhanymkanov/fastapi-best-practices>

## 具有消息队列和监控功能的 FastAPI

RabbitMQ 是最流行的消息代理之一，如果您想将其与 FastAPI 项目集成，那么这个样板 GitHub 存储库就是您的最佳选择。

它甚至包括一个方便的 Celery 设置，用于通过集成的 Redis 后端监控任务。相当惊人！

在此处查看该库： <https://github.com/GregaVrbancic/fastapi-celery>

## 原文地址

[9 FastAPI Resources You Need To Know](https://python.plainenglish.io/9-fastapi-resources-you-need-to-know-f050799ef1f6)

---
date: 2020-01-01
category:
  - GoWind风行
tag:
  - Golang
  - Go-Kratos
  - GoWind
sticky: 10
---

# GoWind Content Hub｜风行，开箱即用的企业级前后端一体内容中台

风行（GoWind HCH）是一款基于 Golang 全栈构建的企业级 Headless 内容中台（HCH=Headless Content Hub，无头内容中枢），以开箱即用的产品形态、灵活可扩展的架构设计，为企业打造全域内容管理与分发的一体化解决方案，助力企业打破内容孤岛，实现全场景内容高效运营。

## 为什么选择风行内容中台？

在数字化时代，企业内容资产的价值愈发凸显，但传统内容管理模式普遍面临「架构僵化、多端适配难、权限管控粗、运营效率低」等痛点。风行内容中台从企业实际业务场景出发，构建了「轻量化部署、全能力覆盖、高灵活拓展」的产品体系：

- **全栈技术底座**：基于 Golang 高性能后端框架打造，兼顾稳定性与并发能力，多前端技术栈适配满足不同团队技术选型需求；
- **Headless 核心架构**：内容生产与展示层解耦，通过标准化 API 实现内容跨端、跨平台无缝分发，适配 Web、小程序、APP 等全终端场景；
- **企业级权限体系**：从租户、部门、角色到按钮级权限的全维度管控，满足大型组织复杂的权限划分与数据隔离需求；
- **可视化高效运营**：无需代码开发，通过可视化配置完成内容建模、菜单管理、站点配置等核心操作，大幅降低运营成本，提升内容上线效率。

## 演示地址

亲身体验风行内容中台的全能力，以下演示地址覆盖中台管理端、多端 API 文档及各前端展示端：

| 演示类型          | 访问地址                                                                                 |
|---------------|--------------------------------------------------------------------------------------|
| 后端管理前端        | [https://admin.cms.gowind.cloud](https://admin.cms.gowind.cloud)                     |
| 后端API Swagger | [https://api.admin.cms.gowind.cloud/docs/](https://api.admin.cms.gowind.cloud/docs/) |
| 默认账号密码        | `admin` / `admin`（所有演示地址通用）                                                          |
| 前台API Swagger | [https://api.cms.gowind.cloud/docs/](https://api.cms.gowind.cloud/docs/)             |
| 前台Vue端        | [https://cms.gowind.cloud](https://cms.gowind.cloud)                                 |
| 前台React端        | [https://react.cms.gowind.cloud](https://react.cms.gowind.cloud)                                 |
| 前台Taro端        | [https://taro.cms.gowind.cloud](https://taro.cms.gowind.cloud)                                 |

## 风行·核心技术栈

秉持「高效、稳定、可扩展」的技术选型理念，打造适配企业级场景的技术底座，同时支持多前端生态适配：

- 后端基于 [Golang](https://go.dev/) + [go-kratos](https://go-kratos.dev/) + [wire](https://github.com/google/wire) + [ent](https://entgo.io/docs/getting-started/)：高性能、易扩展的微服务架构，支撑高并发业务场景，降低后期维护成本；
- 管理中台前端基于 [Vue](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/) + [Ant Design Vue](https://antdv.com/) + [Vben Admin](https://doc.vben.pro/)：组件化、工程化的前端架构，兼顾操作体验与开发效率；
- 前台展示前端支持多技术栈，当前已适配 [Vue3](https://vuejs.org/) + [Naive UI](https://www.naiveui.com/)、[React](https://react.dev/) + [Next.js](https://nextjs.org/) + [Ant Design](https://ant.design/) 、[Taro](https://docs.taro.zone/en/docs/)：一套内容中台适配多端展示，覆盖 PC、H5、小程序等全场景。

## 风行·核心功能列表

从组织管理到内容运营，从权限管控到多端分发，风行内容中台覆盖企业内容全生命周期管理：

| 功能   | 说明                                                                       |
|------|--------------------------------------------------------------------------|
|多租户管理|企业级多租户架构，支持租户新增、启用 / 禁用、套餐配置与隔离管理；新增租户自动初始化部门、默认角色与管理员账号，支持一键登录租户后台。|
|用户管理|系统用户全生命周期管理，支持用户新增、编辑、启用 / 禁用、重置密码；支持绑定多角色、多部门与上级主管，可设置 / 取消主管身份，支持一键代登录指定用户，支持高级条件查询。|
|角色管理|角色与角色分组统一管理，支持按角色关联用户，精细化配置菜单权限、接口权限与数据权限；支持批量添加 / 移除员工，灵活适配团队权限划分。|
|权限管理|统一管理权限分组、菜单节点与权限点，树形结构展示权限体系，支持按钮级细粒度权限控制，与接口、菜单联动实现完整权限闭环。|
|菜单管理|可视化配置系统菜单目录、菜单页面与功能按钮，支持自定义菜单图标、排序、路由与权限标识，前端菜单自动根据权限动态渲染。|
|部门管理|组织架构部门树形管理，支持多级部门创建、编辑、排序与联动绑定用户，清晰划分企业组织层级。|
|内容建模|可视化自定义内容模型与字段类型，支持文本、数字、富文本、图片、文件、关联等字段，灵活适配文章、产品、公告、素材等各类业务内容结构。|
|内容管理|统一管理各类内容数据，支持内容新增、编辑、发布 / 下架、置顶、排序、回收站与批量操作；支持富文本 / Markdown 编辑，图片与附件一键上传。|
|分类管理|多级内容分类树形管理，支持分类新增、编辑、排序、禁用，支持绑定内容模型，前台可按分类快速筛选内容。|
|标签管理|内容标签统一管理，支持标签新增、编辑、删除与关联内容，支持按标签检索与聚合展示。|
|评论管理|管理用户评论与互动内容，支持查看、审核、删除、回复、屏蔽违规评论，可按内容、用户、时间筛选查询。|
|多语言管理|原生多语言国际化支持，支持语种新增、启用 / 禁用，内容、菜单、提示信息统一翻译管理，无缝支撑出海与跨境业务。|
|站点管理|支持多站点独立配置，每个租户可创建多个站点，独立配置域名、标题、Logo、SEO 信息与展示风格。|
|站点配置|可视化站点系统配置，支持基础信息、SEO 优化、上传限制、缓存策略、邮件 / 短信等全局参数配置，配置实时生效。|
|文件资源管理|统一管理图片、文档、视频等文件资源，支持上传至本地或 OSS 云存储，支持文件预览、复制地址、下载、删除、分组管理与大图查看。|
|字典管理|系统数据字典大类与子项管理，支持联动查询、服务端排序、导入导出，用于下拉选项、状态标识等全局通用数据维护。|
|接口管理|后端接口统一维护与自动同步，支持树形展示接口列表，可配置接口请求参数、响应结果与操作日志记录，用于权限点绑定。|
|任务调度|定时任务管理，支持任务新增、编辑、删除、启动、暂停、立即执行，查看任务执行记录与运行日志，保障定时业务自动运行。|
|消息通知|消息分类与消息推送管理，支持多级消息分类，可向指定用户发送消息，查看消息已读状态与已读时间。|
|站内信|个人站内消息中心，支持消息查看、删除、单条标为已读、一键全部已读，实现系统与用户间消息触达。|
|个人中心|个人信息查看与编辑，头像、昵称修改，登录密码重置，查看登录记录与账号安全信息。|
|缓存管理|系统缓存实时查询与管理，支持按缓存键精准清除、批量清理，保障系统配置与数据实时更新。|
|登录日志|记录所有用户登录成功 / 失败日志，包含登录账号、IP、归属地、设备、时间，支持查询与导出，便于安全审计。|
|操作日志|全链路用户操作日志记录，包含正常与异常操作，记录操作人、IP、归属地、请求参数与结果，支持详情查看与追溯。|
|Headless API|API 优先设计，提供完整前后台 OpenAPI 接口，支持内容查询、创建、更新、删除，适配 Vue、React、Taro、小程序等多端调用。|

## 风行·中台界面展示

直观感受风行内容中台的可视化操作体验与精细化管理能力：

<table>
    <tr>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/admin_login.png" alt="后台用户登录界面"/></td>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/admin_register.png" alt="后台用户注册界面"/></td>
    </tr>
    <tr>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/admin_post_list.png" alt="后台帖子列表"/></td>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/admin_post_edit.png" alt="后台帖子编辑"/></td>
    </tr>
    <tr>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/admin_category_list.png" alt="后台分类列表"/></td>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/admin_category_edit.png" alt="后台分类编辑"/></td>
    </tr>
    <tr>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/admin_tag_list.png" alt="后台标签列表"/></td>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/admin_tag_edit.png" alt="后台标签编辑"/></td>
    </tr>
    <tr>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/admin_comment_list.png" alt="后台评论列表"/></td>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/admin_site_list.png" alt="后台站点列表"/></td>
    </tr>
    <tr>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/admin_site_setting_list.png" alt="后台站点配置列表"/></td>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/admin_navigation_list.png" alt="后台导航列表"/></td>
    </tr>
</table>

## 风行·前台截图展示

体验基于风行内容中台 API 构建的多端展示效果，感受内容分发的灵活性：

<table>
    <tr>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/react_app_login.png" alt="React前台用户登录界面"/></td>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/react_app_register.png" alt="React前台用户注册界面"/></td>
    </tr>
    <tr>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/react_app_homepage.png" alt="React前台主页"/></td>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/react_app_about.png" alt="React前台关于页面"/></td>
    </tr>
    <tr>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/react_app_post_list.png" alt="React前台帖子列表"/></td>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/react_app_post_detail.png" alt="React前台帖子详情页"/></td>
    </tr>
    <tr>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/react_app_category_list.png" alt="React前台分类列表"/></td>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/react_app_category_detail.png" alt="React前台分类详情页"/></td>
    </tr>
    <tr>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/react_app_tag_list.png" alt="React前台标签列表"/></td>
        <td><img src="https://tx7do.github.io/assets/images/go_wind_cms/react_app_tag_detail.png" alt="React前台标签详情页"/></td>
    </tr>
</table>

## 适用场景

风行内容中台可广泛适配各类企业的内容运营需求，核心适用场景包括：

- **品牌官网 / 内容门户**：快速搭建并运营企业官网、资讯门户，支持内容快速更新与多端展示；
- **电商平台**：管理产品信息、营销内容、用户评论等，实现商品内容的精细化运营；
- **跨境 / 出海业务**：依托多语言管理能力，支撑多语种站点的内容运营与本地化适配；
- **集团型企业**：通过多租户架构实现多子公司、多品牌的内容隔离与统一管理；
- **小程序 / 多端应用**：基于 Headless API 快速对接小程序、APP 等终端，实现内容一次生产、多端复用。

## 风行(Go Wind Content Hub)·项目代码

* [go-wind-cms Gitee](https://gitee.com/tx7do/go-wind-cms)
* [go-wind-cms Github](https://github.com/tx7do/go-wind-cms)

## 联系我们

如需了解更多产品细节、定制化方案或合作事宜，欢迎联系：

- 微信个人号：`yang_lin_bo`（备注：`go-wind-cms`）
- 掘金专栏：[go-wind-cms](https://juejin.cn/column/7541283508041826367) （持续更新产品文档、技术解析与最佳实践）

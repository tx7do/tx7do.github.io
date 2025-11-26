# 代码特殊注释完整规范：IDE 支持、使用示例与团队协作指南

## 一、完整注释表格


| 注释名 | 核心作用说明	 | 适用场景细分	 |  VSC   |  VS   |  JetBrains   | 优先级建议 |
|-----|-------|-----|-----|-----|-----|-----|
|  TODO   |  功能未实现（尚未启动开发）	|新需求、未动工的模块 / 接口	|   [x]  |   [x]  |[x]|中 - 高|
|TODO:HIGH/MID/LOW|	带优先级的未实现功能	|需区分紧急程度（如 HIGH = 迭代必做，LOW = 后续优化）	|[]	|[]|	[x]	|自定义|
|UNDONE	|功能未完成（已开发部分，待收尾）|	开发中被打断、需补充细节 / 边界处理的功能	|[]|	[x]|	[]	|中|
|FIXME|	已发现明确 Bug，需修复	|可复现、定位清晰的缺陷（含潜在风险未复现的问题）|	[]	|[]|	[x]	|高|
|FIXME:URGENT|	紧急 Bug 修复	|线上故障、阻塞测试的核心流程缺陷|	[]	|[]	|[x]	|最高|
|BUG	|已确认的具体缺陷	|区别于 FIXME：更侧重 “已复现 + 影响范围明确” 的 Bug（如 “用户 ID>1000 时查询失败”）|	[]	|[]	|[]|	高|
|HACK	|临时解决方案 / 取巧实现	|功能可用，但代码不优雅（如硬编码、规避框架限制），待重构	|[]|	[x]	|[]|	中|
XXX|	待优化问题（设计 / 实现不规范）|	非紧急缺陷，如命名不规范、冗余代码、逻辑可简化（优先级低于 HACK/FIXME）|	[]|	[]|	[]	|低 - 中|
|UnresolvedMergeConflict	|未解决的代码合并冲突|	Git 合并分支时产生的冲突，需手动对比处理|	[]	|[x]	|[]	|最高|
|NOTE	|重要说明 / 备注	|记录设计思路、依赖条件、使用限制（如 “依赖第三方 SDK v2.3.0，升级需改签名”）|	[]	|[]|	[x]|	-|
|DEPRECATED	|已废弃的代码 / 接口	|不建议继续使用，后续版本会删除（需标注替代方案）|	[]	|[]|	[x]	|-|
|REVIEW	|需代码审查 / 复核|	复杂逻辑、高风险模块（如权限控制、支付流程），需团队复核	|[]	|[]	|[]|	中|
|OPTIMIZE	|性能 / 结构优化	|代码可运行，但效率低（如 O (n²) 循环）或结构混乱，需重构	|[]	|[]|	[]	|低 - 中|

> 注：IDE 支持标记说明
>
> - [x]：原生自带识别（无需额外配置） 
>
> - []：需通过插件 / 自定义配置实现识别（下文附配置方法）

## 二、规范使用示例（C++/ 通用语法）

```cpp
// TODO:HIGH 实现用户登录的短信验证码校验（截止2025-12-15，依赖短信SDK集成）
void userLogin(const std::string& phone, const std::string& code) {
    // UNDONE 补充验证码过期时间校验（已实现发送逻辑，待加时效判断）
    if (code.empty()) {
        // FIXME:URGENT 空字符串导致崩溃，需添加参数非空校验（线上已反馈3例）
        throw std::invalid_argument("code is empty");
    }

    // BUG 当phone长度>11位时，数据库查询返回空指针（复现步骤：输入12位手机号）
    auto user = db.queryUser(phone);

    // HACK 临时用sleep规避并发问题，后续需改用互斥锁（TODO:MID 优化并发控制）
    std::this_thread::sleep_for(std::chrono::milliseconds(500));

    // XXX 硬编码"admin"，需改为配置项（config.h中添加ADMIN_ROLE常量）
    if (user->role == "admin") {
        // NOTE 管理员登录无需二次验证（产品需求：见文档P12）
        skipSecondAuth();
    }

    // DEPRECATED 该接口将在v2.0删除，替代方案：UserService::newGetUserInfo(phone)
    auto oldInfo = getUserInfo(phone);

    // REVIEW 权限判断逻辑较复杂，需复核是否存在越权风险（涉及用户角色、资源所有权）
    if (!checkPermission(user, resourceId)) {
        return FORBIDDEN;
    }

    // OPTIMIZE 循环遍历全量用户效率低，需添加索引+分页查询（数据量>1万时卡顿）
    for (auto& u : allUsers) {
        if (u.id == targetId) { /* ... */ }
    }
}

// UnresolvedMergeConflict 合并feature/pay分支时冲突：支付回调地址配置（需确认用测试/正式地址）
// const std::string callbackUrl = "https://test-pay.example.com/callback";
// const std::string callbackUrl = "https://pay.example.com/callback";
```

## 三、各 IDE 高效使用指南（查看 + 自定义配置）

### 1. 原生查看方式（无需配置）

|IDE	|查看入口|	支持的默认注释|
|-----|-------|-----|
|VS Code	|终端 → 运行任务 → 任务：显示任务	|TODO|
|Visual Studio|	视图 → 任务列表（默认 “注释” 分类）	|TODO、UNDONE、HACK、UnresolvedMergeConflict|
|JetBrains|	视图 → 工具窗口 → TODO（可筛选优先级）|	TODO、FIXME、NOTE、DEPRECATED、带后缀的 TODO/FIXME|

### 2. 自定义配置（扩展支持更多注释）

#### （1）VS Code（推荐插件：Todo Tree）

- 安装插件：搜索 `Todo Tree`（支持高亮、侧边栏筛选、自定义规则）
- 配置自定义注释（文件 → 首选项 → 设置 → 搜索 `Todo Tree: Pattern`）：
    ```json
    "todo-tree.highlights.customHighlight": {
    "BUG": { "icon": "bug", "color": "#ff0000", "backgroundColor": "#ffebee" },
    "REVIEW": { "icon": "check-circle", "color": "#ff9900", "backgroundColor": "#fff3e0" },
    "OPTIMIZE": { "icon": "rocket", "color": "#0099ff", "backgroundColor": "#e3f2fd" }
    }
    ```
- 效果：侧边栏生成 Todo Tree 面板，可按注释类型 / 颜色筛选。

#### （2）Visual Studio（添加自定义任务令牌）

- 步骤：工具 → 选项 → 环境 → 任务列表 → 点击 “添加”
- 配置示例：

    |令牌	|	说明|
    |-----|-------|
    |BUG|已确认的具体缺陷|
    |REVIEW|需代码审查|
    |OPTIMIZE	|性能 / 结构优化|
- 效果：`// BUG xxx` 会显示在 “任务列表” 的 “注释” 分类中。

#### （3）JetBrains（添加 TODO 模式）

- 步骤：File → Settings → Tools → TODO → 点击 “+”
- 配置示例（正则表达式）：
    |模式		|	描述	|颜色|
    |-----|-------|-------|
    |`BUG\s*:`|已确认的 Bug	|红色|
    |`REVIEW\s*:`|需代码审查	|橙色|
    |`OPTIMIZE\s*:`|性能优化 |蓝色|
- 效果：`// BUG: xxx` 会在 TODO 面板中单独分类，支持筛选。

## 四、团队协作核心规则（避免混乱）

### 1. 明确使用边界：

- 不混用 `TODO` 和 `UNDONE`：未动工用 TODO，开发中未完成用 UNDONE；
- 不滥用 `FIXME` 和 `BUG`：可复现 + 影响明确用 BUG，潜在风险 / 未复现用 FIXME。
- 注释必须包含 3 要素：

### 2. 做什么（明确目标）；

- 优先级 / 截止时间（如 `TODO:HIGH 截止2025-12-20`）；
- 依赖条件（如 `依赖订单模块接口`）。

### 3. 定期清理注释：

- 迭代发布前：删除已完成的 TODO/UNDONE，修复所有 FIXME/BUG；
- 废弃代码：用 `DEPRECATED` 标记，而非直接删除（便于回滚）。

### 4. 跨 IDE 兼容：

- 团队统一使用原生支持的注释（TODO、FIXME、NOTE），或同步自定义配置（如共享 VS Code 的 settings.json、JetBrains 的 TODO 模式导出文件）。

## 五、补充说明

- **语言兼容性**：上述注释语法适用于 C++、Java、Python、JavaScript 等大部分编程语言（仅注释符号差异，如 Python 用 `# TODO`）；
- **工具集成**：可结合项目管理工具（如 Jira），通过插件将 TODO 注释同步为任务（如 VS Code 的Jira Todo插件）；
- **避免过度注释**：仅标记关键待办 / 问题，代码本身可自解释的逻辑无需额外注释。

通过以上规范，可实现 “代码注释→任务跟踪→团队协作” 的闭环，提升项目管理效率。

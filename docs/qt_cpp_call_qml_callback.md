# Qt 6 实战：C++ 调用 QML 回调方法（异步场景完整实现）

在 Qt 6 开发中，C++ 与 QML 混合编程是常见场景。当 C++ 处理异步操作（如登录验证、网络请求、数据库查询）时，需要将结果通知给 QML 界面，**回调函数**是最直观的通信方式之一。本文将基于你提供的代码框架，补充关键细节、修复潜在问题，并完整实现从 C++ 调用 QML 回调的全流程。

## 一、核心场景说明

我们需要实现：

1. QML 调用 C++ 的 `login` 方法（传入用户名、密码和两个回调函数：成功回调 `onSuccess`、失败回调 `onFailure`）；
2. C++ 异步处理登录逻辑（模拟耗时操作）；
3. 登录完成后，C++ 调用对应的 QML 回调函数，将结果（成功响应 / 错误信息）传递给 QML。

## 二、Step 1：完善 C++ 服务类

### 1.1 基础配置（必须继承 QObject）

QML 能调用的 C++ 方法 / 属性，依赖 Qt 的元对象系统（MOC），因此 `AuthenticationService` 必须：

- 继承 `QObject`；
- 添加 `Q_OBJECT` 宏；
- 用 `Q_INVOKABLE` 标记需要暴露给 QML 的方法。

### 1.2 完整 C++ 代码实现

```cpp
// authentication_service.h
#include <QObject>
#include <QJSValue>
#include <QJSEngine>
#include <QtConcurrent>
#include <QThread>
#include <QMetaObject>

// 自定义错误类：封装错误码、错误信息
class KratosError {
public:
    KratosError(int code, const QString& message, const QString& details = "")
        : m_code(code), m_message(message), m_details(details) {}

    // 转换为 QJSValue，供 QML 访问属性
    QJSValue toQJSValue(QJSEngine& engine) const {
        QJSValue errorObj = engine.newObject();
        errorObj.setProperty("code", m_code);       // 错误码（如 401 未授权）
        errorObj.setProperty("message", m_message); // 错误提示
        errorObj.setProperty("details", m_details); // 详细信息（可选）
        return errorObj;
    }

private:
    int m_code;
    QString m_message;
    QString m_details;
};

// 登录成功响应类：封装返回数据
struct LoginResponse {
    QString token;     // 身份令牌
    QString username;  // 用户名
    int userId;        // 用户 ID

    // 转换为 QJSValue，供 QML 访问属性
    QJSValue toQJSValue(QJSEngine& engine) const {
        QJSValue respObj = engine.newObject();
        respObj.setProperty("token", token);
        respObj.setProperty("username", username);
        respObj.setProperty("userId", userId);
        return respObj;
    }
};

// 认证服务类（单例模式）
class AuthenticationService : public QObject {
    Q_OBJECT // 必须添加，启用元对象系统
public:
    // 单例获取方法（线程安全）
    static AuthenticationService* instance() {
        static QMutex mutex;
        if (!m_instance) {
            mutex.lock();
            if (!m_instance) {
                m_instance = new AuthenticationService();
            }
            mutex.unlock();
        }
        return m_instance;
    }

    // 禁止拷贝构造和赋值
    AuthenticationService(const AuthenticationService&) = delete;
    AuthenticationService& operator=(const AuthenticationService&) = delete;

    // 暴露给 QML 的登录方法
    Q_INVOKABLE void login(
        const QString& username,
        const QString& password,
        const QJSValue& onSuccess,  // QML 传入的成功回调
        const QJSValue& onFailure   // QML 传入的失败回调
    );

private:
    AuthenticationService(QObject* parent = nullptr) : QObject(parent) {}
    static AuthenticationService* m_instance;
};

// authentication_service.cpp
#include "authentication_service.h"

AuthenticationService* AuthenticationService::m_instance = nullptr;

void AuthenticationService::login(
    const QString& username,
    const QString& password,
    const QJSValue& onSuccess,
    const QJSValue& onFailure
) {
    // 1. 有效性检查：确保 QJSEngine 和回调函数有效
    QJSEngine* engine = qjsEngine(this);
    if (!engine) {
        qWarning() << "[AuthService] 失败：无法获取 QJSEngine 上下文";
        return;
    }
    if (!onSuccess.isCallable() && !onFailure.isCallable()) {
        qWarning() << "[AuthService] 警告：未传入有效回调函数";
        return;
    }

    // 2. 异步处理登录逻辑（模拟耗时操作：如网络请求、数据库验证）
    // 用 QtConcurrent::run 开启后台线程，避免阻塞 UI 线程
    QtConcurrent::run([=, this]() {
        // 模拟耗时 2 秒（实际场景替换为真实登录逻辑）
        QThread::sleep(2);

        // 3. 模拟登录验证结果（实际场景替换为真实校验逻辑）
        bool isLoginSuccess = (username == "admin" && password == "123456");

        // 4. 切换回主线程执行回调（关键！QJSValue 必须在创建它的线程调用）
        QMetaObject::invokeMethod(this, [=, this]() {
            if (isLoginSuccess) {
                // 登录成功：构造响应对象，调用 onSuccess 回调
                if (onSuccess.isCallable()) {
                    LoginResponse resp;
                    resp.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
                    resp.username = username;
                    resp.userId = 1001;

                    QJSValueList args;
                    args << resp.toQJSValue(*engine); // 传入响应数据
                    onSuccess.call(args);             // 调用 QML 成功回调
                }
            } else {
                // 登录失败：构造错误对象，调用 onFailure 回调
                if (onFailure.isCallable()) {
                    KratosError error(401, "登录失败", "用户名或密码错误");

                    QJSValueList args;
                    args << error.toQJSValue(*engine); // 传入错误信息
                    onFailure.call(args);              // 调用 QML 失败回调
                }
            }
        }, Qt::QueuedConnection); // 队列连接：确保在主线程执行
    });
}
```

## 三、Step 2：注册 C++ 单例到 QML

在 `main.cpp` 中，将 `AuthenticationService` 单例注册到 QML 上下文，让 QML 可以直接访问：

```cpp
// main.cpp
#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include "authentication_service.h"

int main(int argc, char *argv[]) {
    QGuiApplication app(argc, argv);

    QQmlApplicationEngine engine;

    // 注册 C++ 单例到 QML（模块名：backend，版本：1.0，对象名：AuthenticationService）
    qmlRegisterSingletonInstance(
        "backend",                // QML 导入时的模块名
        1, 0,                     // 版本号（需与 QML import 一致）
        "AuthenticationService",  // QML 中访问的对象名
        AuthenticationService::instance() // 单例实例
    );

    // 加载 QML 主文件
    const QUrl url(u"qrc:/LoginDemo/main.qml"_qs);
    QObject::connect(&engine, &QQmlApplicationEngine::objectCreationFailed,
        &app, []() { QCoreApplication::exit(-1); },
        Qt::QueuedConnection);
    engine.load(url);

    return app.exec();
}
```

**关键注意：**

- 注册时模块名（`backend`）、版本号（`1.0`）必须与 QML 中的 `import` 语句一致；
- 单例注册需用 `qmlRegisterSingletonInstance`（Qt 5.15+ 支持，Qt 6 推荐），而非 `qmlRegisterSingletonType`（后者适合动态创建单例）。

## 四、Step 3：QML 中调用 C++ 方法并处理回调

在 QML 界面中，导入注册的模块，调用 `AuthenticationService.login` 并传入回调函数：

```qml
// main.qml
import QtQuick 6.2
import QtQuick.Controls 6.2
import backend 1.0 // 导入 C++ 注册的模块（需与注册时的模块名、版本一致）

ApplicationWindow {
    width: 400
    height: 300
    title: "登录演示"
    visible: true

    ColumnLayout {
        anchors.centerIn: parent
        spacing: 16

        TextField {
            id: usernameField
            placeholderText: "输入用户名"
            Layout.width: 250
            text: "admin" // 测试用默认值
        }

        TextField {
            id: passwordField
            placeholderText: "输入密码"
            echoMode: TextField.Password
            Layout.width: 250
            text: "123456" // 测试用默认值（正确密码）
            // text: "wrong" // 测试失败场景
        }

        Button {
            text: "登录"
            Layout.width: 250
            onClicked: {
                // 调用 C++ 的 login 方法，传入回调函数
                AuthenticationService.login(
                    usernameField.text,
                    passwordField.text,
                    // 成功回调：接收 C++ 传递的响应数据
                    function(response) {
                        console.log("登录成功！响应：", JSON.stringify(response))
                        // 访问响应属性（C++ 中 LoginResponse 的字段）
                        console.log("Token:", response.token)
                        console.log("用户名:", response.username)
                    },
                    // 失败回调：接收 C++ 传递的错误信息
                    function(error) {
                        console.log("登录失败！错误码：", error.code, " 信息：", error.message)
                        // 在界面显示错误提示
                        errorLabel.text = error.message
                    }
                )
            }
        }

        Label {
            id: errorLabel
            color: "red"
            Layout.width: 250
            horizontalAlignment: Text.AlignCenter
        }
    }
}
```

## 五、核心技术关键点解析

### 1. QJSValue：C++ 与 QML 回调的桥梁

- `QJSValue` 是 Qt 中封装 JavaScript 值的类，支持存储函数、对象、基本类型等；
- 用 `isCallable()` 检查是否为可调用的 JavaScript 函数（回调）；
- 用 `call(QJSValueList args)` 调用回调函数，参数通过 `QJSValueList` 传递。

### 2. 线程安全（重中之重）

- QML 的 `QJSEngine` 是**线程关联**的（默认绑定主线程），直接在后台线程调用 `QJSValue::call` 会导致崩溃；
- 解决方案：用 `QMetaObject::invokeMethod` + `Qt::QueuedConnection`，将回调调用切换到主线程执行。

### 3. 自定义数据类型转 QJSValue

- 自定义类（如 `KratosError`、`LoginResponse`）需提供 toQJSValue 方法，通过 `QJSEngine::newObject()` 创建 JS 对象，再用 `setProperty` 设置属性；
- QML 中可直接通过属性名访问（如 `error.message`、`response.token`），大小写敏感。

### 4. 有效性检查

- 必须检查 `QJSEngine* engine = qjsEngine(this)` 是否为空（避免 QML 组件销毁后引擎失效）；
- 必须检查回调函数 `isCallable()`（避免传入非函数类型导致崩溃）。

## 六、常见问题排查

### 1. QML 无法导入 backend 模块？

- 检查 `qmlRegisterSingletonInstance` 的模块名、版本号与 QML import 一致；
- 确保 C++ 类继承 `QObject` 并添加 `Q_OBJECT` 宏；
- 构建时确保 MOC 文件正常生成（qmake 自动处理，CMake 需添加 `qt_add_qml_module`）。

### 2. 回调函数不执行？

- 检查 `isCallable()` 是否返回 `true`（确认传入的是函数）；
- 检查是否在主线程调用 `call()`（后台线程调用会静默失败）；
- 检查异步逻辑是否正常执行（如模拟的 `QThread::sleep` 后是否触发回调）。

### 3. 程序崩溃？

- 大概率是线程问题：后台线程直接操作 `QJSValue` 或 `QJSEngine`；
- 检查 `engine` 是否为空（如单例销毁后仍调用回调）。

## 七、最佳实践

### 1. 优先使用回调还是信号槽？

- **回调**：适合一次性操作（如登录、单次网络请求），代码直观，参数传递灵活；
- **信号槽**：适合多次通知（如实时数据更新），解耦性更强，支持多订阅者；
- 本文场景（登录）用回调更合适，简洁高效。

### 2. 简化数据传递（可选）

若数据简单，可直接用 `QVariantMap` 代替自定义类，无需写 `toQJSValue` 方法：

```cpp
QVariantMap errorMap;
errorMap["code"] = 401;
errorMap["message"] = "登录失败";
onFailure.call(QJSValueList{engine->toScriptValue(errorMap)});
```

### 3. 避免回调地狱

若存在多层回调（如登录后调用获取用户信息），可考虑用 Qt 6 的 `QPromise` + `co_await`（C++20+）或 QML 的 `async/await` 优化。

## 八、总结

本文完整实现了 Qt 6 中 C++ 调用 QML 回调的流程，核心是：

1. C++ 类继承 `QObject` 并暴露 `Q_INVOKABLE` 方法；
2. 用 `QJSValue` 接收 QML 回调，用 `call()` 触发回调；
3. 异步场景下必须切换到主线程执行回调，确保线程安全；
4. 自定义数据通过 `QJSValue` 转换后传递，QML 可直接访问属性。

这种方式适用于所有异步通信场景（登录、网络请求、文件读写等），是 C++ 与 QML 协作的核心技巧之一。

# 解决 Flutter 项目更新至 Android Studio Ladybug (2024.2.1) 后出现的问题

升级到Android Studio Ladybug | 2024.2.1后，我在 Flutter 项目中遇到了一些问题。幸运的是，我通过修改一些配置文件找到了一个简单的解决方案。如果您面临类似的挑战，请按照以下步骤让您的项目重回正轨。

修改`settings.gradle`：

```gradle
id "com.android.application" version "8.3.2" apply false
```

修改`gradle-wrapper.properties`:

```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.4-all.zip
```

## Your project is configured with Android NDK 23.1.7779620

修改`build.gradle`:

```gradle
android {
    ...
 //    ndkVersion flutter.ndkVersion
    ndkVersion = "25.1.8937393"
```

## Dependency ':flutter_local_notifications' requires core library desugaring to be enabled

修改`build.gradle`:

```gradle
android {
    ...
    compileOptions {
        ...
        coreLibraryDesugaringEnabled true
    }
    ...
}

dependencies {
    ...
    coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:1.2.2'
}
```

## 参考资料

- [Could not resolve all files for configuration ‘:app:androidJdkImage](https://fluttergyaan.medium.com/could-not-resolve-all-files-for-configuration-app-androidjdkimage-0096d0fdfe6e)
- ['flutter_local_notifications' requires core library desugaring to be enabled for app #2286](https://github.com/MaikuB/flutter_local_notifications/issues/2286)
- [Dependency ':flutter_local_notifications' requires core library desugaring to be enabled for :app](https://stackoverflow.com/questions/79158012/dependency-flutter-local-notifications-requires-core-library-desugaring-to-be)

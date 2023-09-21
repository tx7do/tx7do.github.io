# Git设置网络代理

## 设置HTTP代理

```bash
git config --global http.proxy http://127.0.0.1:1080
```

## 设置HTTPS代理

```bash
git config --global https.proxy https://127.0.0.1:1080
```

## 取消HTTP代理

```bash
git config --global --unset http.proxy
```

## 取消HTTPS代理

```bash
git config --global --unset https.proxy
```

## 查看系统配置信息

```bash
git config --system --list
```

## 查看当前用户配置信息

```bash
git config --global  --list
```

## 查看当前仓库配置信息

```bash
git config --local  --list
```

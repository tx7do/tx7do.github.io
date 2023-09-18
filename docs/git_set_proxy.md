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

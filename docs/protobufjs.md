# Protobufjs

## 7.x.x和6.x.x差异

6是运行时和CLI都在一起，7则拆分开来了。

```bash
pnpm install -D protobufjs
pnpm install -D protobufjs-cli
```

## 生成代码

### 生成JSON，适用于light库

```bash
pbjs -t json ../../include/protocol/*.proto > src/api/proto.json
pbjs -t json-module -w commonjs -p ../../include/protocol/ -o src/api/proto.js ../../include/protocol/*.proto
```

### 生成JavaScript代码，适用于minimal库

```bash
pbjs -t static-module -w commonjs -p ../../include/protocol/ -o src/api/proto.js ../../include/protocol/*.proto
```

### 用于直接从proto转换为typescript

```bash
pbts convert -o src/api/proto.ts -i ../../include/protocol/net_core.proto
```

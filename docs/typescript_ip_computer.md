# TypeScript IP 计算器

## 验证IP有效性

```typescript
// 验证IP有效性
function isValidIP(ip: string): boolean {
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(ip);
}
```

测试：

```typescript
console.log(isValidIP('10.10.10.111'))
console.log(isValidIP('10.10.10.1111'))
```

## 校验子网掩码有效性

```typescript
// 子网掩码校验
function isValidMask(mask: string): boolean {
  const reg = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
  return reg.test(mask);
}
```

测试：

```typescript
console.log(isValidMask('255.255.255.0'))
console.log(isValidMask('255.255.255.255'))
```

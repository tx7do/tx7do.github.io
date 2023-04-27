# Excel列数和列字母的转换 - TypeScript版

```typescript
// 列数 -> 列字母
function ColumnNumberToName(num: number): string {
  if (num < 1 || num > 16384) {
    return ''
  }

  if (num > 26) {
    const digit1 = String.fromCharCode((num - 1) / 26 + 64)
    const digit2 = String.fromCharCode(((num - 1) % 26) + 65)
    return digit1 + digit2
  } else {
    return String.fromCharCode(num + 64)
  }
}

// 列字母 -> 列数
function ColumnNameToNumber(name: string): number {
  let num = 0
  if (name.length == 1) {
    num = Number(name[0].charCodeAt(0)) - 64
  } else if (name.length == 2) {
    num = (Number(name[0].charCodeAt(0)) - 64) * 26 + Number(name[1].charCodeAt(0)) - 64
  }
  return num
}

console.log(ColumnNumberToName(1))
console.log(ColumnNumberToName(26))
console.log(ColumnNumberToName(27))


console.log(ColumnNameToNumber('A'))
console.log(ColumnNameToNumber('Z'))
console.log(ColumnNameToNumber('AA'))
```

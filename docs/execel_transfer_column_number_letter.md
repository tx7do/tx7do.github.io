# Excel列数和列字母的转换

## TypeScript版

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

## C#版本

```csharp
public string ColumnNumberToName(int columnNum)
{
    if (columnNum > 26)
    {
        return string.Format("{0}{1}", (char)(((columnNum - 1) / 26) + 64), (char)(((columnNum - 1) % 26) + 65));
    }
    else
    {
        return ((char)(columnNum + 64)).ToString();
    }
}

public int ColumnNameToNumber(string letters)
{
    int num = 0;
    if (letters.Length == 1)
    {
        num = Convert.ToInt32(letters[0]) - 64;
    }
    else if (letters.Length == 2)
    {
        num = (Convert.ToInt32(letters[0]) - 64) * 26 + Convert.ToInt32(letters[1]) - 64;
    }
    return num;
}
```

## Go版本

```go
const (
    MinColumns           = 1
    MaxColumns           = 16384
)

func ColumnNumberToName(num int) (string, error) {
	if num < MinColumns || num > MaxColumns {
		return "", ErrColumnNumber
	}
	var col string
	for num > 0 {
		col = string(rune((num-1)%26+65)) + col
		num = (num - 1) / 26
	}
	return col, nil
}

func ColumnNameToNumber(name string) (int, error) {
	if len(name) == 0 {
		return -1, newInvalidColumnNameError(name)
	}
	col := 0
	multi := 1
	for i := len(name) - 1; i >= 0; i-- {
		r := name[i]
		if r >= 'A' && r <= 'Z' {
			col += int(r-'A'+1) * multi
		} else if r >= 'a' && r <= 'z' {
			col += int(r-'a'+1) * multi
		} else {
			return -1, newInvalidColumnNameError(name)
		}
		multi *= 26
	}
	if col > MaxColumns {
		return -1, ErrColumnNumber
	}
	return col, nil
}
```

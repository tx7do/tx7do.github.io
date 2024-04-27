# 怎样在Go语言中生成随机种子

## time.Now().UnixNano

这是用的最多的，但是，也是安全隐患最大的方法。

从表面上看go的时间方法最大精度到纳秒，但是好像其实并不能到达的绝对的纳秒精度。

测试结果很不好，碰撞很高。

```go
import "time"

func TestSeedNanoTime(t *testing.T) {
	var seeds = make(map[int64]bool)
	for i := 0; i < 100000; i++ {
		seed := time.Now().UnixNano()
		seeds[seed] = true
		fmt.Println(seed)
	}
	fmt.Println(len(seeds))
}
```

## maphash.Hash

此方法无碰撞

```go
import "hash/maphash"

func TestSeedMapHash(t *testing.T) {
	var seeds = make(map[int64]bool)
	for i := 0; i < 100000; i++ {
		seed := int64(new(maphash.Hash).Sum64())
		seeds[seed] = true
		fmt.Println(seed)
	}
	fmt.Println(len(seeds))
}
```

## cryptoRand.Read

该方法无碰撞

```go
import (
	cryptoRand "crypto/rand"
	mathRand "math/rand"
)

func TestSeedCryptoRand(t *testing.T) {
	var seeds = make(map[int64]bool)
	for i := 0; i < 100000; i++ {
		var b [8]byte
		_, err := cryptoRand.Read(b[:])
		if err != nil {
			panic("cannot seed math/rand package with cryptographically secure random number generator")
		}
		seed := int64(binary.LittleEndian.Uint64(b[:]))
		seeds[seed] = true
		fmt.Println(seed)
	}
	fmt.Println(len(seeds))
}
```

## 映射表

该方法无碰撞

```go
func TestSeedRandomString(t *testing.T) {
	const alpha = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	size := 8
	var seeds = make(map[int64]bool)
	for i := 0; i < 100000; i++ {
		buf := make([]byte, size)
		for i := 0; i < size; i++ {
			buf[i] = alpha[mathRand.Intn(len(alpha))]
		}
		seed := int64(binary.LittleEndian.Uint64(buf[:]))
		seeds[seed] = true
		fmt.Println(seed)
	}
	fmt.Println(len(seeds))
}
```

## 参考资料

- [How to properly seed random number generator](https://stackoverflow.com/questions/12321133/how-to-properly-seed-random-number-generator)

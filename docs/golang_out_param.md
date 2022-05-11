# Golang在func中分配的变量通过参数传递出函数域之后变nil的问题

最近在Go上面碰到了一个传出参数的问题：

```go
func testOutString(out *string) {
	if out == nil {
		// str := "hellow"
		// out = &str
		out = new(string)
	}
	*out = "hello"
}

func main() {
	var str *string
	testOutString(str)
	fmt.Println(str)
}
```

不管是用的堆分配`out = new(string)`，  
还是栈上内存分配`str := "hellow"`，  
以上代码打印出来的必然是`nil`。

然后下面的代码则不会：

```go
func testOutString(out *string) {
	*out = "hello"
}

func main() {
	var str = new(string)
	testOutString(str)
	fmt.Println(str)
}
```

没错，在调用func之前，传入的参数必须先初始化。

其实，仔细想一想这个问题，要理解也是容易的：

因为Go语言是带GC的语言，内存是在func域中分配的，所以在func域中分配的内存，在func结束之后，会被GC所回收。

换言之，也就是在func中创建出来的变量具有一个引用计数，创建之后引用计数+1。出域的时候，引用计数-1，引用计数就变成了0，GC回收内存也就是很自然的事情了。

而返回值的话则不会出现这样的问题，很显然在用返回值传递的时候，引用计数并没有归零，如以下代码：

```go
func testOutString() *string {
	str := "hellow"
	return &str
}

func main() {
	var str *string
	str = testOutString()
	fmt.Println(*str)
}
```

在这里得提一提golang里面的一个概念：**变量逃逸**

关于变量逃逸，简单来说，就是原本应该分配在函数栈上的局部变量，因为其生命周期超出了所在函数的生命周期，所以编译器将其由栈分配改为堆分配，也就是我们通常所讲的“变量逃逸到了堆上”。

上面这个例子实际上就是一种变量逃逸的例子。  
而我上面产生问题的代码则并没有产生变量逃逸。
照理来说，按照我曾经C和C++的经验，在函数域里边new出来的变量应该是可以传递出来的，直觉上是没问题的，然而就是这个直觉并不是正确的。

这样可以产生变量逃逸：

```go
func testOutString(out **string) {
	var n = "hellow"
	*out = &n
}

func main() {
	var str *string
	testOutString(&str)
	fmt.Println(*str)
}
```

还有全局变量也能产生变量逃逸：

```go
var str *string

func testOutString() {
	var n = new(string)
	*n = "hello"
	str = n
}

func main() {
	testOutString()
	fmt.Println(*str)
}
```

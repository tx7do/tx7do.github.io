# golang实现各种算法 - 搜索算法

***

## 算法列表

- 顺序查找（Sequential Search）  
- 二叉树查找（Binary Search）  
- 三叉树查找（Ternary Search）  
- 插值查找（Interpolation Search）  
- 斐波那契查找（Fibonacci Search）  
- 指数查找（Exponential Search）  
- 树表查找（Tree table lookup）  
- 分块查找（Blocking Search）  
- 哈希查找（Hash Search）  

## 算法实现

### 顺序查找（Sequential Search）

```golang
func SequentialSearch(array []int, target int) int {
	if array == nil || len(array) == 0 {
		return -1
	}
	for i := 0; i < len(array); i++ {
		if array[i] == target {
			return i
		}
	}
	return -1
}
```

### 二叉树查找（Binary Search）

二分查找又称折半查找,前提条件：

1. 必须采用顺序存储结构

2. 必须按关键字大小有序排列。  

#### 基本二分查找

```go
func BinarySearch(array []int, target int) int {
	if array == nil || len(array) == 0 {
		return -1
	}

	low := 0
	high := len(array) - 1
	mid := 0
	for low <= high {
		//mid = low + (high-low)/2
		mid = low + (high-low)>>1
		if array[mid] > target {
			high = mid - 1
		} else if array[mid] < target {
			low = mid + 1
		} else {
			return mid
		}
	}
	return -1
}
```

#### 二分查找第一个元素的位置

```go
func LowerBound(array []int, target int) int {
	low, high, mid := 0, len(array)-1, 0
	for low <= high {
		//mid = low + (high-low)/2
		mid = low + (high-low)>>1
		if array[mid] >= target {
			high = mid - 1
		} else {
			low = mid + 1
		}
	}
	return low
}
```

#### 二分查找第一个大于该元素的位置

```go
func UpperBound(array []int, target int) int {
	low, high, mid := 0, len(array)-1, 0
	for low <= high {
		//mid = low + (high-low)/2
		mid = low + (high-low)>>1
		if array[mid] > target {
			high = mid - 1
		} else {
			low = mid + 1
		}
	}
	return low
}
```

### 三叉树查找（Ternary Search）  

```golang
func TernarySearch(array []int, target int) int {
	if array == nil || len(array) == 0 {
		return -1
	}

	low, high := 0, len(array)-2
	mid1, mid2 := 0, 0
	for low <= high {
		mid1 = low + (high-low)/3
		mid2 = high + (high-low)/3

		if array[mid1] == target {
			return mid1
		} else if array[mid2] == target {
			return mid2
		}

		if target < array[mid1] {
			high = mid1 - 1
		} else if target > array[mid2] {
			low = mid2 + 1
		} else {
			low = mid1 + 1
			high = mid2 - 1
		}
	}

	return -1
}
```

### 插值查找  

基于二分查找算法，将查找点的选择改进为自适应选择，可以提高查找效率。它是二分查找的改进版。  

```golang
func InterpolationSearch(array []int, target int) int {
	if array == nil || len(array) == 0 {
		return -1
	}

	low, high := 0, len(array)-1

	var mid = 0
	for array[low] < target && array[high] > target {
		//mid = low + (high-low)/2
		mid = low + (high-low)>>1

		if array[mid] < target {
			low = mid + 1
		} else if array[mid] > target {
			high = mid - 1
		} else {
			return mid
		}
	}

	if array[low] == target {
		return low
	} else if array[high] == target {
		return high
	} else {
		return -1
	}
}
```

### 斐波那契查找（Fibonacci Search）  

在是二分查找的一种提升算法，通过运用黄金比例的概念在数列中选择查找点进行查找，提高查找效率。注意同时属于一种有序查找算法  

```golang
// FibonacciSearch 斐波那查找
func FibonacciSearch(array []int, target int) int {
	if array == nil || len(array) == 0 {
		return -1
	}

	high := len(array) - 1
	max := array[high]

	fibMMm2 := 0              // (m-2)'th Fibonacci No.
	fibMMm1 := 1              // (m-1)'th Fibonacci No.
	fibM := fibMMm2 + fibMMm1 // m'th Fibonacci

	for fibM < max {
		fibMMm2 = fibMMm1
		fibMMm1 = fibM
		fibM = fibMMm2 + fibMMm1
	}

	var mid, offset = 0, -1
	for fibM > 1 {
		mid = algorithm.Min(offset+fibMMm2, high)

		if array[mid] < target {
			fibM = fibMMm1
			fibMMm1 = fibMMm2
			fibMMm2 = fibM - fibMMm1
			offset = mid
		} else if array[mid] > target {
			fibM = fibMMm2
			fibMMm1 = fibMMm1 - fibMMm2
			fibMMm2 = fibM - fibMMm1
		} else {
			return mid
		}
	}

	if offset < high && (array[offset+1] == target) {
		return offset + 1
	}

	return -1
}

// fibonacciRecursion 递归求斐波那数
// f(n) = f(n-1) + f(n-2), n >= 2
func fibonacciRecursion(n int) int {
	if n == 0 {
		return 0
	} else if n == 1 {
		return 1
	}
	return fibonacciRecursion(n-1) + fibonacciRecursion(n-2)
}

// fibonacci 求斐波那数
func fibonacci(n int) int {
	a := 0
	b := 1
	for i := 0; i < n; i++ {
		temp := a
		a = b
		b = temp + a
	}
	return a
}
```

### 指数查找（Exponential Search）

```golang
func ExponentialSearch(array []int, target int) int {
	if array == nil || len(array) == 0 {
		return -1
	}

	if array[0] == target {
		return 0
	}

	length := len(array)

	if array[length-1] == target {
		return length - 1
	}

	searchRange := 1
	for searchRange < length && array[searchRange] <= target {
		//searchRange = searchRange * 2
		searchRange = searchRange << 1
	}

	//startIndex := searchRange / 2
	startIndex := searchRange >> 1
	endIndex := algorithm.Min(searchRange, length)
	bi := BinarySearch(array[startIndex:endIndex], target)
	if bi == -1 {
		return -1
	} else {
		return bi + startIndex
	}
}
```

### 树表查找（Tree table lookup）

### 分块查找（Blocking Search）

```golang
func JumpSearch(array []int, target int) int {
	if array == nil || len(array) == 0 {
		return -1
	}

	length := len(array)
	step := int(math.Sqrt(float64(length)))

	prev := 0
	for array[algorithm.Min(step, length)-1] < target {
		prev = step
		step += int(math.Sqrt(float64(length)))
		if prev >= length {
			return -1
		}
	}

	for array[prev] < target {
		prev++
		if prev == algorithm.Min(step, length) {
			return -1
		}
	}

	if array[prev] == target {
		return prev
	}

	return -1
}
```

### 哈希查找（Hash Search）

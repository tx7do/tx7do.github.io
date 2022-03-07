# 排序算法实现 - Golang版

***

## 算法列表

- [X] [冒泡排序（Bubble Sort）](#冒泡排序)
- [X] [鸡尾酒排序（Cocktail Sort）](#鸡尾酒排序)
- [X] 选择排序（Selection Sort）
- [X] 插入排序（Insertion Sort）
- [X] 归并排序（Merge Sort）
- [X] 原地归并排序（In-place Merge Sort）
- [X] 堆排序（Heap Sort）
- [X] 快速排序（Quick Sort）
- [X] 希尔排序（Shell Sort）
- [X] 计数排序（Counting Sort）
- [X] 基数排序（Radix Sort）
- [X] 桶排序（Bucket Sort）
- [X] 二叉排序树排序（Binary Tree Sort）
- [X] 鸽巢排序（Pigeonhole Sort）
- [X] 侏儒排序（Gnome Sort）
- [ ] 块排序（Block Sort）

## 算法实现

### 冒泡排序（Bubble Sort）

```go
func BubbleSort(array Interface, begin, end int) {
	length := end - begin + 1
	if length < 2 {
		return
	}

	i, j := 0, 0
	for i = begin; i < end; i++ {
		for j = begin; j < end-i; j++ {
			if array.Less(j+1, j) {
				array.Swap(j, j+1)
			}
		}
	}
}
```

### 鸡尾酒排序（Cocktail Sort）

```go
// CocktailSort 鸡尾酒排序
// @see https://zh.wikipedia.org/zh-hans/%E9%B8%A1%E5%B0%BE%E9%85%92%E6%8E%92%E5%BA%8F
// @see https://zhuanlan.zhihu.com/p/125008445
func CocktailSort(array Interface, begin, end int) {
	length := end - begin + 1
	if length < 2 {
		return
	}

	low, high := begin, end
	i := 0
	swapped := true
	for swapped {
		swapped = false

		for i = low; i < high; i++ {
			if array.Less(i+1, i) {
				array.Swap(i, i+1)
				swapped = true
			}
		}

		if !swapped {
			break
		}

		swapped = false

		high--

		for i = high - 1; i >= low; i-- {
			if array.Less(i+1, i) {
				array.Swap(i, i+1)
				swapped = true
			}
		}

		low++
	}
}
```

### 选择排序（Selection Sort）

```go
// SelectionSort 选择排序
// @see https://en.wikipedia.org/wiki/Selection_sort
func SelectionSort(array Interface, begin, end int) {
	length := end - begin + 1
	if length < 2 {
		return
	}

	i, j, minIndex := 0, 0, 0
	for i = begin; i < end; i++ {
		minIndex = i
		for j = i + 1; j <= end; j++ {
			if array.Less(j, minIndex) {
				minIndex = j
			}
		}
		if minIndex != i {
			array.Swap(i, minIndex)
		}
	}
}
```

### 插入排序（Insertion Sort）

```go
// InsertionSort 插入排序
func InsertionSort(array Interface, begin, end int) {
	length := end - begin + 1
	if length < 2 {
		return
	}

	i, j := begin+1, 0
	for ; i <= end; i++ {
		for j = i; j > 0 && array.Less(j, j-1); j-- {
			array.Swap(j, j-1)
		}
	}
}

```

### 归并排序（Merge Sort）

```go
// MergeSort 归并排序
// @see https://en.wikipedia.org/wiki/Merge_sort
// @see https://www.enjoyalgorithms.com/blog/merge-sort-algorithm
// @see https://qvault.io/golang/merge-sort-golang/
func MergeSort(array Interface, begin, end int) {
	length := end - begin + 1
	if length < 2 {
		return
	}

	tmp := mergeSort(array.Part(begin, end+1))
	for i := 0; i < length; i++ {
		array.Set(i, tmp.Get(i))
	}
}

func mergeSort(array Interface) Interface {
	if array.Len() < 2 {
		return array
	}

	mid := divisionByTwo(array.Len())

	left := mergeSort(array.Part(0, mid))
	right := mergeSort(array.Part(mid, array.Len()))

	return spaceMerge(left, right)
}

// spaceMerge 归并
func spaceMerge(left, right Interface) Interface {
	lengthLeft := left.Len()
	lengthRight := right.Len()

	var result = make(InterfaceSlice, 0, lengthLeft+lengthRight)

	i, j := 0, 0
	for i < lengthLeft && j < lengthRight {
		if less(left.Get(i), right.Get(j)) {
			result = append(result, left.Get(i))
			i++
		} else {
			result = append(result, right.Get(j))
			j++
		}
	}

	for ; i < lengthLeft; i++ {
		result = append(result, left.Get(i))
	}
	for ; j < lengthRight; j++ {
		result = append(result, right.Get(j))
	}

	return result
}
```

### 原地归并排序（In-place Merge Sort）

```go
// InPlaceMergeSort 原地归并排序
// @see https://en.wikipedia.org/wiki/Merge_sort
// @see https://www.geeksforgeeks.org/in-place-merge-sort/
func InPlaceMergeSort(array Interface, begin, end int) {
	if begin < end {
		mid := int(math.Floor(float64(begin + (end-begin)>>1)))

		InPlaceMergeSort(array, begin, mid)
		InPlaceMergeSort(array, mid+1, end)

		inPlaceMerge(array, begin, mid, end)
	}
}

// inPlaceMerge 原地归并
func inPlaceMerge(array Interface, begin, mid, end int) {
	indexLeft, indexRight := begin, mid+1
	endLeft, endRight := mid, end

	if array.Less(endLeft, indexRight) {
		return
	}

	sortedIndex := 0
	for indexLeft <= endLeft && indexRight <= endRight {
		if array.Less(indexLeft, indexRight) {
			indexLeft++
		} else {
			tempValue := array.Get(indexRight)
			sortedIndex = indexRight

			for sortedIndex != indexLeft {
				array.Swap(sortedIndex, sortedIndex-1)
				sortedIndex--
			}
			array.Set(indexLeft, tempValue)

			indexLeft++
			endLeft++
			indexRight++
		}
	}
}
```

### 堆排序（Heap Sort）

```go
// HeapSort 堆排序
// @see https://brilliant.org/wiki/heap-sort/
func HeapSort(array Interface, begin, end int) {
	length := end - begin + 1
	if length < 2 {
		return
	}

	var maxHeap heap
	maxHeap.buildHeap(array, begin, end)
	maxHeap.popTop(array, begin, end)
}

type heap struct {
}

func (h *heap) siftDown(data Interface, lo, hi, first int) {
	root := lo
	for {
		child := 2*root + 1
		if child >= hi {
			break
		}
		if child+1 < hi && data.Less(first+child, first+child+1) {
			child++
		}
		if !data.Less(first+root, first+child) {
			return
		}
		data.Swap(first+root, first+child)
		root = child
	}
}

func (h *heap) buildHeap(array Interface, begin, end int) {
	low, high := begin, end
	mid := int(math.Floor(float64(end + 1>>1)))
	for i := mid; i >= begin; i-- {
		h.siftDown(array, i, high, low)
	}
}

func (h *heap) popTop(array Interface, begin, end int) {
	first := begin
	low, high := begin, end
	for i := high; i >= begin; i-- {
		array.Swap(first, first+i)
		h.siftDown(array, low, i, first)
	}
}
```

### 快速排序（Quick Sort）

```go
// QuickSort 快速排序
// @see https://en.wikipedia.org/wiki/Quicksort
// @see https://www.eecs.yorku.ca/course_archive/2010-11/W/2011/Notes/s4_quick_sort.pdf
func QuickSort(array Interface, begin, end int) {
	if begin < end {
		pi := quickSortPartition(array, begin, end)
		QuickSort(array, begin, pi-1)
		QuickSort(array, pi+1, end)
	}
}

func quickSortPartition(array Interface, begin, end int) int {
	pivot := array.Get(end)
	pi := begin - 1

	for i := begin; i < end; i++ {
		if less(array.Get(i), pivot) {
			pi++
			array.Swap(pi, i)
		}
	}
	array.Swap(pi+1, end)

	return pi + 1
}
```

### 希尔排序（Shell Sort）

```go
// ShellSort 希尔排序
// @see https://en.wikipedia.org/wiki/Shellsort
func ShellSort(array Interface, begin, end int) {
	length := end - begin + 1
	if length < 2 {
		return
	}

	i, j := 0, 0
	gap := divisionByTwo(begin + (end - begin))
	for ; gap > begin; gap = divisionByTwo(gap) {
		for i = gap; i <= end; i++ {
			for j = i - gap; j >= begin; j -= gap {
				if array.Less(j+gap, j) {
					array.Swap(j, j+gap)
				} else {
					break
				}
			}
		}
	}
}
```

### 计数排序（Counting Sort）

```go
// CountingSort 计数排序
func CountingSort(array IntSlice, begin, end int) {
	length := end - begin + 1
	if length < 2 {
		return
	}

	maxValue := array[begin]
	i := 0
	for i = begin + 1; i <= end; i++ {
		if array[i] > maxValue {
			maxValue = array[i]
		}
	}

	bucketLen := maxValue + 1
	bucket := make(IntSlice, bucketLen)

	for i = begin; i <= end; i++ {
		bucket[array[i]]++
	}

	sortedIndex := 0
	for i = 0; i < bucketLen; i++ {
		for bucket[i] > 0 {
			array[sortedIndex] = i
			sortedIndex++
			bucket[i]--
		}
	}
}

// CountingSortNegative 计数排序 - 可以处理负数的版本
func CountingSortNegative(array IntSlice, begin, end int) {
	length := end - begin + 1
	if length < 2 {
		return
	}

	minValue, maxValue := array[begin], array[begin]
	i := 0
	for i = begin + 1; i <= end; i++ {
		if array[i] < minValue {
			minValue = array[i]
		}
		if array[i] > maxValue {
			maxValue = array[i]
		}
	}

	bucketLen := maxValue + 1
	bucket := make(IntSlice, bucketLen)

	negativeBucketLen := 0
	if minValue < 0 {
		negativeBucketLen = int(math.Abs(float64(minValue))) + 1
	}
	negativeBucket := make(IntSlice, negativeBucketLen)

	for i = begin; i <= end; i++ {
		if array[i] >= 0 {
			bucket[array[i]]++
		} else {
			negativeBucket[int(math.Abs(float64(array[i])))]++
		}
	}

	sortedIndex := 0
	for i = negativeBucketLen - 1; i >= 0; i-- {
		for negativeBucket[i] > 0 {
			array[sortedIndex] = -i
			sortedIndex++
			negativeBucket[i]--
		}
	}

	for i = 0; i < bucketLen; i++ {
		for bucket[i] > 0 {
			array[sortedIndex] = i
			sortedIndex++
			bucket[i]--
		}
	}
}
```

### 基数排序（Radix Sort）

```go
type Buckets []IntSlice

// RadixSort 基数排序
// @see https://mp.weixin.qq.com/s/Z8gU9QLpMnA-zoMc9ZeR2w
// @see https://www.geeksforgeeks.org/radix-sort/
// @see https://en.wikipedia.org/wiki/Radix_sort
func RadixSort(array IntSlice, begin, end int) {
	length := end - begin + 1
	if length < 2 {
		return
	}

	maxNumber := getMaxNumber(array, begin, end)

	const NumberOfBuckets = 10

	n := 1
	bucket := make(Buckets, NumberOfBuckets)
	for n <= maxNumber {
		for _, v := range array {
			digit := getDigit(v, n)
			bucket[digit] = append(bucket[digit], v)
		}
		n *= 10

		k := begin
		for i, v := range bucket {
			for _, d := range v {
				array[k] = d
				k++
			}
			bucket[i] = bucket[i][:0]
		}
	}
}

func getMaxNumberOfDigits(array IntSlice, begin, end int) int {
	maxNumber := minInt
	temp := 0
	for i := begin; i <= end; i++ {
		temp = int(math.Log10(float64(array[i])) + 1)
		if temp > maxNumber {
			maxNumber = temp
		}
	}
	fmt.Println(maxNumber)
	return maxNumber
}

func getMaxNumber(array IntSlice, begin, end int) int {
	maxNumber := minInt
	for i := begin; i <= end; i++ {
		if array[i] > maxNumber {
			maxNumber = array[i]
		}
	}
	return maxNumber
}

func getDigit(integer, divisor int) int {
	return (integer / divisor) % 10
}
```

### 桶排序（Bucket Sort）

```go
const DefaultBucketSize = 5

// BucketSort 桶排序
// @see https://www3.nd.edu/~dchiang/teaching/ds/2015/handouts/bucketsort.pdf
// @see https://www.geeksforgeeks.org/bucket-sort-2/
// @see https://en.wikipedia.org/wiki/Bucket_sort
// @see https://codecrucks.com/bucket-sort/
func BucketSort(array Interface, begin, end int) {
	length := end - begin + 1
	if length < 2 {
		return
	}

	minValue, maxValue := array.Get(begin), array.Get(begin)
	i := 0
	for i = begin + 1; i <= end; i++ {
		if less(array.Get(i), minValue) {
			minValue = array.Get(i)
		}
		if less(maxValue, array.Get(i)) {
			maxValue = array.Get(i)
		}
	}

	bucketSize := DefaultBucketSize
	bucketCount := int(math.Floor(float64(minus(maxValue, minValue)/bucketSize))) + 1
	buckets := make([]InterfaceSlice, bucketCount)

	for i = begin; i <= end; i++ {
		bucketIndex := int(math.Floor(float64(minus(array.Get(i), minValue) / bucketSize)))
		buckets[bucketIndex] = append(buckets[bucketIndex], array.Get(i))
	}

	sortedIndex := 0
	for _, bucket := range buckets {
		InsertionSort(bucket, 0, bucket.Len()-1)
		for _, val := range bucket {
			array.Set(sortedIndex, val)
			sortedIndex++
		}
	}
}
```

### 二叉排序树排序（Binary Tree Sort）

```go
// BinaryTreeSort 二叉树排序
// @see https://en.wikipedia.org/wiki/Tree_sort
func BinaryTreeSort(array Interface, begin, end int) {
	length := end - begin + 1
	if length < 2 {
		return
	}

	tree := &binaryTree{}

	for i := begin; i <= end; i++ {
		tree.insert(array.Get(i))
	}

	tree.inOrder(array)
}

type binaryNode struct {
	data  interface{}
	left  *binaryNode
	right *binaryNode
}

type binaryTree struct {
	root *binaryNode
}

func (t *binaryTree) inOrder(array Interface) {
	if t.root != nil {
		i := 0
		t.root.inOrder(array, &i)
	}
}

// print the binary tree
func (t *binaryTree) print(w io.Writer) {
	t.root.print(w, 0, 'M')
}

// insert a binary tree Node into tree
func (t *binaryTree) insert(data interface{}) *binaryTree {
	if t.root == nil {
		t.root = &binaryNode{data: data, left: nil, right: nil}
	} else {
		t.root.insert(data)
	}
	return t
}

// insert a binary tree Node into Node
func (n *binaryNode) insert(data interface{}) {
	if n == nil {
		return
	} else if less(data, n.data) {
		if n.left == nil {
			n.left = &binaryNode{data: data, left: nil, right: nil}
		} else {
			n.left.insert(data)
		}
	} else {
		if n.right == nil {
			n.right = &binaryNode{data: data, left: nil, right: nil}
		} else {
			n.right.insert(data)
		}
	}
}

// inOrder traversal of the BST
func (n *binaryNode) inOrder(array Interface, i *int) {
	if n == nil {
		return
	}

	if n.left != nil {
		n.left.inOrder(array, i)
	}

	array.Set(*i, n.data)
	*i++

	if n.right != nil {
		n.right.inOrder(array, i)
	}
}

// print the BST
func (n *binaryNode) print(w io.Writer, ns int, ch rune) {
	if n == nil {
		return
	}

	for i := 0; i < ns; i++ {
		_, _ = fmt.Fprint(w, " ")
	}
	_, _ = fmt.Fprintf(w, "%c:%v\n", ch, n.data)

	if n.left != nil {
		n.left.print(w, ns+2, 'L')
	}
	if n.right != nil {
		n.right.print(w, ns+2, 'R')
	}
}
```

### 鸽巢排序（Pigeonhole Sort）

```go
// PigeonholeSort 鸽巢排序
// @see https://en.wikipedia.org/wiki/Pigeonhole_sort
// @see https://zh.wikipedia.org/wiki/%E9%B8%BD%E5%B7%A2%E6%8E%92%E5%BA%8F
func PigeonholeSort(array IntSlice, begin, end int) {
	length := end - begin + 1
	if length < 2 {
		return
	}

	i := 0

	minValue, maxValue := array[begin], array[begin]
	for i = begin + 1; i <= end; i++ {
		if array[i] < minValue {
			minValue = array[i]
		}
		if array[i] > maxValue {
			maxValue = array[i]
		}
	}

	holeRange := maxValue - minValue + 1
	holes := make([]IntSlice, holeRange)
	for i = begin; i <= end; i++ {
		holes[array[i]-minValue] = append(holes[array[i]-minValue], array[i])
	}

	sortedIndex := 0
	j := 0
	for i = 0; i < holeRange; i++ {
		for j = 0; j < holes[i].Len(); j++ {
			array[sortedIndex] = holes[i][j]
			sortedIndex++
		}
	}
}
```

### 侏儒排序（Gnome Sort）

```go
// GnomeSort 侏儒排序
// @see https://zh.wikipedia.org/wiki/%E4%BE%8F%E5%84%92%E6%8E%92%E5%BA%8F
func GnomeSort(array Interface, begin, end int) {
	length := end - begin + 1
	if length < 2 {
		return
	}

	for i := begin; i <= end; {
		if i == 0 {
			i++
		}
		if array.Less(i, i-1) {
			array.Swap(i, i-1)
			i--
		} else {
			i++
		}
	}
}
```

### 块排序（Block Sort）

```go
```

## 参考资料

- [排序算法](https://zh.wikipedia.org/wiki/%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95)  

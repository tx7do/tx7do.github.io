# Golang 并发模式：扇入、扇出

个人喜爱 Golang 的最突出原因之一是：我们可以轻松构建高可用且非阻塞的程序。

在本系列文章中，我将尝试回忆 Golang 中可用的模式。我将采用每种模式，并详细讨论它们适合的位置以及如何有效地使用它们。

> 什么是扇入扇出。这是一种将数据从多个流或从一个流汇聚到多个流或管道的单一数据流的方法。

## generate函数

为了讨论这个模式，我们首先需要一个数据源。这是一个可以用作数据源的数据生成器。

```go
func generate( data string) <-chan string{
    channel := make(chan string)
    
    go func() {
        for {
            channel <- data
            time.Sleep(time.Duration(100*time.Millisecond))
    
        }
    }()
    return channel
}
```

上面的函数显然返回一个只接收通道。

> 该函数的消费者只能从通道接收数据。

注意，在这个函数里边，`channel`的定义简化使用`make`定义并创建。但是通过在响应类型前面加`<-`，我们使它限定为一个只接收通道。

## 扇入

现在我们有了数据源，让我们来创建模式中的“扇子”。让我们看看这个函数：

```go
func fanIn() {
    c1 := generate("Hello")
    c2 := generate("There")

    fanin := make(chan string)
    go func() {
        for {
            select {
            case str1 := <-c1: fanin <- str1
            case str2 := <-c2: fanin <- str2
            }
    
        }
    }()
    
    go func() {
        for {
        fmt.Println(<-fanin)
        }
    }()

}
```

### 分析

1. 在第 2、3 行中，我们创建了 2 个数据生成器c1和c2。
2. 在第 5 行中，我们正在创建fanin通道，它将成为从c1和c2获取数据的汇聚通道。
3. 在第 9 行和第 10 行中，根据通道c1和c2的数据可用性，将选择适当的情况并将相同的数据推送到通道fanin。

### 有用的场景

想想我们必须合并所有事件的场景

## 扇出

对于扇出功能，我们需要一组接受器，我们的生成器函数将在其中继续发送要处理的消息或作业。

对于这种情况，让我们将生成器函数更改为有一些延迟。

```go
package main


import (
"fmt"
"time"
)

func generate(data string) <- chan string {
    channel := make(chan string)
    go func() {
        for {
            channel <- data
            time.Sleep(1000)
        }
    }()
    
    return channel
}

type Processor struct {
    jobChannel chan string
    done chan *Worker
    workers []*Worker
}
type Worker struct{
    name string
}

func (w * Worker) processJob(data string, done chan *Worker) {
    // Use the data and process the job
    go func() {
        fmt.Println("Working on data ", data, w.name)
        time.Sleep(3000)
        done <- w
    }()

}

func GetProcessor() *Processor {
    p := &Processor{
        jobChannel: make(chan string),
        workers: make([]*Worker, 5),
        done: make( chan *Worker),
    }
    for i := 0; i < 5; i++ {
        w := &Worker{name : fmt.Sprintf("<Worker - %d>", i)}
        p.workers[i] = w
    }
    p.startProcess()
    return p
}

func (p *Processor) startProcess() {
    go func() {
        for {
            select {
            default :
                if len(p.workers) > 0 {
                    w := p.workers[0]
                    p.workers = p.workers[1:]
                    w.processJob( <- p.jobChannel, p.done)
                }
            case w := <- p.done:
                p.workers = append(p.workers, w)
            }
        }
    }()
}



func (p *Processor) postJob(jobs <-chan string) {
    p.jobChannel <- <-jobs
}




func main() {
    source := generate("data string")
    process := GetProcessor()
    
    for i := 0; i < 12; i++ {
        process.postJob(source)
    }

}
```

让我们逐行讨论。

1. 在第 21 和 26 行中，我们声明了一个`Processor`和一个`Worker`结构。
   > 处理器有一个工人列表，将用作后台进程来处理来自生成器函数（数据源）的数据
2. 第 40 行定义了一个函数来创建`Processor`的实例并在第 50 行开始处理。
3. 我们在第 73 行使用`postJob`方法与处理器实例进行交互，这发生在第 85 行。我们正在向处理器实例发送11条消息进行处理。
4. 在第 74 行，我们从生成器获取消息并将其传送到处理器实例中的`jobChannel`通道。
5. 在`startProcess`方法中，我们有 2 个选择。在第 62 行，我们在`postJob`方法中获取生成器在第 74 行发送的消息，仅当有工作人员时（第 59 行）。
6. 我们在第 61 行选择 `worker` （它始终是处理器实例中 `worker` 切片的顶部 `worker`）。
    > 在实际场景中，我们应该构建一个基于优先级队列的工作池，以便工作均匀分布并且处理器不被阻塞。
    >
    > 此设置也不是背压感知的。如果没有作业，第 62 行会阻塞。在这些情况下，请确保添加背压处理。
7. 在第 62 行中，我们将数据提供给在第 61 行中选择的 `worker`，并发送处理器实例的完成通道。
8. `worker` 在第 32 行的单独 `goroutine` 中进行处理，并通过`done`通道通知处理器实例。
9. `worker` 的信号在第 64 行被捕获，并且 `worker` 被再次添加到 `worker` 列表中。

如果我们运行代码，我们将看到下面的结果：

![result](/assets/images/golang/fanin_fanout_result.webp)

到这里，我们就结束对扇入和扇出模式的学习。我将在接下来的帖子中发布另一个设计模式。

快乐学习和分享。

翻译自：[Golang Concurrency Patterns : Fan in, Fan out](https://medium.com/geekculture/golang-concurrency-patterns-fan-in-fan-out-1ee43c6830c4#id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4MzkyM2M4Y2ZlYzEwZjkyY2IwMTNkMDZlMWU3Y2RkNzg3NGFlYTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2Njk5NTQyMzcsImF1ZCI6IjIxNjI5NjAzNTgzNC1rMWs2cWUwNjBzMnRwMmEyamFtNGxqZGNtczAwc3R0Zy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNjczNDk5Mjk2NzgyMTg2OTMzOCIsImVtYWlsIjoieWFuZ2xpbmJvQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhenAiOiIyMTYyOTYwMzU4MzQtazFrNnFlMDYwczJ0cDJhMmphbTRsamRjbXMwMHN0dGcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJuYW1lIjoi5p2o57K85rOiIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTNrQTRyYnRaQms3UkJkLXZyZkkzaWI1SVRHUEJjNXdHUk1DRlRLPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IueyvOazoiIsImZhbWlseV9uYW1lIjoi5p2oIiwiaWF0IjoxNjY5OTU0NTM3LCJleHAiOjE2Njk5NTgxMzcsImp0aSI6IjZiY2E4ZmE1ZjRlNzI3YTgwZGE1NzczYzAzZTRlZTdlNjAwOGM5OTAifQ.cCsmcRt4A76E7Jg9IvJ0wLuiSjsL_ZDRS2W3nSP-mE9vUeFvXiG3Lp_5JnKMuOQyHkhmPOVsJ6oc3WVyv0LBuiB1wQIjS4iZ0xeO5aH_7nGHJJ9BN4_rbVCUliAfrBjxbkTQAilx_o_WgktAEcaKLeCQfhafbP59NIpm7Io-GRvSnlP4Wh2D7trNoXfjXQXVicoiXtUUhfcAXgAfGLEt-fa0Vaf1Plc51SKr-tsaUA8PH0lYS2iIs1aFVHFT1l61V4TWiTL77An7dLlvpqevjAs-RcgEMHtDJxlc_muW9njWAvJ4znlGQ3tdxozgafcL2t38553WyAERPrMZRmlhQA)

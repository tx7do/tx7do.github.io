# ASIO的post和dispatch方法

关于这两个方法，我去网上找了一大堆资料，都没有讲清楚是怎么一回事。还是读了ASIO的源代码这才理解。

要提到这两个方法，不得不提一下Windows的两个API：`SendMessage`和`PostMessage`。

`io_context::post`跟`PostMessage`的行为差不多，投递完消息立即返回，Handler的执行跟它没有半毛钱的关系。

`io_context::dispatch`可以认为是`SendMessage`的超集，`SendMessage`是阻塞的，必须要在消息处理完成之后才返回，当`io_context::dispatch`在`io_context`的工作线程中被调用的时候，`io_context::dispatch`的行为和`SendMessage`是一致的，必须要在Handler调用完成之后才返回。但是，如果不是io_context的工作线程中调用，则执行了`io_context::post`一样的行为：将Handler投递到`io_context`的事件队列中去。

我下面用伪代码来描述其功能：

```c++
void post(Handler handler)
{
    _queue.push(handler);
}

void dispatch(Handler handler)
{
    if (can_execute())
        handler();
    else
        post(handler);
}

void run()
{
    _work_thrd_id = std::this_thread::get_id();
    while (!_queue.empty())
    {
        auto handler = _queue.front();
        _queue.pop();
        handler();
    }
}

bool can_execute()
{
    return _work_thrd_id == std::this_thread::get_id();
}
```

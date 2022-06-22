# ASIO的定时器

ASIO现在提供的定时器有以下几种：

```c++
boost::asio::deadline_timer
boost::asio::steady_timer
boost::asio::high_resolution_timer
boost::asio::system_timer
```

`high_resolution_timer`就是`system_timer`，也是精度最高的定时器，精度为：纳秒。

`steady_timer`、`system_timer`都是模板`basic_waitable_timer<>`的特例化：

```c++
typedef basic_waitable_timer<chrono::system_clock> system_timer;
typedef basic_waitable_timer<chrono::steady_clock> steady_timer;
```

`deadline_timer`是`basic_deadline_timer<>`的特例化，它使用的计量时间是系统时间，修改系统时间会对它造成影响：

```c++
typedef basic_deadline_timer<boost::posix_time::ptime> deadline_timer;
```

下面是一个完整的定时器应用示例：

```c++
#include <boost/asio.hpp>
#include <iostream>

namespace asio = boost::asio;
using error_code = boost::system::error_code;

auto now()
{
    return std::chrono::high_resolution_clock::now();
}

void async_wait(asio::high_resolution_timer& timer, std::chrono::high_resolution_clock::time_point& lastTime)
{
    timer.expires_after(std::chrono::seconds(1));

    timer.async_wait([&](error_code ec)
    {
        if (ec == asio::error::operation_aborted)
        {
            return;
        }
        auto elapsed = std::chrono::duration_cast<std::chrono::seconds>(now() - lastTime).count();
        lastTime = now();
        std::cout << elapsed << "\n";
        async_wait(timer, lastTime);
    });
}

int main()
{
    asio::io_context ctx;

    asio::high_resolution_timer timer(ctx);
    auto lastTime = now();

    async_wait(timer, lastTime);

    ctx.run();
}
```

定时器的到期时间可以用持续时间：

```c++
timer.expires_after(std::chrono::seconds(1));
```

也可以用绝对时间去定时：

```c++
timer.expires_at(std::chrono::high_resolution_clock::now() + std::chrono::seconds(1));
```

如果要获取到期的绝对时间值，可以调用`expiry()`成员方法：

```c++
std::chrono::high_resolution_clock::time_point time_point = timer.expiry();
```

如果要取消当前定时器，可以调用cancel成员方法，它将触发一个错误码为`boost::asio::error::operation_aborted`的回调：

```c++
timer.async_wait([&] (error_code error)
{
    if(error == boost::asio::error::operation_aborted)
    {
        std::cout << "The timer is cancelled\n";
    }
});


timer.cancel();
```

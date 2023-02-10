# 你一定用过htop，但你有看懂每个选项吗？

![main.webp](/assets/images/htop/main.webp)

身为一个工程师，不管你写的是前端、后端、全端还是什么端，一定多少用过htop，就算真的没用过也会听同事说过。htop 是一个process manager，他可以让你看到执行中的process、系统资源的使用量，也可以让你轻松kill 掉任何一个process，总之，你想得到的功能统统都有～

虽然，大家都说htop 很好用，但许多人打开htop 也只看得懂CPU、Mem、PID、Command 这些简单的选项，对于Load average、NI、State、SHR 就没那么熟悉。

不过，htop 都帮你列出来了，看不懂好像又有点可惜对吧！所以这篇文章要跟大家巨细弥遗的介绍htop 每个栏位的意义，也许哪天有需要时就能派上用场呢！

## CPU

首先来说说最重要的CPU，在htop 最上方会列出各CPU 的使用率，值得注意的是这边显示的是CPU 的逻辑核心数，譬如说你的电脑有四核心八线程，意思是同时可以执行八个thread，那这边就会显示八个CPU 哦～

![cpu.webp](/assets/images/htop/cpu.webp)

另外不知道有没有人发现这个使用率的bar 包含了**红色**跟**绿色**，有时甚至还会有**蓝色**，那其实是有意义的哦：

- **红色** 代表的是 `kernel thread` 占用的CPU，像是系统需要自动做process scheduling、memory management 等等，是整个系统中最重要、优先权也最高的任务。
- **绿色** 代表的是 `normal priority thread`，线程的优先权比kernel thread 低一些，一般来说使用者执行的程序如果没有特别调优先权的话，都会归在这一类。
- **蓝色** 的话就是 `low priority thread`，因为优先权比较低，分配到的CPU 自然也比较少，适合「我ok，你先跑」那类比较无关紧要的process，如果CPU 已经被操到快不行了，或是memory 真的不够用了，第一个杀掉的也是这类process。

## Memory & Swap

![memory_swap.webp](/assets/images/htop/memory_swap.webp)

紧接在CPU 下面的是memory 跟swap 的使用量，memory 这边应该大家都看得懂，值得一提的是他的颜色也是有意义的：

- **绿色** 指的是被process 占用的内存，譬如说你开的浏览器、VSCode、终端机等等程序，还有正在执行的htop 都算是这一类。
- **蓝色** 则是`buffer pages`，他是用来储存一些metadata。譬如说当你第一次执行 `ls -l` 时系统会去硬盘探查**这个资料夹有哪些文档、每个文档的权限**等等，然后帮你存在buffer pages，当你短时间内再执行 `ls -l` 时就不用再进入硬盘（因为硬盘很慢），直接从buffer 拿即可。
- **橘色** 的`cache pages`跟buffer 很像，只不过**buffer 存的是metadata，而cache 存的是文档内容**。像你第一次下 `cat index.js` 时就会把内容读取到cache pages，如果你cat 之后发现程序码太长，决定先看前十行就好了，那再下 `head -n 10 index.js` 就会从cache pages 直接读取。

这也代表说**内存使用量并非越低越好**，毕竟闲在那边也没啥用，不如让系统把闲置的部分拿去当buffer 跟cache，读取时能不碰硬盘就不碰硬盘，才可以让程序执行得更快。

> 所以千万不要相信什么「内存清理大师」可以帮你提升效能，说真的没变慢就不错了XD，随便把buffer 跟cache 都清掉了只会加重系统负担。内存管理就交给系统来，十之八九都可以管理得还不错。

![memory_swap.webp](/assets/images/htop/memory_swap.webp)

而swap 的部分虽然上图完全没用到，但还是解释一下：**swap 的机制跟刚刚提到的cache & buffer 正好相反**，万一你实在开了太多程序，而且每个程序都跟 chrome 一样狂吃猛吃，**导致memory 快要不够了**。

**那系统就会把内存里面一些东西swap 到硬盘上**，等真的需要那些东西时再从硬盘拿回来。虽然这样做看似有更多内存可以用，但代价就是程序速度会慢上许多，因为硬盘实在是太慢了。

顺带一提swap 的发音是：美式「司哇噗」，英式「司哇噗」，不要再念成「司位噗」了～

## Load Average

接着来看看屏幕右上方那堆神奇的数字

首先 **Tasks** 栏位的 `488, 1994 thr; 3 running` 代表的是目前总共有488 的process、1994 个thread，其中3 个thread 正在执行（这数字最大就是你的逻辑核心数）。

![load_average.webp](/assets/images/htop/load_average.webp)

而 **Load Average(LA)** 是用来判断断目前系统有多繁忙，三个数字代表的是系统在 **最近1分钟、5分钟、15 分钟内，平均有多少个thread 需要CPU**。

以上图来说，**近一分钟内平均有5.9 个thread 需要使用CPU 进行运算**，但无奈我只有 4 个逻辑核心，所以 CPU 是忙到翻过来（因为我正在编译Rust 执行文件 XD），而最近十五分钟的LA 是3.49，其实也算是高了。

一般来说电脑完全没在用时LA 会低于1，而平常在上网、听音乐、写文档则是会介于 1 到 2 之间。

所以如果觉得自己写的程序跑很慢，不妨先看看LA 确认瓶颈是不是在CPU，如果LA 很低但程序却慢得夸张，那很可能**程序并没有善用多核心，或是瓶颈卡在硬盘跟网络IO**；如果LA 已经很高了但还是觉得太慢，那就只能改善算法、或是换更快的 CPU 了。

## PID/USER

上面讲完之后来看看下面这一大块，这部分**每一行都是一个process**，而PID 就是每个process 的ID

![pid.webp](/assets/images/htop/pid.webp)

那知道PID 之后可以干嘛呢？其实他的用途挺多的，譬如说你可以用 `kill -KILL <pid>` 来杀掉某个process；或是使用 `kill -STOP` 来暂停process 再用 `kill -CONT` 让他继续执行（这超好用👍，但好像很多人都不知道）

而 USER 栏位没什么好解释的XD，就是**把这个process 跑起来的人**。不管程序是谁写的，只要是我把他跑起来，USER 那栏就会显示我的名字。

## PRI & NI

接下来的Priority 跟Nice 两个都是跟优先权有关的指标，**注意数字越小表示优先权越高，也就可以分配到越多CPU 时间**。

![pri_ni.webp](/assets/images/htop/pri_ni.webp)

其中PRI 是由系统帮你决定的，无法自行修改，像上图mdbulkimport 的PRI 值是17，而 `ping 8.8.8.8` 则是24，代表系统认为mdbulkimport 比ping 来得重要

> 注：mdbulkimport 是mac spotlight 功能的一部分

而 nice 值的部分预设是0，可以用 `renice -n 19 -p <pid>` 调整到最低优先权19，想要调高的话最高也可以调到-20

虽然 nice 值可以随自己高兴调高调低，但**系统不见得都会听你的**。有的系统比较友善会愿意参考你设的 nice 值，但也有一些只看PRI 系统根本不在乎nice，你设你的我排我的XD，所以不要太期待提高优先权可以为效能带来多大的变化，想要提升效能还是乖乖把程序写好比较重要～

## VIRT/RES/SHR

这三个数字都是跟内存有关的，分别代表`Virtual memory`、`Resident` 跟 `Shared memory`

![virt_res_shr.webp](/assets/images/htop/virt_res_shr.webp)

Virtual memory 的概念比较复杂一点，基本上你可以把他想成 **process 可以存取到的memory 总和**。譬如说 `head -n index.js` 内部运作的方式是先把 index.js 打开，然后读取前十行

虽然他只读取前十行，**但 head process 已经把文档打开了，他其实有权限 access 到整个文档的内容（只是它没有这么做），所以virtual memory 会把整个文档的大小算进去。**

而 Resident 正好相反，他指的是**物理上你到底占用了多少内存**。以同样的例子来说，若你只读取前十行，**那系统就只把前十行从硬盘读进内存，RES 也就只算那十行。**

因此在 **htop 里面 RES 一定会小于VIRT（如下图），而且通常是远小于**，因为 VIRT 会把一堆哩哩叩叩的东西都算进去，所以就算看到 VIRT 很肥也完全不用担心。

![virt_res_shr.webp](/assets/images/htop/virt_res_shr.webp)

而 Shared memory 的话**顾名思义就是可以跟别人分享的memory**，像程序执行时很常会用的glibc，或是在读取 read-only 文档时，**这些东西都只需要读进内存一次就可以了，所以就会被算进 SHR 里面。**

虽说能跟其他 process 共用内存是好事，但这种事也强求不来，所以一般我都只看RES，很少在管 SHR 是多少。

## State

![state.webp](/assets/images/htop/state.webp)

接着来看这小小一个`S`，代表的是process 的 `state`，比较常见的有以下几个

- **R: 意思是process 正在跑或是在running queue 里等待CPU 排程**

    如果你的程序长时间处于R 状态但还是跑很慢，代表可能是算法太慢了，或是CPU 实在太忙一直把你丢在queue 里面，可以再透过CPU% 来确认是哪个问题

- **S: 目前正在睡觉，有事做才会醒来**

    通常定时执行的、要使用者互动的程序如ping 跟VSCode 很常会处于S 状态（上图），**毕竟 ping 一秒只送一个封包，但现今的CPU 一秒可以跑十亿个cycle**，所以CPU 当然是送出封包后就马上把你踢到旁边去睡觉，等一秒后你睡醒了再回来

    VSCode 的话是因为**你总不可能一秒打十亿个字吧**，所以没事做的时候他会马上被CPU 踢出去，等你打字了他再被叫回来动一下，然后马上又被踢出去（怎么感觉有点惨XD）

- **D: 这个也是在睡觉，只不过等待的一定是IO，譬如说读取文档、写入资料库等等**

    如果你的process 长时间处于 D 状态，代表 IO 所占的时间比较多，三不五时就被 CPU 踢出去睡觉。因此想改善效能也要从 IO 着手，譬如用 redis 做缓存 或是 换SSD 等等，若只是单纯更换程序语言或是升级CPU 可能没什么效果

## CPU% / MEM%

![cpu_mem.webp](/assets/images/htop/cpu_mem.webp)

`CPU%` 意思是你在**这段时间平均用了几颗CPU**，因为 htop 预设 3 秒更新一次，假如前 1.5 秒你用了一颗，后 1.5 都没用，**那平均就是50%**；如果你这三秒用好用满四个核心，那就是漂亮的400%（上图Rust 编译器的其中一个process 就有用到331%）

因为 CPU% 是很短期的数据，所以当你突然觉得电脑当当的快不行时，**直接看 CPU% 就可以知道是谁在作怪**，然后看是要用 signal 把他暂停还是干脆直接杀掉

`MEM%` 也很类似，就是使用内存的比例，要注意的是 **他是用 RES 来做计算**，所以如果电脑配有4GB 的内存、某个process 的RES 是1GB，那他就是用掉实体内存的25%

## Time+

最后要来说说Time+，这个时间很有意思，**他代表的并不是程序从启动到现在总共经过了多久，而是这个程序总共占用了多少CPU Time**

![time_plus.webp](/assets/images/htop/time_plus.webp)

譬如说上图我在编译Rust 时，虽然我才刚跑十秒而已，但CPU Time 已经有 28 秒，**代表说这个process 在十秒内平均使用了 2.8 颗CPU，也就是平均的 CPU% 是 280% 左右**

相反的如果像 `ping 8.8.8.8` 这种几乎不需要CPU 运算的process（就只是把封包送出去而已），那即便跑了十多分钟，占用的 CPU Time 也不过 12 秒而已，平均起来的 CPU% 大概是 2% 左右

![time_plus_1.webp](/assets/images/htop/time_plus_1.webp)

因此如果想知道**长期**而言哪个程序最占 CPU 的话，就看 Time+ 的数值；如果是想看**短期**、目前正在**峰值**的程序，那就是看先前提到的CPU%

## 总结

今天介绍了怎么用htop 看系统的负载状态、各种内存使用量、以及长短期的CPU 使用率，看到这我想大家都累了，一下子资讯量太大说不定也忘得差不多了XD

但也没关系，看完脑袋中有个概念就好了，先把文章收藏起来，哪天发现又看不太懂 htop 时，再回来当技术文档翻一下也可以哦～

## 延伸阅读

- [Linux 的内存快取功能：系统把内存用光了？](https://blog.gtwang.org/linux/linux-cache-memory-linux/)
- [Operating System — Virtual Memory](https://www.tutorialspoint.com/operating_system/os_virtual_memory.htm)
- [htop explained](https://peteris.rocks/blog/htop)

翻译自：<https://medium.com/starbugs/do-you-understand-htop-ffb72b3d5629>

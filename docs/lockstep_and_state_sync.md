# 帧同步和状态同步

## 帧同步/锁步同步 (Lockstep Synchronization)

什么是帧同步：帧同步常被RTS(即时战略)游戏常采用。在游戏中同步的是玩家的操作指令，操作指令包含当前的帧索引。一般的流程是客户端上传操作到服务器，
服务器收到后并不计算游戏行为， 而是转发到所有客户端。这里最重要的概念就是 相同的输入 + 相同的时机 = 相同的输出。

实现帧同步的流程一般是：

1. 同步随机数种子。(一般游戏中都设计随机数的使用， 通过同步随机数种子，可以保持随机数一致性)
2. 客户端上传操作指令。(指令包括游戏操作和当前帧索引)
3. 服务器广播所有客户端的操作。(如果没有操作， 也要广播空指令来驱动游戏帧前进)。

因为帧同步的特性， 我们可以很方便的做出战斗回放：服务器记录所有操作， 客户端请求到操作文件再执行一次即可。

帧同步的特性导致客户端的逻辑实现和表现实现必须完全分离。Unity中的一些方法接口(如 Invoke， Update、动画系统等)
是不可靠的，所有要自己实现一套物理引擎、数学库，做到逻辑和表现分离。 这样即使Unity的渲染是不同步的，但是逻辑跑出来是同步的。

## 状态同步 (State Synchronization)

什么是状态同步：同步的是游戏中的各种状态。一般的流程是客户端上传操作到服务器，服务器收到后计算游戏行为的结果，然后以广播的方式下发游戏中各种状态，客户端收到状态后再根据状态显示内容。状态同步最广泛的应用应该是在回合制游戏中。

状态同步其实是一种不严谨的同步。它的思想中，不同玩家屏幕上的表现的一致性并不是重要指标，
只要每次操作的结果相同即可。所以状态同步对网络延迟的要求并不高。像玩RPG游戏，200-300ms的延迟也可以接受。
但是在RTS游戏中，50ms的延迟也会很受伤。
举个移动的例子，在状态同步中， 客户端甲上操作要求从A点移动到B点，但在客户端乙上， 甲对象从A移动到C，然后从C点移动到了B。这是因为，
客户端乙收到A的移动状态时， 已经经过了一个延迟。这个过程中，需要客户端乙本地做一些平滑的处理，最终达到移动到B点的结果。

所以国产RPG游戏中，动画的特效一般做的比较绚丽(大)，
攻击的时候给人感觉是击中了。放技能之前一般也有一个动画前摇，同时将攻击请求提交给服务器。等服务器结果返回时，动画也播放完毕了，之后就是统一的伤害效果和结算。

## 乐观帧锁定 (Bucket Synchronization)

## 状态同步和帧同步的比较

|         | 状态同步                    | 帧同步                                                                       |
|---------|-------------------------|---------------------------------------------------------------------------|
| 流量      | 相对高                     | 相对低                                                                       |
| 回放      | 记录文件大                   | 记录文件小                                                                     |
| 安全性     | 服务器实现逻辑，安全性高            | 逻辑在客户端，反外挂压力大、无法避免开图挂                                                     |
| 服务器压力   | 大                       | 小                                                                         |
| 战斗校验    | 协议加密，内存混肴，误差校验， 无法彻底解决。 | 服务器可以重启跑一遍战斗。                                                             |
| 网络卡顿的表现 | 瞬移，回位，莫名掉血	             | 战斗卡顿                                                                      |
| 实现      | 调优状态同步方式，客户端需要做插值处理。	   | 客户端按照单机方式开发，保证逻辑层和表现层分离。逻辑层不要用到浮点数，不要用不确定顺序的逻辑结构。对于物理引擎和浮点数计算要不能使用Unity的。 |

## 参考资料

- [lockstep 网络游戏同步方案](https://blog.codingnow.com/2018/08/lockstep.html)
- [帧同步游戏开发基础指南](https://mp.weixin.qq.com/s/ambS-XTKV_RllXG3F5FjcA)
- [关于 “帧同步”说法的历史由来](https://zhuanlan.zhihu.com/p/165293116)
- [《Unity3D高级编程之进阶主程》第六章，网络层(六) - 网络同步解决方案](http://www.luzexi.com/2019/07/14/Unity3D%E9%AB%98%E7%BA%A7%E7%BC%96%E7%A8%8B%E4%B9%8B%E8%BF%9B%E9%98%B6%E4%B8%BB%E7%A8%8B-%E7%BD%91%E7%BB%9C%E5%B1%826)
- [Lockstep protocol](https://en.wikipedia.org/wiki/Lockstep_protocol)
- [细谈网络同步在游戏历史中的发展变化（上）](https://zhuanlan.zhihu.com/p/130702310)
- [细谈网络同步在游戏历史中的发展变化（下）](https://zhuanlan.zhihu.com/p/336869551)
- [《Brick & Ball》开发总结（一）——帧锁定同步](https://musoucrow.github.io/2018/03/09/bnb_1/)
- [[Unity Mirror] State Synchronization（状态同步）](https://blog.csdn.net/u013716859/article/details/123317761)

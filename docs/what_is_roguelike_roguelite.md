# Roguelike与Roguelite究竟是什么？

如果有留意独立游戏，应该不时会看到「`Roguelike`」或「`Roguelite`」等字眼，我们介绍过的独立游戏中亦不乏此类作品。下文会为大家科普「Roguelike」的种种，以后看到游戏介绍中有这些字眼时，便知道是否自己想玩的类型了。

## 《Rogue》的诞生

原来「Roguelike」并不是一个生字，而是由「Rogue」及「like」两字组成，指的是「像Rogue的游戏」。《Rogue》，全名《Rogue: Exploring the Dungeons of Doom》，是由Michael Toy 和Glenn Wichman开发的地下城冒险游戏，当时两人都是加州大学克鲁兹分校的学生。

![Rogue](/assets/images/rogue/rogue_game.jpg)
>《Rogue》本质上是一个TRPG副本：一个玩家，一个地下城，一个目的；只不过Dungeon Master由电脑代劳。有关TRPG和RPG的种种，有机会另文再述。

7、80年代是《龙与地下城》及奇幻文化风气最盛行的年代，不论是桌上还是电子游戏都深受其影响，《Rogue》亦不例外。玩家扮演一位冒险者（adventurer），前往一个深不见底的地下城（或称迷宫），目的是达到最底层，找回宝物「贤多的护符」（Amulet of Yendor）并返回地面。

![Amulet of Yendor](/assets/images/rogue/rogue_amulet_of_yendor.jpg)
>Amulet of Yendor作为Roguelike游戏始祖的终极目的，成为后来许多同类游戏的致敬对像，在NetHack、Brogue等知名Roguelike游戏都有Amulet of Yendor登场。

Amulet of Yendor作为Roguelike游戏始祖的终极目的，成为后来许多同类游戏的致敬对象，在NetHack、Brogue等知名Roguelike游戏都有Amulet of Yendor登场。

《Rogue》最特别的地方是其「永久死亡」机制：玩家一旦在游戏中死亡，便会永远失去这个角色，既不能读取存档再开游戏，亦无法继承角色生前的装备、道具、经验等，玩家只能另开一个新角色（存档）从头开始挑战。换言之玩家若想「破台」，便必须做到一命通关。

《Rogue》的另一大特色是「随机生成地图」；地下城的大小、层数、怪物多寡、装备道具宝物等，全部由系统以程序方式随机产生（procedural generation），因此玩家虽然可能会在游戏中不停死亡重新开始，然而每次游戏都有新的迷宫构成、新的体验，使游戏的耐玩性和重玩性大大提高，风靡许多RPG及地城探索游戏爱好者。

由于《Rogue》的成功，后来不少作品均仿效了《Rogue》的机制，如《Moria》及《Hack》等，于是便自然而然地有了「Roguelike」这个字眼，用来统称这类游戏。

![Rogue Derived Graph](/assets/images/rogue/rogue_derived_graph.jpg)
> Roguelike游戏派系衍生图。Rogue并非最早的Roguelike游戏，但受Rouge启发的作品最多。《Moria》和《Hack》算是两大主要派系，当然此外还有其他流派。

![Moria Game](/assets/images/rogue/moria_game.jpg)
> 《Moria》及《Hack》等古典Roguelike游戏一大特色是地图及物件全以英文、数字、符号等ACSII字型排出，玩家需要发挥想像力和逻辑来理解地下城的状况。

![黑暗破坏神](/assets/images/rogue/diablo_game.jpg)
> 从Rogue出现以后，很多游戏都受到Rogue的影响，像是大家很熟悉的《黑暗破坏神》（Diablo）系列，便应用了Rogue里随机生成、RPG、资源管理的概念。可以说专家模式的Diablo便是一只即时版的Rogue。

![特鲁内克大冒险不可思议的迷宫](/assets/images/rogue/tor_game.jpg)
> 有趣的是Roguelike文化在日本颇有市场，《特鲁内克大冒险不可思议的迷宫》系列就是一个很本格的Roguelike游戏，系列还出过Pokemon版。

![特鲁内克大冒险不可思议的迷宫](/assets/images/rogue/tor_game1.jpg)
> 不可思议的迷宫制作人中村光一曾表示游戏是直接比对《Rogue》来开发，只是难度稍为调低，永久死亡亦非强制而是选项，成为较易玩的「亲民Rogue」，让不熟悉Rogue的玩家较易上手。

## Roguelike的定义- 柏林阐释

自从《Rogue》诞生之后，世界各地对Roguelike游戏的开发未曾间断，最后促成了2008年在柏林举行的第一届International Roguelike Development Conference（国际Roguelike游戏开发会议）。会上除了分享Roguelike游戏的开发心得外，亦讨论了「Roguelike」游戏的定义，是谓「柏林准则」（The Berlin Interpretation）。

「Rogue」所代表不单是一个游戏，更是「一篮子Rogue的象征性元素」，因此比起一刀切地定义什么叫做Roguelike游戏，比较合适的方向是找出「代表Rogue的元素」，然后你便可以从一只游戏里所含的Rogue元素多寡，来厘定这只游戏有多「Roguelike」。柏林阐释定义了15个Rogue元素，一般而言，要称得上是「本格Roguelike」，需要具备以下特征：

- **永久死亡**：玩家一旦失败（随游戏定义不同，通常为角色死亡），便会永远失去这个进度。同样玩家无法以存档读档的方式影响随机决定的结果。

- **回合制**：玩家每作出一个行动，游戏内所有相应单位都会随之作出行动，玩家无法以反应或操作速度获得优势。

- **方格版图**：游戏版图以方格（正方形或六边形等）组成。

- **程序生成的随机内容**：大部份游戏内容为游戏开始后随机生成，以保持重覆游玩时的游戏性，鼓励玩家失败后重新尝试。

- **资源管理**：玩家可获得和可携带的资源（装备、道具等）均有限制，玩家需作出取舍。

## Roguelike-like 和 Roguelite

以今时今日的角度来看，本格Roguelike无疑是非常硬派，试想一下一个失误便可能令花上数小时甚至数十小时建立的进度化为乌有，加上Roguelike游戏大多内容深奥，玩家往往需要多次挑战才能成功过关，对不是「此道中人」而言确实不太友好。

![《Diablo》的hardcore模式](/assets/images/rogue/diablo_game1.jpg)
> 想像一下自己在玩《Diablo》的hardcore模式，几十个小时后不慎阵亡，你的英勇长存人心…这种打击不是每个人都承受得起。

另一方面，太过着眼于模仿Rogue未必能带来创意，反而将Rogue的一些元素抽出来，和其他种类的游戏或机制结合，往往能刷出新的火花。带有Rogue元素却又不是本格Roguelike的游戏便是Roguelike-like，最近多以带「谐音双关」意味的「Roguelite」称呼，两者意思相同。Roguelite游戏可以追溯到2002年的《Strange Adventures in Infinite Space》，不过一般认为2008年的《Spelunky》才是带起近年Roguelite文化的功臣。

![《Spelunky》](/assets/images/rogue/spelunky_game.jpg)
> 《Spelunky》是2D平台动作游戏，玩家的目的是在一层层地底洞窟中收集财宝、避开陷阱打倒怪物、找到出口前往下一关。其Roguelike在于关卡全部即时随机生成，而且角色一旦死亡便会彻底Gameover，玩家需要从头开始冒险。

《Spelunky》是2D平台动作游戏，玩家的目的是在一层层地底洞窟中收集财宝、避开陷阱打倒怪物、找到出口前往下一关。其Roguelike在于关卡全部即时随机生成，而且角色一旦死亡便会彻底Game Over，玩家需要从头开始冒险。

Roguelite游戏的乐趣在于，他以随机生成的方式保持每轮游戏的新鲜感，同时死亡的压力令玩家须认真思考及操作；而玩家一旦失败，虽然会损失大量进度，但也不会像传统Roguelike那样变得一无所有，感觉没那么沮丧较有动力重新挑战。

经过多年发展，Roguelite游戏的构思和制作都日趋成熟，亦不乏别出心裁的优秀作品，例如将Rogue和策略经营结合的《FTL：Faster Than Light》、将Rogue和横向动作游戏结合的《Dead Cells》等都是出色的Roguelite游戏。虽然未必比得上本格Roguelike，但Roguelite游戏一般以高难度见称，喜欢挑战的朋友今后不妨多留意此类游戏。

![《FTL：Faster Than Light》](/assets/images/rogue/ftl_faster_than_light.jpg)

![《Dead Cells》](/assets/images/rogue/dead_cells.jpg)

## 转载自

[【遊戲用語解密】Roguelike與Roguelite究竟是什麼？](https://game.udn.com/game/story/122090/4414490)

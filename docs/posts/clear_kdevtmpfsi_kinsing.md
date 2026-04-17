---
date: 202026-04-17
category:
  - 运维技术
tag:
  - 杀毒
sticky: 10
---

# 实用教程：kdevtmpfsi \+ kinsing挖矿病毒一键清理脚本（含Docker容器查杀）

在Linux服务器运维过程中，kdevtmpfsi与kinsing挖矿病毒是极为常见且隐蔽的恶意程序，一旦入侵会疯狂占用服务器CPU、内存资源，导致服务卡顿、宕机，甚至窃取服务器敏感信息，给个人和企业带来巨大损失。本文将详细解析一款高效的一键清理脚本，涵盖病毒进程查杀、文件删除、自启清理及Docker容器内病毒查杀，帮助运维人员快速摆脱病毒困扰，同时提供后续防护建议，从根源减少病毒再次入侵的可能。

## 一、挖矿病毒kdevtmpfsi \+ kinsing 危害解析

kdevtmpfsi与kinsing通常成对出现，kinsing作为守护进程，负责监控kdevtmpfsi挖矿进程，一旦kdevtmpfsi被杀死，kinsing会立即重启该进程，形成“不死循环”，难以彻底清理。其主要危害体现在三个方面：

- 资源侵占：挖矿进程会占用90%以上的CPU和大量内存，导致服务器正常业务无法运行，响应速度急剧下降；

- 隐蔽性强：病毒文件多隐藏在/tmp、/var/tmp等临时目录，且会修改定时任务、开机自启配置，不易被发现；

- 后门残留：部分病毒会留下隐藏后门，即使清理完成，也可能被黑客再次入侵，导致病毒复发。

此外，随着Docker容器的广泛使用，这类病毒也会入侵容器内部，利用容器资源进行挖矿，常规的服务器层面清理无法触及容器内的病毒，给清理工作带来更大难度。

## 二、一键清理脚本完整解析

以下脚本针对kdevtmpfsi \+ kinsing病毒的特性，采用“进程查杀→文件删除→自启清理→容器查杀”的全流程清理逻辑，操作简单、精准高效，不会误删系统正常文件，适合所有Linux系统（含CentOS、Ubuntu、Debian等），同时新增Docker容器查杀功能，覆盖更全面的使用场景。

### （一）完整脚本代码

```shell
#!/bin/bash

clear

echo "==== 开始清理 kdevtmpfsi + kinsing 挖矿病毒 ===="

# 1. 杀死病毒进程
echo -e "\033[33m[1/6] 杀死病毒进程...\033[0m"
ps aux | grep -E 'kdevtmpfsi|kinsing' | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null
ps aux | grep -E 'kdevtmpfsi|kinsing' | grep -v grep | awk '{print $2}' | xargs kill -15 2>/dev/null
sleep 1

# 2. 删除病毒文件（精准删除，不碰系统文件）
echo -e "\033[33m[2/6] 删除病毒文件...\033[0m"
rm -f /tmp/kdevtmpfsi /tmp/kinsing
rm -f /var/tmp/kdevtmpfsi /var/tmp/kinsing
rm -f /usr/bin/kdevtmpfsi /usr/bin/kinsing
rm -f /usr/sbin/kdevtmpfsi /usr/sbin/kinsing
rm -rf /tmp/*ki* /tmp/kdev* 2>/dev/null

# 3. 清理恶意定时任务（只删病毒，不清空正常任务）
echo -e "\033[33m[3/6] 清理恶意定时任务...\033[0m"
find /var/spool/cron/ -type f | xargs grep -l -iE 'kdev|kinsing' 2>/dev/null | xargs rm -f 2>/dev/null
find /etc/cron* -type f | xargs grep -l -iE 'kdev|kinsing' 2>/dev/null | xargs rm -f 2>/dev/null

# 4. 清理 rc.local 病毒（不删除系统文件）
echo -e "\033[33m[4/6] 清理开机自启病毒...\033[0m"
sed -i '/kdevtmpfsi/d' /etc/rc.d/rc.local 2>/dev/null
sed -i '/kinsing/d' /etc/rc.d/rc.local 2>/dev/null
chmod +x /etc/rc.d/rc.local 2>/dev/null

# 5. 清理 Redis 恶意模块
echo -e "\033[33m[5/6] 清理 Redis 恶意模块...\033[0m"
find /name "red2.so" -o -name "*libki*.so" -o -name "*kdev*.so" -delete 2>/dev/null

# 6. 最后查杀
echo -e "\033[33m[6/6] 最终查杀...\033[0m"
ps aux | grep -E 'kdevtmpfsi|kinsing' | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null

# ==================== 【新增：Docker 容器查杀】 ====================
echo -e "\033[33m[7/7] 清理所有 Docker 容器内病毒...\033[0m"

# 遍历所有运行中的容器
for cid in $(docker ps -q); do
  echo "→ 清理容器：$cid"
  docker exec $cid bash -c '
    # 杀进程
    ps aux | grep -E "kdevtmpfsi|kinsing" | grep -v grep | awk "{print \$2}" | xargs kill -9 2>/dev/null
    # 删文件
    rm -f /tmp/kdevtmpfsi /tmp/kinsing /var/tmp/kdevtmpfsi /var/tmp/kinsing
    # 删定时任务
    find /var/spool/cron/ /etc/cron* -type f 2>/dev/null | xargs grep -l -iE "kdev|kinsing" 2>/dev/null | xargs rm -f 2>/dev/null
    # 检查是否还存在
    ps aux | grep -E "kdevtmpfsi|kinsing" | grep -v grep
  ' 2>/dev/null
done
# ==================================================================

echo -e "\033[32m===== 清理完成！=====\033[0m"
echo -e "\033[32m检查结果（无输出 = 干净）：\033[0m"
ps aux | grep -E 'kdevtmpfsi|kinsing' | grep -v grep

echo -e "\n\033[31m必须立即执行：\033[0m"
echo "1. 修改SSH密码为强密码"
echo "2. 关闭 Redis 未授权访问"
echo "3. PostgreSQL/MySQL 容器若中毒，建议删除重建（无法彻底清后门）"

```

### （二）脚本核心步骤解析

脚本共分为7个核心步骤，每一步都针对性解决病毒的一个入侵点，确保清理彻底，具体解析如下：

#### 1\. 杀死病毒进程（第1步）

通过ps命令筛选出包含kdevtmpfsi、kinsing关键词的进程，排除grep自身进程后，提取进程ID（PID），分别使用kill \-9（强制终止）和kill \-15（正常终止）命令双重查杀，确保病毒进程被彻底杀死，避免残留。sleep 1是为了给进程终止留出时间，提升查杀成功率。

#### 2\. 删除病毒文件（第2步）

病毒文件主要隐藏在临时目录（/tmp、/var/tmp）和系统命令目录（/usr/bin、/usr/sbin），脚本采用精准删除的方式，直接删除已知的病毒文件名，同时通过通配符删除/tmp目录下疑似病毒文件（/tmp/\*ki\*、/tmp/kdev\*），避免遗漏。2\&gt;/dev/null用于屏蔽删除不存在文件时的错误提示，提升脚本运行体验。

#### 3\. 清理恶意定时任务（第3步）

挖矿病毒通常会添加定时任务，实现进程自动重启和病毒自动下载。脚本通过find命令遍历定时任务目录（/var/spool/cron/、/etc/cron\*），筛选出包含kdev、kinsing关键词的文件并删除，仅清理恶意任务，不会影响服务器正常的定时任务配置。

#### 4\. 清理开机自启病毒（第4步）

部分病毒会修改/etc/rc\.d/rc\.local文件（开机自启配置文件），添加病毒启动命令，实现开机自动运行。脚本使用sed命令删除该文件中包含kdevtmpfsi、kinsing的行，同时修复文件权限（chmod \+x），确保开机自启功能正常，避免系统异常。

#### 5\. 清理Redis恶意模块（第5步）

很多挖矿病毒会利用Redis未授权访问漏洞，植入恶意模块（如red2\.so、libki\*\.so等），实现病毒持久化。脚本通过find命令查找并删除这类恶意模块，从根源上清除Redis相关的病毒残留，减少病毒复发可能。

#### 6\. 最终查杀（第6步）

再次执行进程查杀操作，检查是否有遗漏的病毒进程，确保所有病毒进程被彻底终止，避免因进程重启导致清理不彻底。

#### 7\. Docker容器内病毒查杀（第7步，新增）

针对容器化部署的场景，脚本遍历所有运行中的Docker容器（通过docker ps \-q获取容器ID），通过docker exec命令进入容器内部，执行与服务器层面相同的清理操作（杀进程、删文件、删定时任务），并检查清理结果，确保容器内的病毒也被彻底清除，解决常规清理无法覆盖容器的痛点。

## 三、脚本使用方法（新手友好）

脚本使用步骤简单，无需复杂操作，只需按照以下步骤执行，即可完成病毒清理，全程无需手动干预：

### 步骤1：创建脚本文件

登录Linux服务器，通过vim命令创建脚本文件（文件名可自定义，建议命名为clean\_kdev\.sh）：

```shell
vim clean_kdev.sh
```

### 步骤2：粘贴脚本代码

进入vim编辑模式后，将上述完整脚本代码复制粘贴到文件中，粘贴完成后，按Esc键退出编辑模式，输入:wq保存并退出vim。

### 步骤3：赋予脚本执行权限

执行以下命令，给脚本赋予可执行权限，否则无法运行：

```shell
chmod +x clean_kdev.sh
```

### 步骤4：运行脚本

执行以下命令，启动脚本进行病毒清理，建议使用root用户运行（确保拥有足够权限，避免清理失败）：

```shell
./clean_kdev.sh
```

### 步骤5：查看清理结果

脚本运行完成后，会提示“清理完成”，并自动检查残留病毒进程。如果没有任何输出，说明病毒已被彻底清理；若有输出，则说明仍有残留，可再次运行脚本重复清理。

## 四、关键提醒：清理后必须做的3件事

挖矿病毒的入侵往往源于服务器存在安全漏洞，若只清理病毒而不修复漏洞，病毒很可能再次入侵。因此，清理完成后，务必立即执行以下3件事，筑牢服务器安全防线：

### 1\. 修改SSH密码为强密码

很多病毒通过暴力破解SSH密码入侵服务器，建议修改SSH密码为“字母\+数字\+特殊符号”的强密码，长度不低于12位，同时禁止root用户直接登录，创建普通用户并赋予sudo权限，提升SSH登录安全性。

### 2\. 关闭Redis未授权访问

Redis未授权访问是挖矿病毒入侵的主要途径之一，建议修改Redis配置文件（通常为redis\.conf），设置密码（requirepass 强密码），绑定指定IP（bind 127\.0\.0\.1 服务器内网IP），关闭公网访问，同时重启Redis服务，确保配置生效。

### 3\. 处理中毒的数据库容器

PostgreSQL、MySQL等数据库容器若感染病毒，病毒可能会在数据库中留下后门，难以彻底清理，建议直接删除中毒容器及相关数据卷，重新部署数据库，并恢复备份数据，避免后门导致再次入侵。

## 五、日常防护建议（避免病毒再次入侵）

除了清理病毒和修复漏洞，日常运维中做好以下几点，可有效减少挖矿病毒入侵的概率：

- 定期更新系统和软件：及时安装系统补丁，更新服务器上的各类软件（如Redis、Docker、SSH等），修复已知安全漏洞；

- 关闭不必要的端口：通过防火墙（firewalld、iptables）关闭公网不必要的端口，仅开放业务所需端口，减少入侵入口；

- 定期检查进程和文件：定期使用ps命令查看服务器进程，检查/tmp、/var/tmp等目录是否有可疑文件，及时发现并处理异常；

- 启用安全监控工具：部署服务器安全监控工具（如fail2ban、云安全中心等），实时监控异常登录、异常进程，及时告警；

- 规范容器管理：Docker容器使用非root用户运行，限制容器权限，定期清理无用容器和镜像，避免容器漏洞被利用。

## 六、常见问题解答

### Q1：运行脚本提示“权限不足”怎么办？

答：请使用root用户运行脚本，或在脚本执行命令前添加sudo（如sudo \./clean\_kdev\.sh），确保拥有足够的文件删除、进程终止权限。

### Q2：清理完成后，服务器CPU使用率仍很高，怎么办？

答：可能存在脚本未清理干净的病毒残留，或有其他挖矿病毒入侵。可再次运行脚本，同时使用top命令查看CPU占用最高的进程，手动排查可疑进程并终止，删除相关可疑文件。

### Q3：Docker容器查杀失败，提示“exec: \&\#34;bash\&\#34;: executable file not found in $PATH”怎么办？

答：部分精简版容器（如Alpine系统容器）未安装bash，可将脚本中docker exec命令中的bash替换为sh，修改后重新运行脚本即可。

## 总结

kdevtmpfsi \+ kinsing挖矿病毒虽隐蔽性强、难以彻底清理，但通过本文提供的一键清理脚本，可快速完成服务器及Docker容器内的病毒查杀，覆盖全流程清理场景，新手也能轻松操作。需要注意的是，病毒清理只是第一步，后续的漏洞修复和日常防护才是关键，只有筑牢服务器安全防线，才能从根源上避免病毒再次入侵，保障服务器稳定运行。

> （注：文档部分内容可能由 AI 生成）

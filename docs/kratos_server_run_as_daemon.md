# 将Kratos微服务程序运行为Linux守护进程

## supervisor

### 安装supervisor

Centos：

```bash
# 先安装 EPEL
yum install -y epel-release

# 安装supervisor
sudo yum -y install supervisor

# 设置为开机启动
sudo systemctl enable supervisord

# 启动进程
sudo systemctl start supervisord
```

### 启动守护进程

```bash
cd ~/app/service/admin/service/bin/
pm2 start --namespace kratos_app --name admin server -- -conf ../configs/

cd ~/app/service/front/service/bin/
pm2 start --namespace kratos_app --name front server -- -conf ../configs/

# 保存配置
pm2 save

# 重启全部守护进程
pm2 restart all
```

## pm2

### 安装pm2

Centos：

```bash
# 安装nodejs和npm
sudo yum install node npm -y

node -v
npm -v

# 安装pm2
npm install -g pm2
# 查看pm2的版本
pm2 --version
# tab补全
pm2 completion install
# 创建pm2开机启动脚本
pm2 startup
# 设置pm2的开机启动
sudo systemctl enable pm2-${USER}
```

### 启动守护进程

在当前路径下创建一个ini文件，比如：`supervisor/admin_service.ini`

```ini
[program:admin_service]
; 程序异常退出后自动重启
autorestart=True
; 在 supervisord 启动的时候也自动启动
autostart=True
; 用哪个用户启动
user=root
; 启动命令，与手动在命令行启动的命令是一样的
command=/root/app/service/admin/service/bin/server -conf /root/app/service/admin/service/configs/
; 程序的启动目录
directory=/root/app/service/admin/service/bin/
; stdout 日志文件大小，默认 50MB
stdout_logfile_maxbytes = 20MB
; stdout 日志文件备份数
stdout_logfile_backups = 20
; 把 stderr 重定向到 stdout，默认 false
redirect_stderr=True
; 日志输出
stderr_logfile=/data/logs/admin_service.stderr.log
stdout_logfile=/data/logs/admin_service.stdout.log
```

然后执行脚本：

```bash
# 拷贝配置文件
cp -rf ./script/supervisor/*.ini /etc/supervisord.d/
# 重载配置
sudo supervisorctl reload
# 重启所有守护进程
sudo supervisorctl restart all
```

## screen

关闭所有的screen：

```bash
str=$(screen -ls)
array=$(echo $str|tr "." "\n")

for V in $array
do
if [ $V -gt 0  ]
  then screen -S $V -X quit
fi
done
```

启动screen：

```bash
screen -dmS front bash -c '~/app/service/front/service/bin/server -conf ~/app/service/front/service/configs/';
screen -dmS admin bash -c '~/app/service/admin/service/bin/server -conf ~/app/service/admin/service/configs/';
```

# MQTT服务器使用HTTP进行用户认证

MQTT开源服务器有不少,我只用了两个Erlang开发的开源服务器:

* [RabbitMQ](https://www.rabbitmq.com/) 
* [EMQX](https://www.emqx.io/).  

现实中,我们需要提供一个HTTP认证服务器,来认证我们的MQTT客户端.

## Docker部署开发服务器

1. **RabbitMQ**

```bash
docker pull bitnami/rabbitmq:latest

docker run -itd \
    --hostname localhost \
    --name rabbitmq-test \
    -p 15672:15672 \
    -p 5672:5672 \
    -p 1883:1883 \
    -p 15675:15675 \
    -e RABBITMQ_PLUGINS=rabbitmq_top,rabbitmq_mqtt,rabbitmq_web_mqtt,rabbitmq_auth_backend_http \
    bitnami/rabbitmq:latest

# 查看插件列表
rabbitmq-plugins list
```

管理后台: <http://localhost:15672>  
默认账号: user  
默认密码: bitnami

2. **EMQX**

```bash
docker pull emqx/emqx:latest

docker run -itd \
    --name emqx-test \
    --add-host=host.docker.internal:host-gateway \
    -p 18083:18083 \
    -p 1883:1883 \
    emqx/emqx:latest
```

管理后台: <http://localhost:18083>  
默认账号: admin  
默认密码: public

## RabbitMQ认证

### 需要的插件

* **rabbitmq_mqtt** 提供MQTT协议的支持
* **rabbitmq_web_mqtt** 提供Web MQTT协议的支持
* **rabbitmq_auth_backend_http** 提供HTTP认证的支持

### 配置文件

打开Docker的命令行,编辑配置文件

```bash
vim /opt/bitnami/rabbitmq/etc/rabbitmq/rabbitmq.conf
```

添加如下的配置:

```ini
# 打开内置认证,优先会检查内置账号
auth_backends.1 = internal
# 第二级认证,使用缓存认证
auth_backends.2 = cache
# 缓存后端指定为 http
auth_cache.cached_backend = http
# 缓存时间，单位毫秒
auth_cache.cache_ttl = 60000

# HTTP请求方法,使用post
auth_http.http_method   = post
# 用户认证
auth_http.user_path     = http://host.docker.internal:8100/auth/user
# Vhost权鉴
auth_http.vhost_path    = http://host.docker.internal:8100/auth/vhost
# 资源权鉴
auth_http.resource_path = http://host.docker.internal:8100/auth/resource
# Topic权鉴
auth_http.topic_path    = http://host.docker.internal:8100/auth/topic
```

### HTTP认证服务器实现

认证服务器使用Golang+Gin实现,代码大致如下:

* 注册路由

```go
	r.POST("/auth/user", handleRabbitMqUser)
	r.POST("/auth/vhost", handleRabbitMqVhost)
	r.POST("/auth/resource", handleRabbitMqResource)
	r.POST("/auth/topic", handleRabbitMqTopic)
```

* 处理路由

```go
func handleRabbitMqUser(c *gin.Context) {
	var form struct {
		Username string `form:"username"`
		Password string `form:"password"`
		ClientId string `form:"client_id"`
		Vhost    string `form:"vhost"`
		Ip       string `form:"ip"`
	}
	BindAndValid(c, &form)
	fmt.Println("handleRabbitMqUser", form)

	if form.Username == "user" && form.Password == "bitnami" {
		c.String(200, "allow administrator")
	} else if form.Username == "admin" && form.Password == "bitnami" {
		c.String(200, "allow management")
	} else {
		c.String(200, "allow")
	}
	// c.String(200, "deny")
}

func handleRabbitMqVhost(c *gin.Context) {
	var form struct {
		Username string `form:"username"`
		Vhost    string `form:"vhost"`
		Ip       string `form:"ip"`
	}
	BindAndValid(c, &form)
	fmt.Println("handleRabbitMqVhost", form)
	c.String(200, "allow")
}

func handleRabbitMqResource(c *gin.Context) {
	var form struct {
		Username   string `form:"username"`
		Vhost      string `form:"vhost"`
		Resource   string `form:"resource"`
		Name       string `form:"name"`
		Permission string `form:"permission"`
	}
	BindAndValid(c, &form)
	fmt.Println("handleRabbitMqResource", form)
	c.String(200, "allow")
}

func handleRabbitMqTopic(c *gin.Context) {
	var form struct {
		Username   string `form:"username"`
		Vhost      string `form:"vhost"`
		Resource   string `form:"resource"`
		Name       string `form:"name"`
		Permission string `form:"permission"`
		RoutingKey string `form:"routing_key"`
	}
	BindAndValid(c, &form)
	fmt.Println("handleRabbitMqTopic", form)
	c.String(200, "allow")
}
```

## EMQX认证

### 需要的插件

* **emqx_auth_http** 插件同时包含 ACL 功能，可通过注释禁用。

### 配置文件

打开Docker的命令行,编辑配置文件

```bash
vi etc/plugins/emqx_auth_http.conf
```

添加如下的配置:

```ini
auth.http.auth_req = http://127.0.0.1:8100/mqtt/auth
auth.http.auth_req_method = POST
auth.http.auth_req_content_type = application/json
auth.http.auth_req.params = clientid=%c,username=%u,password=%P,ipaddress=%a
```

### HTTP认证服务器实现

认证服务器使用Golang+Gin实现,代码大致如下:

* 注册路由

```go
r.POST("/mqtt/auth", handleEmqxMqttAuth)
```

* 处理路由

```go
func handleEmqxMqttAuth(c *gin.Context) {
	var form struct {
		Username  string `form:"username"`
		Password  string `form:"password"`
		ClientId  string `form:"clientid"`
		IpAddress string `form:"ipaddress"`
		Protocol  string `form:"protocol"`
		SockPort  string `form:"sockport"`
	}
	BindAndValid(c, &form)
	fmt.Println("handleEmqxMqttAuth", form)

	ResponseJSON(c, http.StatusOK, 0, "", "")
}
```

## 示例代码

Github代码仓库: <https://github.com/tx7do/mqtt-http-auth-example>

## 参考资料

* [EMQX HTTP 认证](https://www.emqx.io/docs/zh/v4.3/advanced/auth-http.html#%E8%AE%A4%E8%AF%81%E8%AF%B7%E6%B1%82)
* [rabbitmq_auth_backend_http插件文档](https://github.com/rabbitmq/rabbitmq-auth-backend-http/blob/v3.7.x/README.md)
* [RabbitMQ Authentication, Authorisation, Access Control](https://www.rabbitmq.com/access-control.html#server-mechanism-configuration)

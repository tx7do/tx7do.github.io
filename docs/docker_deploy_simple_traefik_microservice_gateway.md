# Docker部署简单的Traefik微服务网关

## 什么是Traefik?

Traefik 是一款开源的反向代理与负载均衡工具，它监听后端的变化并自动更新服务配置。Traefik 最大的优点是能够与常见的微服务系统直接整合，可以实现自动化动态配置。目前支持 Docker、Swarm,Marathon、Mesos、Kubernetes、Consul、Etcd、Zookeeper、BoltDB 和 Rest API 等后端模型。

## 什么是微服务网关?

微服务网关是整个微服务API请求的入口，可以实现过滤Api接口。并且可以实现用户的验证登录、解决跨域、日志拦截、权限控制、限流、熔断、负载均衡、黑名单与白名单机制等。

## Docker部署服务器

1. Consul (测试的版本为v1.11.4)

```bash
docker pull bitnami/consul:latest
docker pull bitnami/consul-exporter:latest

docker run -itd \
    --name consul-server-standalone \
    -p 8300:8300 \
    -p 8500:8500 \
    -p 8600:8600/udp \
    -e CONSUL_BIND_INTERFACE='eth0' \
    -e CONSUL_AGENT_MODE=server \
    -e CONSUL_ENABLE_UI=true \
    -e CONSUL_BOOTSTRAP_EXPECT=1 \
    -e CONSUL_CLIENT_LAN_ADDRESS=0.0.0.0 \
    bitnami/consul:latest
```

2. Traefik (测试的版本为v2.5.6)

```bash
docker pull traefik:latest

docker run -itd `
    --name traefik-server `
    --link consul-server-standalone `
    --add-host=host.docker.internal:host-gateway `
    -p 8080:8080 `
    -p 80:80 `
    -v /var/run/docker.sock:/var/run/docker.sock `
    traefik:latest --api.insecure=true --providers.consul.endpoints="consul-server-standalone:8500"
```

## 管理后台

* Consul: <http://localhost:8500>
* Traefik:<http://localhost:8080>

## 加入路由配置

在这里我使用了Consul作为远程配置中心，配置以KV的方式存储，可登陆consul的管理后台添加配置，Traefik默认是监控配置改变的。

| 键  | 值  |
|-----|----|
|  traefik/http/routers/myrouter-1/rule   |  PathPrefix(`/`)  |
|  traefik/http/routers/myrouter-1/entryPoints/0   |  http  |
|   traefik/http/routers/myrouter-1/service  |  myservice-1  |
|  traefik/http/services/myservice-1/loadbalancer/servers/0/url   |  http://host.docker.internal:8100  |

## 简单的Go服务示例

```go
package main
import (
	"fmt"
	"net/http"
)

func HelloHandle(w http.ResponseWriter, r *http.Request)  {
	_, _ = fmt.Fprint(w, "hello kitty")
}

func main() {
    http.HandleFunc("/hello", HelloHandle)
    if e := http.ListenAndServe(":8100", nil); e!= nil{
        panic(e.Error())
    }
```

* 原始服务器的访问地址是：http://localhost:8100/hello
* 通过网关访问的地址是：http://localhost/hello

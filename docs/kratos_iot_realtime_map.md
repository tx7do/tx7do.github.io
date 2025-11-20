# Kratos微服务框架物联网IoT实战：设备实时地图

IoT，也就是物联网，万物互联，在未来肯定是一个热点——实际上，现在物联网已经很热了。

那好，既然这一块这么有前途。那我们就来学习怎么开发物联网系统吧。可是，作为一个小白，两眼一抹黑：我想学，可是我该如何开始？这玩意儿到底该咋整呢？

于是，我各种找资料，各种学习——此处省略一亿个字，其中的艰辛，其中的曲折，总之就是：说来都是泪，欲哭却无声——总算是有了基础的认知，有了一个模糊的方向。我知道了物联网设备通讯协议MQTT、CoAP、LwM2M，知道了微服务，知道了MQ，知道了Websocket，知道了REST，知道了gRPC……有了这些认知，看起来可以开始做技术选型了。

在这个时候，我发现了B站开源的微服务框架[go-kratos](https://github.com/go-kratos/kratos)。那么，Kratos能否实现物联网的系统和功能呢？答案是：必须可以。

我们现在要开发一个物联网的系统，Kratos能够为我们提供什么技术支撑呢？有以下功能模块可供使用：

1. MQTT，用于设备与物联网服务之间的同异步通讯；
2. gRPC，用于微服务之间的同步通讯；
3. MQ消息队列（RabbitMQ、Kafka、Pulsar、NATS、RocketMQ等），用于微服务之间的异步通讯；
4. REST（基于gRPC gateway），用于后端跟前端的同步通讯；
5. Websocket，用于后端跟前端的异步通讯。

物联网一个最基础的功能就是实时地图了，也就是在地图上展现设备的动态，比如：位置、轨迹、方向……在我查找资料的时候，发现了一个实时地图的示例程序 [realtimemap-go](https://github.com/asynkron/realtimemap-go)，它是Actor模型框架 [Proto.Actor](https://proto.actor/) 的展示程序。该示例程序显示的是芬兰首都赫尔辛基公共交通车辆的实时位置。

Proto.Actor，它是一种用于 Go、C# 和 Java/Kotlin 的超快速分布式 Actor 解决方案。你可能会问，那为什么不用它来进行开发？因为，它实现起来太复杂了，维护起来就更加复杂。如果你用过Erlang编程语言，那么你就能够深深体会到当中的困难。

Proto.Actor该示例有一个在线演示：<https://realtimemap.skyrise.cloud/>

![实时地图](/assets/images/iot/iot_realtime_map.png)

该示例程序有以下特性：

1. 车辆的实时位置；
2. 车辆的轨迹；
3. 地理围栏通知（车辆进出该地理区域）；
4. 每个公交公司在地理围栏区域的车辆；
5. 水平缩放。

本文基于此示例程序，在Kratos下面重新实现了一遍。

## 先决条件

- [Kratos](https://go-kratos.dev/)
- [Vue.js](https://vuejs.org/)
- [MQTT](https://mqtt.org/)
- [Websocket](https://www.ruanyifeng.com/blog/2017/05/websocket.html)
- [gRPC](https://grpc.io/)
- [RESTful](https://www.runoob.com/w3cnote/restful-architecture.html)

示例程序的后端基于Kratos微服务框架开发，需要有一定的Kratos的基础。前端基于Vue3和Typescript进行开发，需要有一定的相关基础。

## 它是如何工作的？

1. 设备使用MQTT通讯协议将数据推送给服务端；
2. 服务端使用REST和Websocket将设备数据推送给前端。

服务端基于Kratos框架进行开发，为了简便演示，本示例只有一个单体服务，实际运用时，拆分服务也是容易的。

## 服务端接收MQTT数据

### 数据源

由于这个应用程序是关于跟踪车辆的，我们需要从某个地方获取它们的位置。在此应用程序中，位置是从赫尔辛基地区交通局的高频车辆定位 MQTT 代理接收的。有关数据的更多信息：

- [赫尔辛基地区交通 - 开放数据。](https://www.hsl.fi/en/hsl/open-data)
- [赫尔辛基地区交通局的高频定位。](https://digitransit.fi/en/developers/apis/4-realtime-api/vehicle-positions/)

此数据已根据 © Helsinki Region Transport 2021、Creative Commons BY 4.0 International 获得许可

Topic的定义如下：

```text
0/1       /2        /3             /4              /5           /6               /7            /8               /9         /10            /11        /12          /13         /14             /15       /16
 /<prefix>/<version>/<journey_type>/<temporal_type>/<event_type>/<transport_mode>/<operator_id>/<vehicle_number>/<route_id>/<direction_id>/<headsign>/<start_time>/<next_stop>/<geohash_level>/<geohash>/<sid>/#
```

Topic的Go定义：

```go
type Topic struct {
	Prefix       string // /hfp/ is the root of the topic tree.
	Version      string // v2 is the current version of the HFP topic and the payload format.
	JourneyType  string // The type of the journey. Either journey, deadrun or signoff.
	TemporalType string // The status of the journey, ongoing or upcoming.

	EventType     string // One of vp, due, arr, dep, ars, pde, pas, wait, doo, doc, tlr, tla, da, dout, ba, bout, vja, vjout.
	TransportMode string // The type of the vehicle. One of bus, tram, train, ferry, metro, ubus (used by U-line buses and other vehicles with limited realtime information) or robot (used by robot buses).

	// operator_id/vehicle_number uniquely identifies the vehicle.
	OperatorId    string // The unique ID of the operator that owns the vehicle.
	VehicleNumber string // The vehicle number that can be seen painted on the side of the vehicle, often next to the front door. Different operators may use overlapping vehicle numbers.

	RouteId      string // The ID of the route the vehicle is running on.
	DirectionId  string // The line direction of the trip, either 1 or 2.
	Headsign     string // The destination name, e.g. Aviapolis.
	StartTime    string // The scheduled start time of the trip
	NextStop     string // The ID of next stop or station.
	GeohashLevel string // The geohash level represents the magnitude of change in the GPS coordinates since the previous message from the same vehicle.
	Geohash      string // The latitude and the longitude of the vehicle.
	Sid          string // Junction ID, corresponds to sid in the payload.
}
```

载体数据结构定义如下：

```go
package hfp

type Payload struct {
	Longitude *float64   `json:"long"` // 经度(WGS84)
	Latitude  *float64   `json:"lat"`  // 纬度(WGS84)
	Heading   *int32     `json:"hdg"`  // 朝向角度[0, 360]
	DoorState *int32     `json:"drst"` // 门状态 0:所有门都已关闭 1:有门打开
	Timestamp *time.Time `json:"tst"`  // 时间戳
	Speed     *float64   `json:"spd"`  // 车速(m/s)
	Odometer  *int32     `json:"odo"`  // 里程(m)
}

type Event struct {
	VehicleId  string // 车辆ID
	OperatorId string // 司机ID

	VehiclePosition *Payload `json:"VP"`  // 坐标
	DoorOpen        *Payload `json:"DOO"` // 开门
	DoorClosed      *Payload `json:"DOC"` // 关门
}
```

需要注意的是，我测试时发现，MQTT接收数据时只要接收一段时间就自动断开了，一开始我还以为是我这边出问题了，后来做了一些测试才发现，是对方限制了使用，应该是测试账号的ClientID只允许接收一定时长的数据。

### 编写代码

首先创建MQTT服务端，它本质上是一个MQTT的客户端，它具有全双工、双向的数据流，所以实现为服务端也并无问题。

```go
package server

import (
	"context"

	"github.com/go-kratos/kratos/v2/log"
	"github.com/tx7do/kratos-transport/transport/mqtt"
	
	"kratos-realtimemap/app/admin/internal/conf"
	"kratos-realtimemap/app/admin/internal/service"
)

// NewMQTTServer create a mqtt server.
func NewMQTTServer(c *conf.Server, _ log.Logger, svc *service.AdminService) *mqtt.Server {
	ctx := context.Background()

	srv := mqtt.NewServer(
		mqtt.WithAddress([]string{c.Mqtt.Addr}),
		mqtt.WithCodec("json"),
	)

	_ = srv.RegisterSubscriber(ctx,
		"/hfp/v2/journey/ongoing/vp/bus/#",
		registerSensorDataHandler(svc.TransitPostTelemetry),
		hfpEventCreator,
	)

	svc.SetMqttBroker(srv)

	return srv
}
```

以上代码创建了一个MQTT的服务器，使用JSON编解码器进行编解码，监听了Topic为`/hfp/v2/journey/ongoing/vp/bus/#`的MQTT推送消息。

接着实现服务，对设备通过MQTT推送的消息进行处理：

```go
package service

import (
	"context"

	"github.com/tx7do/kratos-transport/broker"

	"kratos-realtimemap/api/hfp"
	"kratos-realtimemap/app/admin/internal/pkg/data"
)

func (s *RealtimeMapService) SetMqttBroker(b broker.Broker) {
	s.mb = b
}

func (s *RealtimeMapService) TransitPostTelemetry(_ context.Context, topic string, headers broker.Headers, msg *hfp.Event) error {
	//fmt.Println("Topic: ", topic)

	topicInfo := hfp.Topic{}
	topicInfo.Parse(topic)

	msg.OperatorId = topicInfo.OperatorId
	msg.VehicleId = topicInfo.GetVehicleUID()

	position := msg.MapToPosition()
	if position != nil {
		s.positionHistory.Update(position)
		turnovers := data.AllOrganizations.Update(position)

		s.BroadcastVehicleTurnoverNotification(turnovers)
		s.BroadcastVehiclePosition(s.positionHistory.GetPositionsHistory(position.VehicleId))
	}

	s.log.Infof("事件类型: %s 交通工具类型: %s 司机ID: %s 车辆ID: %s", topicInfo.EventType, topicInfo.TransportMode, topicInfo.OperatorId, msg.VehicleId)

	return nil
}
```

以上代码对Topic和载体数据进行了解析，将设备状态存入内存当中，旋即把状态通过Websocket广播给前端。

好了，我们对MQTT的处理就完成了。处理MQTT的课结束，下课！

嗯？这就完了？这么简单？

没错，就这么点代码，就这么的容易，我也想多叨叨几句，扩充点篇幅，只可惜，它确实就是这么容易就搞定了。

## 服务端推送数据到前端

服务端与前端的通讯主要靠REST和Websocket来实现。那些更新频率不高，实时性要求也不高的数据都可以走REST，由前端主动拉取。而实时性和更新频率都比较高的数据则可以通过Websocket由服务端主动推送。

### 数据结构

别看设备与服务端的通讯很简单，但是，服务端到前端的数据就复杂多了。有以下数据：

1. Organization（组织），指的是汽车的所属公司。
2. Geofence（地理围栏），它是地图上的一个几何区域，用于标定汽车的停车场或者运营区域，出入都将会发送一个通知给前端。
3. Position（汽车坐标），它是汽车的一个坐标点，包含了汽车在该点上的状态，比如：开关门，速度，朝向等。
4. Viewport（视口），它是地图上的一个裁剪矩形，浅显的描述就是你在前端看到的地图区域，前端只接收该视口之内的汽车数据，否则服务器会向前端发送系统所有的汽车数据，不论服务器还是网络都将会吃不消。
5. Notification（通知），服务端通知前端一些事件，主要是：汽车进出地理围栏的事件，汽车上线下线通知。

其中，Position和Notification都是通过Websocket推送给前端，其他数据则是前端通过REST主动拉取。

以上数据结构通过Protobuf定义：

```protobuf
syntax = "proto3";

// 地理点
message GeoPoint {
  double longitude = 1;// 经度(WGS84)
  double latitude = 2;// 纬度(WGS84)
}

// 组织
message Organization {
  string id = 1;// 组织ID
  string name = 2;// 组织名称
}

// 地理围栏
message Geofence {
  string name = 1;// 围栏名称
  double radius_in_meters = 2;// 半径长度（圆形地理围栏）
  double longitude = 3;// 经度(WGS84)
  double latitude = 4;// 纬度(WGS84)
  string org_id = 5;// 组织ID
  repeated string vehicles_in_zone = 6;// 区域内所有的车辆
}

// 车辆坐标
message Position {
  string vehicle_id = 1;// 车辆ID
  string org_id = 2;// 组织ID
  int64 timestamp = 3;// 时间戳
  double longitude = 4;// 经度(WGS84)
  double latitude = 5;// 纬度(WGS84)
  int32 heading = 6;// 朝向角度[0, 360]
  bool doors_open = 7;// 门状态 0:所有门都已关闭 1:有门打开
  double speed = 8;// 车速(m/s)
}

// 视口
message Viewport {
  GeoPoint south_west = 1;// 西南点（左下点）
  GeoPoint north_east = 2;// 东北点（右上点）
}

// 通知
message Notification {
  string message = 1;// 通知内容
}
```

### REST

像拉取组织列表、获取某一个组织的详情、获取某一车辆的行车轨迹，都属于低频的操作，所以都走REST。

REST的功能是通过gRPC的gateway实现的，所以我们可以通过protobuf来定义API：

```protobuf
syntax = "proto3";

// 实时地图服务
service RealtimeMapService {
  // 获取组织列表
  rpc ListOrganizations (google.protobuf.Empty) returns (ListOrganizationsReply) {
    option (google.api.http) = {
      get: "/api/organizations"
    };
  }

  // 获取组织详情
  rpc GetOrganization (GetOrganizationReq) returns (GetOrganizationReply) {
    option (google.api.http) = {
      get: "/api/organizations/{org_id}"
    };
  }

  // 获取车辆轨迹
  rpc GetVehicleTrail (GetVehicleTrailReq) returns (GetVehicleTrailReply) {
    option (google.api.http) = {
      get: "/api/trail/{id}"
    };
  }
}
```

下面就可以创建REST服务器了：

```go
package server

// NewMiddleware 创建中间件
func NewMiddleware(ac *conf.Auth, logger log.Logger) http.ServerOption {
	return http.Middleware(
		recovery.Recovery(),
		tracing.Server(),
		logging.Server(logger),
	)
}

// NewHTTPServer new an HTTP server.
func NewHTTPServer(c *conf.Server, ac *conf.Auth, logger log.Logger, s *service.RealtimeMapService) *http.Server {
	var opts = []http.ServerOption{
		NewMiddleware(ac, logger),
		http.Filter(handlers.CORS(
			handlers.AllowedHeaders([]string{"" +
				"", "Content-Type", "Authorization"}),
			handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"}),
			handlers.AllowedOrigins([]string{"*"}),
		)),
	}
	if c.Http.Network != "" {
		opts = append(opts, http.Network(c.Http.Network))
	}
	if c.Http.Addr != "" {
		opts = append(opts, http.Address(c.Http.Addr))
	}
	if c.Http.Timeout != nil {
		opts = append(opts, http.Timeout(c.Http.Timeout.AsDuration()))
	}
	srv := http.NewServer(opts...)

	h := openapiv2.NewHandler()
	srv.HandlePrefix("/q/", h)

	v1.RegisterRealtimeMapServiceHTTPServer(srv, s)
	return srv
}
```

其服务很简单，也就是一些非常简单的内存数据查询：

```go
package service

func (s *RealtimeMapService) ListOrganizations(_ context.Context, _ *emptypb.Empty) (*v1.ListOrganizationsReply, error) {
	reply := &v1.ListOrganizationsReply{
		Organizations: data.AllOrganizations.MapToBaseInfoArray(),
	}

	return reply, nil
}

func (s *RealtimeMapService) GetOrganization(_ context.Context, req *v1.GetOrganizationReq) (*v1.GetOrganizationReply, error) {
	if org, ok := data.AllOrganizations[req.OrgId]; ok {
		return &v1.GetOrganizationReply{
			Id:        org.Id,
			Name:      org.Name,
			Geofences: org.MapToGeofenceArray(),
		}, nil
	} else {
		return nil, v1.ErrorResourceNotFound(fmt.Sprintf("Organization %s not found", req.OrgId))
	}
}

func (s *RealtimeMapService) GetVehicleTrail(_ context.Context, req *v1.GetVehicleTrailReq) (*v1.GetVehicleTrailReply, error) {
	his := s.positionHistory.GetVehicleTrail(req.Id)
	if his == nil {
		return nil, v1.ErrorResourceNotFound(fmt.Sprintf("%s positions history not found", req.Id))
	}
	return &v1.GetVehicleTrailReply{Positions: his}, nil
}
```

### Websocket

Websocket适合需要服务端主动推送消息的应用场景之下。REST肯定是做不到的，长轮询的效率之低下，令人发指。

在Kratos下创建一个Websocket的服务器是容易的，只需要以下代码即可实现：

```go
package server

import (
	"github.com/go-kratos/kratos/v2/log"
	"github.com/tx7do/kratos-transport/transport/websocket"

	"kratos-realtimemap/app/admin/internal/conf"
	"kratos-realtimemap/app/admin/internal/service"
)

// NewWebsocketServer create a websocket server.
func NewWebsocketServer(c *conf.Server, _ log.Logger, svc *service.RealtimeMapService) *websocket.Server {
	srv := websocket.NewServer(
		websocket.WithAddress(c.Websocket.Addr),
		websocket.WithPath(c.Websocket.Path),
		websocket.WithConnectHandle(svc.OnWebsocketConnect),
		websocket.WithCodec("json"),
	)

	svc.SetWebsocketServer(srv)

	return srv
}
```

向前端推送消息，我简单处理了，调用`Broadcast`方法直接广播全部前端了：

```go
func (s *RealtimeMapService) BroadcastToWebsocketClient(eventId string, payload interface{}) {
	if payload == nil {
		return
	}

	bufPayload, _ := json.Marshal(&payload)

	var proto v1.WebsocketProto
	proto.EventId = eventId
	proto.Payload = string(bufPayload)

	bufProto, _ := json.Marshal(&proto)

	var msg websocket.Message
	msg.Body = bufProto

	s.ws.Broadcast(websocket.MessageType(v1.MessageType_Notify), &msg)
}
```

只有两个推送：

`BroadcastVehiclePosition`方法是推送车辆的位置信息的：

```go
func (s *RealtimeMapService) BroadcastVehiclePosition(positions data.PositionArray) {
	s.BroadcastToWebsocketClient("positions", positions)
}
```

`BroadcastVehicleTurnoverNotification`是推送车辆进出物理围栏通知的：

```go
func (s *RealtimeMapService) BroadcastVehicleTurnoverNotification(turnovers data.TurnoverArray) {
	for _, turnover := range turnovers {
		var str string
		if turnover.Status {
			str = fmt.Sprintf("%s from %s entered the zone %s",
				turnover.VehicleId, turnover.OrganizationName, turnover.GeofenceName)
		} else {
			str = fmt.Sprintf("%s from %s left the zone %s",
				turnover.VehicleId, turnover.OrganizationName, turnover.GeofenceName)
		}
		s.BroadcastToWebsocketClient("notification", str)
	}
}
```

在程序里面，我们只处理了一个前端推送的消息，是前端视口改变的更新消息：

```go
func (s *RealtimeMapService) OnWebsocketMessage(sessionId websocket.SessionID, message *websocket.Message) error {
	s.log.Infof("[%s] Payload: %s\n", sessionId, string(message.Body))

	var proto v1.WebsocketProto

	if err := json.Unmarshal(message.Body, &proto); err != nil {
		s.log.Error("Error unmarshalling proto json %v", err)
		return nil
	}

	switch proto.EventId {
	case "viewport":
		var msg v1.Viewport
		if err := json.Unmarshal([]byte(proto.Payload), &msg); err != nil {
			s.log.Error("Error unmarshalling payload json %v", err)
			return nil
		}

		_ = s.OnWsSetViewport(sessionId, &msg)
	}

	return nil
}

func (s *RealtimeMapService) OnWsSetViewport(sessionId websocket.SessionID, msg *v1.Viewport) error {
	s.viewports[sessionId] = msg
	return nil
}
```

到这里，服务端基本上就实现了。虽然还很粗糙，但是该有的功能是实现了。

## 实现前端

前端基于Vue.js和Typescript开发。

### REST客户端

REST客户端基于axios封装而成：

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {deepMerge} from '@/util';

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string;
}

export class VAxios {
  private axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
  }

  private createAxios(config: CreateAxiosOptions): void {
    this.axiosInstance = axios.create(config);
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance;
  }

  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) {
      return;
    }
    this.createAxios(config);
  }

  setHeader(headers: any): void {
    if (!this.axiosInstance) {
      return;
    }
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  get<T = any>(url: string): Promise<T> {
    return this.axiosInstance.get(url);
  }
}

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        authenticationScheme: '',
        withCredentials: false,
        timeout: 10 * 1000,

        baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8800/api/',

        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
        },
      },
      opt || {},
    ),
  );
}

export const apiInstance = createAxios();
```

### Websocket客户端

Websocket基于`WebSocket`类开发：

```typescript
export interface PositionsDto {
  positions: PositionDto[];
}

export interface PositionDto {
  vehicle_id: string;
  longitude: number;
  latitude: number;
  heading: number;
  speed: number;
  doors_open: boolean;
}

export interface WebsocketProto {
  event_id: string;
  payload: string;
}

export interface GeoPoint {
  longitude: number;
  latitude: number;
}

export interface Viewport {
  southWest: GeoPoint;
  northEast: GeoPoint;
}

export interface UpdateViewport {
  viewport: Viewport;
}

export interface Notification {
  message: string;
}

export interface HubConnection {
  setViewport(swLng: number, swLat: number, neLng: number, neLat: number);

  onPositions(callback: (positions: PositionDto[]) => void);

  onNotification(callback: (notification: string) => void);

  disconnect(): Promise<void>;
}

function ByteBufferToObject(buff) {
  const enc = new TextDecoder('utf-8');
  const uint8Array = new Uint8Array(buff);
  const decodedString = enc.decode(uint8Array);
  // console.log(decodedString);
  return JSON.parse(decodedString);
}

function StringToArrayBuffer(str) {
  return new TextEncoder().encode(str);
}

class WebsocketConnect implements HubConnection {
  private connection: WebSocket;
  private onPositionsCallback?: (positions: PositionDto[]) => void;
  private onNotificationCallback?: (notification: string) => void;

  constructor() {
    const wsURL = `ws://localhost:7700/`;
    this.connection = new WebSocket(wsURL);
    this.connection.binaryType = 'arraybuffer';
    this.connection.onopen = this.onWebsocketOpen.bind(this);
    this.connection.onerror = this.onWebsocketError.bind(this);
    this.connection.onmessage = this.onWebsocketMessage.bind(this);
    this.connection.onclose = this.onWebsocketClose.bind(this);
  }

  onWebsocketOpen(event) {
    console.log('ws连接成功', event);
  }

  onWebsocketError(event) {
    console.error('ws错误', event);
  }

  onWebsocketMessage(event) {
    const proto = ByteBufferToObject(event.data);
    // console.log(proto);
    const data = JSON.parse(proto['payload']);
    // console.log(data);

    const eventId = proto['event_id'];
    if (eventId == 'positions') {
      if (this.onPositionsCallback != null) {
        this.onPositionsCallback(data);
      }
    } else if (eventId == 'notification') {
      if (this.onNotificationCallback != null) {
        this.onNotificationCallback(data);
      }
    }
  }

  onWebsocketClose(event) {
    console.log('ws连接关闭', event);
  }

  sendMessage(eventId, data) {
    const x: WebsocketProto = {
      event_id: eventId,
      payload: JSON.stringify(data),
    };
    const str = JSON.stringify(x);
    // console.log(str);
    this.connection.send(StringToArrayBuffer(str));
  }

  setViewport(swLng: number, swLat: number, neLng: number, neLat: number) {
    const x: Viewport = {
      southWest: {
        longitude: swLng,
        latitude: swLat,
      },
      northEast: {
        longitude: neLng,
        latitude: neLat,
      },
    };
    this.sendMessage('viewport', x);
  }

  onPositions(callback: (positions: PositionDto[]) => void) {
    this.onPositionsCallback = callback;
  }

  onNotification(callback: (notification: string) => void) {
    this.onNotificationCallback = callback;
  }

  async disconnect() {
    await this.connection.close(1000);
  }
}

export const connectToHub = new WebsocketConnect;
```

### 地图客户端

地图是使用的Mapbox开发的，这一块是直接从realtimemap-go中拷贝出来的。本来是想自己基于高德或者百度地图重新做一个，但是基于坐标系的考虑，就没有采用高德或者百度地图来开发了。

要使用Mapbox，首先需要去 [Mapbox](https://www.mapbox.com/) 注册一个账号。

然后在`mapboxConfig.ts`当中把你自己账号的AccessToken填写到`mapboxAccessToken`常量。

## 项目代码

- [Github](https://github.com/tx7do/kratos-realtimemap)
- [Gitee](https://gitee.com/tx7do/kratos-realtimemap)
- [Kratos 官方示例](https://github.com/go-kratos/examples/tree/main/realtimemap)

## 中间件代码

* [kratos-transport Gitee](https://gitee.com/tx7do/kratos-transport)
* [kratos-transport Github](https://github.com/tx7do/kratos-transport)

## 参考资料

- [GTFS Realtime Reference](https://developers.google.com/transit/gtfs-realtime/reference)
- [High-frequency positioning](https://digitransit.fi/en/developers/apis/4-realtime-api/vehicle-positions/)
- [realtimemap-go](https://github.com/asynkron/realtimemap-go)

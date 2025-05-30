# 开箱即用的GO后台管理系统 Kratos Admin - 从零开始实现一个新的服务

本文旨在指导开发者从零开始，增加一个新的服务。

我们在这里所谓的“服务”，指的是gRPC里边的一个`service`。它是一个功能的集合，包含了一个数据集最基本的CURD（增删改查）操作。

我们顺着开发的流程来讲述完整的开发过程：

1. 设计数据库表结构；
2. 手动编写或者自动生成ent的schema；
3. 手动编写或者自动生成gRPC的proto；
4. 编写data包；
5. 编写service包；
6. 注册进Server。

## 1. 设计数据库表结构

## 2. 手动编写或者自动生成ent的schema

Ent 是 Go 语言中的一个开源ORM库，它由Facebook开源。用于构建高效、类型安全的数据库抽象层。Ent 的 Schema 是用于定义实体（Entity）及其关系的结构。

Schema我们放在data包下面，其路径为：`data/ent/schema`。

我们在其下创建一个`user.go`：

```go
package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/tx7do/go-utils/entgo/mixin"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

func (User) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{
			Table:     "users",
			Charset:   "utf8mb4",
			Collation: "utf8mb4_bin",
		},
		entsql.WithComments(true),
		schema.Comment("用户表"),
	}
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("username").
			Comment("用户名").
			Unique().
			NotEmpty().
			Immutable().
			Optional().
			Nillable(),

		field.String("password").
			Comment("登录密码").
			MaxLen(255).
			Optional().
			Nillable().
			NotEmpty(),

		field.String("nick_name").
			Comment("昵称").
			MaxLen(255).
			Optional().
			Nillable(),

		field.String("real_name").
			Comment("真实名字").
			MaxLen(255).
			Optional().
			Nillable(),

		field.String("email").
			Comment("电子邮箱").
			MaxLen(320).
			Optional().
			Nillable(),

		field.String("mobile").
			Comment("手机号码").
			Default("").
			MaxLen(255).
			Optional().
			Nillable(),

		field.String("telephone").
			Comment("座机号码").
			Default("").
			MaxLen(255).
			Optional().
			Nillable(),

		field.String("avatar").
			Comment("头像").
			MaxLen(1023).
			Optional().
			Nillable(),

		field.Enum("gender").
			Comment("性别").
			Values(
				"UNKNOWN",
				"MALE",
				"FEMALE",
			).
			Optional().
			Nillable(),

		field.String("address").
			Comment("地址").
			Default("").
			MaxLen(2048).
			Optional().
			Nillable(),

		field.String("region").
			Comment("国家地区").
			Default("").
			MaxLen(255).
			Optional().
			Nillable(),

		field.String("description").
			Comment("个人说明").
			MaxLen(1023).
			Optional().
			Nillable(),

		field.Enum("authority").
			Comment("授权").
			Optional().
			Nillable().
			Values(
				"SYS_ADMIN",
				"SYS_MANAGER",
				"CUSTOMER_USER",
				"GUEST_USER",
				"REFRESH_TOKEN",
			).
			Default("CUSTOMER_USER"),

		field.Int64("last_login_time").
			Comment("最后一次登录的时间").
			Optional().
			Nillable(),

		field.String("last_login_ip").
			Comment("最后一次登录的IP").
			Default("").
			MaxLen(64).
			Optional().
			Nillable(),

		field.Uint32("role_id").
			Comment("角色ID").
			Optional().
			Nillable(),

		field.Uint32("org_id").
			Comment("部门ID").
			Optional().
			Nillable(),

		field.Uint32("position_id").
			Comment("职位ID").
			Optional().
			Nillable(),

		field.Uint32("work_id").
			Comment("员工工号").
			Optional().
			Nillable(),

		field.Uint32("tenant_id").
			Comment("租户ID").
			Optional().
			Nillable(),
	}
}

// Mixin of the User.
func (User) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.AutoIncrementId{},
		mixin.CreateBy{},
		mixin.UpdateBy{},
		mixin.Time{},
		mixin.Remark{},
		mixin.SwitchStatus{},
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return nil
}

// Indexes of the User.
func (User) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("id", "username").Unique(),
	}
}
```

其中，我们可以在`Annotations()`中定义表的基本信息，在`Fields()`中定义表的字段，在`Indexes()`中定义表的索引，在`Edges()`中定义表与表之间的关系，而`Mixin()`则是组合一些预设配置。

## 3. 手动编写或者自动生成gRPC的proto

```proto
syntax = "proto3";

package user.service.v1;

import "gnostic/openapi/v3/annotations.proto";
import "google/protobuf/empty.proto";
import "google/protobuf/field_mask.proto";
import "google/protobuf/timestamp.proto";
import "google/api/field_behavior.proto";

import "pagination/v1/pagination.proto";

// 用户服务
service UserService {
  // 查询用户列表
  rpc ListUser (pagination.PagingRequest) returns (ListUserResponse) {}

  // 查询用户详情
  rpc GetUser (GetUserRequest) returns (User) {}

  // 创建用户
  rpc CreateUser (CreateUserRequest) returns (google.protobuf.Empty) {}

  // 更新用户
  rpc UpdateUser (UpdateUserRequest) returns (google.protobuf.Empty) {}

  // 删除用户
  rpc DeleteUser (DeleteUserRequest) returns (google.protobuf.Empty) {}
}

// 用户权限
enum UserAuthority {
  SYS_ADMIN = 0;  // 系统超级用户
  SYS_MANAGER = 1;  // 系统管理员
  CUSTOMER_USER = 2;  // 普通用户
  GUEST_USER = 3;  // 游客

  REFRESH_TOKEN = 4; // 刷新令牌
}

// 用户性别
enum UserGender {
  SECRET = 0;  // 未知
  MALE = 1;     // 男性
  FEMALE = 2;   // 女性
}

// 用户状态
enum UserStatus {
  OFF = 0;
  ON = 1;
}

// 用户
message User {
  optional uint32 id = 1 [
    json_name = "id",
    (gnostic.openapi.v3.property) = {description: "用户ID"}
  ];  // 用户ID

  optional uint32 role_id = 2 [json_name = "roleId", (gnostic.openapi.v3.property) = {description: "角色ID"}];  // 角色ID
  optional uint32 work_id = 3 [json_name = "workId", (gnostic.openapi.v3.property) = {description: "工号"}];  // 工号
  optional uint32 org_id = 4 [json_name = "orgId", (gnostic.openapi.v3.property) = {description: "部门ID"}];  // 部门ID
  optional uint32 position_id = 5 [json_name = "positionId", (gnostic.openapi.v3.property) = {description: "岗位ID"}];  // 岗位ID
  optional uint32 tenant_id = 6 [json_name = "tenantId", (gnostic.openapi.v3.property) = {description: "租户ID"}];  // 租户ID

  optional uint32 create_by = 7 [json_name = "createBy", (gnostic.openapi.v3.property) = {description: "创建者ID"}]; // 创建者ID
  optional uint32 update_by = 8 [json_name = "updateBy", (gnostic.openapi.v3.property) = {description: "更新者ID"}]; // 更新者ID

  optional string user_name = 10 [
    json_name = "userName",
    (gnostic.openapi.v3.property) = {description: "登录名"}
  ]; // 登录名

  optional string nick_name = 11 [
    json_name = "nickName",
    (gnostic.openapi.v3.property) = {description: "昵称"}
  ]; // 昵称

  optional string real_name = 12 [
    json_name = "realName",
    (gnostic.openapi.v3.property) = {description: "真实姓名"}
  ]; // 真实姓名

  optional string avatar = 13 [
    json_name = "avatar",
    (gnostic.openapi.v3.property) = {description: "头像"}
  ]; // 头像

  optional string email = 14 [
    json_name = "email",
    (gnostic.openapi.v3.property) = {description: "邮箱"}
  ]; // 邮箱

  optional string mobile = 15 [
    json_name = "mobile",
    (gnostic.openapi.v3.property) = {description: "手机号"}
  ]; // 手机号

  optional string telephone = 16 [
    json_name = "telephone",
    (gnostic.openapi.v3.property) = {description: "座机号"}
  ]; // 手机号

  optional UserGender gender = 17 [
    json_name = "gender",
    (gnostic.openapi.v3.property) = {description: "性别"}
  ]; // 性别

  optional string address = 18 [
    json_name = "address",
    (gnostic.openapi.v3.property) = {description: "住址"}
  ]; // 住址

  optional string region = 19 [
    json_name = "region",
    (gnostic.openapi.v3.property) = {description: "国家地区"}
  ]; // 国家地区

  optional string description = 20 [
    json_name = "description",
    (gnostic.openapi.v3.property) = {description: "个人描述"}
  ]; // 个人描述

  optional string remark = 21 [
    json_name = "remark",
    (gnostic.openapi.v3.property) = {description: "备注名"}
  ]; // 备注名

  optional int64 last_login_time = 30 [
    json_name = "lastLoginTime",
    (gnostic.openapi.v3.property) = {description: "最后登录时间"}
  ]; // 最后登录时间

  optional string last_login_ip = 31 [
    json_name = "lastLoginIp",
    (gnostic.openapi.v3.property) = {description: "最后登录IP"}
  ]; // 最后登录IP

  optional UserStatus status = 32 [(gnostic.openapi.v3.property) = {
    description: "用户状态"
    default: {string: "ON"}
    enum: [{yaml: "ON"}, {yaml: "OFF"}]
  }]; // 用户状态

  optional UserAuthority authority = 33 [(gnostic.openapi.v3.property) = {
    description: "权限"
    default: {string: "CUSTOMER_USER"}
  }]; // 权限

  repeated string roles = 34 [(gnostic.openapi.v3.property) = {
    description: "角色码"
  }]; // 角色码

  optional google.protobuf.Timestamp create_time = 200 [json_name = "createTime", (gnostic.openapi.v3.property) = {description: "创建时间"}];// 创建时间
  optional google.protobuf.Timestamp update_time = 201 [json_name = "updateTime", (gnostic.openapi.v3.property) = {description: "更新时间"}];// 更新时间
  optional google.protobuf.Timestamp delete_time = 202 [json_name = "deleteTime", (gnostic.openapi.v3.property) = {description: "删除时间"}];// 删除时间
}

// 获取用户列表 - 答复
message ListUserResponse {
  repeated User items = 1;
  uint32 total = 2;
}

// 获取用户数据 - 请求
message GetUserRequest {
  uint32 id = 1;
}

// 创建用户 - 请求
message CreateUserRequest {
  optional uint32 operator_id = 1 [
    (gnostic.openapi.v3.property) = {description: "操作用户ID", read_only: true},
    json_name = "operatorId"
  ]; // 操作用户ID

  User data = 2;

  optional string password = 3 [
    (gnostic.openapi.v3.property) = {description: "用户登录密码", read_only: true},
    json_name = "password"
  ]; // 用户登录密码
}

// 更新用户 - 请求
message UpdateUserRequest {
  optional uint32 operator_id = 1 [
    json_name = "operatorId",
    (gnostic.openapi.v3.property) = {description: "操作用户ID", read_only: true}
  ]; // 操作用户ID

  User data = 2 [
    json_name = "data",
    (google.api.field_behavior) = REQUIRED,
    (gnostic.openapi.v3.property) = {description: "用户的数据"}
  ]; // 用户的数据

  optional string password = 3 [
    (gnostic.openapi.v3.property) = {description: "用户登录密码", read_only: true},
    json_name = "password"
  ]; // 用户登录密码

  google.protobuf.FieldMask update_mask = 4 [
    json_name = "updateMask",
    (gnostic.openapi.v3.property) = {
      description: "要更新的字段列表",
      example: {yaml : "id,realName,userName"}
    }
  ]; // 要更新的字段列表

  optional bool allow_missing = 5 [
    json_name = "allowMissing",
    (gnostic.openapi.v3.property) = {description: "如果设置为true的时候，资源不存在则会新增(插入)，并且在这种情况下`updateMask`字段将会被忽略。"}
  ]; // 如果设置为true的时候，资源不存在则会新增(插入)，并且在这种情况下`updateMask`字段将会被忽略。
}

// 删除用户 - 请求
message DeleteUserRequest {
  optional uint32 operator_id = 1 [
    (gnostic.openapi.v3.property) = {description: "操作用户ID", read_only: true},
    json_name = "operatorId"
  ]; // 操作用户ID

  uint32 id = 2;
}
```

## 4. 编写data包

```go
package data

type UserRepo struct {
	data *Data
	log  *log.Helper
}

func NewUserRepo(data *Data, logger log.Logger) *UserRepo {
	l := log.NewHelper(log.With(logger, "module", "user/repo/admin-service"))
	return &UserRepo{
		data: data,
		log:  l,
	}
}

func (r *UserRepo) convertUserAuthorityToEnt(authority *userV1.UserAuthority) *user.Authority {
	if authority == nil {
		return nil
	}
	find, ok := userV1.UserAuthority_name[int32(*authority)]
	if !ok {
		return nil
	}
	return (*user.Authority)(trans.Ptr(find))
}

func (r *UserRepo) convertUserAuthorityToProto(authority *user.Authority) *userV1.UserAuthority {
	if authority == nil {
		return nil
	}
	find, ok := userV1.UserAuthority_value[string(*authority)]
	if !ok {
		return nil
	}
	return (*userV1.UserAuthority)(trans.Ptr(find))
}

func (r *UserRepo) convertUserGenderToEnt(gender *userV1.UserGender) *user.Gender {
	if gender == nil {
		return nil
	}
	find, ok := userV1.UserGender_name[int32(*gender)]
	if !ok {
		return nil
	}
	return (*user.Gender)(trans.Ptr(find))
}

func (r *UserRepo) convertUserGenderToProto(gender *user.Gender) *userV1.UserGender {
	if gender == nil {
		return nil
	}
	find, ok := userV1.UserGender_value[string(*gender)]
	if !ok {
		return nil
	}
	return (*userV1.UserGender)(trans.Ptr(find))
}

func (r *UserRepo) convertUserStatusToEnt(status *userV1.UserStatus) *user.Status {
	if status == nil {
		return nil
	}
	find, ok := userV1.UserStatus_name[int32(*status)]
	if !ok {
		return nil
	}
	return (*user.Status)(trans.Ptr(find))
}

func (r *UserRepo) convertUserStatusToProto(status *user.Status) *userV1.UserStatus {
	if status == nil {
		return nil
	}
	find, ok := userV1.UserStatus_value[string(*status)]
	if !ok {
		return nil
	}
	return (*userV1.UserStatus)(trans.Ptr(find))
}

func (r *UserRepo) convertEntToProto(in *ent.User) *userV1.User {
	if in == nil {
		return nil
	}

	return &userV1.User{
		Id:            trans.Ptr(in.ID),
		RoleId:        in.RoleID,
		WorkId:        in.WorkID,
		OrgId:         in.OrgID,
		PositionId:    in.PositionID,
		TenantId:      in.TenantID,
		UserName:      in.Username,
		NickName:      in.NickName,
		RealName:      in.RealName,
		Email:         in.Email,
		Avatar:        in.Avatar,
		Telephone:     in.Telephone,
		Mobile:        in.Mobile,
		Address:       in.Address,
		Region:        in.Region,
		Description:   in.Description,
		Remark:        in.Remark,
		LastLoginTime: in.LastLoginTime,
		LastLoginIp:   in.LastLoginIP,
		CreateBy:      in.CreateBy,
		UpdateBy:      in.UpdateBy,
		Gender:        r.convertUserGenderToProto(in.Gender),
		Authority:     r.convertUserAuthorityToProto(in.Authority),
		Status:        r.convertUserStatusToProto(in.Status),
		CreateTime:    timeutil.TimeToTimestamppb(in.CreateTime),
		UpdateTime:    timeutil.TimeToTimestamppb(in.UpdateTime),
		DeleteTime:    timeutil.TimeToTimestamppb(in.DeleteTime),
	}
}

func (r *UserRepo) Count(ctx context.Context, whereCond []func(s *sql.Selector)) (int, error) {
	builder := r.data.db.Client().User.Query()
	if len(whereCond) != 0 {
		builder.Modify(whereCond...)
	}

	count, err := builder.Count(ctx)
	if err != nil {
		r.log.Errorf("query count failed: %s", err.Error())
	}

	return count, err
}

func (r *UserRepo) ListUser(ctx context.Context, req *pagination.PagingRequest) (*userV1.ListUserResponse, error) {
	builder := r.data.db.Client().User.Query()

	err, whereSelectors, querySelectors := entgo.BuildQuerySelector(
		req.GetQuery(), req.GetOrQuery(),
		req.GetPage(), req.GetPageSize(), req.GetNoPaging(),
		req.GetOrderBy(), user.FieldCreateTime,
		req.GetFieldMask().GetPaths(),
	)
	if err != nil {
		r.log.Errorf("解析条件发生错误[%s]", err.Error())
		return nil, err
	}

	if querySelectors != nil {
		builder.Modify(querySelectors...)
	}

	results, err := builder.All(ctx)
	if err != nil {
		r.log.Errorf("query list failed: %s", err.Error())
		return nil, err
	}

	items := make([]*userV1.User, 0, len(results))
	for _, res := range results {
		item := r.convertEntToProto(res)
		items = append(items, item)
	}

	count, err := r.Count(ctx, whereSelectors)
	if err != nil {
		return nil, err
	}

	return &userV1.ListUserResponse{
		Total: uint32(count),
		Items: items,
	}, nil
}

func (r *UserRepo) IsExist(ctx context.Context, id uint32) (bool, error) {
	return r.data.db.Client().User.Query().
		Where(user.IDEQ(id)).
		Exist(ctx)
}

func (r *UserRepo) GetUser(ctx context.Context, userId uint32) (*userV1.User, error) {
	ret, err := r.data.db.Client().User.Get(ctx, userId)
	if err != nil {
		r.log.Errorf("query one data failed: %s", err.Error())

		if ent.IsNotFound(err) {
			return nil, userV1.ErrorUserNotFound("user not found")
		}

		return nil, err
	}

	u := r.convertEntToProto(ret)

	return u, err
}

func (r *UserRepo) CreateUser(ctx context.Context, req *userV1.CreateUserRequest) error {
	if req.Data == nil {
		return errors.New("invalid request")
	}

	builder := r.data.db.Client().User.Create().
		SetNillableUsername(req.Data.UserName).
		SetNillableNickName(req.Data.NickName).
		SetNillableEmail(req.Data.Email).
		SetNillableRealName(req.Data.RealName).
		SetNillableEmail(req.Data.Email).
		SetNillableTelephone(req.Data.Telephone).
		SetNillableMobile(req.Data.Mobile).
		SetNillableAvatar(req.Data.Avatar).
		SetNillableRegion(req.Data.Region).
		SetNillableAddress(req.Data.Address).
		SetNillableDescription(req.Data.Description).
		SetNillableRemark(req.Data.Remark).
		SetNillableLastLoginTime(req.Data.LastLoginTime).
		SetNillableLastLoginIP(req.Data.LastLoginIp).
		SetNillableStatus(r.convertUserStatusToEnt(req.Data.Status)).
		SetNillableGender(r.convertUserGenderToEnt(req.Data.Gender)).
		SetNillableAuthority(r.convertUserAuthorityToEnt(req.Data.Authority)).
		SetNillableOrgID(req.Data.OrgId).
		SetNillableRoleID(req.Data.RoleId).
		SetNillableWorkID(req.Data.WorkId).
		SetNillablePositionID(req.Data.PositionId).
		SetNillableTenantID(req.Data.TenantId).
		SetNillableCreateBy(req.OperatorId).
		SetNillableCreateTime(timeutil.TimestamppbToTime(req.Data.CreateTime))

	if len(req.GetPassword()) > 0 {
		cryptoPassword, err := crypto.HashPassword(req.GetPassword())
		if err == nil {
			builder.SetPassword(cryptoPassword)
		}
	}

	if req.Data.CreateTime == nil {
		builder.SetCreateTime(time.Now())
	}

	err := builder.Exec(ctx)
	if err != nil {
		r.log.Errorf("insert one data failed: %s", err.Error())
		return err
	}

	return nil
}

func (r *UserRepo) UpdateUser(ctx context.Context, req *userV1.UpdateUserRequest) error {
	if req.Data == nil {
		return errors.New("invalid request")
	}

	// 如果不存在则创建
	if req.GetAllowMissing() {
		exist, err := r.IsExist(ctx, req.GetData().GetId())
		if err != nil {
			return err
		}
		if !exist {
			return r.CreateUser(ctx, &userV1.CreateUserRequest{Data: req.Data, OperatorId: req.OperatorId})
		}
	}

	if req.UpdateMask != nil {
		req.UpdateMask.Normalize()
		if !req.UpdateMask.IsValid(req.Data) {
			return errors.New("invalid field mask")
		}
		fieldmaskutil.Filter(req.GetData(), req.UpdateMask.GetPaths())
	}

	builder := r.data.db.Client().User.
		UpdateOneID(req.Data.GetId()).
		SetNillableNickName(req.Data.NickName).
		SetNillableEmail(req.Data.Email).
		SetNillableRealName(req.Data.RealName).
		SetNillableEmail(req.Data.Email).
		SetNillableTelephone(req.Data.Telephone).
		SetNillableMobile(req.Data.Mobile).
		SetNillableAvatar(req.Data.Avatar).
		SetNillableRegion(req.Data.Region).
		SetNillableAddress(req.Data.Address).
		SetNillableDescription(req.Data.Description).
		SetNillableRemark(req.Data.Remark).
		SetNillableLastLoginTime(req.Data.LastLoginTime).
		SetNillableLastLoginIP(req.Data.LastLoginIp).
		SetNillableStatus(r.convertUserStatusToEnt(req.Data.Status)).
		SetNillableGender(r.convertUserGenderToEnt(req.Data.Gender)).
		SetNillableAuthority(r.convertUserAuthorityToEnt(req.Data.Authority)).
		SetNillableOrgID(req.Data.OrgId).
		SetNillableRoleID(req.Data.RoleId).
		SetNillableWorkID(req.Data.WorkId).
		SetNillablePositionID(req.Data.PositionId).
		SetNillableTenantID(req.Data.TenantId).
		SetNillableUpdateBy(req.OperatorId).
		SetNillableUpdateTime(timeutil.TimestamppbToTime(req.Data.UpdateTime))

	if req.Data.UpdateTime == nil {
		builder.SetUpdateTime(time.Now())
	}

	if len(req.GetPassword()) > 0 {
		cryptoPassword, err := crypto.HashPassword(req.GetPassword())
		if err == nil {
			builder.SetPassword(cryptoPassword)
		}
	}

	if req.UpdateMask != nil {
		nilPaths := fieldmaskutil.NilValuePaths(req.Data, req.GetUpdateMask().GetPaths())
		nilUpdater := entgoUpdate.BuildSetNullUpdater(nilPaths)
		if nilUpdater != nil {
			builder.Modify(nilUpdater)
		}
	}

	err := builder.Exec(ctx)
	if err != nil {
		r.log.Errorf("update one data failed: %s", err.Error())
		return err
	}

	return nil
}

func (r *UserRepo) DeleteUser(ctx context.Context, userId uint32) (bool, error) {
	err := r.data.db.Client().User.
		DeleteOneID(userId).
		Exec(ctx)
	if err != nil {
		r.log.Errorf("delete one data failed: %s", err.Error())
	}

	return err == nil, err
}

func (r *UserRepo) GetUserByUserName(ctx context.Context, userName string) (*userV1.User, error) {
	ret, err := r.data.db.Client().User.Query().
		Where(user.UsernameEQ(userName)).
		Only(ctx)
	if err != nil {
		r.log.Errorf("query user data failed: %s", err.Error())

		if ent.IsNotFound(err) {
			return nil, userV1.ErrorUserNotFound("user not found")
		}

		return nil, err
	}

	u := r.convertEntToProto(ret)
	return u, err
}

func (r *UserRepo) VerifyPassword(ctx context.Context, req *userV1.VerifyPasswordRequest) (*userV1.VerifyPasswordResponse, error) {
	ret, err := r.data.db.Client().User.
		Query().
		Select(user.FieldID, user.FieldPassword).
		Where(user.UsernameEQ(req.GetUserName())).
		Only(ctx)
	if err != nil {
		return &userV1.VerifyPasswordResponse{
			Result: userV1.VerifyPasswordResult_ACCOUNT_NOT_EXISTS,
		}, userV1.ErrorUserNotFound("用户未找到")
	}

	// 解密密码
	bytesPass, err := base64.StdEncoding.DecodeString(req.GetPassword())
	plainPassword, _ := crypto.AesDecrypt(bytesPass, crypto.DefaultAESKey, nil)

	// 校验密码
	bMatched := crypto.VerifyPassword(string(plainPassword), *ret.Password)

	if !bMatched {
		return &userV1.VerifyPasswordResponse{
			Result: userV1.VerifyPasswordResult_WRONG_PASSWORD,
		}, userV1.ErrorIncorrectPassword("密码错误")
	}

	return &userV1.VerifyPasswordResponse{
		Result: userV1.VerifyPasswordResult_SUCCESS,
	}, nil
}

func (r *UserRepo) UserExists(ctx context.Context, req *userV1.UserExistsRequest) (*userV1.UserExistsResponse, error) {
	count, _ := r.data.db.Client().User.
		Query().
		Select(user.FieldID).
		Where(user.UsernameEQ(req.GetUserName())).
		Count(ctx)
	return &userV1.UserExistsResponse{
		Exist: count > 0,
	}, nil
}
```

## 5. 编写service包

```go
package service

import (
	...

	adminV1 "kratos-admin/api/gen/go/admin/service/v1"
	userV1 "kratos-admin/api/gen/go/user/service/v1"
)

type UserService struct {
	adminV1.UserServiceHTTPServer

	log *log.Helper

	userRepo *data.UserRepo
	roleRepo *data.RoleRepo
}

func NewUserService(
	logger log.Logger,
	userRepo *data.UserRepo,
	roleRepo *data.RoleRepo,
) *UserService {
	l := log.NewHelper(log.With(logger, "module", "user/service/admin-service"))
	return &UserService{
		log:      l,
		userRepo: userRepo,
		roleRepo: roleRepo,
	}
}

func (s *UserService) ListUser(ctx context.Context, req *pagination.PagingRequest) (*userV1.ListUserResponse, error) {
	return s.userRepo.ListUser(ctx, req)
}

func (s *UserService) GetUser(ctx context.Context, req *userV1.GetUserRequest) (*userV1.User, error) {
	user, err := s.userRepo.GetUser(ctx, req.GetId())
	if err != nil {
		return nil, err
	}

	role, err := s.roleRepo.GetRole(ctx, user.GetRoleId())
	if err == nil && role != nil {
		user.Roles = append(user.Roles, role.GetCode())
	}

	return user, nil
}

func (s *UserService) CreateUser(ctx context.Context, req *userV1.CreateUserRequest) (*emptypb.Empty, error) {
	if req.Data == nil {
		return nil, adminV1.ErrorBadRequest("错误的参数")
	}

	if req.Data.Authority == nil {
		req.Data.Authority = userV1.UserAuthority_CUSTOMER_USER.Enum()
	}

	// 获取操作者的用户信息
	operator, err := s.userRepo.GetUser(ctx, req.GetOperatorId())
	if err != nil {
		return nil, err
	}

	// 校验操作者的权限
	if operator.GetAuthority() != userV1.UserAuthority_SYS_ADMIN && operator.GetAuthority() != userV1.UserAuthority_SYS_MANAGER {
		return nil, adminV1.ErrorAccessForbidden("权限不够")
	}

	if req.Data.Authority != nil {
		if operator.GetAuthority() >= req.Data.GetAuthority() {
			return nil, adminV1.ErrorAccessForbidden("不能够创建同级用户或者比自己权限高的用户")
		}
	}

	// 创建用户
	err = s.userRepo.CreateUser(ctx, req)

	return &emptypb.Empty{}, nil
}

func (s *UserService) UpdateUser(ctx context.Context, req *userV1.UpdateUserRequest) (*emptypb.Empty, error) {
	if req.Data == nil {
		return nil, adminV1.ErrorBadRequest("错误的参数")
	}

	// 获取操作者的用户信息
	operator, err := s.userRepo.GetUser(ctx, req.GetOperatorId())
	if err != nil {
		return nil, err
	}

	// 校验操作者的权限
	if operator.GetAuthority() != userV1.UserAuthority_SYS_ADMIN && operator.GetAuthority() != userV1.UserAuthority_SYS_MANAGER {
		return nil, adminV1.ErrorAccessForbidden("权限不够")
	}

	if req.Data.Authority != nil {
		if operator.GetAuthority() >= req.Data.GetAuthority() {
			return nil, adminV1.ErrorAccessForbidden("不能够赋权同级用户或者比自己权限高的用户")
		}
	}

	// 更新用户
	err = s.userRepo.UpdateUser(ctx, req)

	return &emptypb.Empty{}, nil
}

func (s *UserService) DeleteUser(ctx context.Context, req *userV1.DeleteUserRequest) (*emptypb.Empty, error) {
	// 获取操作者的用户信息
	operator, err := s.userRepo.GetUser(ctx, req.GetOperatorId())
	if err != nil {
		return nil, err
	}

	// 校验操作者的权限
	if operator.GetAuthority() != userV1.UserAuthority_SYS_ADMIN && operator.GetAuthority() != userV1.UserAuthority_SYS_MANAGER {
		return nil, adminV1.ErrorAccessForbidden("权限不够")
	}

	// 获取将被删除的用户信息
	user, err := s.userRepo.GetUser(ctx, req.GetId())
	if err != nil {
		return nil, err
	}

	// 不能删除超级管理员
	if user.GetAuthority() == userV1.UserAuthority_SYS_ADMIN {
		return nil, adminV1.ErrorAccessForbidden("闹哪样？不能删除超级管理员！")
	}

	if operator.GetAuthority() == user.GetAuthority() {
		return nil, adminV1.ErrorAccessForbidden("不能删除同级用户！")
	}

	// 删除用户
	_, err = s.userRepo.DeleteUser(ctx, req.GetId())

	return &emptypb.Empty{}, err
}
```

## 6. 注册进Server

在server包里面，如果是注册进REST服务器则：

```go
package server

import (
	...

	adminV1 "kratos-admin/api/gen/go/admin/service/v1"
)

// NewRESTServer new an HTTP server.
func NewRESTServer(
    cfg *conf.Bootstrap, logger log.Logger,
	userSvc *service.UserService,
) *http.Server {
    srv := rpc.CreateRestServer(cfg)

    adminV1.RegisterUserServiceHTTPServer(srv, userSvc)

    return srv
}
```

注册进gRPC服务器则：

```go
package server

import (
	...

	userV1 "kratos-admin/api/gen/go/user/service/v1"
)

// NewGRPCServer new a gRPC server.
func NewGRPCServer(
    cfg *conf.Bootstrap, logger log.Logger,
	userSvc *service.UserService,
) *grpc.Server {
	srv := rpc.CreateGrpcServer(cfg, logging.Server(logger))

	userV1.RegisterUserServiceServer(srv, userSvc)

	return srv
}
```

## 项目代码

* [kratos-admin Gitee](https://gitee.com/tx7do/go-kratos-admin)
* [kratos-admin Github](https://github.com/tx7do/go-kratos-admin)

## 参考资料

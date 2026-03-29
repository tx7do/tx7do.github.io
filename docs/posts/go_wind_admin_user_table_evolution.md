---
date: 2020-01-01
category:
  - GoWind风行
tag:
  - Golang
  - Go-Kratos
  - GoWind
sticky: 10
---

# GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：用户表从简单到租户的演进

先解决有没有，再解决好不好

## 极简User

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    authority VARCHAR(50),
    password VARCHAR(255)
);
```

密码和权限都简单处理，一股脑全部都放在`users`表中。

## 分离出UserCredential表

如果只是密码登录，按照之前的设计倒是够用，可是现在需要支持微信、飞书登录，这时候就不够用了。

## 增加Role表

```sql
CREATE TABLE roles (
  code VARCHAR(50) PRIMARY KEY,
  display_name VARCHAR(100),
  description TEXT,
);
```

## 增加Organization、Department表

```sql
```

## 增加Tenant表

```sql
```

## 分离Membership、OrgUnit表

```sql
CREATE TABLE memberships (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  tenant_id BIGINT NOT NULL DEFAULT 0,
  status TINYINT NOT NULL DEFAULT 1,
);
```

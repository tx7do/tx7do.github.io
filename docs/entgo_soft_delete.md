# Entgo 实现 软删除（Soft Delete）

我们在开发程序的过程中，会遇到一个常见的需求——删除表中的数据。

但是有时候，业务需求要求不能永久删除数据库中的数据。比如一些敏感信息，我们需要留着以方便做历史追踪。
这个时候，我们便会用到软删除。

Entgo本身是不直接支持的，但是，要实现也并不是很难的事情。

## 什么是软删除？

**软删除（Soft Delete）** 是相对于 **硬删除（Hard Delete）** 来说的，它又可以叫做 **逻辑删除** 或者 **标记删除**。

这种删除方式并不是真正地从数据库中把记录删除，而是通过特定的标记方式在查询的时候将此记录过滤掉。虽然数据在界面上已经看不见，但是数据库还是存在的。

## 如何实现软删除？

1. 布尔类型字段标识
2. 时间戳字段标识
3. 将软删除的数据插入到另一个表中
4. 布尔类型字段、时间戳字段混合标识

### 1. 布尔类型字段标识

添加一个字段名为：`is_deleted`、`is_active`、`is_archived`等的布尔类型的字段，以此来标识该行是否已经删除。

### 2. 时间戳字段标识

添加一个字段名为：`deleted_at`、`delete_time`等的时间戳字段，null表示未删除，非null则表示已经删除，同时还能获取到删除的时间。

### 3. 将软删除的数据插入到另一个表中

举个例子，`order`表会有一个相应的`order_deleted`表，在删除`order`表中的数据，将数据复制到`order_deleted`表中。

### 4. 布尔类型字段、时间戳字段混合标识

使用时间戳的方式去标识，虽然可以在标识同时也可以获取到删除时间，但是在查询的时候，null值会导致查询全表扫描，导致查询的性能大打折扣。

混合布尔类型和时间戳类型的字段来进行删除标识，虽然会多占用一点存储，但是可以带来更好的费效比。

## 软删除使用场景

我在网上搜索到了 [Abel Avram](https://www.infoq.com/news/2009/09/Do-Not-Delete-Data/) 和 [Udi Dahan](https://udidahan.com/2009/09/01/dont-delete-just-dont/) 两个大佬关于要不要软删除的争论。存在的，就是有理的。软删除有其好处，也有其弊端。所以，不能够滥用，也不能完全否认它存在的意义。

在数据库的领域里面，删除只有 Delete 的概念。但是，在业务的领域里面，删除其实是有很多现实意义的概念：员工的解雇、公民的故去、订单的取消、产品的停售……

假设市场部要从商品目录中删除一样商品，那是不是说所有包含了该商品的旧订单都要一并消失？再级联下去，这些订单对应的所有发票也要删除吗？就这么一步步删下去，是不是公司的损益报表也要重做了？

软删除，它就是后悔药，可以在历史追踪，审计等场景下发挥大作用。

但是，必须要面对的是，留存大量的冗余数据，对于数据库的性能必然是不利的。

## Entgo中实现软删除（Soft Deletes）

在Ent中实现软删除有两种方式：

1. 在实体声明中创建某种删除标志（不通用）；
2. 创建某种灵活的 Mixin，它可以拦截查询并修补它们以添加自定义逻辑。

### 在实体声明中创建某种删除标志

在表里面添加字段：

```go
package schema

func (User) Fields() []ent.Field {
    return []ent.Field{
        ...
        field.Time("deleted_at").Optional(),
        ...
    }
}
```

查询

```go
    users, err := client.User.
        Query().
        Where(user.DeletedAt).
        All(ctx)
```

删除

```go
    _, err := client.User.
        UpdateOneID(id).
        SetDeletedAt(time.Now())
        Save(ctx)
```

这种方式比较简单直观，但是，不够通用。

### 创建某种灵活的 Mixin

Mixin是Ent一个很重要也很有用的特性。我们可以把一些通用的字段提炼出来形成一个mixin包，这样这个mixin包里边的字段就可以复用了。

例如，我们创建一个`SoftDelete`的mixin：

```go
package mixin

type SoftDelete struct{}

func (SoftDelete) Fields() []ent.Field {
    return field.Time("deleted_at").Optional()
}
```

然后，我们再向构建器添加`Delete`和`Query`拦截器的查询构建器。

```go
func (SoftDelete) Delete() ent.Builder { 
    // here we return Update statement, that is extends delete with all the WHERE condtions, but providing a SET instruction to update single field
    return builder.Update().SetDeletedAt(time.Now())
}

func (SoftDelete) Query() ent.Builder {
    // here we return patched Query, that just add a ... deleted_at IS NULL
    return builder.Query().Where(
        softdelete.DeletedAt
    )
}
```

之前的删除操作是这样的：

```sql
DELETE FROM pets WHERE id = 1
```

现在将会变成这样：

```sql
UPDATE pets SET deleted_at = ? WHERE id = ?
```

之前的查询操作是这样的：

```sql
SELECT * FROM pets WHERE name = ? AND age = ?
```

现在将会变成这样：

```sql
SELECT * FROM pets WHERE (name = ? AND age = ?) AND deleted_at IS NULL
```

用这种方式会很通用，很方便。但是，会比较复杂，也不够直观。

## 参考资料

1. [Feature Request: Soft Deletes](https://github.com/ent/ent/issues/252)
2. [数据的软删除—什么时候需要？又如何去实现？](https://juejin.cn/post/7077365676444221477)
3. [Don’t Delete – Just Don’t](https://udidahan.com/2009/09/01/dont-delete-just-dont/)
4. [Deleting Data Is Not a Recommended Practice](https://www.infoq.com/news/2009/09/Do-Not-Delete-Data/)

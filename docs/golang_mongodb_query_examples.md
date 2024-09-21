# 如何使用 Golang 查询 MongoDB

## 如何使用 Golang 连接 MongoDB

连接 MongoDB 非常简单，只需连接 MongoDB 生成的 uri。

然后我们可以使用 [client.Database()](https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo#Client.Database) 函数来确保我们连接到正确的数据库。

```go
package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	db := client.Database("testdb")

	// disconnect the mongo client when main is completed
	defer func() {
		if err = client.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
}
```

我们可以使用`Ping`方法来真正确保我们连接到正确的数据库。

```go
ctx, cancel = context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()

err = client.Ping(ctx, readpref.Primary())
```

## 使用 Golang 向 MongoDB 插入文档

要将文档插入 MongoDB，我们可以使用MongoDB 提供的 [bson.D](https://pkg.go.dev/go.mongodb.org/mongo-driver/bson#D)。但为了使操作更简单、更贴近实际应用，我们将使用`bson`注解标注`struct`。

我们使用的模型是：

```go
type Car struct {
	Id    primitive.ObjectID `bson:"_id"`
	Brand string             `bson:"brand"`
	Model string             `bson:"model"`
	Year  int                `bson:"year"`
}
```

然后我们可以简单地使用 [InsertOne()](https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo#Collection.InsertOne)方法 将文档插入 MongoDB。

```go
package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Car struct {
	Id        primitive.ObjectID `bson:"_id"`
    CreatedAt time.Time          `bson:"createdAt"`
	Brand     string             `bson:"brand"`
	Model     string             `bson:"model"`
	Year      int                `bson:"year"`
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	db := client.Database("testdb")

	exampleData := Car{
		Id:    primitive.NewObjectID(),
        CreatedAt: time.Now().UTC(),
		Brand: "Mercedes",
		Model: "G-360",
		Year:  2002,
	}

	res, err := db.Collection("cars").InsertOne(context.Background(), exampleData)
	if err != nil {
		log.Fatal(err)
	}

	// inserted id is ObjectID("639b62ae2518fbd9315e405d")
	log.Printf("inserted id is %v", res.InsertedID)
}
```

## 使用 Golang 向 MongoDB 写入多个文档

我们可以使用 [Collection](https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo#Collection)对象 的 [InsertMany()](https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo#Collection.InsertMany)方法。但是，`InsertMany()`方法需要传入`[]interface{}`参数。

```go
package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Car struct {
	Id        primitive.ObjectID `bson:"_id"`
    CreatedAt time.Time          `bson:"createdAt"`
	Brand     string             `bson:"brand"`
	Model     string             `bson:"model"`
	Year      int                `bson:"year"`
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	db := client.Database("testdb")

	var data []interface{}
	data = append(data, Car{
		Id:    primitive.NewObjectID(),
        CreatedAt: time.Now().UTC(),
		Brand: "Toyota",
		Model: "Corolla",
		Year:  2008,
	})
	data = append(data, Car{
		Id:    primitive.NewObjectID(),
        CreatedAt: time.Now().UTC(),
		Brand: "Ford",
		Model: "Focus",
		Year:  2021,
	})

	res, err := db.Collection("cars").InsertMany(context.Background(), data)
	if err != nil {
		log.Fatal(err)
	}

	// 2 documents inserted
	log.Printf("%v documents inserted", len(res.InsertedIDs))
}
```

## 使用 Golang 从 MongoDB 中查找单个文档

要查找符合条件的单个文档，我们可以使用`*Collection`对象的 [FindOne()](https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo#Collection.FindOne)方法。

```go
package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Car struct {
	Id        primitive.ObjectID `bson:"_id"`
    CreatedAt time.Time          `bson:"createdAt"`
	Brand     string             `bson:"brand"`
	Model     string             `bson:"model"`
	Year      int                `bson:"year"`
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	db := client.Database("testdb")

    condition := bson.M{}
    cur, err := db.Collection("cars").FindOne(context.Background(), condition)
	if err != nil {
		log.Fatal(err)
	}

	var data []Car
	if err := cur.All(context.Background(), &data); err != nil {
		log.Fatal(err)
	}

	// now we can use the data array, which contains all of the documents
	for _, car := range data {
		log.Printf("the brand is %v\n", car.Brand)
	}
}
```

### 获取最后创建的文档

我们还可以将 [mongo.Options](https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo/options#FindOneOptions) 传递给 `Find()`方法。

假设我们想要获取最后插入的文档。

- 我们需要按`createdAt`字段排序
- 它应该是降序的，这就是我们将排序值设为`-1`的原因。

## 使用 Golang 从 MongoDB 中查找所有文档

要查找集合中的所有文档，我们可以使用`*Collection`对象的[Find()](https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo#Collection.Find)方法。

在下面的示例中，我们没有指定任何条件，这意味着返回数据库中的所有文档。

```go
package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Car struct {
	Id        primitive.ObjectID `bson:"_id"`
    CreatedAt time.Time          `bson:"createdAt"`
	Brand     string             `bson:"brand"`
	Model     string             `bson:"model"`
	Year      int                `bson:"year"`
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	db := client.Database("testdb")

    condition := bson.M{}
    cur, err := db.Collection("cars").Find(context.Background(), condition)
	if err != nil {
		log.Fatal(err)
	}

	var data []Car
	if err := cur.All(context.Background(), &data); err != nil {
		log.Fatal(err)
	}

	// now we can use the data array, which contains all of the documents
	for _, car := range data {
		log.Printf("the brand is %v\n", car.Brand)
	}
}
```

### 查找符合条件的多个文档

如果我们想返回`brand`为`Toyota`，那么我们可以将`condition`变量更改为

```go
condition := bson.M{
    "brand": "Toyota"
}
```

### 在查找操作中使用Projection

如果要在`Find()`方法中使用`Projection`，我们可以使用`mongo.Options`参数。

假设我们想返回 2 个字段

1. 返回汽车的品牌`brand`；
2. 返回一个布尔字段`isNew`来检查汽车是否是新的（1. 如果汽车的生产年份是 2022 年，那么它是新的； 2. 否则，它就旧了。）。

使用[SetProjection()](https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo/options#FindOptions.SetProjection)方法来设置`Projection`字段的值：

```go
var opts = options.Find().SetProjection(
		bson.M{
			"brand": 1,
			"isNew": bson.M{
				"$cond": bson.M{
					"if": bson.M{"$gte": bson.A{"$year", 2022}}, 
					"then": true, 
					"else": false},
			},
		})
cur, err := db.Collection("cars").Find(context.Background(), bson.M{}, opts)
```

## 使用 Golang 更新 MongoDB 中的单个文档

要更新单个文档，我们应该使用`FindOneAndUpdate()`或`UpdateOne()`操作。在本文中，我们将使用`FindOneAndUpdate()`方法来进行操作。

```go
package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	db := client.Database("testdb")

	filter := bson.M{
		"brand": "Toyota",
		"model": "Corolla",
	}

	update := bson.M{
		"year": 2022,
	}

	res := db.Collection("cars").FindOneAndUpdate(context.Background(), filter, update)

	if res.Err() != nil {
		log.Fatal(err)
	}

	// operation successful
}
```

### 如何在 MongoDB 中返回更新的文档？

我们可以使用`mongo.Options`包来实现这一点。我们应该将返回文档的选项`SetReturnDocument`设置为`after`。

```go
opts := options.FindOneAndUpdate().SetReturnDocument(options.After)

res := db.Collection("cars").FindOneAndUpdate(context.Background(), filter, update, opts)

// we can use the updated car document
var updatedData Car

if err := res.Decode(&updatedData); err != nil {
	log.Fatal(err)
}
```

## 使用 Golang 从 MongoDB 中删除文档

要删除文档，我们可以使用`*Collection`对象的`DeleteOne()`方法。

要删除多个文档，我们可以使用`*Collection`对象的`DeleteMany()`方法。

```go
package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	db := client.Database("testdb")

	filter := bson.M{
		"brand": "Toyota",
		"model": "Corolla",
	}

	// for single document
	res, err := db.Collection("cars").DeleteMany(context.Background(), filter)

	if err != nil {
		log.Fatal(err)
	}

	// 1 document is deleted.
	log.Printf("%v document is deleted", res.DeletedCount)
}
```

## 原文地址

[MongoDB & Golang Query Examples - Cheat Sheet](https://ocakhasan.github.io/golang-mongodb-query-examples/)

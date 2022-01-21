# golang的接口和继承

***

## 前言

golang是一门google设计的类C语言,它是用于替代Python的语言.
它更C,更面向过程,而并不C++,并不那么面向对象.
但是,我还是想实现类似于C++中的接口,事实上,它是能够做到的,虽然写法比较C.

## 单一继承
单一继承简单来说就是只有一个父类,具体实现起来我又做了两种实验:
1. 仅有接口
2. 具有基类
  
### 1. 仅有接口
在C++里面伪代码实现为:
```cpp
typedef struct interface;
interface IFruit {
    virtual string GetName() const = 0;
	virtual void SetName(string name) = 0;

	virtual Type GetType() const = 0;
};

class Apple : public IFruit {
public:
    virtual string GetName() const {}
	virtual void SetName(string name) {}

	virtual Type GetType() const {}
};
```

在golang里面的实现大概是这样的:

我们先定义一个接口:
```go
type Fruit interface {
	GetName() string
	SetName(name string)

	GetType() Type
}
```

我们有一根香蕉:
```go
type Banana struct {
	name   string
	energy float32
}

func NewBanana(name string) *Banana {
	c := &Banana{}
	c.name = name
	c.energy = 0
	return c
}

func (c *Banana) GetName() string {
	return c.name
}

func (c *Banana) SetName(name string) {
	c.name = name
}

func (c *Banana) GetType() Type {
	return BananaType
}

func (c *Banana) SetEnergy(energy float32) {
	c.energy = energy
}

func (c *Banana) GetEnergy() float32 {
	return c.energy
}
```

我们这里有一个NewBanana用于创建新的香蕉,而这个方法可以有两种用法:
1. 赋值给接口
```go
var fruitBanana Fruit
fruitBanana = NewBanana("big")
```
2. 赋值给自己
```go
banana := NewBanana("little")
```

还可以用基类提供的工厂方法NewFruit来创造水果:
```go
apple := NewFruit(AppleType, "big")
banana := NewFruit(BananaType, "big")
```

### 具有基类
在C++里面伪代码实现为:
```cpp
typedef struct interface;

interface IVehicle {
    virtual string GetName() const = 0;
	virtual void SetName(string name) = 0;

	virtual Type GetType() const = 0;

    virtual void SetWheelCount(wheelCount int) = 0;
	virtual int GetWheelCount() const = 0;

	virtual string ToString() const = 0;
};

class VehicleBase: public IVehicle {
    virtual string ToString() const {}
};

class Apple : public VehicleBase {
public:
    virtual string GetName() const {}
	virtual void SetName(string name) {}

	virtual Type GetType() const {}

    virtual void SetWheelCount(wheelCount int) {}
	virtual int GetWheelCount() const {}

	virtual string ToString() const {}
};
```

在golang里面的实现大概是这样的:

我们先定义一个接口:
```go
type Vehicle interface {
	GetType() Type

	GetName() string
	SetName(name string)

	SetWheelCount(wheelCount int)
	GetWheelCount() int

	ToString() string
}
```
再来一个基类:
```go
type vehicleImpl struct {
	wheelCount int
}

func (c *vehicleImpl) SetWheelCount(wheelCount int) {
	c.wheelCount = wheelCount
}

func (c *vehicleImpl) GetWheelCount() int {
	return c.wheelCount
}

func (c *vehicleImpl) ToString() string {
	return "vehicle -> "
}
```
那么接着咱来俩公交车:
```go
type Bus struct {
	vehicleImpl
	name string
}
```
对的,它组合了基类```vehicleImpl```.

在这里**公交车**把**基类**的```ToString()```给覆盖了,但是我们可以这样调用```c.vehicleImpl.ToString()```:
```go
func (c *Bus) ToString() string {
	str := fmt.Sprintf("Bus -> %s", c.GetName())
	return c.vehicleImpl.ToString() + str
}
```


## 多重继承
多重继承就是具有多个父类.

在C++里面伪代码实现为:
```cpp
class Father {
    virtual string GetName() const {}
    virtual string Say() const {}
};

class Mother {
    virtual string GetName() const {}
    virtual string Say() const {}
};

class Child : public Father, public Mother {
    virtual string GetName() const {}
    virtual string Say() const {
        Father::GetName();
        Mother::GetName();
    }
};
```

我们先整一个爸爸:
```go
type Father struct {
}

func NewFather() Father {
	c := Father{}
	return c
}

func (c *Father) GetName() string {
	return "Tony"
}

func (c *Father) Say() string {
	return "I am " + c.GetName()
}
```

我们先整一个妈妈:
```go
type Mother struct {
}

func NewMother() Mother {
	c := Mother{}
	return c
}

func (c *Mother) GetName() string {
	return "Aurora"
}

func (c *Mother) Say() string {
	return "I am " + c.GetName()
}
```

我们先整一个爸爸妈妈的继承者:
```go
type Child struct {
	*Mother
	Father
}

func NewChild() Child {
	c := Child{}
	return c
}

func (c *Child) GetName() string {
	return "Jerry"
}

func (c *Child) Say() string {
	return "I am " + c.GetName() + ", My Father is " + c.Father.Say() + ", My Mother is " + c.Mother.Say() + "."
}
```
其实也没啥,关键就是在于匿名成员```*Mother```和```Father```.
在这里,继承方式有两种:
1. 非指针继承
>1. 在派生类没有改写基类的成员方法时，相应的成员方法被继承。
>2. 派生类可以直接调用基类的成员方法，譬如基类有个成员方法为Base.Func()，那么Derived.Func()等同于Derived.Base.Func()
>3. 倘若派生类的成员方法名与基类的成员方法名相同，那么基类方法将被覆盖或叫隐藏，譬如基类和派生类都有成员方法Func()，那么Derived.Func()将只能调用派生类的Func()方法，如果要调用基类版本，可以通过Derived.Base.Func()来调用。

2. 指针方式组合
>1. 基类采用指针方式的组合，依然具有派生的效果，只是派生类创建实例的时候需要外部提供一个基类实例的指针。
>2. 其他规则与非指针方式组合一致。


## 本文代码
代码仓库: <https://github.com/tx7do/go-inheritance-example>
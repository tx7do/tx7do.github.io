# 关于C++嵌入Python并且引用protobuf引起的一个SIGSEGV错误

首先，我的应用场景是这样的，我是一个C++为宿主的程序，内嵌了Python，我C++里边有引用C++版的protobuf动态链接库。Python里边也有用到Python版的Protobuf。两者都用了同一版本的protobuf: 3.13.0。

因为我是插件式的系统，我单独测试Python脚本系统插件的时候，一切都是完美的。然后，我将插件集成到主程序里边去，就完犊子了。只要我在Python中import到protobuf的协议，主程序就会以SIGSEGV信号崩掉。

最终堆栈挂在了`_message.cpython-35m-x86_64-linux-gnu.so`的`google::protobuf::DescriptorPool::FindFileByName()`这里：

```
I0731 15:34:01.122179 19043 layer_factory.hpp:77] Creating layer loss
*** Aborted at 1501508041 (unix time) try "date -d @1501508041" if you are using GNU date ***
PC: @ 0x7f0b345a4b73 std::_Hashtable<>::clear()
*** SIGSEGV (@0x9) received by PID 19043 (TID 0x7f0b6b021ac0) from PID 9; stack trace: ***
@ 0x7f0b682674b0 (unknown)
@ 0x7f0b345a4b73 std::_Hashtable<>::clear()
@ 0x7f0b34595ca6 google::protobuf::DescriptorPool::FindFileByName()
@ 0x7f0b34572dc8 google::protobuf::python::cdescriptor_pool::AddSerializedFile()
@ 0x7f0b688d17d0 PyEval_EvalFrameEx
@ 0x7f0b689fa01c PyEval_EvalCodeEx
```

我是百思不得其解，我一开始只怀疑是我自己的问题，一直找啊，找啊……都没有找到原因。后来，又看了看堆栈，觉得可能问题不在我这边。仔细想了下：会不会是C++里边的protobuf同python的protobuf产生冲突了？

这个错误有两个关键点：

1. Python当中import了protobuf的协议；
2. C++当中引用了C++版protobuf的动态链接库。

我后来把python当中的protobuf升级到了最新的版本4.21.11：

```
Name: protobuf
Version: 4.21.11
Summary:
Home-page: https://developers.google.com/protocol-buffers/
Author: protobuf@googlegroups.com
Author-email: protobuf@googlegroups.com
License: 3-Clause BSD License
Location: /usr/local/lib/python3.8/dist-packages
Requires:
Required-by:
```

然后，下载了相对应版本的protoc v3.21.11（需要注意的是：在python中的protobuf包从protobuf v21开始都标识为v4.x.x了），重新生成了Python的protobuf协议，再重新运行程序，得！好了。这似乎证明了我的猜想是正确的。

但是，我不确定究竟是怎样解决的：

1. C++和Python的protobuf版本不一致可以解决（那么就有可能是寻址冲突了）；
2. C++和Python的protobuf都升级到最新的版本可以解决（那么就可能是旧版本的bug）。

我后面看了下python生成的protobuf协议的import段，差异反正是挺大的：

libprotoc 3.13.0：

```python
from google.protobuf.internal import enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
```

libprotoc 3.21.11：

```python
from google.protobuf.internal import builder as _builder
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
```

一眼望过去，相比较3.13.0的差异是挺大的。

然后，我又去下载了v3的最后一个版本：v3.20.3。生成的协议的import是这样的，也就是说它已经跟后面v4，也就是v21.x的一致了：

```python
from google.protobuf.internal import builder as _builder
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
```

但是，运行了程序之后，跟3.13.0的结果却是一致的：崩了。堆栈虽然有些不一样：

```
[_message.cpython-38-x86_64-linux-gnu.so] google::protobuf::python::InitDescriptor() 0x00007fffe4d3b1bc
[_message.cpython-38-x86_64-linux-gnu.so] google::protobuf::python::InitProto2MessageModule(_object*) 0x00007fffe4d4f500
[_message.cpython-38-x86_64-linux-gnu.so] PyInit__message 0x00007fffe4d55282
[libpython3.8.so.1.0] _PyImport_LoadDynamicModuleWithSpec 0x00007ffff5e67006
```

接着我又试了v4的第一个正式版：v4.21.0，其结果跟v4.21.11是一致的：运行没有问题。

因为我不好升级C++版本的protobuf，所以我并没有办法去测试这一块。但是就目前来看（武断的认为），似乎问题还是在python的protobuf的版本上，升级后应该就没问题了。

另外附上我查找到的一些相关的问题资料：

- [python: SIGSEGV when use PyImport_Import import symbol_database #5979](https://github.com/protocolbuffers/protobuf/issues/5979)
- [This program requires version 3.3.0 of the Protocol Buffer runtime library #5711](https://github.com/BVLC/caffe/issues/5711)
- [Python 是如何寻找包的路径 import 包和系统冲突 同名 PYTHONPATH](https://www.xiewo.net/blog/show/457/)

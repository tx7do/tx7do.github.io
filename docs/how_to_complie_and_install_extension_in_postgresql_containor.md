# 怎样编译PostgreSQL扩展并安装到容器中去

通常PostgreSQL容器当中会内置一些扩展，一般存放在：`/usr/lib/postgresql/{PostgreSQL版本号}/lib`，扩展的实体都是`.so`文件，如果容器当中存在着扩展的so文件，那么就可以顺利的通过SQL语句进行安装，否则，则不能够顺利的安装，这时候，就需要编译扩展并拷贝进容器。

https://yum.postgresql.org/repopackages/

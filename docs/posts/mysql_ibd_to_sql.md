---
date: 2026-04-16
category:
  - 运维技术
tag:
  - MySQL
sticky: 10
---

# MySQL 运维实战：ibd 文件批量转换为 SQL 完整指南（基于 ibd2sql）

在 MySQL 数据库运维、数据恢复、迁移场景中，**仅存 ibd 文件、丢失表结构 / 备份** 是最棘手的问题之一。InnoDB 的独立表空间文件 `.ibd` 存储了表的全部数据和结构，但无法直接读取使用。

基于开源工具 `ibd2sql`，我们可以**离线解析 ibd 文件**，直接导出完整的 `CREATE TABLE`（DDL）和 `INSERT`（DML）语句。本文整合** Windows PowerShell 批量脚本** + **Linux Shell 自动转换** + 导入脚本，实现一键批量处理，彻底解决 ibd 恢复难题。

## 一、核心概念：ibd 文件到底是什么？

- `.ibd` = InnoDB Data File，MySQL InnoDB 独立表空间文件
- 开启 `innodb_file_per_table=ON`（默认开启）后，**一张表对应一个 ibd 文件**
- 包含：表结构、数据行、索引、约束、元数据（MySQL 8.0+）
- 无法直接用文本编辑器打开，必须专用工具解析

`ibd2sql` 是目前最易用、跨平台、无依赖的 ibd 解析工具，支持：

- ✅ 导出表结构（DDL）
- ✅ 导出全部数据（SQL）
- ✅ 恢复误删数据
- ✅ 支持 MySQL 5.6 ~ 8.4+
- ✅ Windows / Linux 通用
- ✅ 纯 Python 运行，无需编译

## 二、环境准备（1 分钟完成）

### 1. 下载工具

```bash
git clone https://github.com/ddcw/ibd2sql.git
cd ibd2sql
```

### 2. 检查 Python

```bash
# Windows
python --version

# Linux
python3 --version
```

只要是 Python 3.6+ 即可，无需安装任何依赖库。

### 3. 放入 ibd 文件

把需要恢复的 `.ibd` 文件复制到 ibd2sql 目录下（或子目录）。

## 三、基础命令（单文件转换）

你可以先手动测试，确保工具正常工作：

```bash
# 导出 DDL + 数据 到 SQL 文件
python main.py test.ibd --ddl --sql > test.sql
```

常用参数：

- `--ddl`：导出建表语句
- `--sql`：导出数据 insert 语句
- `--delete`：导出已删除的数据（误删恢复）
- `--mysql5`：兼容 MySQL 5.7 及更早版本

## 四、Windows 批量转换脚本（PowerShell）

适合 Windows 环境，**批量扫描所有 ibd** → **自动生成 SQL** → **自动清理空文件**，输出统一保存到 `output_sql` 目录。

### 完整脚本

```powershell
chcp 65001 | Out-Null

# 创建输出目录
mkdir -Force output_sql | Out-Null

# 获取当前目录下所有 ibd 文件（你可以改成自己的路径）
$ibdFiles = Get-ChildItem -Path . -Recurse -Filter *.ibd

# 循环批量转换
foreach ($file in $ibdFiles) {
    $name = $file.BaseName
    $output = "output_sql\$name.sql"
    
    Write-Host "`nProcessing: $($file.Name)" -ForegroundColor Cyan

    # 正确获取 DDL + 保留格式换行
    $ddl = python -X utf8 main.py $file.FullName --ddl 2>&1
    $data = python -X utf8 main.py $file.FullName --sql 2>&1

    # 合并，保留原始格式
    $fullSql = (@($ddl) + @("") + @($data)) -join "`r`n"

    # 写入 UTF8 无 BOM
    [System.IO.File]::WriteAllText($output, $fullSql, [System.Text.Encoding]::UTF8)

    # 删除空文件
    if (Test-Path $output) {
        if ((Get-Item $output).Length -eq 0) {
            Remove-Item $output -Force
        }
    }
}

Write-Host "`nAll done! Files saved in output_sql folder" -ForegroundColor Green
```

### 使用方法

1. 保存为 `ibd2sql_batch.ps1`
2. 放在 ibd2sql 工具目录
3. 右键 → 使用 PowerShell 运行
4. 所有 SQL 文件自动生成在 `output_sql` 文件夹

### 脚本优势

- 递归扫描子目录所有 ibd
- 自动 UTF-8 编码，无中文乱码
- 自动合并 DDL + 数据
- 自动删除解析失败的空文件
- 兼容所有 Windows 版本

## 五、Linux 自动转换 + 直接导入 MySQL 脚本

Linux 环境最强方案：**扫描 ibd** → **生成 SQL** → **自动导入数据库**，全程无需人工干预。

### 完整脚本

```shell
#!/bin/bash

# ===================== MySQL 连接信息 =====================
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3306"
MYSQL_USER="root"
MYSQL_PASS="你的密码"
# =========================================================

OUTPUT_DIR="./output_sql"
mkdir -p "$OUTPUT_DIR"

echo "====================================="
echo "  递归扫描 ibd 文件 → 自动转换 + 导入"
echo "====================================="

# 递归查找所有子目录下的 ibd
find . -type f -name "*.ibd" | while read -r ibd_file; do
    filename=$(basename "$ibd_file" .ibd)
    output_sql="$OUTPUT_DIR/$filename.sql"

    echo "Processing: $ibd_file"

    # 导出 DDL + 数据（会自动生成 CREATE DATABASE + USE）
    python3 main.py "$ibd_file" --ddl --sql > "$output_sql"

    # 跳过空文件
    if [ ! -s "$output_sql" ]; then
        rm -f "$output_sql"
        continue
    fi

    # 直接导入，不指定数据库，SQL 内部自动建库
    mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASS" < "$output_sql"
    echo "Imported: $output_sql"
done

echo -e "\n🎉 All tasks completed!"
```

### 使用方法

1. 保存为 ibd2sql_auto_import.sh
2. 修改 MySQL 账号密码
3. 赋予执行权限：`chmod +x ibd2sql_auto_import.sh`
4. 运行：`./ibd2sql_auto_import.sh`

### 脚本优势

- 递归扫描全目录 ibd
- 自动生成 SQL 并保存备份
- 自动跳过解析失败文件
- **自动导入 MySQL**，无需手动执行
- 自动创建原数据库，表结构完整恢复

## 六、生成后的 SQL 文件如何手动导入？

如果你不想自动导入，可手动执行：

### 1. 命令行导入

```bash
mysql -uroot -p 数据库名 < output_sql/test.sql
```

### 2. 客户端导入

Navicat / DBeaver / SQLyog：

- 连接 MySQL
- 新建数据库
- 运行 SQL 文件 → 选择生成的 `.sql`

## 七、常见问题与解决方案

### 1. 中文乱码

- Windows 脚本已强制 UTF-8
- 导入时确保 MySQL 连接字符集为 utf8mb4

### 2. 解析失败

- ibd 文件损坏：尝试加 `--force`
- MySQL 5.7 加 `--mysql5`
- 文件权限不足：管理员运行

### 3. 数据丢失

- 普通恢复不加 `--delete`
- 误删数据恢复使用：`python main.py xx.ibd --sql --delete`

## 八、总结

`ibd2sql` 是 MySQL 数据恢复的**终极工具**，配合本文提供的双平台脚本：

- **Windows**：批量生成 SQL，安全、标准化导出
- **Linux**：一键转换 + 自动导入，适合服务器应急恢复

无论你是误删库、系统崩溃、备份丢失，只要有 ibd 文件，就能完整恢复表结构和全部数据。

建议收藏本文 + 保存工具，作为 MySQL 运维必备急救方案！

# 使用 Go (Golang) 为 postgresql 实施 更改数据捕获 (CDC)

## Change Data Capture介绍

变更数据捕获 (CDC) 是一种用于跟踪对数据库中的数据所做的更改的技术，使您能够跟踪数据的演变。在 PostgreSQL 中，CDC 是使用逻辑复制（Logical Replication）功能实现的，它可以选择性地复制对特定表或列所做的更改。

Golang 是一种编程语言，近年来因其速度和简单性而受到欢迎。它也非常适合处理数据库，因为它内置了对 SQL 数据库的支持以及许多用于处理这些数据库的强大库。

在 PostgreSQL 中使用 Golang 和 CDC 是一个强大的组合，因为它允许您轻松地实时捕获和处理对数据库所做的更改。以下是开始在 PostgreSQL 中使用 Golang 和 CDC 需要遵循的基本步骤：

1. 首先，您需要在 PostgreSQL 数据库上启用逻辑复制。这可以通过修改 PostgreSQL 配置文件来完成。完成此操作后，您需要创建一个发布来指定要复制的表或列。
2. 接下来，您需要编写一个连接到数据库并订阅逻辑复制流的 Golang 程序。这可以使用 Golang 中内置的 database/sql 包以及第三方库（例如 pq）来完成。订阅流后，您将开始接收包含对数据库所做更改的消息。
3. 最后，您需要处理这些消息并对它们进行处理。这可能涉及更新缓存或搜索索引、向另一个系统发送通知或简单地记录更改以供将来分析。Golang 提供了许多处理数据的强大工具，包括用于处理 JSON 数据的标准库的 encoding/json 包，以及用于解析 JSON 的第三方库，如 gjson。

总的来说，在 PostgreSQL 中使用 Golang 和 CDC 是一个强大的组合，允许您实时捕获和处理对数据库的更改。借助正确的工具和技术，您可以使用这种组合来构建强大的实时数据处理系统，帮助您掌握数据并做出更明智的决策。

## PostgreSQL的docker-compose配置

下面是 docker compose 文件的示例，用于在本地开启配置，侦听数据库更改。

```yml
version: '3.7'
services:
  postgres:
    image: postgres:13-alpine
    restart: always
    environment:
      POSTGRES_DB: mydatabase
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_INITDB_ARGS: '--data-checksums'
      PGDATA: /var/lib/postgresql/data/pgdata
    ports:
      - "5434:5432"
    volumes:
      - ./pgdata:/var/lib/postgresql/data/pgdata
    command: postgres -c max_wal_senders=2 -c wal_level=logical -c max_replication_slots=2
```

## 简单的go程序用于监听改变

`pglogrepl`此 Go 脚本是使用和`pgx`包在 PostgreSQL 中执行逻辑复制的示例。

该脚本首先定义一个 PostgreSQL 连接字符串，然后使用该函数创建到数据库的连接`pgconn.Connect`。该脚本然后删除并重新创建一个`pglogrepl_demo`以数据库中的所有表命名的发布。

接下来，脚本创建一个`pglogrepl_demo`使用该`pglogrepl.CreateReplicationSlot`函数命名的新复制槽，并使用该`pglogrepl.StartReplication`函数在该槽上开始复制。

然后该脚本进入一个循环，该循环使用该`conn.ReceiveMessage`函数侦听传入的复制消息。它检查每条消息的类型并采取相应的措施。

例如，当它收到一个 时`PrimaryKeepaliveMessage`，脚本会记录消息的详细信息并在必要时更新下一个备用消息截止日期。

当它收到一条`XLogData`消息时，脚本会使用 解析消息`pglogrepl.ParseXLogData`，然后记录解析的数据。然后它尝试使用`pglogrepl.Parse`并切换消息类型来解析逻辑复制消息以采取适当的操作。

在此示例中，脚本仅处理`RelationMessage`和`InsertMessage`类型。当它收到`InsertMessage`时，它会记录插入行的值。

```go
package main

import (
    "context"
    "encoding/hex"
    "log"
    "time"

    "github.com/jackc/pglogrepl"
    "github.com/jackc/pgx/v5/pgconn"
    "github.com/jackc/pgx/v5/pgproto3"
    "github.com/jackc/pgx/v5/pgtype"
)

const (
    PGLOGREPL_DEMO_CONN_STRING = "postgres://user:password@127.0.0.1:5434/mydatabase?replication=database"
)

func main() {
    //    const outputPlugin = "test_decoding"
    const outputPlugin = "pgoutput"
    conn, err := pgconn.Connect(context.Background(), PGLOGREPL_DEMO_CONN_STRING)
    if err != nil {
        log.Fatalln("failed to connect to PostgreSQL server:", err)
    }
    defer conn.Close(context.Background())

    result := conn.Exec(context.Background(), "DROP PUBLICATION IF EXISTS pglogrepl_demo;")
    _, err = result.ReadAll()
    if err != nil {
        log.Fatalln("drop publication if exists error", err)
    }

    result = conn.Exec(context.Background(), "CREATE PUBLICATION pglogrepl_demo FOR ALL TABLES;")
    _, err = result.ReadAll()
    if err != nil {
        log.Fatalln("create publication error", err)
    }
    log.Println("create publication pglogrepl_demo")

    var pluginArguments []string
    if outputPlugin == "pgoutput" {
        pluginArguments = []string{"proto_version '1'", "publication_names 'pglogrepl_demo'"}
    } else if outputPlugin == "wal2json" {
        pluginArguments = []string{"\"pretty-print\" 'true'"}
    }

    sysident, err := pglogrepl.IdentifySystem(context.Background(), conn)
    if err != nil {
        log.Fatalln("IdentifySystem failed:", err)
    }
    log.Println("SystemID:", sysident.SystemID, "Timeline:", sysident.Timeline, "XLogPos:", sysident.XLogPos, "DBName:", sysident.DBName)

    slotName := "pglogrepl_demo"

    _, err = pglogrepl.CreateReplicationSlot(context.Background(), conn, slotName, outputPlugin, pglogrepl.CreateReplicationSlotOptions{Temporary: true})
    if err != nil {
        log.Fatalln("CreateReplicationSlot failed:", err)
    }
    log.Println("Created temporary replication slot:", slotName)
    err = pglogrepl.StartReplication(context.Background(), conn, slotName, sysident.XLogPos, pglogrepl.StartReplicationOptions{PluginArgs: pluginArguments})
    if err != nil {
        log.Fatalln("StartReplication failed:", err)
    }
    log.Println("Logical replication started on slot", slotName)

    clientXLogPos := sysident.XLogPos
    standbyMessageTimeout := time.Second * 10
    nextStandbyMessageDeadline := time.Now().Add(standbyMessageTimeout)
    relations := map[uint32]*pglogrepl.RelationMessage{}
    typeMap := pgtype.NewMap()

    for {
        if time.Now().After(nextStandbyMessageDeadline) {
            err = pglogrepl.SendStandbyStatusUpdate(context.Background(), conn, pglogrepl.StandbyStatusUpdate{WALWritePosition: clientXLogPos})
            if err != nil {
                log.Fatalln("SendStandbyStatusUpdate failed:", err)
            }
            log.Println("Sent Standby status message")
            nextStandbyMessageDeadline = time.Now().Add(standbyMessageTimeout)
        }

        ctx, cancel := context.WithDeadline(context.Background(), nextStandbyMessageDeadline)
        rawMsg, err := conn.ReceiveMessage(ctx)
        cancel()
        if err != nil {
            if pgconn.Timeout(err) {
                continue
            }
            log.Fatalln("ReceiveMessage failed:", err)
        }

        if errMsg, ok := rawMsg.(*pgproto3.ErrorResponse); ok {
            log.Fatalf("received Postgres WAL error: %+v", errMsg)
        }

        msg, ok := rawMsg.(*pgproto3.CopyData)
        if !ok {
            log.Printf("Received unexpected message: %T\n", rawMsg)
            continue
        }

        switch msg.Data[0] {
        case pglogrepl.PrimaryKeepaliveMessageByteID:
            pkm, err := pglogrepl.ParsePrimaryKeepaliveMessage(msg.Data[1:])
            if err != nil {
                log.Fatalln("ParsePrimaryKeepaliveMessage failed:", err)
            }
            log.Println("Primary Keepalive Message =>", "ServerWALEnd:", pkm.ServerWALEnd, "ServerTime:", pkm.ServerTime, "ReplyRequested:", pkm.ReplyRequested)

            if pkm.ReplyRequested {
                nextStandbyMessageDeadline = time.Time{}
            }

        case pglogrepl.XLogDataByteID:
            xld, err := pglogrepl.ParseXLogData(msg.Data[1:])
            if err != nil {
                log.Fatalln("ParseXLogData failed:", err)
            }
            log.Printf("XLogData => WALStart %s ServerWALEnd %s ServerTime %s WALData:\n%s\n", xld.WALStart, xld.ServerWALEnd, xld.ServerTime, hex.Dump(xld.WALData))
            logicalMsg, err := pglogrepl.Parse(xld.WALData)
            if err != nil {
                log.Fatalf("Parse logical replication message: %s", err)
            }
            log.Printf("Receive a logical replication message: %s", logicalMsg.Type())
            switch logicalMsg := logicalMsg.(type) {
            case *pglogrepl.RelationMessage:
                relations[logicalMsg.RelationID] = logicalMsg

            case *pglogrepl.BeginMessage:
                // Indicates the beginning of a group of changes in a transaction. This is only sent for committed transactions. You won't get any events from rolled back transactions.

            case *pglogrepl.CommitMessage:

            case *pglogrepl.InsertMessage:
                rel, ok := relations[logicalMsg.RelationID]
                if !ok {
                    log.Fatalf("unknown relation ID %d", logicalMsg.RelationID)
                }
                values := map[string]interface{}{}
                for idx, col := range logicalMsg.Tuple.Columns {
                    colName := rel.Columns[idx].Name
                    switch col.DataType {
                    case 'n': // null
                        values[colName] = nil
                    case 'u': // unchanged toast
                        // This TOAST value was not changed. TOAST values are not stored in the tuple, and logical replication doesn't want to spend a disk read to fetch its value for you.
                    case 't': //text
                        val, err := decodeTextColumnData(typeMap, col.Data, rel.Columns[idx].DataType)
                        if err != nil {
                            log.Fatalln("error decoding column data:", err)
                        }
                        values[colName] = val
                    }
                }
                log.Printf("INSERT INTO %s.%s: %v", rel.Namespace, rel.RelationName, values)

            case *pglogrepl.UpdateMessage:
                // ...
            case *pglogrepl.DeleteMessage:
                // ...
            case *pglogrepl.TruncateMessage:
                // ...

            case *pglogrepl.TypeMessage:
            case *pglogrepl.OriginMessage:
            default:
                log.Printf("Unknown message type in pgoutput stream: %T", logicalMsg)
            }

            clientXLogPos = xld.WALStart + pglogrepl.LSN(len(xld.WALData))
        }
    }
}

func decodeTextColumnData(mi *pgtype.Map, data []byte, dataType uint32) (interface{}, error) {
    if dt, ok := mi.TypeForOID(dataType); ok {
        return dt.Codec.DecodeValue(mi, dataType, pgtype.TextFormatCode, data)
    }
    return string(data), nil
}
```

如果您喜欢我的文章，可以关注我的博客：https ://adam-szpilewicz.pl/

## 翻译源

[Change Data Capture (CDC) for postgresql using Go (Golang)](https://towardsdev.com/change-data-capture-cdc-for-postgresql-using-go-golang-2b34c576a5d)

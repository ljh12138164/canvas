## 聊天服务

### 安装依赖

```sh
bun install
```

### 运行

```sh
bun run dev
```

### 访问

http://localhost:8088/jebetChat

### sendMessage 发送消息事件

```json
{
  "workspaceId": "123",
  "message": "hello"
}
```

### disconnectChat 断开连接事件

```

```

### connectChat 连接成功事件

```json
{
  "socketId": "123",
  "workspaceId": "123"
}
```

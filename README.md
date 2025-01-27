# 项目文档

## 项目概述

这是一个基于 monorepo(turbo) 架构的全栈项目,包含多个应用和一个共享的后端服务。项目使用 pnpm workspace 进行包管理。

## 可行性分析在根目录的`public/`中，记录着项目的功能实现

## 项目结构

### 后端服务 (8000端口)

这个后端服务是要打包后通过单仓库导入其他项目，去解析类型调用接口的是hono的特点 ![alt text](/public/后端部署到边缘函数的探索/hc解析类型通过类型调用api.png)

基于 Hono + Supabase（云数据库） 构建的后端服务(**最后是部署到vercel中变成无服务器的边缘函数**),位于 `server/api` 目录:

- **目录结构**:

  - `api/` - Vercel部署入口
  - `src/` - 后端服务代码
    - `hono/` - 路由和控制器
    - `libs/` - 工具库
    - `server/` - Supabase数据库操作
    - `types/` - TypeScript类型定义
    - `email/` - 邮件服务(未使用)

- **API 路由**:

  - `/api/design` - 设计相关API
  - `/api/jebt` - 项目管理相关API
  - `/api/note` - 笔记相关API
  - `/api/form` - 表单相关API
  - `/api/ai` - AI相关API
  - `/api/storage` - 存储相关API

- **主要功能**:
  - 用户认证
  - 文件存储
  - 数据库操作
  - AI 对话(完成)

#### Socket.io 聊天服务 (8088端口)----已上线（wss://jebetsocket.ljhboard.cn）

基于 Bun 构建的实聊天服务，基于`socket.io`实现的,位于 `server/jebetChat` 目录:

- **目录结构**:

  - `src/` - 源代码
    - `index.ts` - 服务入口

- **主要功能**:
  - 数据的分发
  - 房间的概念

#### note项目的tiptap协同服务 (8080端口)----已上线（wss://socket.ljhboard.cn/）

主要通过`@hocuspocus/server`服务实现的服务器功能，再通过webhook接入已有的api路由实现云端的自动保存

基于 Bun 构建的实时协作服务,位于 `server/ws` 目录:

- **目录结构**:

  - `src/` - 源代码
    - `index.ts` - 服务入口
    - `types/` - 类型定义
    - `utils/` - 工具函数

- **主要功能**:
  - 实时数据同步
  - 协同编辑支持
  - 在线状态管理

#### design项目的协同实现 (8888端口)----开发中（从0写yjs的东西，可能要点时间）毕设

基于 Bun 构建的实时协作服务,位于 `server/ws` 目录:

- **目录结构**:

  - `src/` - 源代码
    - `index.ts` - 服务入口
    - `types/` - 类型定义
    - `utils/` - 工具函数

- **主要功能**:
  - 实时数据同步
  - 协同编辑支持
  - 在线状态管理

### 前端应用

#### 1. 设计应用 (8400端口) - 毕设选题

基于 Next.js 15 + React 19 构建:

- **目录结构**:

  - `components/` - 组件
  - `lib/` - 工具库
  - `database/` - Supabase数据库配置
  - `server/` - API请求配置
  - `store/` - 状态管理
  - `types/` - 类型定义
  - `hooks/` - 自定义hooks
  - `app/` - 应用代码
    - `fonts/` - 字体文件
    - `globals.css` - 全局样式
    - `pages/` - 页面
    - `_provider/` - React Query配置

- **技术栈**:
  - 状态管理: Zustand
  - UI组件: Shadcn
  - 主要功能:
    - 设计画布
    - 图片处理
    - 协同编辑

#### 2. 管理应用 (8100端口)

基于 React 19 构建，概括了多个业务场景:

- 可拖拽的列表
- 大的日历显示（react-big-）

- **目录结构**:

  - `public/` - 静态资源
  - `src/` - 源代码
    - `server/` - API请求配置
    - `components/` - 组件
    - `lib/` - 工具库
    - `pages/` - 页面
    - `types/` - 类型定义
    - `utils/` - 工具函数
    - `store/` - 状态管理
    - `hooks/` - 自定义hooks
    - `assets/` - 静态资源

- **技术栈**:
  - 状态管理: MobX
  - UI组件: Shadcn
  - 主要功能:
    - 项目管理
    - 任务跟踪
    - 团队聊天
    - react-flow的工作流
    - 团队空间

#### 3. 笔记应用 (8200端口)

基于 Vue 3 + Rebuild 构建:

- **目录结构**:

  - `public/` - 静态资源
  - `src/` - 源代码
    - `components/` - 组件
    - `server/` - API请求配置
    - `router/` - 路由配置
    - `lib/` - 工具库
    - `pages/` - 页面
    - `types/` - 类型定义
    - `utils/` - 工具函数
    - `store/` - 状态管理

- **技术栈**:
  - 状态管理: Pinia
  - UI组件: Shadcn
  - 主要功能:
    - 笔记编辑
    - 笔记分享
    - 实时协作

#### 4. 表单生成器 (8300端口)

基于 Vue3 构建使用了 vue-draggable-plus和 auth-form(做过贡献)实现的

auth-form是基于zod检验来生成表单，具体实现看`public/自定义表单的可行性`

- **目录结构**:

  - `components/` - 组件
  - `lib/` - 工具库
  - `pages/` - 页面
  - `types/` - 类型定义
  - `utils/` - 工具函数
  - `store/` - 状态管理
  - `assets/` - 静态资源

- **技术栈**:
  - 状态管理: Pinia
  - UI框架: Tailwind + Shadcn/vue
  - 主要功能:
    - 表单设计
    - 表单验证
    - 数据收集

## 技术栈

### 后端

- Hono - 后端框架
- Supabase - 数据库和认证
- Bun - WebSocket 服务
- TypeScript - 开发语言

### 前端

- React/Vue/Nuxt - 前端框架
- Zustand/MobX/Pinia - 状态管理
- Tailwind - 样式框架
- Shadcn - UI组件库

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务

```bash
# 后端服务
pnpm --filter api dev

# 设计应用
pnpm --filter design dev

# 管理应用
pnpm --filter jebet dev

# 笔记应用
pnpm --filter note dev

# 表单应用
pnpm --filter form dev

# WebSocket服务
pnpm --filter ws dev

# 测试点子
pnpm --filter test dev
```

## TODO

- 文档补全（协同的webhook的实现）

# 作者：李建辉

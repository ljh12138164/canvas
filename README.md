# 项目结构

## 后端服务(hono + supabase)

- ### apps/api 后端服务

  - #### api vercel部署入口
  - #### .env 环境变量
  - #### src 后端服务代码
    - ##### hono 后端框架
    - ##### libs 工具库
    - ##### server supabase的server代码（控制数据库）
    - ##### types 类型
    - ##### email 邮件服务(未使用)

## 设计应用(next15 + react19 + zustand)

- ### apps/ljh-design 设计应用

  - #### components 组件
  - #### lib 工具库
  - #### database supabase数据库
  - #### server 配置api打包后进行请求接口
  - #### store 状态管理
  - #### types 类型
  - #### hooks 自定义hooks
  - #### app 设计应用代码
    - ##### fonts 字体
    - ##### globals.css 全局样式
    - ##### pages 页面
    - ##### \_provider react-query 配置

## 管理应用(react18 + mobx)

- ### apps/jebet 管理应用

  - #### public 静态资源
  - #### src 管理应用代码
    - ##### server 配置api打包后进行请求接口
    - ##### components 组件
    - ##### lib 工具库
    - ##### pages 页面
    - ##### types 类型
    - ##### utils 工具函数
    - ##### store 状态管理
    - ##### hooks 自定义hooks
    - ##### assets 静态资源

## 笔记应用(vue + rebuild + pinia)

- ### apps/note 笔记应用
  - #### server 配置api打包后进行请求接口
  - #### public 静态资源
  - #### src 笔记应用代码
    - ##### components 组件
    - ##### router 自定义hooks
    - ##### lib 工具库
    - ##### pages 页面
    - ##### types 类型
    - ##### utils 工具函数
    - ##### store 状态管理

## 协同笔记websocket服务(bun)

- ### apps/ws 协同笔记websocket服务
  - #### src 协同笔记websocket服务代码

## 表单生成器应用(nuxt)

- ### apps/form 表单生成器应用(未开始)

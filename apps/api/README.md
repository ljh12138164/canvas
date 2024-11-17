apps
├── api
│ ├── index.ts # 部署入口文件
│ └── README.md # 项目架构说明
├── ljh-design
│ ├── hooks
│ │ └── useTryData.ts # 自定义钩子
│ ├── components
│ │ ├── Header.tsx # 头部组件
│ │ ├── Footer.tsx # 底部组件
│ │ └── ... # 其他组件
│ ├── pages
│ │ ├── Home.tsx # 主页
│ │ ├── About.tsx # 关于页
│ │ └── ... # 其他页面
│ └── styles
│ ├── main.css # 主样式文件
│ └── ... # 其他样式文件
src
├── hono
│ ├── index.ts # Hono应用入口文件
│ ├── board.ts # 看板相关路由
│ ├── design.ts # 设计相关路由
│ ├── jebt.ts # JEBT相关路由
│ └── note.ts # 笔记相关路由
├── libs
│ ├── error
│ │ └── index.ts # 错误处理模块
│ └── server
│ ├── supabase
│ │ ├── index.ts # Supabase服务入口文件
│ │ ├── design.ts # 设计相关服务
│ │ ├── jebt.ts # JEBT相关服务
│ │ └── auth.ts # 认证相关服务
│ └── ... # 其他服务
├── utils
│ ├── helpers.ts # 辅助函数
│ └── constants.ts # 常量定义
├── types
│ └── index.d.ts # 类型定义

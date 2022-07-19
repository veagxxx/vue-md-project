# ✈️使用指南

## 🪂说明
这是一个由 markdown 文件生成 vue 页面的文档系统。\
通过上传 .md 文件会自动生成文档路由，访问路由时 .md 文件会渲染成 html 格式的富文本。\
**注意：由于用的 [vite](https://cn.vitejs.dev/guide/) 搭建的项目，Vite 需要 Node.js 版本 >= 14.18.0。然而，有些模板需要依赖更高的 Node 版本才能正常运行，当你的包管理器发出警告时，请注意升级你的 Node 版本。**

## 🕹️使用技术
- 前端：`Vue3 + TypeScript + Vite`
- 服务端：`Node(Express框架)`
- UI框架：[ElementPlus](https://element-plus.gitee.io/zh-CN/)
- Markdown编辑器：[md-editor-v3](https://imzbf.github.io/md-editor-v3/index)

## 📱启动命令
- 安装依赖：`npm install`
- 前端：`npm run dev`
- node服务：`npm run node-server`

## ⚙️IDE 设置

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- 禁用(工作区) `Vetur`

## 🎮Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).

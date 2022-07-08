import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import commonjsExternals from 'vite-plugin-commonjs-externals'
// import ElementPlus from 'unplugin-element-plus/vite'
const md = require('vite-plugin-markdown')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    md.plugin({
      mode: ["html", "vue"],
    }),
    // ElementPlus({
    //   useSource: true,
    // }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({ importStyle: "sass" }),
      ],
    }),
    // commonjsExternals({
    //   externals: ['fs'] //这里
    // })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  },
  // 自定义主题色
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
  
})

import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import "@/assets/styles/index.scss"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
// Message 消息弹框样式
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'
import 'github-markdown-css'
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css';
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('MdEditor', MdEditor)
app.use(router).mount('#app')


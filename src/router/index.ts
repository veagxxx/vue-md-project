import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'
import { h } from "vue"
import Article from "@/views/Article.vue"
import { html as Intro } from "@/doc/form.md"
const modules = import.meta.glob('@/doc/**.md')
const md = (string: any) => h(Article, { content: string, key: string })
const IntroDoc = md(Intro);
const Layout = () => import("@/layout/index.vue")
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/form'
  },
  {
    path: '/',
    name: "Layout",
    component: Layout,
    children: [
      // { path: "/doc", component: IntroDoc }
    ],
    meta: {
      title: "文档",
    },
  }
]
if (modules) {
  for (const key in modules) {
    if (Object.prototype.hasOwnProperty.call(modules, key)) {
      const name: string = key.split('.md')[0].split('/')[key.split('.md')[0].split('/').length - 1]
      const MdCmp = md(await modules[key]().then(res => res.html))
      routes[1].children?.push(
        { path: `/${name}`, component: MdCmp }
      )
    }
  }
}
const router: Router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router 
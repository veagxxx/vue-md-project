import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'
import { h } from "vue"
import { getMenus } from '@/controller/FsController'
import Article from "@/views/Article.vue"
import { html as Intro } from "../../README.md"
const modules = import.meta.glob('@/doc/**.md')
const res: any = await getMenus()
// console.log('xxxxxxxxxxxxxxxx', res.data, modules)
const md = (string: any) => h(Article, { content: string, key: string })
const IntroDoc = md(Intro);
const Layout = () => import("@/layout/index.vue")
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/guide'
  },
  {
    path: '/',
    name: "Layout",
    component: Layout,
    children: [
      { path: "/guide", component: IntroDoc }
    ],
    meta: {
      title: "文档",
    },
  },
]
if (modules && res.data.length) {
  for (const key in res.data) {
    if (Object.prototype.hasOwnProperty.call(modules, `../doc/${res.data[key].doc}`)) {
      // console.log('key', key)
      // const name: string = key.split('.md')[0].split('/')[key.split('.md')[0].split('/').length - 1]
      const MdCmp = md(await modules[`../doc/${res.data[key].doc}`]().then(res => res.html))
      // console.log('MdCmp', MdCmp)
      routes[1].children?.push(
        { path: `/${res.data[key].path}`, component: MdCmp }
      )
    }
  }
}
const router: Router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router 
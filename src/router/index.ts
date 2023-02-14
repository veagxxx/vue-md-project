import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'
import { h } from "vue"
import { getMenus } from '@/controller/FsController'
import Article from "@/views/Article.vue"
import { html as Intro } from "../../README.md"
// 读取doc目录下所有 .md 文件
const modules = import.meta.glob('@/doc/**.md')
// 获取菜单数据
const res: any = await getMenus()
const md = (string: any) => h(Article, { content: string, key: string })
const IntroDoc = md(Intro);
const Page404 = () => import('@/views/page-404/Page404.vue')
const Layout = () => import("@/layout/index.vue")
const Statistic = () => import('@/views/statistics/index.vue')
const Painting = () => import ('@/views/painting/Painting.vue')
const ZCharts = () => import('@/views/zcharts/index.vue')
const Cropper = () => import('@/views/cropper/index.vue')
const Jigsaw = () => import('@/views/jigsaw/index.vue')
const Mirror = () => import('@/views/mirror/index.vue')
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
      { path: "/guide", component: IntroDoc },
      { path: '/statistics', component: Statistic },
      { path: '/fantastic', component: Painting },
      { path: '/z-charts', component: ZCharts },
      { path: '/cropper', component: Cropper },
      { path: '/jigsaw', component: Jigsaw },
      { path: '/mirror', component: Mirror },
    ],
    meta: {
      title: "文档",
    },
  },
  // 404页面
  {
    path: '/:pathMatch(.*)',
    component: Page404
  },
]
if (modules && res.data.length) {
  for (const key in res.data) {
    if (Object.prototype.hasOwnProperty.call(modules, `../doc/${res.data[key].doc}`)) {
      const MdCmp = md(await modules[`../doc/${res.data[key].doc}`]().then(res => res.html))
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
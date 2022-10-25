<template>
  <div class="header">
    <div class="header-left">
      <el-icon><Skeleton /></el-icon>
      <span>ONE PIECE</span>
    </div>
    <div class="header-right">
      <el-menu
        :default-active="route.path"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
        router
        active-text-color="#36ad6a"
      >
        <el-menu-item index="/guide">指南</el-menu-item>
        <el-menu-item index="/statistics">统计</el-menu-item>
        <el-sub-menu index="">
          <template #title>文档</template>
          <el-menu-item  
            v-for="(item, index) in routerMenus" 
            :key="item.name + index" 
            :index="item.path"
          >
            {{ item.name }}  
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/fantastic">画图</el-menu-item>
        <el-menu-item index="/z-charts">图表</el-menu-item>
      </el-menu>
      <div class="icon-item" @click="handleOpenUpload">
        <span>上传</span>
        <el-icon><UploadFilled /></el-icon>
      </div>
      <el-tooltip place="bottom-start" content="源码地址">
        <div class="icon-item" @click="toGitHub()">
          <span>github</span>
          <el-icon><Link /></el-icon>
        </div>
      </el-tooltip>
    </div>
    <Upload :show-upload="upload" @close-upload="handleCloseUpload"/>
  </div>
</template>
<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import Upload from './components/Upload.vue'
import { getMenus } from '@/controller/FsController'
import { Router, useRoute, useRouter } from 'vue-router';
import Skeleton from '@/components/icons/Skeleton.vue'
const route = useRoute()
const github: string = 'https://github.com/veagxxx/vue-md-project'
// import { IRouteMenu } from '@/types'
const router: Router = useRouter()
const upload = ref(false)
const routerMenus = ref<any>([])
// 打开弹框
const handleOpenUpload = (): void => {
  upload.value = true
}
// 关闭弹框
const handleCloseUpload = (): void => {
  upload.value = false
}
// 获取路由菜单
const getRouterMenus = async (): Promise<void> => {
  const res: any = await getMenus()
  routerMenus.value = res.data
}
// github源码 
const toGitHub = (): void => {
  window.open(github)
}
const handleSelect = () => {

}
onMounted(() => {
  getRouterMenus()
})
</script>
<style lang='scss' scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    user-select: none;
    .header-left {
      width: 30%;
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 20px;
      margin-left: 20px;
      font-weight: 600;
      color: #36ad6a;
      :deep(.el-icon) {
        width: 1.5em;
        height: 1.5em;
        svg {
          width: 1.5em;
          height: 1.5em;
        }
      }
    }
    .header-right {
      width: 70%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .el-menu--horizontal {
        border-bottom: none;
      }
    }
    .icon-item {
      display: flex;
      align-items: center;
      font-size: 20px;
      margin: 0px 10px;
      cursor: pointer;
      /* color: #36ad6a; */
      line-height: 20px;
      span {
        font-size: 14px;
      }
    }
    
  }
</style>
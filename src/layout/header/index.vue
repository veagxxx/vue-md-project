<template>
  <div class="header">
    <div class="header-left">
      <el-icon><Orange /></el-icon>
      <span>ONE PIECE</span>
    </div>
    <div class="header-right">
      <div class="icon-item" @click="router.push('/guide')">
        <span>指南</span>
        <el-icon><Stopwatch /></el-icon>
      </div>
      <div class="icon-item" @click="handleOpenUpload">
        <span>上传</span>
        <el-icon><UploadFilled /></el-icon>
      </div>
      <el-dropdown>
        <span class="el-dropdown-link">
          <div class="icon-item">
            <span>文档</span>
            <el-icon><Coin /></el-icon>
          </div>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item 
              v-for="(item, index) in routerMenus" 
              :key="item.name + index"
              @click="selectRoute(item)"
            >
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
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
import { Router, useRouter } from 'vue-router';
const github: string = 'https://github.com/veagxxx/vue-md-project'
// import { IRouteMenu } from '@/types'
const router: Router = useRouter()
const upload = ref(false)
const routerMenus = ref<any>([])
// 打开弹框
const handleOpenUpload = () => {
  upload.value = true
}
// 关闭弹框
const handleCloseUpload = () => {
  upload.value = false
}
// 菜单切换
const selectRoute = (item: any) => {
  // console.log('item', item)
  router.push(item.path)
}
// 获取路由菜单
const getRouterMenus = async () => {
  const res: any = await getMenus()
  routerMenus.value = res.data
}
// github源码 
const toGitHub = () => {
  window.open(github)
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
    .header-left {
      width: 30%;
      display: flex;
      align-items: center;
      font-size: 20px;
      margin-left: 20px;
      font-weight: 600;
      color: #36ad6a;
    }
    .header-right {
      width: 70%;
      display: flex;
      align-items: center;
      justify-content: right;
    }
    .icon-item {
      display: flex;
      align-items: center;
      font-size: 20px;
      margin: 0px 10px;
      cursor: pointer;
      color: #36ad6a;
      line-height: 20px;
      span {
        font-size: 16px;
      }
    }
  }
</style>
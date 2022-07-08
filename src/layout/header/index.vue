<template>
  <div class="header">
    <div class="header-left">
      <el-icon><Orange /></el-icon>
      <span>BCY ONE PIECE</span>
    </div>
    <div class="header-right">
      <div class="icon-item" @click="handleOpenUpload">
        <span>上传</span>
        <el-icon><UploadFilled /></el-icon>
      </div>
      <div class="icon-item">
        <span>资源</span>
        <el-icon><Coin /></el-icon>
      </div>
      <el-tooltip place="bottom-start" content="源码地址">
        <div class="icon-item">
          <span>github</span>
          <el-icon><Link /></el-icon>
        </div>
      </el-tooltip>
    </div>
    <Upload :show-upload="upload" @close-upload="handleCloseUpload"/>
  </div>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
import Upload from './components/Upload.vue'
const upload = ref(false)
const handleOpenUpload = () => {
  upload.value = true
}
const handleCloseUpload = () => {
  upload.value = false
}
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
      span {
        font-size: 16px;
      }
    }
  }
</style>
<template>
  <el-container>
    <el-header>
      <Header/>
    </el-header>
    <!-- <el-main> -->
  <router-view></router-view>
      
      <!-- <el-scrollbar> -->
        <!-- </el-scrollbar> -->
    <!-- </el-main> -->
  </el-container>
</template>
<script lang='ts' setup>
import Header from './header/index.vue'
</script>
<style lang='scss' scoped>
  .el-header {
    padding: 0;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    z-index: 1000;
    position: sticky;
    top: 0;
    background-color: #fff;
  }
  .el-main {
    height: calc(100vh - 60px);
    overflow-y: auto;
    padding: 0 10px;
  }
</style>
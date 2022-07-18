<template>
  <el-container>
    <el-header>
      <Header/>
    </el-header>
    <el-main>
      <div class="my-main">
        <!-- <el-scrollbar> -->
        <router-view></router-view>
      <!-- </el-scrollbar> -->
      </div>
    </el-main>
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
    /* position: sticky;
    top: 0; */
    background-color: #fff;
  }
  .el-main {
    transition: all 0.3s linear;
    padding: 0px;
    .my-main {
      position: relative;
      height: calc(100vh - 60px);
      overflow: auto;
      &::-webkit-scrollbar{
        width: 8px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: lightgray;
        height: 50px;
        border-radius: 5px;
      }
    }
  }
</style>
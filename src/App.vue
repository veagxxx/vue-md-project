<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
</script>

<template>
  <el-config-provider>
    <router-view></router-view>
  </el-config-provider>
</template>

<style scoped>
  html, body, #app {
    height: 100%;
  }
</style>

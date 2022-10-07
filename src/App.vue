<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
</script>

<template>
  <el-config-provider>
    <router-view></router-view>
  </el-config-provider>
</template>

<style>
  html, body, #app {
    height: 100%;
  }
  .purple {
    color: #626aef;
  }
  .danger {
    color: #f56c6c;
  }
  .warning {
    color: #eebe77;
  }
  .hotpink {
    color: hotpink;
  }
</style>

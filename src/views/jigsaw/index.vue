<template>
  <div class="jigsaw-page">
    <Jigsaw/>
  </div>
</template>
<script lang='ts' setup>
import Jigsaw from './components/Jigsaw.vue'
</script>
<style lang='scss' scoped>
  .jigsaw-page {
    padding: 10px 15px;
    height: calc(100% - 20px);
    background-color: #eee;
    display: flex;
    justify-content: center;
  }
</style>
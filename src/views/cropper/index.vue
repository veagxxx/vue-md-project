<template>
  <div class="cropper">
    <div class="cropper-container">
      <Cropper/>
    </div>
  </div>
</template>
<script lang='ts' setup>
import Cropper from './components/Cropper.vue'
</script>
<style lang='scss' scoped>
  .cropper {
    padding: 10px 15px;
    background: #eee;
    height: calc(100% - 20px);
    overflow: auto;
    .cropper-container {
      height: 100%;
      background: #fff;
      padding: 10px;
    }
  }
</style>
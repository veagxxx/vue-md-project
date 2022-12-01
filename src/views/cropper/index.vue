<template>
  <div class="cropper">
    <div class="cropper-container">
      <Cropper circle/>
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
    /* overflow: auto; */
    .cropper-container {
      height: calc(100% - 20px);
      background: #fff;
      padding: 10px;
      overflow: auto;
    }
  }
</style>
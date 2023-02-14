<template>
  <div class="mirror-canvas" id="container"></div>
</template>
<script lang='ts' setup>
  import { onMounted, watch } from 'vue';
  const props = defineProps({
    code: String
  })
  onMounted(() => {
    initCanvas(props.code)
  })
  const initCanvas = (code?: string) => {
    new Function('', `
      const container = document.getElementById('container')
      const oldCanvas = document.getElementById('myCanvas')
      oldCanvas && container.removeChild(oldCanvas)
      const canvas = document.createElement('canvas')
      canvas.id = 'myCanvas'
      if (container) {
        container.appendChild(canvas)
      } 
      const width = container.offsetWidth
      const height = container.offsetHeight
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      canvas.width = width * 2
      canvas.height = height * 2
      const ctx = canvas.getContext('2d');` + code || ''
    )()
  }
  watch(() => props.code, (val) => {
    initCanvas(val)
  })
</script>
<style lang='scss' scoped>
  .mirror-canvas {
    height: calc(100% - 20px);
  }
</style>
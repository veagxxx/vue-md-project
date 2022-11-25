<template>
  <div class="cropper-canvas">
    <canvas id="canvas"></canvas>
    <canvas id="cropper-canvas"></canvas>
  </div>
</template>
<script lang='ts' setup>
import { onMounted, reactive, ref } from 'vue';
const props = defineProps({
  width: Number,
  height: Number,
})
// 缩放比例
const dpr: number = window.devicePixelRatio
// 默认图片
const URL: string = 'src/views/cropper/components/images/hyrz.jpg'
// 大画布参数
const _canvas = reactive({
  ctx: null as any,
  canvas: null as any,
  width: 700,
  height: 400,
})
// 裁剪参数
const _cropper = reactive({
  left: _canvas.width / 2, // 起点x
  top: _canvas.height / 2, // 起点y
  width: _canvas.width / 2, // 宽度
  height: _canvas.width / 2, // 高度
})
const croppering = ref<boolean>(false)
onMounted(() => {
  initCanvas()
  initCanvasImage()
})
// 初始化画布
const initCanvas = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
  const width: number = props.width || _canvas.width
  const height: number = props.height || _canvas.height
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  canvas.width = width * dpr
  canvas.height = height * dpr
  _canvas.ctx = ctx
  _canvas.width = width * dpr
  _canvas.height = height * dpr
  _canvas.canvas = canvas
  canvas.addEventListener('mousedown', (e: MouseEvent) => onCropperDown(e))
  canvas.addEventListener('mousemove', (e: MouseEvent) => onCropperMove(e))
  canvas.addEventListener('mouseup', stopCropper)
  canvas.addEventListener('mouseleave', stopCropper)
}
// 画裁剪图
const drawCropper = (data: ImageData) => {
  const cropperCvs = document.getElementById('cropper-canvas') as HTMLCanvasElement
  const cropperCtx = cropperCvs.getContext('2d') as CanvasRenderingContext2D
  cropperCvs.style.width = `${_cropper.width / 2}px`
  cropperCvs.style.height = `${_cropper.height / 2}px`
  cropperCvs.width = _cropper.width / 2 * dpr
  cropperCvs.height = _cropper.height / 2 * dpr
  cropperCtx.clearRect(0, 0, cropperCvs.width, cropperCvs.height)
  // 添加裁剪图
  cropperCtx.putImageData(data, 0, 0)
}
// 初始化移动裁剪盒子
const initCropperBox = () => {
  _canvas.ctx.beginPath()
  _canvas.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
  _canvas.ctx.fillRect(_cropper.left, _cropper.top, _cropper.width, _cropper.height)
}
// 填充图片
const initCanvasImage = (url?: string) => {
  const img: HTMLImageElement = new Image()
  img.src = url ? url : URL
  img.onload = () => {
    _canvas.ctx.clearRect(0, 0, _canvas.width, _canvas.height)
    _canvas.ctx.drawImage(img, 0, 0, _canvas.width, _canvas.height)
    const pattern = _canvas.ctx.createPattern(img, 'no-repeat')
    _canvas.ctx.fillStyle = pattern
    drawCropper(_canvas.ctx.getImageData(_cropper.left, _cropper.top, _cropper.width, _cropper.height))
    initCropperBox()
  }
}
// 点击画布裁剪
const onCropperDown = (e: MouseEvent) => {
  const { left, top }: { left: number, top: number } = _canvas.canvas.getBoundingClientRect()
  croppering.value = true
  const [x, y]: number[] = [(e.pageX - left) * dpr, (e.pageY - top) * dpr]
  // 点击位置不在裁剪盒子位置，移动裁剪盒子
  if ((x > _cropper.width || y > _cropper.height) || (x < _cropper.width || y < _cropper.width)) {
    _cropper.left = (x - _cropper.width / 2) 
    _cropper.top = (y - _cropper.height / 2) 
  }
  initCanvasImage()
}
// 移动裁剪盒子
const onCropperMove = (e: MouseEvent) => {
  if (croppering.value) {
    const { left, top }: { left: number, top: number } = _canvas.canvas.getBoundingClientRect()
    const [x, y]: number[] = [(e.pageX - left) * dpr, (e.pageY - top) * dpr]
    let moveLeft: number = (x - _cropper.width / 2) 
    let moveTop: number = (y - _cropper.height / 2)
    if (moveLeft <= 0) { // 左侧临界点
      moveLeft = 0 
    } else if (moveLeft + _cropper.width >= _canvas.width) { // 右侧临界点
      moveLeft = _canvas.width - _cropper.width
    } else {
      moveLeft = moveLeft
    }
    if (moveTop <= 0) { // 顶部临界点
      moveTop = 0
    } else if (moveTop + _cropper.height >= _canvas.height) { // 底部临界点
      moveTop = _canvas.height - _cropper.height
    } else {
      moveTop = moveTop
    }
    _cropper.left = moveLeft
    _cropper.top = moveTop
    initCanvasImage()
  }
}
const stopCropper = () => {
  croppering.value = false
}
</script>
<style lang='scss' scoped>
  canvas {
    cursor: pointer;
    margin-right: 24px;
  }
</style>
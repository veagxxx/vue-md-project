<template>
  <div class="cropper-canvas">
    <canvas id="canvas"></canvas>
    <canvas id="cropper-canvas" :style="{ borderRadius: circle ? '50%' : '' }"></canvas>
  </div>
  <div class="cropper-tools">
    <a type="button" class="cropper-upload__btn">
      上传图片
      <input 
        class="cropper-upload__input"
        type="file" 
        text="上传图片" 
        accept="image/png, image/jpeg, image/jpg" 
        @change="onChange"
      />
    </a>
    <button class="cropper-tools__btn primary ml-12" @click="onEnlarge">放大</button>
    <button class="cropper-tools__btn primary ml-12" @click="onShrink">缩小</button>
    <button class="cropper-tools__btn primary ml-12" @click="onMosaic">马赛克</button>
    <button class="cropper-tools__btn primary ml-12" @click="onReset">重置</button>
    <button 
      class="cropper-tools__btn primary ml-12" 
      @click="downloadCropper"
    >下载切图</button>
  </div>
</template>
<script lang='ts' setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { 
  Canvas, 
  Cropper, 
  enlarge, 
  shrink, 
  downloadCropper, 
  getRandomXYColor, 
  setRandomXYColor, 
  pointerInCropperBox,
  cropperProps,
} from './cropper'
import { Omit } from '@/types/index'
const props = defineProps(cropperProps)
// 缩放比例
const dpr: number = 2
// 
const isMosaic = ref<boolean>(false)
// 默认图片
const URL = ref<string>(props.url ? props.url : 'src/views/cropper/components/images/hyrz.jpg')
// 大画布cavnas参数
const _canvas = reactive<Canvas>({
  ctx: null as any,
  canvas: null as any,
  width: props.width,
  height: props.height,
})
// 裁剪参数
const _cropper = reactive<Cropper>({
  left: 0, // 起点x
  top: 0, // 起点y
  width: props.cropperBoxWidth, // 宽度
  height: props.cropperBoxHeight, // 高度
})
// 小画布canvas参数
const cropperCanvas = reactive<Omit<Canvas, 'canvas'>>({
  ctx: null as any,
  width: props.cropperWidth,
  height: props.cropperHeight
})
const croppering = ref<boolean>(false)
onMounted(() => {
  initCanvas()
  initCanvasImage()
})
// 存放马赛克图片
const mosaicData = ref<ImageData[]>([])
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
  createEvent(canvas)
}
// 画裁剪图
const drawCropper = (imageData: ImageData) => {
  const cropperCvs = document.getElementById('cropper-canvas') as HTMLCanvasElement
  const cropperCtx = cropperCvs.getContext('2d') as CanvasRenderingContext2D
  cropperCvs.style.width = `${cropperCanvas.width}px`
  cropperCvs.style.height = `${cropperCanvas.height}px`
  cropperCvs.width = cropperCanvas.width * dpr
  cropperCvs.height = cropperCanvas.height * dpr
  cropperCtx.clearRect(0, 0, cropperCvs.width, cropperCvs.height)
  cropperCtx.beginPath()
  // 创建临时canvas
  const tempCanvas: HTMLCanvasElement = document.createElement('canvas')
  tempCanvas.width = _cropper.width * dpr
  tempCanvas.height = _cropper.width * dpr
  const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D
  tempCtx.putImageData(imageData, 0, 0)
  // 添加裁剪图
  cropperCtx.scale(cropperCvs.width / _cropper.width, cropperCvs.height / _cropper.height)
  cropperCtx.drawImage(tempCanvas, 0, 0)
  tempCanvas.remove()
}
// 初始化移动裁剪盒子
const initCropperBox = () => {
  _canvas.ctx.beginPath()
  _canvas.ctx.fillStyle = 'rgba(60, 60, 60, 0.5)'
  _canvas.ctx.fillRect(_cropper.left, _cropper.top, _cropper.width, _cropper.height)
  _canvas.ctx.closePath()
  fillSizeText()
}
const fillSizeText = () => {
  if (!isMosaic.value) {
    _canvas.ctx.beginPath()
    _canvas.ctx.fillStyle = 'hotpink'
    _canvas.ctx.font = '25px Arial'
    _canvas.ctx.textBaseline = 'middle'
    _canvas.ctx.fillText(`${_cropper.width}×${_cropper.height}`, _cropper.left, _cropper.top + 25)
    _canvas.ctx.closePath()
  }
}
// 填充图片
const initCanvasImage = () => {
  return new Promise<void>((resolve, reject) => {
    const img: HTMLImageElement = new Image()
    img.src = URL.value
    img.onload = () => {
      _canvas.ctx.clearRect(0, 0, _canvas.width, _canvas.height)
      if (mosaicData.value.length) {
        _canvas.ctx.putImageData(mosaicData.value[0], 0, 0)
      } else {
        _canvas.ctx.drawImage(img, 0, 0, _canvas.width, _canvas.height)
      }
      const pattern: any = _canvas.ctx.createPattern(img, 'no-repeat')
      _canvas.ctx.fillStyle = pattern
      drawCropper(_canvas.ctx.getImageData(_cropper.left, _cropper.top, _cropper.width, _cropper.height))
      if (!isMosaic.value) {
        initCropperBox()
      }
      resolve()
    }
  })
}
// 点击画布裁剪
const onCropperClick = (e: MouseEvent) => {
  const { left, top }: { left: number, top: number } = _canvas.canvas.getBoundingClientRect()
  croppering.value = true
  const [x, y]: number[] = [(e.pageX - left) * dpr, (e.pageY - top) * dpr]
  // 点击位置不在裁剪盒子位置，移动裁剪盒子
  if ((x > _cropper.width || y > _cropper.height) || (x < _cropper.width || y < _cropper.width)) {
    movePosition(x, y)
    initCanvasImage()
  }
}
// 移动裁剪盒子
const onCropperMove = (e: MouseEvent) => {
  const { left, top }: { left: number, top: number } = _canvas.canvas.getBoundingClientRect()
  const [x, y]: number[] = [(e.pageX - left) * dpr, (e.pageY - top) * dpr]
  _canvas.canvas.style.cursor = pointerInCropperBox([x, y], _cropper) ? 'all-scroll' : 'pointer'
  if (croppering.value) {
    movePosition(x, y)
    initCanvasImage()
  }
}
// 移动盒子
const movePosition = (left: number, top: number) => {
  let moveLeft: number = (left - _cropper.width / 2) 
  let moveTop: number = (top - _cropper.height / 2)
  // 越界处理
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
}
// 停止切图
const stopCropper = () => {
  croppering.value = false
}
// 上传图片
const onChange = (e: any) => {
  URL.value = window.URL.createObjectURL(e.target.files[0])
  initCanvasImage()
}
// 放大
const onEnlarge = () => {
  enlarge(
    { 
      _cropper, 
      _canvas, 
      cropperBoxWidth: props.cropperBoxWidth, 
      cropperBoxHeight: props.cropperBoxHeight 
    }, 
    initCanvasImage
  )
}
// 缩小
const onShrink = () => {
  shrink(_cropper, props.cropperBoxWidth, props.cropperBoxHeight, initCanvasImage)
}
// 马赛克
const onMosaic = async () => {
  isMosaic.value = true
  await initCanvasImage()
  const imgData: ImageData = _canvas.ctx.getImageData(_cropper.left, _cropper.top, _cropper.width, _cropper.height)
  const imgWidth: number = imgData.width
  const imgHeight: number = imgData.height
  const deep: number = props.mosaicDeep
  const [stepW, stepH]: [number, number] = [imgWidth / deep, imgHeight / deep]
  for (let i = 0; i < stepH; i++) {
    for (let j = 0; j < stepW; j++) {
      const color: number[] = getRandomXYColor(
        imgData, j * deep + Math.floor(Math.random() * deep), i * deep + Math.floor(Math.random() * deep)
      )
      for (let k = 0; k < deep; k++) {
        for (let l = 0; l < deep; l++) {
          setRandomXYColor(imgData, j * deep + l, i * deep + k, color)
        }
      }
    }
  }
  _canvas.ctx.putImageData(imgData, _cropper.left, _cropper.top)
  mosaicData.value[0] = _canvas.ctx.getImageData(0, 0, _canvas.width, _canvas.height)
  initCropperBox()
  drawCropper(imgData)
  isMosaic.value = false
}
// 重置
const onReset = () => {
  _cropper.width = props.cropperBoxWidth
  _cropper.height = props.cropperBoxHeight
  _cropper.top = 0
  _cropper.left = 0
  mosaicData.value.length = 0
  initCanvasImage()
}
// 取色
const onColoring = (e: MouseEvent) => {
  const { left, top }: { left: number, top: number } = _canvas.canvas.getBoundingClientRect()
  const [x, y]: number[] = [(e.pageX - left) * dpr, (e.pageY - top) * dpr]
  const color = _canvas.ctx.getImageData(x, y, 1, 1)
  const [r, g, b] = color.data
  const hex: string = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  console.log(`%c rgb(${r}, ${g}, ${b})`, `color: ${hex}`)
}
// 创建事件
const createEvent = (canvas: HTMLCanvasElement) => {
  canvas.addEventListener('click', (e: MouseEvent) => onColoring(e))
  canvas.addEventListener('mousedown', (e: MouseEvent) => onCropperClick(e))
  canvas.addEventListener('mousemove', (e: MouseEvent) => onCropperMove(e))
  canvas.addEventListener('mouseup', stopCropper)
  canvas.addEventListener('mouseleave', stopCropper)
}
// 销毁事件
const destoryEvent = (canvas: HTMLCanvasElement) => {
  canvas.removeEventListener('mousedown', onCropperClick)
  canvas.removeEventListener('mousemove', onCropperMove)
  canvas.removeEventListener('mouseup', stopCropper)
  canvas.removeEventListener('mouseleave', stopCropper)
}
onBeforeUnmount(() => {
  destoryEvent(_canvas.canvas)
})
</script>
<style lang='scss' scoped>
  #canvas {
    cursor: pointer;
    margin-right: 24px;
  }
  .cropper-canvas {
    display: flex;
    align-items: flex-end;
  }
  .cropper-tools {
    display: flex;
    margin-top: 12px;
  }
  .cropper-upload__input {
    position: absolute;
    right: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
  .cropper-upload__btn {
    width: 80px;
    position: relative;
    display: inline-block;
    background: #f54da1;
    border: 1px solid #d9d9d9;
    box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
    border-radius: 3px;
    padding: 4px 8px;
    font-size: 13px;
    color: #fff;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
  }
  .cropper-upload__btn:hover {
    background: #d64b90;
    text-decoration: none;
  }
  .cropper-tools__btn {
    outline: none;
    background: #fff;
    border: 1px #888 solid;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 12px;
    border-radius: 3px;
    &:hover {
      background: #eee;
    }
    &:focus {
      background: #eee;
    }
    &.primary {
      background: #36ad6a;
      color: #fff;
      border: #36ad6a;
      &:hover {
        background: #319f61;
      }
      &:focus {
        background: #319f61
      }
    }
  }
  .ml-12 {
    margin-left: 12px;
  }
</style>
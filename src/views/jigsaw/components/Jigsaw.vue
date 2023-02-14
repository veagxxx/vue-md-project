<template>
  <div class="jigsaw">
    <canvas id="jigsaw-canvas"></canvas>
    <canvas id="original-canvas"></canvas>
  </div>
</template>
<script lang='ts' setup>
import { onMounted, reactive, onBeforeUnmount, ref } from 'vue'
const props = defineProps({
  width: {
    type: [Number, String],
    default: () => 700
  },
  height: {
    type: [Number, String],
    default: () => 350
  },
  cols: {
    type: [Number, String],
    default: () => 6
  },
  rows: {
    type: [Number, String],
    default: () => 3
  },
  originWidth: {
    type: [Number, String],
    default: () => 300,
  },
  originHeight: {
    type: [Number, String],
    default: () => 150
  }
})
onMounted(() => {
  initJigsaw()
})
const dpr: number = 2 // 缩放比
const cols: number = Number(props.cols) + 1
const rows: number = Number(props.rows)
const URL = ref<string>('src/assets/images/hyrz2.jpg')
const img = new Image()
const loading = ref<boolean>(false)
const jCanvas = reactive({
  canvas: null as any,
  ctx: null as any,
  width: +props.width,
  height: +props.height,
})
const oCanvas = reactive({
  canvas: null as any,
  ctx: null as any,
  width: +props.originWidth,
  height: +props.originHeight
})
const moveGrid = reactive({
  row: 0,
  col: 0,
  isMoving: false
})
const matrix = new Array<number[]>(rows)
const initOriginalCanvas = () => {
  const canvas = document.getElementById('original-canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
  canvas.style.width = `${oCanvas.width}px`
  canvas.style.height = `${oCanvas.height}px`
  canvas.width = oCanvas.width * dpr
  canvas.height = oCanvas.height * dpr
  oCanvas.canvas = canvas
  oCanvas.ctx = ctx
  oCanvas.width = canvas.width
  oCanvas.height = canvas.height
  drawOriginImage()
}
const drawOriginImage = () => {
  oCanvas.ctx.clearRect(0, 0, oCanvas.width, oCanvas.height)
  oCanvas.ctx.drawImage(img, 0, 0, oCanvas.width, oCanvas.height)
}
const initJigsaw = () => {
  const canvas = document.getElementById('jigsaw-canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
  canvas.style.width = `${jCanvas.width}px`
  canvas.style.height = `${jCanvas.height}px`
  canvas.width = jCanvas.width * dpr
  canvas.height = jCanvas.height * dpr
  jCanvas.canvas = canvas
  jCanvas.ctx = ctx
  jCanvas.width = canvas.width
  jCanvas.height = canvas.height
  initMatrix()
  initJigsawImage()
  createEvent(canvas)
}
/**
 * 图片位置数据
 */
const initMatrix = () => {
  let number: number = 0
  for (let i = 0; i < rows; i++) {
    matrix[i] = new Array<number>(cols) 
    for (let j = 0; j < cols; j++) {
      matrix[i][j] = number
      number++
    }
  }  
  messMatrix()
}
// 打乱顺序
const messMatrix = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const row: number = Math.floor(Math.random() * rows)
      const col: number = Math.floor(Math.random() * (cols))
      let temp: number = matrix[i][j]
      matrix[i][j] = matrix[row][col]
      matrix[row][col] = temp
    }
  }
}
/**
 * 绘制网格线
 */
const initGridLine = () => {
  const [gW, gH]: [number, number] = [jCanvas.width / (cols), jCanvas.height / rows]
  jCanvas.ctx.strokeStyle = '#aaa'
  for (let i = 0; i < rows; i++) {
    jCanvas.ctx.beginPath()
    jCanvas.ctx.moveTo(0, i * gH)
    jCanvas.ctx.lineTo(jCanvas.width, i * gH)
    jCanvas.ctx.stroke()
    jCanvas.ctx.closePath()
  }
  jCanvas.ctx.beginPath()
  jCanvas.ctx.moveTo(0, jCanvas.height)
  jCanvas.ctx.lineTo(jCanvas.width, jCanvas.height)
  jCanvas.ctx.stroke()
  jCanvas.ctx.closePath()
  for (let i = 0; i < cols; i++) {
    jCanvas.ctx.beginPath()
    jCanvas.ctx.moveTo(i * gW, 0)
    jCanvas.ctx.lineTo(i * gW, jCanvas.height)
    jCanvas.ctx.stroke()
    jCanvas.ctx.closePath()
  }
  jCanvas.ctx.beginPath()
  jCanvas.ctx.moveTo(jCanvas.width, 0)
  jCanvas.ctx.lineTo(jCanvas.width, jCanvas.height)
  jCanvas.ctx.stroke()
  jCanvas.ctx.closePath()
}
/**
 * 初始化拼图
 */
const initJigsawImage = () => {
  const imgW: number = jCanvas.width / (cols)
  const imgH: number = jCanvas.height / rows
  img.src = URL.value
  img.onload = () => {
    if (!loading.value) {
      initOriginalCanvas()
    }
    loading.value = true
    jCanvas.ctx.clearRect(0, 0, jCanvas.width, jCanvas.height)
    const copyCanvas: HTMLCanvasElement = document.createElement('canvas')
    copyCanvas.style.width = `${props.width}px`
    copyCanvas.style.height = `${props.height}px`
    copyCanvas.width = +props.width * dpr
    copyCanvas.height = +props.height * dpr
    const copyCtx = copyCanvas.getContext('2d') as CanvasRenderingContext2D
    copyCtx.drawImage(img, 0, 0, copyCanvas.width - imgW, copyCanvas.height)
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // 获取列
        const col = Math.floor(matrix[i][j] % (cols))
        // 获取图片的行
        const row = Math.floor(matrix[i][j] / (cols))
        // if (!(row === rows - 1 && col === cols - 1)) {
          // 进行绘图
          jCanvas.ctx.drawImage(
            copyCanvas, 
            col * imgW, 
            row * imgH, 
            imgW, 
            imgH, 
            j * imgW, 
            i * imgH, 
            imgW, 
            imgH, 
          )
        // }
      }
      initGridLine()
    }  
    copyCanvas.remove()
  }
}
const startJigsaw = (e: MouseEvent) => {
  const [row, col] = getRowColInMatrix(getXY(e))
  // 空白格
  if ([6, 13, 20].indexOf(matrix[row][col]) > -1) {
    return
  } else {
    moveGrid.row = row
    moveGrid.col = col
    moveGrid.isMoving = true
  }
}
const moveJigsaw = (e: MouseEvent) => {
  if (moveGrid.isMoving) {
    const [row, col] = getRowColInMatrix(getXY(e))
    if (
      (
        (moveGrid.row === row && Math.abs(moveGrid.col - col) === 1) || 
        (moveGrid.col === col && Math.abs(moveGrid.row - row) === 1)
      ) &&
      [6, 13, 20].indexOf(matrix[row][col]) > -1
    ) {
      let temp: number =  matrix[row][col]
      matrix[row][col] = matrix[moveGrid.row][moveGrid.col]
      matrix[moveGrid.row][moveGrid.col] = temp
      moveGrid.row = row
      moveGrid.col = col
      initJigsawImage()
    }
  }
}
const stopJigsaw = () => {
  moveGrid.isMoving = false
}
const getRowColInMatrix = ({ x, y }: { x: number, y: number }) => {
  let row: number = 0
  let col: number = 0
  const [colWidth, rowHeight] = [jCanvas.width / (cols), jCanvas.height / rows]
  for (let i = cols; i >= 1; i--) {
    if (i * colWidth > x) {
      col = i - 1
    }
  }
  for (let i = rows; i >= 1; i--) {
    if (i * rowHeight > y) {
      row = i - 1
    }
  }
  return [row, col]
}
const getXY = (e: MouseEvent) => {
  const { left, top }: { left: number, top: number } = jCanvas.canvas.getBoundingClientRect()
  const [x, y]: number[] = [(e.pageX - left) * dpr, (e.pageY - top) * dpr]
  return { x, y }
}
// 创建事件
const createEvent = (canvas: HTMLCanvasElement) => {
  canvas.addEventListener('mousedown', (e: MouseEvent) => startJigsaw(e))
  canvas.addEventListener('mousemove', (e: MouseEvent) => moveJigsaw(e))
  canvas.addEventListener('mouseup', stopJigsaw)
  canvas.addEventListener('mouseleave', stopJigsaw)
}
// 销毁事件
const destoryEvent = (canvas: HTMLCanvasElement) => {
  canvas.removeEventListener('mousedown', startJigsaw)
  canvas.removeEventListener('mousemove', moveJigsaw)
  canvas.removeEventListener('mouseup', stopJigsaw)
  canvas.removeEventListener('mouseleave', stopJigsaw)
}
onBeforeUnmount(() => {
  destoryEvent(jCanvas.canvas)
})
</script>
<style lang='scss' scoped>
  .jigsaw {
    width: 75%;
    background-color: #fff;
    height: calc(100% - 30px);
    padding: 15px;
    display: flex;
    justify-content: space-between;
    #jigsaw-canvas {
      cursor: pointer;
    }
  }
</style>
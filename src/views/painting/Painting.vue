<template>
  <div class="painting">
    <el-card class="paint-card">
      <template #header>
        <div class="paint-header">
          <div class="header-title"><DrawingBoard color="blue"/>&nbsp;画图</div>
          <el-color-picker :predefine="predefineColors" v-model="color" />
          <TooltipButton
            className="purple"
            type="text"
            :icon="EditPen"
            content="画笔"
            :callback="() => setPaintBrush(1)"
            :selected="paintBrush === 1"
          >
          </TooltipButton>
          <TooltipButton
            type="text"
            :icon="LineSize"
            content="大小"
            placement="bottom"
            :disabled="paintBrush === 100"
          >
            <div 
              class="flex pointer line-size" 
              :class="{ selected: lineSize === 2 ** (i - 1) }"
              style="width: 150px" 
              v-for="i in 4" :key="i + 'px'"
              @click="setPaintSize(2 ** (i - 1))"
            >
              <span>{{`${2 ** (i - 1)}像素`}}：</span>
              <div class="flex-1 line" :style="{ height: `${2 ** (i - 1)}px` }"></div>
            </div>
          </TooltipButton>
          <TooltipButton
            content="填充" 
            type="text" 
            :callback="() => setPaintBrush(100)"
            :selected="paintBrush === 100"
          >
            <template #icon>
              <ColorFill/>
            </template>
          </TooltipButton>
          <TooltipButton 
            content="撤销" 
            className="warning" 
            type="text" 
            :icon="Back" 
            :callback="revokeDraw"
          ></TooltipButton>
          <TooltipButton
            content="清空" 
            className="danger" 
            type="text" 
            :icon="Delete" 
            :callback="clearCanvas"
          ></TooltipButton>
          <TooltipButton 
            content="形状" 
            className="purple" 
            type="text" 
            :icon="Shape" 
            placement="bottom"
          >
            <div class="graph">
              <div title="直线" class="straight-line" @click="setPaintBrush(2)">
                <svg xmlns="http://www.w3.org/2000/svg">
                  <polygon
                    points="0,0 12,12"
                    style="stroke: #666; stroke-width: 1; fill: #fff"
                    :style="paintBrush === 2 ? { stroke: 'hotpink' } : {}"
                  ></polygon>
                </svg>
              </div>
              <div title="矩形" 
                class="rectangle" 
                :class="{ 'selected-border': paintBrush === 3 }"
                @click="setPaintBrush(3)"
              ></div>
              <div title="三角形" class="triangle" @click="setPaintBrush(4)">
                <svg xmlns="http://www.w3.org/2000/svg">
                  <polygon 
                    points="6,0 0,12 12,12" 
                    style="stroke: #666; stroke-width: 1; fill: #fff"
                    :style="paintBrush === 4 ? { stroke: 'hotpink' } : {}"
                  ></polygon>
                </svg>
              </div>
              <div title="直角三角形" class="triangle" @click="setPaintBrush(5)">
                <svg xmlns="http://www.w3.org/2000/svg">
                  <polygon 
                    points="0,0 0,12 12,12" 
                    style="stroke: #666; stroke-width: 1; fill: #fff"
                    :style="paintBrush === 5 ? { stroke: 'hotpink' } : {}"
                  ></polygon>
                </svg>
              </div>
              <div title="圆形" 
                class="circle" 
                @click="setPaintBrush(6)" 
                :class="{ 'selected-border': paintBrush === 6 }"
              ></div>
              <div title="椭圆" 
                class="ellipse" 
                @click="setPaintBrush(7)" 
                :class="{ 'selected-border': paintBrush === 7 }"
              ></div>
            </div>
          </TooltipButton>
          <TooltipButton 
            content="下载" 
            className="primary" 
            type="text" 
            :icon="Download" 
            :callback="dowloadCanvas"
          ></TooltipButton>
        </div>
      </template>
      <div class="paint-body" id="paint-body" 
        :class="{ brush: paintBrush === 1, graphCur: paintBrush && paintBrush !== 1 }"
      >
        <canvas id="canvas"></canvas>
      </div>
    </el-card>
  </div>
</template>

<script lang='ts' setup>
  import { EditPen, Delete, Back, Download } from '@element-plus/icons-vue';
  import { ref, onMounted, reactive, onBeforeUnmount } from 'vue'
  import TooltipButton from '@/components/TooltipButton.vue';
  import { DrawType } from '@/types/index'
  import { 
    predefineColors, 
    initPoint, 
    getFillGragh, 
    Draw, 
    Rectangle, 
    Circle, 
    getCircleData,
    getEllipseData,
    addDraw,
    Triangle,
    Ellipse, 
  } from './painting' 
  import DrawingBoard from '@/components/icons/DrawingBoard.vue'
  import ColorFill from '@/components/icons/ColorFill.vue'
  import Shape from '@/components/icons/Shape.vue'
  import LineSize from '@/components/icons/LineSize.vue'
  const cursor = ref<string>('crosshair')
  const paintBrush = ref<number>(0) // 是否画笔
  const color = ref<string>('#000000') // 颜色
  const lineSize = ref<number>(1) // 线条粗细
  const drawArr = reactive<any>([]) // 画布数组
  const drawing = ref<boolean>(false) // 绘画状态
  const _context = ref<any>(null) // canvas画笔对象
  const center = reactive<{x: number, y: number}>({x: 0, y: 0}) // 起点坐标
  const fillGragh = ref<any>(null)
  // 设置画笔大小
  const setPaintSize = (value: number) => {
    lineSize.value = value
  }
  // 设置画笔样式
  const setPaintBrush = (value: number) => {
    if (value === DrawType.LINE) {
      const img: any = new URL('../../assets/images/pen-90.cur', import.meta.url)
      cursor.value = `url(${img.href})`
    } else if (value === DrawType.FILL) {
      const img: any = new URL('../../assets/images/fill.cur', import.meta.url)
      cursor.value = `url(${img.href})`
    }
    paintBrush.value = paintBrush.value === value ? 0 : value
    _context.value.closePath()
  }
  // 设置起点/圆心
  const setCenterPoint = ({x, y}: {x: number, y: number}) => {
    center.x = x
    center.y = y
  }
  // 初始化
  const initCanvas = () => {
    drawArr.length = 0
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const dom = document.getElementById('paint-body') as HTMLElement
    const [width, height]: number[] = [dom.offsetWidth, dom.offsetHeight]
    const dpr: number = window.devicePixelRatio
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    canvas.width = width * dpr
    canvas.height = height * dpr
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    ctx!.scale(dpr, dpr)
    _context.value = ctx
    initPoint(_context.value)
    canvas.addEventListener('mousedown', (e: MouseEvent) => onMouseDown(canvas, e))
    canvas.addEventListener('mousemove', (e: MouseEvent) => onMouseMove(canvas, e))
    canvas.addEventListener('mouseup', (e: MouseEvent) => onMouseUp(canvas, e))
    canvas.addEventListener('mouseleave', () => onMouseUp())
    canvas.addEventListener('click', (e: MouseEvent) => onMouseClick(canvas, e))
  }
  // 鼠标点击
  const onMouseClick = (canvas: HTMLCanvasElement, e: MouseEvent) => {
    if (paintBrush.value === DrawType.FILL) {
      fillCanvas(fillGragh.value)
    }
  }
  // 鼠标按下
  const onMouseDown = (canvas: HTMLCanvasElement, e: MouseEvent) => {
    drawing.value = true
    if (drawing.value && paintBrush.value) {
      const draw = _context.value.getImageData(0, 0, canvas.width, canvas.height)
      drawArr.push(draw)
      const { left, top }  = canvas.getBoundingClientRect()
      // 获取填充图形
      fillGragh.value = getFillGragh([e.pageX - left, e.pageY - top], canvas)
      _context.value.beginPath()
      if (paintBrush.value === DrawType.LINE) {
          _context.value.moveTo(e.pageX - left, e.pageY - top)
      }
      // 获取起点坐标
      setCenterPoint({ x: e.pageX - left, y: e.pageY - top })
    }
  }
  // 鼠标移动
  const onMouseMove = (canvas: HTMLCanvasElement, e: MouseEvent) => {
    if (drawing.value && paintBrush.value) {
      const { left, top }  = canvas.getBoundingClientRect()
      switch (paintBrush.value) {
        // 画线
        case DrawType.LINE:
          drawLine(e.pageX - left, e.pageY - top)
          break;
        case DrawType.STRAIGHTLINE:
          drawStraightLine(canvas, e.pageX - left, e.pageY - top)
          break
        // 画矩形
        case DrawType.RECTANGLE:
          drawRectangle(canvas, e.pageX - left - center.x, e.pageY - top - center.y)
          break
        // 画三角形
        case DrawType.TRIANGLE:
        case DrawType.RIGHTANGLE:
          drawTriangle(canvas, e.pageX - left, e.pageY - top)
          break
        // 画圆
        case DrawType.CIRCLE:
          const circle = getCircleData(canvas, e, center)
          drawCircle(canvas, circle.centerX, circle.centerY, circle.radius)
          break
        // 椭圆
        case DrawType.ELLIPSE:
          const ellipse = getEllipseData(canvas, e, center)
          drawEllipse(canvas, ellipse.centerX, ellipse.centerY, ellipse.axisX, ellipse.axisY)
        default:
          return;
      }
    }
  }
  // 画线
  const drawLine = (x: number, y: number) => {
    _context.value.lineTo(x, y)
    _context.value.strokeStyle = color.value
    _context.value.lineWidth = lineSize.value
    _context.value.lineJoin = 'round'
    _context.value.stroke()
  }
  // 画直线
  const drawStraightLine = (canvas: HTMLCanvasElement, x: number, y: number): void => {
    redrawCanvas(canvas)
    _context.value.beginPath()
    _context.value.moveTo(center.x, center.y)
    drawLine(x, y)
  }
  // 绘画矩形
  const drawRectangle = (canvas: HTMLCanvasElement, width: number, height: number): void => {
    redrawCanvas(canvas)
    _context.value.strokeStyle = color.value
    // 矩形(从鼠标点击位置到鼠标移动位置，参数1、2为起点，参数3、4为宽高)
    _context.value.strokeRect(center.x, center.y, width, height)
  }
  // 绘画三角形
  const drawTriangle = (canvas: HTMLCanvasElement, x: number, y: number): void => {
    _context.value.beginPath()
    redrawCanvas(canvas)
    if (paintBrush.value === DrawType.TRIANGLE) {
      // 左侧角起点
      _context.value.moveTo(center.x, y)
      // 右侧角
      _context.value.lineTo(x, y)
      // 顶角
      _context.value.lineTo((center.x + x) / 2, center.y)
    } else {
      // 顶角起点
      _context.value.moveTo(center.x, center.y)
      // 左侧角
      _context.value.lineTo(center.x, y)
      // 右侧角
      _context.value.lineTo(x, y)
    }
    _context.value.closePath()
    _context.value.strokeWidth = lineSize.value
    _context.value.strokeStyle = color.value
    _context.value.stroke()
  }
  // 绘画圆
  const drawCircle = (canvas: HTMLCanvasElement, x: number, y: number, radius: number): void => {
    // 开启路径
    redrawCanvas(canvas)
    _context.value.beginPath()
    _context.value.arc(x, y, radius, 0, 2 * Math.PI)
    _context.value.strokeStyle = color.value
    _context.value.stroke()
  }
  /**
   * 绘制椭圆
   * @param canvas canvas元素
   * @param x 中心点x
   * @param y 中心点y
   * @param rx 半轴 x
   * @param ry 半轴 y
   */
  const drawEllipse = (canvas: HTMLCanvasElement, x: number, y: number, rx: number, ry: number) => {
    redrawCanvas(canvas)
    // 开启路径
    _context.value.beginPath()
    _context.value.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI)
    _context.value.strokeStyle = color.value
    _context.value.stroke()
  }
  // 鼠标松开
  const onMouseUp = (canvas?: HTMLCanvasElement, e?: MouseEvent) => {
    drawing.value = false
    if (canvas && e) {
      addDraw(canvas, e, paintBrush.value, center, color.value)
    }
  }
  // 撤销
  const revokeDraw = () => {
    if (drawArr.length) {
      _context.value.putImageData(drawArr.pop(), 0, 0)
    } else {
      return
    }
  }
  // 清空画布
  const clearCanvas = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    ctx.clearRect(0, 0, canvas.width, canvas.height) 
  }
  // 重绘画布
  const redrawCanvas = (canvas: HTMLCanvasElement) => {
    // 清空canvas
    _context.value.clearRect(0, 0, canvas.width, canvas.height)
    // 重新填充绘画矩形之前的canvas
    _context.value.putImageData(drawArr[drawArr.length - 1], 0, 0)
  }
  // 填充画布
  const fillCanvas = (graph: Draw) => {
    _context.value.fillStyle = color.value
    if (graph) {
      if (graph.type === 'rectangle') {
        _context.value.fillRect(...graph.point, (<Rectangle>graph).width, (<Rectangle>graph).height)
      } else if (graph.type === 'circle') {
        _context.value.arc(...graph.point, (<Circle>graph).radius, 0, Math.PI * 2)
        _context.value.fill()
      } else if (graph.type === 'triangle') {
        _context.value.beginPath()        
        if (!(<Triangle>graph).rightAngle) {
          // 左侧角起点
          _context.value.moveTo(graph.point[0], (<Triangle>graph).height + graph.point[1])
          // 右侧角
          _context.value.lineTo((<Triangle>graph).width + graph.point[0], (<Triangle>graph).height + graph.point[1])
          // 顶角
          _context.value.lineTo(graph.point[0] + ((<Triangle>graph).width) / 2, graph.point[1])
        } else {
          // 顶角起点
          _context.value.moveTo(graph.point[0], graph.point[1])
          // 左侧角
          _context.value.lineTo(graph.point[0], (<Triangle>graph).height + graph.point[1])
          // 右侧角
          _context.value.lineTo((<Triangle>graph).width + graph.point[0], (<Triangle>graph).height + graph.point[1])
        }
        _context.value.fill()
      } else if (graph.type === 'ellipse') {
        _context.value.ellipse(...graph.point, (<Ellipse>graph).axisX, (<Ellipse>graph).axisY, 0, 0, 2 * Math.PI)
        _context.value.fill()
      }
    } else {
      // _context.value.fillRect(0, 0, canvas.width, canvas.height)
    }
  }
  // 下载canvas图片
  const dowloadCanvas = () => {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas')
    // a 标签
    const a: HTMLAnchorElement = document.createElement('a')
    a.style.display = 'none'
    const href: string = canvas.toDataURL()
    a.href = href
    // 下载后文件名
    a.download = '画图'
    document.body.appendChild(a)
    // 点击下载
    a.click()
    // 下载完成移除元素
    document.body.removeChild(a)
    // 释放掉blob对象
    window.URL.revokeObjectURL(href)
  }

  onMounted(async () => {
    initCanvas()
  })
  onBeforeUnmount(() => {
    const canvas: any = document.getElementById('canvas')
    canvas.removeEventListener('mousedown', onMouseDown)
    canvas.removeEventListener('mousemove', onMouseMove)
    canvas.removeEventListener('mouseup', onMouseUp)
    canvas.removeEventListener('mouseleave', onMouseUp)
  })
</script>

<style lang='scss' scoped>
  .painting {
    height: calc(100% - 20px);
    background: #eee;
    overflow-y: auto;
    padding: 10px 15px;
    .paint-card {
      height: calc(100% - 2px);
      :deep(.el-card__body) {
        height: 100%;
      }
      .paint-header {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .header-title {
          display: flex;
          align-items: center;
          font-weight: bold;
          color:green;
          user-select: none;
          text-shadow: 0 0 1px currentColor,
              -1px -1px 1px #000,
              0 -1px 1px #000,
              1px -1px 1px #000,
              1px 0 1px #000,
              1px 1px 1px #000,
              0 1px 1px #000,
              -1px 1px 1px #000,
              -1px 0 1px #000;
        }
        .el-button {
          font-size: 120%;
        }
      }
      .paint-body {
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 5px;
        height: calc(100% - 129px);
        box-shadow: 0px 0px 0px 1px #ddd;
      }
    }
  }
  .line-size {
    margin: 2px 0px;
    padding: 3px 5px;
    border-radius: 3px;
    &.selected {
      background: #ddd;
    }
  }
  .graph {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100px;
    .straight-line {
      width: 1em;
      height: 1em;
      cursor: pointer;
    }
    .rectangle {
      border: 1px solid #666;
      width: 10px;
      height: 10px;
      cursor: pointer;
    }
    .triangle {
      width: 1em;
      height: 1em;
      cursor: pointer;
    }
    .circle {
      border: 1px solid #666;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      cursor: pointer;
    }
    .ellipse {
      border: 1px solid #666;
      width: 16px;
      height: 10px;
      border-radius: 50%;
      cursor: pointer;
    }
    svg {
      width: 1em;
      height: 1em;
      font-size: 20px;
    }
    .selected-border {
      border-color: hotpink;
    }
  }
  .line {
    background: #000;
  }
  .flex {
    display: flex;
    align-items: center;
    &.pointer {
      cursor: pointer;
    }
    .flex-1 {
      flex: 1;
    }
  }
  .brush {
    cursor: v-bind(cursor), crosshair;
  }
  .graphCur {
    cursor: crosshair;
  }
</style>
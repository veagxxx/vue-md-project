<template>
  <div class="canvas-date-picker" id="canvas-date-picker">
    <canvas id="date-canvas"></canvas>
  </div>
</template>
<script lang='ts' setup>
  import { onMounted, reactive } from 'vue';
  import { calcDayOfTheYear, calcDate, initEarth } from './date'
  const props = defineProps({
    visible: Boolean,
    dateValue: String,
    width: {
      type: Number,
      default: () => 400
    },
    height: {
      type: Number,
      default: () => 350
    }
  })
  const emit = defineEmits(['updateDate'])
  const scale: number = 2 // 缩放比
  const orbitRadius: number = 250 // 轨道半径
  interface PickerCanvas {
    ctx: CanvasRenderingContext2D | null;
    canvas: HTMLCanvasElement | null;
    width: number;
    height: number;
  }
  interface Earth {
    radius: number;
    x: number;
    y: number;
    hasSelected: boolean;
  }
  onMounted(() => {
    initCanvasDatePicker()
  })
  const picker = reactive<PickerCanvas>({
    ctx: null,
    canvas: null,
    width: 0,
    height: 0,
  })
  const earth = reactive<Earth>({
    radius: 20,
    x: 0,
    y: 0,
    hasSelected: false
  })
  const initCanvasDatePicker = () => {
    const container = document.getElementById('canvas-date-picker') as HTMLElement
    const canvas = document.getElementById('date-canvas') as HTMLCanvasElement
    const width: number = props.width || container.offsetWidth
    const height: number = props.height || container.offsetHeight
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    canvas.width = width * scale
    canvas.height = height * scale
    const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
    picker.canvas = canvas
    picker.ctx = ctx
    picker.width = canvas.width
    picker.height = canvas.height
    const { x, y } = initEarth(props.dateValue || '', orbitRadius)
    earth.x = picker.width / 2 + x
    earth.y = picker.height / 2 - y
    mountPickerEvent()
    redraw()
  }
  // 挂载事件
  const mountPickerEvent = () => {
    picker.canvas?.addEventListener('mousedown', (e: MouseEvent) => onCanvasClick(e))
    picker.canvas?.addEventListener('mousemove', (e: MouseEvent) => onEarthMove(e))
    picker.canvas?.addEventListener('mouseup', onStopMoving)
    picker.canvas?.addEventListener('mouseleave', onStopMoving)
  }
  // 画布点击
  const onCanvasClick = (e: MouseEvent) => {
    const { left, top } = picker.canvas!.getBoundingClientRect()
    const center: number[] = [earth.x, earth.y]
    const point: number[] = [(e.pageX - left) * scale, (e.pageY - top) * scale]
    earth.hasSelected = pointInCircle(center, earth.radius, point)
  }

  // 是否在圆上
  const pointInCircle = (center: number[], radius: number, point: number[]): boolean => {
    return (point[0] - center[0]) ** 2 + (point[1] - center[1]) ** 2 <= radius ** 2
  }
  const redraw = () => {
    picker.ctx?.clearRect(0, 0, picker.width, picker.height)
    drawEarthOrbit()
    drawSun()
    drawEarth()
  }
  // 移动地球
  const onEarthMove = (e: MouseEvent) => {
    if (earth.hasSelected) {
      const { left, top } = picker.canvas!.getBoundingClientRect()
      const point: number[] = [(e.pageX - left) * scale, (e.pageY - top) * scale]
      calcEarthPosition(point)
      redraw()
    }
  }
  // 计算地球位置
  const calcEarthPosition = (point: number[]) => {
    const [x, y]: number[] = point
    const [cx, cy]: number[] = [picker.width / 2, picker.height / 2]
    const deg: number = Math.atan2(Math.abs(cy - y), Math.abs(cx - x))
    const dx: number = orbitRadius * Math.cos(deg)
    const dy: number = orbitRadius * Math.sin(deg)
    if (x > cx) {
      earth.x = cx + dx
    } else if (x === cx) {
      earth.x = cx
    } else {
      earth.x = cx - dx
    }
    if (y > cy) {
      earth.y = cy + dy
    } else if (y === cy) {
      earth.y = cy
    } else {
      earth.y = cy - dy
    }
    const angle: number = calcAngle(x, y)
    const days: number = calcDayOfTheYear(props.dateValue || '', angle)
    const date: string = calcDate(days)
    emit('updateDate', date)
  }
  // 计算角度
  const calcAngle = (x: number, y: number): number => {
    // 原点
    const [cx, cy]: number[] = [picker.width / 2, picker.height / 2]
    // 减 90 是因为把最顶点当作 0 度
    let deg: number = (360 * Math.atan2(cy - y, cx - x)) / (Math.PI * 2) - 90
    // 第四象限，第三象限，第二象限
    if ((x > cx && cy < y) || (x <= cx && cy <= y) || (x < cx && cy > y)) {
      deg += 360
    }
    return deg
  }
  // 停止
  const onStopMoving = () => {
    earth.hasSelected = false
  }
  // 地球绕太阳运行轨道
  const drawEarthOrbit = () => {
    picker.ctx?.beginPath()
    const { width, height } = picker
    picker.ctx?.arc(width / 2, height / 2, orbitRadius, 0, Math.PI * 2)
    picker.ctx?.closePath()
    picker.ctx!.strokeStyle = '#fff'
    picker.ctx?.stroke()
  }
  // 画地球
  const drawEarth = () => {
    drawPlanet(earth.x, earth.y, earth.radius, '#037AEE', '#113d66')
  }
  // 画太阳
  const drawSun = () => {
    const { width, height } = picker
    drawPlanet(width / 2, height / 2, 50, '#f00', '#f90')
  }
  const drawPlanet = (x: number, y: number, r: number, sColor: string, eColor: string) => {
    picker.ctx?.beginPath()
    picker.ctx?.arc(x, y, r, 0, Math.PI * 2)
    const color: any = picker.ctx?.createRadialGradient(x, y, 0, x, y, r)
    picker.ctx?.closePath()
    color?.addColorStop(0, sColor)
    color?.addColorStop(1, eColor)
    picker.ctx!.fillStyle = color
    picker.ctx?.fill()
  }
</script>
<style lang='scss' scoped>
  .canvas-date-picker {
    /* height: calc(100% - 20px); */
    height: 350px;
    width: 350px;
    z-index: 2023;
    canvas {
      background: #132332;
    }
  }
</style>
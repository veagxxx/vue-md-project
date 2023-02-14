<template>
  <div class="canvas-date-picker" id="canvas-date-picker">
    <canvas id="date-canvas"></canvas>
  </div>
</template>
<script lang='ts' setup>
  import { onMounted, reactive } from 'vue';
  const scale: number = 2
  const orbitRadius: number = 250
  interface PickerCanvas {
    ctx: CanvasRenderingContext2D | null;
    canvas: HTMLCanvasElement | null;
    width: number;
    height: number;
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
  const earth = reactive({
    radius: 20,
    center: [0, 0],
    
  })
  const initCanvasDatePicker = () => {
    const container = document.getElementById('canvas-date-picker') as HTMLElement
    const canvas = document.getElementById('date-canvas') as HTMLCanvasElement
    const width = container.offsetWidth
    const height = container.offsetHeight
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    canvas.width = width * scale
    canvas.height = height * scale
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    picker.canvas = canvas
    picker.ctx = ctx
    picker.width = canvas.width
    picker.height = canvas.height
    mountPickerEvent()
    drawEarthOrbit()
    drawSun()
    drawEarth()
  }
  // 挂载事件
  const mountPickerEvent = () => {
    picker.canvas?.addEventListener('click', (e: MouseEvent) => onCanvasClick(e))
    picker.canvas?.addEventListener('mousemove', (e: MouseEvent) => onEarthMove(e))
  }
  // 画布点击
  const onCanvasClick = (e: MouseEvent) => {
    const { left, top } = picker.canvas!.getBoundingClientRect()
    const { width, height } = picker
    const center: number[] = earth.center
    const point: number[] = [(e.pageX - left) * scale, (e.pageY - top) * scale]
    const hasSelectEarth: boolean = pointInCircle(center, earth.radius, point)
  }
  // 是否在圆上
  const pointInCircle = (center: number[], radius: number, point: number[]): boolean => {
  return (point[0] - center[0]) ** 2 + (point[1] - center[1]) ** 2 <= radius ** 2
}
  // 移动地球
  const onEarthMove = (e: MouseEvent) => {

  }
  // 地球绕太阳运行轨道
  const drawEarthOrbit = () => {
    picker.ctx?.beginPath()
    const { width, height } = picker
    picker.ctx?.arc(width / 2, height / 2, orbitRadius, 0, Math.PI * 2)
    picker.ctx?.closePath()
    picker.ctx!.strokeStyle = '#000'
    picker.ctx?.stroke()
  }
  // 画地球
  const drawEarth = () => {
    const { width, height } = picker
    earth.center = [width / 2, height / 2 - orbitRadius]
    drawPlanet(width / 2, height / 2 - orbitRadius, earth.radius, '#78b1e8', '#050c12')
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
    height: calc(100% - 20px);
  }
</style>
import SeriesChart from './charts/Chart';
import { ChartData, Chart, Legend, Title, Option, ChartTypeData } from './type'

interface ZCharts {
  _container: HTMLElement; // 图表容器
  _canvas: HTMLCanvasElement; // canvas 元素
  _ctx: CanvasRenderingContext2D; // canvas上下文实例
  width: number; // canvas 宽
  height: number; // canvas 高
}
class ZCharts extends SeriesChart implements ZCharts {
  private chartsDrawData: ChartTypeData[] = [] // 
  private option: Option | null = null
  private dpr: number = window.devicePixelRatio
  constructor(container: HTMLElement) {
    super()
    this._container = container
    this.initCanvas()
  }
  private createCanvas() {
    const oldCanvas = document.getElementById('z-canvas')
    oldCanvas && this._container.removeChild(oldCanvas)
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    canvas.id = 'z-canvas'
    this._container.appendChild(canvas)
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this._ctx = ctx
    this._canvas = canvas
  }
  /**
   * 初始化
   */
  private initCanvas(resize?: boolean) {
    const offsetWidth: number = this._container.offsetWidth
    const offsetHeight: number = this._container.offsetHeight
    const width: number = offsetWidth * this.dpr
    const height: number = offsetHeight * this.dpr
    if (!resize) {
      this.createCanvas()
    }
    this._canvas.width = width
    this._canvas.height = height
    this._canvas.style.width = offsetWidth + 'px'
    this._canvas.style.height = offsetHeight + 'px'
    this.width = width
    this.height = height
    this._canvas.addEventListener('click', (event: MouseEvent) => this.pointInCanvas(event))
  }
  /**
   * 设置图表配置参数
   * @param option charts option data
   */
  setOption(option: Option | null) {
    this.option = option
    if (option) {
      this._ctx.clearRect(0, 0, this.width, this.height)
      this.drawTitle(option.title, this._ctx, this.width)
      this.initBarChart(option, this._ctx, this._canvas)
      // this.drawChartByData(option.series || [])
    }
  }
  private drawChartByData(chartData: Chart[]) {
    chartData.forEach((item: Chart, index: number) => {
      switch (item.type) {
        case 'bar':
          break;
        case 'pie':
          let startAngle: number = 0 // 起始角
          const total: number = item.data.reduce((pre: number, cur: ChartData) => pre + cur.value, 0)
          const radius: number[] = item.radius ? item.radius : [0, 50]
          const [x, y]: number[] = [this.width / 2, this.height / 2] // 圆心坐标
          for (let i = 0; i < item.data.length; i++) {
            const angle: number = Math.PI / 180 * (360 * item.data[i].value / total) // 计算角度
            const r: number = radius[1] / 100 * this.height / 2 // 半径
            const endAngle: number = startAngle + angle
            const data: ChartTypeData = {
              id: Math.random(),
              type: 'pie',
              x, 
              y,
              r,
              color: item.colors ? item.colors[i] : 'red',
              startAngle,
              endAngle,
              state: 0,
              radius,
            }
            this.drawPieChart(data)
            startAngle = endAngle
          }
          break;
      }
    })
  }
  private drawPieChart(chart: ChartTypeData) {
    const { x, y, r, startAngle, endAngle } = chart
    const chartIndex: number = this.chartsDrawData.findIndex((ch: ChartTypeData) => ch.id === chart.id)
    if (chartIndex > -1 && this.chartsDrawData[chartIndex].r !== r) {
      this.chartsDrawData[chartIndex].color = '#fff'
      this.chartsDrawData[chartIndex].r += 1
      // this.chartsDrawData[chartIndex].shadowBlur = 0
      this.drawPieChart(this.chartsDrawData[chartIndex])
    }
    this._ctx.beginPath()
    this._ctx.moveTo(x, y) // 绘制扇形需要移动到圆心
    this._ctx.strokeStyle = '#fff'
    this._ctx.fillStyle = chart.color || 'red'
    // this._ctx.shadowBlur = chart.shadowBlur || 0
    // this._ctx.shadowColor = "black";
    this._ctx.arc(x, y, r, startAngle, endAngle, false)
    this._ctx.closePath()
    this._ctx.stroke()
    this._ctx.fill()
    if (chartIndex === -1) {
      this.chartsDrawData.push(chart)
    } else {
      this.chartsDrawData.splice(chartIndex, 1, chart)
    }
  }
  /**
   * 鼠标是否在canvas上
   * @param event 鼠标事件
   * @param item canvas
   */
  private pointInCanvas(event: MouseEvent) {
    const { x, y } = this.getMousePoint(event)
    const copyData: ChartTypeData[] = JSON.parse(JSON.stringify(this.chartsDrawData))
    for (let i = 0; i < copyData.length; i++) {
      const item: ChartTypeData = copyData[i]
      if (item.type === 'pie' && this.pointInPie([x, y], item)) {
        item.state = item.state ? 0 : 1
        // item.shadowBlur = 10
        item.r = item.state ? item.r + 20 : item.r - 20
        this.drawPieChart(item)
      } else {
        item.state = 0
      }
    }
    // console.log(x, y)
  }
  private pointInPie(point: [number, number], pieData: ChartTypeData): boolean {
    const { x, y, r, startAngle, endAngle, radius } = pieData
    const [diffX, diffY] = [point[0] - x / this.dpr, point[1] - y / this.dpr]
    // 鼠标到圆心位置
    const dis: number = Math.sqrt(diffX * diffX + diffY * diffY)
    // 是否在扇形对应角度区域
    let ang: number = Math.atan2(diffY, diffX)
    if (ang < 0) {
      ang += Math.PI * 2
    }
    return (dis < r) && (ang >= startAngle && ang < endAngle)
  }
  /**
   * 获取鼠标位置
   * @param event 
   * @returns 
   */
   private getMousePoint(event: MouseEvent) {
    const { clientX, clientY, pageX, pageY }: { clientX: number, clientY: number, pageX: number, pageY: number } = event
    const { left, top } = this._canvas.getBoundingClientRect()
    const [x, y] = [clientX - left, clientY - top]
    return { x, y }
  }
  resize() {
    if (this.option) this.option.animation = false
    this.initCanvas(true)
    this.setOption(this.option)
  }
  private canvasDestory() {
    this._canvas.removeEventListener('click', (event: MouseEvent) => this.pointInCanvas(event))
  }
}

export default ZCharts
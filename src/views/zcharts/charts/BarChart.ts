import { fi } from "element-plus/lib/locale";
import { Axis, XYAxis, Option } from "../type";


class Bar {
  private barChartMGW: number = 150
  private barChartMGH: number = 50
  private barChartWidth: number = 50
  private axisFontSize: number = 20
  private yAxisGap: number = 10
  private maxValue: number = 0
  private maxYScaleCount: number = 5
  private yAxisList: string[] | number[] = []
  initAxis<T>(
    option: Option<T>, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement
  ) {
    this.drawYScaleValue(option, ctx, canvas)
  }
  // Y 坐标刻度
  private drawYScaleValue<T>(
    option: Option<T>, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement
  ) {
    if (option.yAxis.type || !option.yAxis.data) {
      for (let i = 0; i < option.series.length; i++) {
        this.maxValue = Math.max(this.maxValue, ...option.series[i].data.map(i => i.value))
      }
    } else {
      this.yAxisList = option.yAxis.data ? <string[] | number[]>option.yAxis.data : []
    }
    if (!this.maxValue && !this.yAxisList.length) return
    if (this.maxValue) {
      ctx.font = `${this.axisFontSize}px 微软雅黑`
      ctx.fillStyle = '#333'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      this.yAxisGap = Math.ceil(this.maxValue / this.maxYScaleCount)
      this.yAxisGap = this.fillNumber(this.yAxisGap)
      if (this.maxValue % this.yAxisGap !== 0) {
        this.maxValue += this.yAxisGap - this.maxValue % this.yAxisGap
      }
      const length: number = this.maxValue / this.yAxisGap + 1
      const average: number = (canvas.height - 3 * this.barChartMGH) / length
      let index: number = 1
      while (this.maxValue >= 0) {
        // 刻度值
        ctx.fillText(this.maxValue.toString(), this.barChartMGW, this.barChartMGH + index * average)
        // y坐标数值横线
        ctx.beginPath()
        ctx.moveTo(this.barChartMGW + this.barChartWidth, this.barChartMGH + index * average)
        ctx.lineTo(canvas.width - this.barChartMGW, this.barChartMGH + index * average)
        ctx.strokeStyle = '#333'
        ctx.stroke()
        ctx.closePath()
        this.maxValue -= this.yAxisGap
        index++
      }
    }
    
  }
  private fillNumber(num: number): number {
    const length: number = num.toString().length
    const fill: number = 10 ** (length - 1)
    return num + fill - num % fill
  }
}

export default Bar
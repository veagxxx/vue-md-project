import { Chart, Legend, Option } from "../type";
import Common from "./common";
/**
 * class of Bar Chart
 */
class Bar extends Common {
  private barChartMGW: number = 150 // 左右边距
  private barChartMGH: number = 50 // 上下边距
  private yAxisValue_Line_Gap: number = 50 // y轴刻度与线的距离
  private axisFontSize: number = 25 // 刻度字体大小
  private yAxisGap: number = 2 // y轴每条刻度的差距
  private maxValue: number = 0 // 最大刻度
  private maxYScaleCount: number = 5 // 最大y轴刻度数
  private yAxisList: string[] | number[] = [] // y轴
  private barGap: number = 0.2 // 柱体间隙(柱体宽度占比)
  private step: number = 50 // 动画速度
  private series: Chart[] = [] // 
  // 初始化柱状图
  initBarChart(
    option: Option, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement
  ) {
    this.series = this._deepClone(option.series)
    this.initBarFrame(option, ctx, canvas)
    this.drawBar(option, ctx, canvas)
    this.initSeries()
  }
  /**
   * 初始化柱状图基本框架
   * @param option 
   * @param ctx 
   * @param canvas 
   */
  private initBarFrame(
    option: Option, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement
  ) {
    this.drawLegend(option, ctx, canvas)
    this.drawYScaleValue(option, ctx, canvas)
    this.drawXScaleValue(option, ctx, canvas)
    this.drawTitle(option.title, ctx, canvas.width)
  }
  private initSeries() {
    this.series.forEach((item, index) => {
      item.data.forEach((it) => {
        it.rate = 0
      })
    })
  }
  /**
   * 画柱状图
   * @param option 
   * @param ctx 
   * @param canvas 
   */
  private drawBar(
    option: Option, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement
  ) {
    this.animation = option.animation === undefined ? this.animation : option.animation
    // 系列数据
    const series: Chart[] = this.series
    // y轴0点
    const zeroH: number = canvas.height - 3 * this.barChartMGH
    // x轴0点
    const zeroX: number = this.barChartMGW + this.yAxisValue_Line_Gap
    // x坐标轴
    const xAxis: any[] = option.xAxis.data || []
    // 最大y轴高度
    const maxLineH: number = zeroH / (this.maxValue / this.yAxisGap + 1) + this.barChartMGH
    // 最大x轴距离
    const maxLineW: number = canvas.width - 2 * this.barChartMGW - this.yAxisValue_Line_Gap
    // x 轴刻度平均值
    const average: number = maxLineW / (xAxis.length || Math.max(...series.map(s => s.data.length)) || 1)
    // 柱状图高度
    const barChartH: number = zeroH + this.barChartMGH
    // 宽度占比（1 + 数据数量 + 总间隙数量中等于多少个数据数量）
    const Rate_W: number = 1 / (1 + series.length + this.barGap * (series.length - 1))
    // 柱体宽度
    const barW: number = average * Rate_W
    // 柱体间距
    const barGap: number = series.length === 1 ? 0 : this.barGap * barW
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.initBarFrame(option, ctx, canvas)
      for (let i = 0; i < series.length; i++) {
        // 柱状图起点 x = zero(0点) + (barW/2 刻度左边距 + i * barW柱体宽度 + i * barGap 柱体间隙))
        let startX: number = zeroX + barW / 2 + i * (barW + barGap)
        // ctx.clearRect(0, 0, canvas.width, canvas.height)
        series[i].data.forEach((item, index) => {
          ctx.beginPath()
          // 获取颜色
          // const colors: string[] = series[i].colors || []
          ctx.fillStyle = this.defaultColors[i % this.defaultColors.length]
          // 数值高度占比
          const value_H_Rate: number = (this.animation ? (item.rate || 0) : item.value) / this.maxValue
          // 主体高度
          const barH: number = value_H_Rate * (barChartH - maxLineH)
          ctx.rect(startX, barChartH, barW, -barH)
          ctx.stroke()
          ctx.fill()
          ctx.closePath()
          ctx.beginPath()
          ctx.font = `${20}px 微软雅黑`
          ctx.textBaseline = 'middle'
          ctx.fillText(
            item.value.toString(), 
            startX + barW / 2, 
            barChartH - value_H_Rate * (barChartH - maxLineH) - 10
          )
          ctx.closePath()
          // 下一个柱体起点
          startX += average
          // 动画数据
          if (item.rate || item.rate === 0) {
            if (item.rate > item.value) {
              item.rate = item.value
            } else if (item.rate < item.value) {
              item.rate += this.step
            }
          }
        })
      }
      if (this.animation) {
        window.requestAnimationFrame(render)
      }
    }
    render()

  }
  /**
   * 画图例
   * @param option 
   */
  private drawLegend(
    option: Option, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement
  ) {
    const legend: Legend = option.legend || this.legend
    if (legend.data && legend.show !== false) {
      // 图例宽
      const lWid: number = legend.width || this.legendW
      // 图例高
      const lHgt: number = legend.height || this.legendH
      // 图例间隔
      const lGap: number = legend.gap || this.legendGap
      // 图例字体大小
      const l_fontSize: number = legend.fontSize || this.legend_text_size
      // 字体总宽度
      const fontW: number = legend.data.map((item: string) => item.length).reduce((pre: number, cur: number) => pre + cur, 0) * l_fontSize
      // 图例总宽度
      const legendW: number = legend.data.length * lWid
      // 图例间距总宽度
      const gapW: number = (legend.data.length - 1) * lGap
      // 开始位置
      let startX: number = (canvas.width - legendW - gapW - fontW) / 2
      if (legend.align) {
        if (legend.align === 'left') {
          startX = this.barChartMGW
        } else if (legend.align === 'right') {
          startX = canvas.width - this.barChartMGW - legendW - gapW - fontW
        }
      } 
      for (let i = 0; i < legend.data.length; i++) {
        // 图例文字宽度
        const l_fontWidth: number = l_fontSize * legend.data[i].length
        ctx.beginPath()
        // const colors: string[] = option.series[0].colors || []
        const colors: string[] = []
        ctx.fillStyle = colors[i] || this.defaultColors[i % this.defaultColors.length]
        ctx.strokeStyle = colors[i] || this.defaultColors[i % this.defaultColors.length]
        ctx.font = `${l_fontSize}px 微软雅黑`
        ctx.textBaseline = 'top'
        ctx.textAlign = 'left'
        ctx.rect(startX, legend.top || this.legendTop, lWid, lHgt)
        ctx.fill()
        ctx.fillText(
          legend.data[i], 
          startX + lWid + this.legend_rect_text_gap, 
          legend.top || this.legendTop + this.legend_rect_text_gap
        )
        ctx.closePath()
        startX += lWid + lGap + l_fontWidth
      }
    }
  }
  /**
   * y 轴刻度线
   * @param option 
   * @param ctx 
   * @param canvas 
   * @returns 
   */
  private drawYScaleValue(
    option: Option, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement
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
      let maxValue: number = this.maxValue
      while (maxValue >= 0) {
        // 刻度值
        ctx.fillText(maxValue.toString(), this.barChartMGW, this.barChartMGH + index * average)
        // y坐标数值横线
        ctx.beginPath()
        ctx.moveTo(this.barChartMGW + this.yAxisValue_Line_Gap, this.barChartMGH + index * average)
        ctx.lineTo(canvas.width - this.barChartMGW, this.barChartMGH + index * average)
        ctx.strokeStyle = '#999'
        ctx.stroke()
        ctx.closePath()
        maxValue -= this.yAxisGap
        index++
      }
    }
  }
  /**
   * x 轴刻度线
   * @param option 
   * @param ctx 
   * @param canvas 
   * @returns 
   */
  private drawXScaleValue(
    option: Option, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement
  ) {
    if (option.xAxis.data) {
      const xAxisList = <string[] | number[]>option.xAxis.data
      ctx.beginPath()
      ctx.font = `${this.axisFontSize}px 微软雅黑`
      ctx.fillStyle = '#333'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      const length: number = option.xAxis.data.length
      // x 轴刻度平均值
      const average: number = (canvas.width - 2 * this.barChartMGW - this.yAxisValue_Line_Gap) / length
      const zeroH: number = canvas.height - 3 * this.barChartMGH
      const zeroX: number = this.barChartMGW + this.yAxisValue_Line_Gap
      let lastX: number = zeroX + average
      // x 轴刻度
      for (let i = 0; i < length; i++) {
        ctx.moveTo(zeroX + average * i, zeroH + this.barChartMGH)
        ctx.lineTo(zeroX + average * i, zeroH + this.barChartMGH + 15)
        ctx.stroke()
        ctx.fillText(xAxisList[i].toString(), (lastX + zeroX + average * i) / 2, zeroH + this.barChartMGH + 15)
        lastX += average
      }
      ctx.closePath()
      // 最后一个 x 刻度
      ctx.beginPath()
      ctx.moveTo(zeroX + average * length, zeroH + this.barChartMGH)
      ctx.lineTo(zeroX + average * length, zeroH + this.barChartMGH + 15)
      ctx.stroke()
      ctx.closePath()
    } else {
      return
    }
  }
  private fillNumber(num: number): number {
    const length: number = num.toString().length
    const fill: number = 10 ** (length - 1)
    return num + fill - num % fill
  }
}

export default Bar
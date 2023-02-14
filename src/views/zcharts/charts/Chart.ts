import { Chart, ChartData, Legend, Option } from "../type";
import Common from "./common";
/**
 * class of Bar Chart
 */
class SeriesChart extends Common {
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
  private _max: number[] = [0, 0, 0]
  // 初始化柱状图
  initBarChart(
    option: Option, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement
  ) {
    this.series = this._deepClone(option.series)
    const chartGap = option.chartGap
    this.barChartMGW = chartGap?.lr ? chartGap?.lr : this.barChartMGW
    this.getMaxValueAndIndex(this.series)
    this.initBarFrame(option, ctx, canvas)
    this.drawSeriesChart(option, ctx, canvas)
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
  private drawSeriesChart(
    option: Option, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement
  ) {
    this.animation = !!option.animation
    // 系列数据
    const series: Chart[] = this.series
    // 柱体列数
    const barSeriesLength: number = series.filter(item => item.type === 'bar').length
    // y轴0点
    const zeroH: number = canvas.height - 2 * this.barChartMGH
    // x轴0点
    const zeroX: number = this.barChartMGW + this.yAxisValue_Line_Gap
    // x坐标轴
    const xAxis: any[] = option.xAxis.data || []
    // y轴刻度数
    const length: number = this.maxValue / this.yAxisGap + 1
    // 平均y轴刻度间隔
    const average_Y_Gap: number = (canvas.height - 3 * this.barChartMGH) / length
    // 最大y轴位置（上边距+第一个y轴刻度）
    const maxLineH: number = this.barChartMGH + average_Y_Gap
    // const maxLineH: number = zeroH / (this.maxValue / (this.yAxisGap + 1))
    // 最大x轴距离
    const maxLineW: number = canvas.width - 2 * this.barChartMGW - this.yAxisValue_Line_Gap
    // x 轴刻度平均值
    const average: number = maxLineW / (xAxis.length || Math.max(...series.map(s => s.data.length)) || 1)
    // 宽度占比（1 + 数据数量 + 总间隙数量中等于多少个数据数量）
    const Rate_W: number = 1 / (1 + barSeriesLength + this.barGap * (barSeriesLength - 1))
    // 柱体宽度
    const barW: number = average * Rate_W
    // 柱体间距
    const barGap: number = barSeriesLength === 1 ? 0 : this.barGap * barW
    const render = () => {
      // 最后一条画图数据动画结束
      if (
        series[this._max[0]].data[this._max[1]].rate === this._max[2] &&
        series[series.length - 1].data[series[series.length - 1].data.length - 1].rate === 
        series[series.length - 1].data[series[series.length - 1].data.length - 1].value
      ) {
        this.animation = false
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.initBarFrame(option, ctx, canvas)
      for (let i = 0; i < series.length; i++) {
        const data: ChartData[] = series[i].data
        // 柱状图起点 x = zero(0点) + (barW/2 刻度左边距 + i * barW柱体宽度 + i * barGap 柱体间隙))
        let startX: number = zeroX + barW / 2 + i * (barW + barGap)
        // 折线图 x 起点
        let lineStartX: number = zeroX
        // const colors: string[] = series[i].colors || this.defaultColors
        const color: string = this.defaultColors[i % this.defaultColors.length]
        data.forEach((item, index) => {
          if (series[i].type === 'bar') {
            // 数值高度占比
            const value_H_Rate: number = (this.animation ? (item.rate || 0) : item.value) / this.maxValue
            // 主体高度
            const barH: number = value_H_Rate * (zeroH - maxLineH)
            this.drawBar(ctx, color, [startX, zeroH], barW, -barH)
            ctx.beginPath()
            ctx.font = `${20}px 微软雅黑`
            ctx.textBaseline = 'middle'
            ctx.fillText(
              `${(this.animation ? (item.rate || 0) : item.value)}`, 
              startX + barW / 2, 
              zeroH - value_H_Rate * (zeroH - maxLineH) - 10
            )
            ctx.closePath()
            // 下一个柱体起点
            startX += average
          } else if (series[i].type === 'line') {
            const dataLength: number = data.length
            // 数值高度占比
            const value_H_Rate: number = (this.animation ? (item.rate || 0) : item.value) / this.maxValue
            // next 数值高度占比
            const value_H_Rate2: number = 
              index < dataLength - 1 ? 
              (this.animation ? (data[index + 1].rate || 0) : data[index + 1].value) / this.maxValue : 
              value_H_Rate
            // 线 y 开始点
            const lineStartY: number = zeroH - value_H_Rate * (zeroH - maxLineH)
            // 线 y 下一个点
            const lineNextY: number = zeroH - value_H_Rate2 * (zeroH - maxLineH)
            index === 0 && this.drawJoinCircle(ctx, [lineStartX + average / 2, lineStartY], color)
            if (index !== dataLength - 1) {
              // 画拐点圆，返回线的x，y偏移量
              const [dX, dY] = this.drawJoinCircle(ctx, [lineStartX + 1.5 * average, lineNextY], color)
              this.drawLine(
                ctx, color,
                [lineStartX + average / 2 + dX, lineStartY + (lineStartY < lineNextY ? dY : -dY)], 
                [lineStartX + 1.5 * average - dX, lineNextY + (lineStartY < lineNextY ? -dY : dY)]
              )
            }
            lineStartX += average
          }
          // 动画效果数据
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
   * 画柱状图
   * @param ctx 
   * @param color 
   * @param start 
   * @param width 
   * @param height 
   */
  private drawBar (
    ctx: CanvasRenderingContext2D, color: string, start: [number, number], width: number, height: number
  ) {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.rect(...start, width, height)
    ctx.stroke()
    ctx.fill()
    ctx.closePath()
  }
  /**
   * 画线
   * @param ctx 
   * @param color 
   * @param startPoint 
   * @param endPoint 
   */
  private drawLine (
    ctx: CanvasRenderingContext2D, color: string, startPoint: [number, number], endPoint: [number, number]
  ) {
    ctx.beginPath()
    ctx.lineWidth = 3
    ctx.strokeStyle = color
    ctx.moveTo(...startPoint)
    ctx.lineTo(...endPoint)
    ctx.stroke()
    ctx.closePath()
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
      const fontW: number = legend.data.map(
        (item: string) => item.length
      ).reduce(
        (pre: number, cur: number) => pre + cur, 0
      ) * l_fontSize
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
    // 获取最大刻度
    if (option.yAxis.type || !option.yAxis.data) {
      this.maxValue = this._max[2]
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
      // 根据最大刻度获取刻度差
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
        ctx.lineWidth = 1
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
      const zeroH: number = canvas.height - 2 * this.barChartMGH
      const zeroX: number = this.barChartMGW + this.yAxisValue_Line_Gap
      let lastX: number = zeroX + average
      // x 轴刻度
      for (let i = 0; i < length; i++) {
        ctx.moveTo(zeroX + average * i, zeroH)
        ctx.lineTo(zeroX + average * i, zeroH + 15)
        ctx.stroke()
        ctx.fillText(xAxisList[i].toString(), (lastX + zeroX + average * i) / 2, zeroH + 15)
        lastX += average
      }
      ctx.closePath()
      // 最后一个 x 刻度
      ctx.beginPath()
      ctx.moveTo(zeroX + average * length, zeroH)
      ctx.lineTo(zeroX + average * length, zeroH + 15)
      ctx.stroke()
      ctx.closePath()
    } else {
      return
    }
  }
  /**
   * 画折线图拐点，并返回拐点圆的[x, y]偏移量
   * @param ctx 
   * @param point 
   * @returns 
   */
  private drawJoinCircle(ctx: CanvasRenderingContext2D, point: [number, number], color: string) {
    ctx.beginPath()
    const radius: number = 5
    ctx.lineWidth = 3
    ctx.strokeStyle = color
    ctx.arc(...point, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.closePath()
    const angle: number = Math.atan2(point[1], point[0])
    return [radius * Math.cos(angle), radius * Math.sin(angle)]
  }
  /**
   * 生成刻度差
   * @param num 
   * @returns 
   */
  private fillNumber(num: number): number {
    const length: number = num.toString().length
    const fill: number = 10 ** (length - 1)
    return num + fill - num % fill
  }
  /**
   * 获取最大y刻度值及其位置
   * @param series 
   */
  private getMaxValueAndIndex(series: Chart[]) {
    for (let i = 0; i < series.length; i++) {
      for (let j = 0; j < series[i].data.length; j++) {
        if (this._max[2] < series[i].data[j].value) {
          this._max = [i, j, series[i].data[j].value]
        }  
      }
    }
  }
}

export default SeriesChart
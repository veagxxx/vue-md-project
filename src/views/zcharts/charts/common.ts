import { Legend, Title } from './../type';
/**
 * 公共类
 */
class Common {
  protected animation: boolean = true // 开启动画
  protected legendGap: number = 20 // 图例间隔
  protected legend_rect_text_gap: number = 5 // 图例与文字间隔
  protected legendW: number = 50 // 图例宽
  protected legendH: number = this.legendW / 2 // 图例高
  protected legend_text_size: number = 20 // 图例文字大小
  protected legendTop: number = 100 // 图例所在高度
  protected legendRadius: number = 5 // 图例矩形圆角大小
  protected defaultColors: string[] = [
    '#626AEF', '#91CC75', '#FFDC60', '#FF7070', '#73C0DE', '#3BA272', '#FC8452', '#A969C6', '#EA7CCC'
  ]
  protected legend: Legend = {
    width: 50,
    height: 25, 
    data: [],
    show: true,
    position: 'horizontal',
    align: 'center',
    fontSize: 20,
    gap: 20,  
  }
  /**
   * get random color
   * @returns color string code
   */
  protected getRandomColor(): string {
    return `#${Math.floor(Math.random() * 0xffffff).toString(16)}`
  }
  protected drawTitle(title: Title, ctx: CanvasRenderingContext2D, width: number) {
    const lineHeight: number = title.lineHeight || 20
    const fontSize: number = title.size || 40
    const text: string = title.text || ''
    ctx.font = `${fontSize}px 微软雅黑`
    ctx.fillStyle = title.color || '#000'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const x: number = title.align === 'center' ? width / 2 : text.length * fontSize / 2
    ctx.fillText(text, x, fontSize + lineHeight)
  }
  /**
   * deep clone methods
   * @param data 
   */
  protected _deepClone<T>(data: T) {
    if (data && typeof data === 'object') {
      const _cloneData: any = Array.isArray(data) ? [] : {}
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          if (typeof data[key] === 'object') {
            _cloneData[key] = this._deepClone(data[key])
          } else {
            _cloneData[key] = data[key]
          }
        }
      }
      return _cloneData
    } else {
      return data
    }
  }
}


export default Common

export interface Canvas {
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
}
export interface Cropper {
  width: number,
  height: number,
  left: number,
  top: number
}
type Enlarge = {
  _cropper: Cropper,
  _canvas: Canvas,
  cropperBoxWidth: number,
  cropperBoxHeight: number
}
export const cropperProps = {
  // 大图宽
  width: {
    type: Number,
    default: () => 700
  },
  // 大图高
  height: {
    type: Number,
    default: () => 400
  },
  // 图片url
  url: String,
  // 裁剪盒子宽
  cropperBoxWidth: {
    type: Number,
    default: () => 350
  },
  // 裁剪盒子高
  cropperBoxHeight: {
    type: Number,
    default: () => 350
  },
  // 裁剪图宽
  cropperWidth: {
    type: Number,
    default: () => 200
  },
  // 裁剪图高
  cropperHeight: {
    type: Number,
    default: () => 200
  },
  circle: Boolean,
  mosaicDeep: {
    type: Number,
    default: () => 10
  }
}
// 放大
export const enlarge = (
  { _cropper, _canvas, cropperBoxWidth, cropperBoxHeight }: Enlarge,
  callback?: () => void
) => {
  const minEdge: number = Math.min(_canvas.height, _canvas.width)
  if (_cropper.width < minEdge) {
    _cropper.width += (cropperBoxWidth / 10)
    _cropper.height += (cropperBoxHeight / 10)
    _cropper.width = Math.min(minEdge, _cropper.width)
    _cropper.height = Math.min(minEdge, _cropper.height)
    const diffW: number = _cropper.width + _cropper.left - _canvas.width
    const diffH: number = _cropper.height + _cropper.top - _canvas.height
    if (diffW > 0) {
      _cropper.left -= diffW
    }
    if (diffH > 0) {
      _cropper.top -= diffH
    }
    callback && callback()
  }
}
// 缩小
export const shrink = (_cropper: Cropper, boxWdith: number, boxHeight: number, callback?: () => void) => {
  const minEdge: number = Math.min(boxWdith, boxHeight)
  if (_cropper.width > minEdge / 2) {
    _cropper.width -= (boxWdith / 10)
    _cropper.height -= (boxHeight / 10)
    callback && callback()
  }
}
// 马赛克
export const mosaic = () => {

}
// 获取随机位置的颜色
export const getRandomXYColor = (imageData: ImageData, x: number, y: number) => {
  const width: number = imageData.width
  const color: number[] = []
  color[0] = imageData.data[4 * (y * width + x)]
  color[1] = imageData.data[4 * (y * width + x) + 1]
  color[2] = imageData.data[4 * (y * width + x) + 2]
  color[3] = imageData.data[4 * (y * width + x) + 3]
  return color
}
// 设置随机位置颜色
export const setRandomXYColor = (imageData: ImageData, x: number, y: number, color: number[]) => {
  const width: number = imageData.width
  imageData.data[4 * (y * width + x)] =  color[0]
  imageData.data[4 * (y * width + x) + 1] = color[1]
  imageData.data[4 * (y * width + x) + 2] = color[2]
  imageData.data[4 * (y * width + x) + 3] = color[3]
}
// 下载切图
export const downloadCropper = () => {
  const canvas = <HTMLCanvasElement>document.getElementById('cropper-canvas')
  // a 标签
  const a: HTMLAnchorElement = document.createElement('a')
  a.style.display = 'none'
  const href: string = canvas.toDataURL()
  a.href = href
  // 下载后文件名
  a.download = 'cropper'
  document.body.appendChild(a)
  // 点击下载
  a.click()
  // 下载完成移除元素
  document.body.removeChild(a)
  // 释放掉blob对象
  window.URL.revokeObjectURL(href)
}

/**
 * 指针是否在裁剪盒子内
 * @param point 指针坐标
 * @param cropper 裁剪盒子参数
 */
export const pointerInCropperBox = (point: [number, number], cropper: Cropper): boolean => {
  const [x, y] = point
  return (
    x >= cropper.left && x <= cropper.left + cropper.width &&
    y >= cropper.top && y <= cropper.top + cropper.height
  )
}
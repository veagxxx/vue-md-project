import { reactive, ref } from "vue";
export const drawType = reactive<string[]>(['', 'line', 'straightLine', 'rectangle', 'triangle', 'triangle', 'circle'])
export interface Rectangle {
  type: string;
  point: [number, number];
  width: number;
  height: number;
  color: string;
  fill: boolean;
}
export interface Circle {
  type: string;
  point: [number, number];
  radius: number;
  color: string;
  fill: boolean;
}
export interface Triangle {
  type: string;
  point: [number, number];
  width: number;
  height: number;
  color: string;
  fill: boolean;
  rightAngle: boolean;
}
export interface Line {
  type: string;
  point: [number, number];
  endPoint: [number, number];
  color: string;
}
type Point = {
  x: number;
  y: number;
}
export type Draw = Rectangle | Circle | Triangle | Line

// 预定义颜色
export const predefineColors = ref<string[]>([
  '#000000',
  '#FFFFFF',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
]) 

export const points = reactive<Draw[]>([
  {
    type: 'rectangle',
    point: [20, 20],
    width: 100,
    height: 150,
    color: '#000',
    fill: false
  },
  {
    type: 'circle',
    point: [100, 100],
    radius: 20,
    color: 'green',
    fill: false
  },
  {
    type: 'triangle',
    point: [500, 120],
    width: 180,
    height: 90,
    color: 'hotpink',
    fill: true,
  },
  {
    type: 'straightLine',
    point: [800, 300],
    endPoint: [1300, 350],
    color: 'hsl(181, 100%, 37%)',
  }
])
// 初始化画布点
export const initPoint = (ctx: CanvasRenderingContext2D) => {
  if (points.length) {
    points.map((item: Draw, index: number) => {
      if(item.type === 'circle') {
        ctx.beginPath()
        ctx.arc(...item.point, (<Circle>item).radius, 0, 2 * Math.PI)
        ctx.strokeStyle = item.color
        ctx.stroke()
        ctx.closePath()
      } else if (item.type === 'rectangle') {
        ctx.beginPath()
        ctx.rect(...item.point, (<Rectangle>item).width, (<Rectangle>item).height)
        ctx.strokeStyle = item.color
        ctx.stroke()
        ctx.closePath()
      } else if (item.type === 'triangle') {
        ctx.beginPath()
        ctx.moveTo(item.point[0], item.point[1] + (<Triangle>item).height)
        ctx.lineTo(item.point[0] + (<Triangle>item).width / 2, item.point[1])
        ctx.lineTo(item.point[0] + (<Triangle>item).width, item.point[1] + (<Triangle>item).height)
        ctx.strokeStyle = item.color
        ctx.stroke()
        ctx.closePath()
      } else {
        ctx.beginPath()
        ctx.moveTo(...item.point)
        ctx.lineTo(...(<Line>item).endPoint)
        ctx.strokeStyle = item.color
        ctx.stroke()
        ctx.closePath()
      }
      ctx.fillStyle = item.color;
      (<Circle | Triangle | Rectangle>item).fill && ctx.fill()
    })
  }
}
// 获取圆的数据
export const getCircleData = (canvas: HTMLCanvasElement, e: MouseEvent, startPoint: Point) => {
  const { left, top }  = canvas.getBoundingClientRect()
    // 当前鼠标位置与点击位置 x 距离
    const _x: number = e.pageX - left - startPoint.x
    // 当前鼠标位置与点击位置 y 距离
    const _y: number = e.pageY - top - startPoint.y
    // 圆心 x (点击位置与当前鼠标位置中点坐标x)
    const centerX: number = (2 * startPoint.x + _x) / 2
    // 圆心 y (点击位置与当前鼠标位置中点坐标y)
    const centerY: number = (2 * startPoint.y + _y) / 2
    const radius: number = Math.sqrt((_x * _x) + (_y * _y)) / 2
    return { centerX, centerY, radius }
}
// 添加一个图
export const addDraw = (
  canvas: HTMLCanvasElement, 
  e: MouseEvent, 
  paintBrush: number, 
  startPoint: Point,
  color: string,
) => {
  const { left, top }  = canvas.getBoundingClientRect()
    let draw: Draw | any = null
    switch (paintBrush) {
      case 1:
        return
      case 2:
        draw = {
          type: drawType[paintBrush],
          point: [startPoint.x, startPoint.y],
          endPoint: [e.pageX - left, e.pageY - top],
          color: color
        }
        break
      case 3:
      case 4:
      case 5:
        draw = {
          type: drawType[paintBrush],
          point: [startPoint.x, startPoint.y],
          width: e.pageX - left - startPoint.x,
          height: e.pageY - top - startPoint.y,
          color: color,
          fill: false,
        }
        if (paintBrush === 5) {
          draw.rightAngle = true
        }
        break
      case 6: 
        const circle = getCircleData(canvas, e, startPoint)
        draw = {
          type: drawType[paintBrush],
          point: [circle.centerX, circle.centerY],
          radius: circle.radius,
          color: color,
          fill: false
        }   
        break
      default:
        return
    }
    draw && points.push(draw)
}
/**
 * 判断点是否在圆内，根据圆的标准方程(x - a)² + (y - b)² = r²，圆心坐标(a, b)，半径 r
 * @param startPoint 圆心坐标
 * @param radius 半径
 * @param point 点
 * @returns (x - startPoint.x)² + (y - startPoint.y)² <= radius²
 */
const pointInCircle = (startPoint: number[], radius: number, point: number[]): boolean => {
  return (point[0] - startPoint[0]) ** 2 + (point[1] - startPoint[1]) ** 2 <= radius ** 2
}
/**
 * 1. 当前点是否在图形中
 * 2. 比较当前点与图形的最近距离
 * @param point 当前点
 * @returns 返回一个图形(起点，宽高，类型)
 */
export const getFillGragh = (point: number[], canvas: HTMLCanvasElement): Draw => {
  let minDistance = Number.MAX_VALUE
  let result: Draw = {
    type: 'rectangle',
    point: [0, 0],
    width: canvas.width,
    height: canvas.height,
    color: '#000',
    fill: true
  }
  for (let i = 0; i < points.length; i++) {
    const [startX, startY]: number[] = points[i].point
    if (points[i].type === 'rectangle') {
      const [endX, endY]: number[] = [
        points[i].point[0] + ((<Rectangle>points[i]).width), 
        points[i].point[1] + ((<Rectangle>points[i]).height)
      ]
      // 点是否在图形中
      if ((point[0] >= startX && point[0] <= endX) && (point[1] >= startY && point[1] <= endY)) {
        const distance: number = Math.sqrt(Math.abs(point[0] - startX) ** 2 + Math.abs(point[1] - startY) ** 2)
        // 取最小距离
        if (distance < minDistance) {
          minDistance = distance
          result = <Rectangle>points[i]
        }
      }
    } else if (points[i].type === 'circle') {
      // 点是否在圆中
      if (pointInCircle(points[i].point, ((<Circle>points[i]).radius), point)) {
        const distance: number = Math.sqrt(Math.abs(point[0] - startX) ** 2 + Math.abs(point[1] - startY) ** 2)
        // 取最小距离
        if (distance < minDistance) {
          minDistance = distance
          result = <Circle>points[i]
        }
      }
    } else if (points[i].type === 'triangle') {
      const APB = getAngle(
        { x: point[0], y: point[1] }, 
        { x: startX, y: (<Triangle>points[i]).height + startY }, 
        { x: (startX + (<Triangle>points[i]).width + startX) / 2, y: startY }
      ) 
      const APC = getAngle(
        { x: point[0], y: point[1] }, 
        { x: startX, y: (<Triangle>points[i]).height + startY }, 
        { x: startX + (<Triangle>points[i]).width, y: startY + (<Triangle>points[i]).height }
      ) 
      const BPC = getAngle(
        { x: point[0], y: point[1] }, 
        { x: startX + (<Triangle>points[i]).width / 2, y: startY },
        { x: startX + (<Triangle>points[i]).width, y: startY + (<Triangle>points[i]).height }
      ) 
      // 在三角形内(如果在三角形内，点 P 连接三角形三个点形成三个夹角和为 360 度)
      if (Math.round(APB + APC + BPC) === 360) {
        const distance: number = Math.sqrt(
          Math.abs(startX + (<Triangle>points[i]).width / 2 - point[0]) ** 2 + 
          Math.abs(startY + (<Triangle>points[i]).height / 2 - point[1]) ** 2
        )
        if (distance < minDistance) {
          minDistance = distance
          result = <Triangle>points[i]
        }
      }
    }
  }
  result.fill = true
  return result
}
// ABC 三点求角 BAC 
const getAngle = (A: Point, B: Point, C: Point) => {
  const AB = Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2))
  const AC = Math.sqrt(Math.pow(A.x - C.x, 2) + Math.pow(A.y - C.y, 2))
  const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2))
  // cosA = (a² + b² - c²) / 2ab
  const cosA = (Math.pow(AB, 2) + Math.pow(AC, 2) - Math.pow(BC, 2)) / (2 * AB * AC)
  const angleA = Math.acos(cosA) * 180 / Math.PI
  return angleA
}
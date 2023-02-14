/**
 * 路由菜单接口
 */
 export interface IRouteMenu {
  name: string;
  path: string;
  doc: string;
}
/**
 * 路由接口
 */
export interface IRouter {
  routerName: string;
  routerPath: string
}


export interface IParam {
  fileString: any;
  fileName: string;
  routerName: string;
  routerPath: string;
}

export interface PathMenu {
  date?: string;
  name: string;
  path: string;
  doc?: string;
  fileName?: string;
}

/**
 * 绘画类型：枚举类型
 * LINE(1)：线
 * STRAIGHTLINE(2)：直线
 * RECTANGLE(3)：矩形
 * TRIANGLE(4)：三角形
 * RIGHTANGLE(5)：直角三角形
 * CIRCLE(6)：圆
 * ELLIPSE(7)：椭圆
 * FILL(100)：填充
 */
export enum DrawType {
  /** 线 */
  LINE = 1,
  /** 直线 */
  STRAIGHTLINE,
  /** 矩形 */
  RECTANGLE,
  /** 三角形 */
  TRIANGLE,
  /** 直角三角形 */
  RIGHTANGLE,
  /** 圆 */
  CIRCLE,
  /** 椭圆 */
  ELLIPSE,
  /**  */
  /** 填充 */
  FILL = 100
}


export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>


export interface TableHead {
  label: string;
  prop?: string;
  align?: string;
  children?: TableHead[];
}
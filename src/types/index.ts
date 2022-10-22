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
 * LINE(1)：线，STRAIGHTLINE(2)：直线，RECTANGLE(3)：矩形，TRIANGLE(4)：三角形，RIGHTANGLE(5)：直角三角形，CIRCLE(6)：圆，ELLIPSE(7)：椭圆，FILL(100)：填充
 */
export enum DrawType {
  LINE = 1,
  STRAIGHTLINE,
  RECTANGLE,
  TRIANGLE,
  RIGHTANGLE,
  CIRCLE,
  ELLIPSE,
  FILL = 100
}
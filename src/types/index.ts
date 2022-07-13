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
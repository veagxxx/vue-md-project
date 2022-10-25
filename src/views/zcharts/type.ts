
type ChartType = 'bar' | 'pie' | 'line'
// 图形数据
export interface ChartData {
  name: string;
  value: number;
}
// 图形
export interface Chart {
  name: string;
  type: ChartType;
  radius?: [number, number];
  colors: string[];
  data: ChartData[];
}
// 提示
export interface Legend {
  data: string[];
  position: 'vertical' | 'horizontal'
}
// 标题
export interface Title {
  text?: string;
  align?: 'left' | 'right' | 'center';
  size?: number;
  color?: string;
  lineHeight?: number;
}
/**
 * 图表参数配置
 */
export interface Option {
  title: Title;
  legend?: Legend;
  series: Chart[];
}

export interface PieData {
  id: number;
  type: 'pie',
  x: number;
  y: number;
  r: number;
  startAngle: number;
  endAngle: number;
  color?: string;
  state?: number;
  shadowBlur?: number
  radius: number | number[]
}

export type ChartTypeData = PieData
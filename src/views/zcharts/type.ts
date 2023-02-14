
type ChartType = 'bar' | 'pie' | 'line'
// 图形数据
export interface ChartData {
  name: string;
  value: number;
  rate?: number;
}
// 图形
export interface Chart {
  name: string;
  type: ChartType;
  radius?: [number, number];
  colors?: string[];
  data: ChartData[];
  barGap?: number;
}
// 提示
export interface Legend {
  data?: string[];
  position?: 'vertical' | 'horizontal';
  show?: boolean;
  width?: number;
  height?: number;
  align?: 'center' | 'left' | 'right';
  fontSize?: number;
  gap?: number;
  top?: number;
  radius?: number; 
}
// 标题
export interface Title {
  text?: string;
  align?: 'left' | 'right' | 'center';
  size?: number;
  color?: string;
  lineHeight?: number;
}
export interface XYAxis<T> {
  type: 'value' | 'other';
  data?: T[];
  show?: boolean;
}
export interface Axis<T> {
  xAxis: XYAxis<T>;
  yAxis: XYAxis<T>;
}
export interface ChartGap {
  lr?: number;
  tb?: number;
}

/**
 * 图表参数配置
 */
export interface Option {
  title: Title;
  xAxis: XYAxis<string | number>;
  yAxis: XYAxis<string | number>;
  legend?: Legend;
  series: Chart[];
  animation?: boolean;
  chartGap?: ChartGap;
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
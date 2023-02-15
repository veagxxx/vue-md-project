import { RendererElement, markRaw, reactive } from 'vue';
import CodingCanvas from './components/edit-canvas/CodingCanvas.vue'
import ZCharts from './components/zchart/ZChart.vue';
import Algorithm from './components/algorithm/Algorithm.vue'
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import LevelTable from './components/level-table/LevelTable.vue'
import DatePicker from './components/date-picker/index.vue'
export interface ComponentItem {
  name: string;
  component: RendererElement;
  dark: boolean;
  tabSize: number;
  extensions: any;
  code: string;
  autofocus?: boolean;
}
export const componentsList = reactive<ComponentItem[]>([
  {
    name: 'ZCharts',
    component: markRaw(ZCharts),
    dark: true,
    tabSize: 2,
    autofocus: false,
    extensions: [javascript(), oneDark],
    code: `const option = {
  title: {
    text: '标题',
    align: 'center',
    color: '#ff8800'
  },
  xAxis: {
    type: 'value',
    data: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'],
  },
  yAxis: {
    type: 'value',
    data: [10, 50, 100, 200, 250, 50, 300],
  },
  legend: {
    data: ['RNG', 'EDG', 'WE', 'JDG', 'WBG'],
    position: 'horizontal',
    align: 'center'
  },
  series: [
    {
      name: 'ZChart的饼图',
      type: 'bar',
      radius: [0, 50],
      barGap: 0.5,
      colors: ['green', 'hotpink', 'red', 'blue', 'orange'],
      data: [
        { name: 'RNG', value: 25 },
        { name: 'EDG', value: 75 },
        { name: 'WE', value: 75 },
        { name: 'JDG', value: 800 },
        { name: 'IG', value: 200 },
        { name: 'WBG', value: 1200 },
        { name: 'LNG', value: 1000 },
      ]
    },
  ],
  animation: true,
  chartGap: {
    lr: 100,
  },
}`
  },
  {
    name: 'Canvas',
    component: markRaw(CodingCanvas),
    dark: false,
    tabSize: 2,
    autofocus: false,
    extensions: [javascript()],
    code: `ctx.beginPath()
ctx.arc(500, 100, 50, 0, Math.PI * 2)
ctx.moveTo(500, 150)
ctx.lineTo(500, 300)
ctx.moveTo(400, 250)
ctx.lineTo(500, 200)
ctx.lineTo(600, 250)
ctx.moveTo(400, 350)
ctx.lineTo(500, 300)
ctx.lineTo(600, 350)
ctx.lineWidth = 2
ctx.strokeStyle = 'hotpink'
ctx.stroke()
    `
  },
  {
    name: '算法题',
    component: markRaw(Algorithm),
    dark: false,
    tabSize: 2,
    autofocus: false,
    extensions: [javascript()],
    code: ``
  },
  {
    name: '递归多级表头',
    component: markRaw(LevelTable),
    dark: false,
    tabSize: 2,
    autofocus: false,
    extensions: [javascript()],
    code: `const tableHeader = [
  {
    label: '广东省',
    align: 'center',
    children: [{
      label: '广州市',
      align: 'center',
      children: [{
        label: '天河区',
        align: 'center',
        children: [{
          label: '珠江新城',
          prop: 'third_1_1_1_1',
          align: 'center',
        },{
          label: '体育西路',
          prop: 'third_1_1_1_2',
          align: 'center',
        }]
      },{
        label: '越秀区',
        prop: 'third_1_1_2',
        align: 'center',
      }]
    },{
      label: '深圳市',
      children: [{
        label: '福田区',
        prop: 'third_1_2_1',
        align: 'center',
      },{
        label: '南山区',
        prop: 'third_1_2_2',
        align: 'center',
      }]
    }]
  },
  {
    label: '北京市',
    prop: 'first_2',
    align: 'center',
  },
]
const tableData = [
  {
    first_2: 'aaa',
    third_1_1_1: 'ccc',
    third_1_2_1: 'eee',
    third_1_2_2: 'bbb',
    third_1_1_2: 'ddd',
    third_1_1_1_1: 'fff',
    third_1_1_1_2: 'ggg',
  }
]`
  },
  {
    name: '日期选择器',
    component: markRaw(DatePicker),
    dark: false,
    tabSize: 2,
    autofocus: false,
    extensions: [javascript()],
    code: ``
  }
])
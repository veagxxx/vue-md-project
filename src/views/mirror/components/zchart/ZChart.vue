<template>
  <div class="zhy-charts" id="chart"></div>
</template>
<script lang='ts' setup>
  import ZCharts from '@/views/zcharts/zcharts' 
  import { onMounted, reactive, watch } from 'vue';
  import { Option } from '@/views/zcharts/type'
  import { matchVariable } from '@/utils/index'
  const props = defineProps({
    code: String
  })
  onMounted(() => {
    initChart(props.code && new Function('return ' + props.code.split(matchVariable)[1])())
  })
  watch(() => props.code, (val) => {
    initChart(val && new Function('return ' + val.split(matchVariable)[1])())
  })
  const option: Option = reactive({
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
  })
  const initChart = (data?: Option) => {
    const zcharts = new ZCharts(document.getElementById('chart') as HTMLElement)
    zcharts.setOption(data ? data : option)
    window.addEventListener('resize', () => zcharts.resize())
  }
</script>
<style lang='scss' scoped>
  .zhy-charts {
    width: 100%;
    height: calc(100% - 20px);
  }
</style>
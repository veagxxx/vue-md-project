<template>
  <div class="z-charts">
    <div class="chart" id="chart">
      <!-- <canvas id="canvas"></canvas> -->
    </div>
  </div>
</template>
<script lang='ts' setup>
  import { onMounted, onUnmounted, ref } from 'vue';
  import ZCharts from './zcharts'
  import { Option } from './type'

  onMounted(() => {
    initChart()
  })
  const initChart = () => {
    const zcharts = new ZCharts(document.getElementById('chart') as HTMLElement)
    const option: Option = {
      title: {
        text: 'ZCharts的title',
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
            { name: 'LNG', value: 1600 },
          ]
        },
        {
          name: 'ZChart的饼图',
          type: 'bar',
          radius: [0, 50],
          colors: ['green', 'hotpink', 'red', 'blue', 'orange'],
          data: [
            { name: 'RNG', value: 25 },
            { name: 'EDG', value: 75 },
            { name: 'WE', value: 75 },
            { name: 'JDG', value: 800 },
            { name: 'IG', value: 200 },
            { name: 'WBG', value: 1200 },
            { name: 'LNG', value: 1600 },
          ]
        },
        {
          name: 'ZChart的饼图',
          type: 'bar',
          radius: [0, 50],
          colors: ['green', 'hotpink', 'red', 'blue', 'orange'],
          data: [
            { name: 'RNG', value: 25 },
            { name: 'EDG', value: 75 },
            { name: 'WE', value: 75 },
            { name: 'JDG', value: 800 },
            { name: 'IG', value: 200 },
            { name: 'WBG', value: 1200 },
            { name: 'LNG', value: 1600 },
          ]
        },
        {
          name: 'ZChart的饼图',
          type: 'bar',
          radius: [0, 50],
          colors: ['green', 'hotpink', 'red', 'blue', 'orange'],
          data: [
            { name: 'RNG', value: 25 },
            { name: 'EDG', value: 75 },
            { name: 'WE', value: 75 },
            { name: 'JDG', value: 800 },
            { name: 'IG', value: 200 },
            { name: 'WBG', value: 1200 },
            { name: 'LNG', value: 1600 },
          ]
        },
        {
          name: 'ZChart的饼图',
          type: 'bar',
          radius: [0, 50],
          colors: ['green', 'hotpink', 'red', 'blue', 'orange'],
          data: [
            { name: 'RNG', value: 25 },
            { name: 'EDG', value: 75 },
            { name: 'WE', value: 75 },
            { name: 'JDG', value: 800 },
            { name: 'IG', value: 200 },
            { name: 'WBG', value: 1200 },
            { name: 'LNG', value: 1600 },
          ]
        },
      ]
    }
    zcharts.setOption(option)
    window.addEventListener('resize', () => zcharts.resize())
  }

</script>
<style lang='scss' scoped>
  .z-charts {
    height: calc(100% - 20px);
    background: #eee;
    overflow-y: auto;
    padding: 10px 15px;
    .chart {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
    }
  }
</style>
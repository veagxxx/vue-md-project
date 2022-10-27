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
    const option: Option<string | number> = {
      title: {
        text: '这是一个ZCharts的title',
        align: 'center',
        color: '#ff8800'
      },
      xAxis: {
        type: 'value',
        data: ['1', '2', '3', '4', '5'],
      },
      yAxis: {
        type: 'value',
        data: [10, 50, 100, 200, 250, 50, 300],
      },
      series: [
        {
          name: 'ZChart的饼图',
          type: 'pie',
          radius: [0, 50],
          colors: ['green', 'hotpink', 'red', 'blue', 'orange'],
          data: [
            { name: '测试1', value: 25 },
            { name: '测试2', value: 75 },
            { name: '测试3', value: 75 },
            { name: '测试4', value: 75 },
            { name: '测试5', value: 1575 },
          ]
        }
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
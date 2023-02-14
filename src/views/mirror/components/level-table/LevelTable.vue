<template>
  <el-table :data="tableData">
    <LevelColumn 
      v-for="(item, index) in tableHeader" 
      :key="item.label" 
      :colItem="item"
    ></LevelColumn>
  </el-table>
</template>
<script lang='ts' setup>
  import { onMounted, reactive, ref, watch } from 'vue';
  import LevelColumn from './components/LevelColumn.vue';
  import { TableHead } from '@/types/index'
  import { matchVariable } from '@/utils/index'
  const props = defineProps({
    code: String,
  })
  onMounted(() => {
    initTable()
  })
  watch(() => props.code, () => {
    initTable()
  })
  const initTable = () => {
    const dataList: string[] = props.code?.split(matchVariable).filter(v => v) || []
    tableHeader.value = new Function('return ' + dataList[0])()
    tableData.value = new Function('return ' + dataList[1])()
  }
  const tableHeader = ref<TableHead[]>([
    {
      label: '一级表头1',
      align: 'center',
      children: [{
        label: '二级表头1-1',
        align: 'center',
        children: [{
          label: '三级表头1-1-1',
          align: 'center',
          children: [{
            label: '四级表头1-1-1-1',
            prop: 'third_1_1_1_1',
            align: 'center',
          },{
            label: '四级表头1-1-1-1',
            prop: 'third_1_1_1_2',
            align: 'center',
          }]
        },{
          label: '三级表头1-1-2',
          prop: 'third_1_1_2',
          align: 'center',
        }]
      },{
        label: '二级表头1-2',
        children: [{
          label: '三级表头1-2-1',
          prop: 'third_1_2_1',
          align: 'center',
        },{
          label: '三级表头1-2-2',
          prop: 'third_1_2_2',
          align: 'center',
        }]
      }]
    },
    {
      label: '一级表头2',
      prop: 'first_2',
      align: 'center',
    },
    {
      label: '一级表头3',
      prop: 'first_3',
      align: 'center',
    },
  ])
  const tableData = ref([
    {
      first_2: 'aaa',
      first_3: 'hhh',
      third_1_1_1: 'ccc',
      third_1_2_1: 'eee',
      third_1_2_2: 'bbb',
      third_1_1_2: 'ddd',
      third_1_1_1_1: 'fff',
      third_1_1_1_2: 'ggg',
    }
  ])
</script>
<style lang='scss' scoped>
  
</style>
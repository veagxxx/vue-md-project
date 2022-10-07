<template>
  <div class="statistic">
    <el-card>
      <el-table  
        v-loading="loading" 
        :data="tableData" 
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'ascending' }"
      > 
        <el-table-column type="index" :index="getIndex"></el-table-column>
        <el-table-column 
          v-for="(column, colIndex) in columnData" 
          :key="colIndex + 'col'" 
          :prop="column.prop" 
          :label="column.label"
          :sortable="column.sortable || false"
        >
          <template #default="scope">
            <template v-if="column.tag">
              <el-tag type="success">{{ scope.row[column.prop] }}</el-tag>
            </template>
            <template v-else>{{ scope.row[column.prop] }}</template>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="text" class="purple">查看</el-button>
            <el-button type="text" @click="downloadFile(scope.row)">下载</el-button>
            <el-button type="text" @click="deleteFile(scope.row)" class="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="queryInfo.pageIndex"
        v-model:page-size="queryInfo.pageSize"
        :page-sizes="[2, 10, 20, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script lang='ts' setup>
import { getMenus } from '@/controller/FsController';
import { PathMenu } from '@/types';
import { markRaw, onMounted, ref, reactive } from 'vue';
import { downloadFileApi } from '@/controller/FsController'
import { ElMessageBox } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
const loading = ref<boolean>(false)
const total = ref<number>(0)
const queryInfo = reactive({
  pageIndex: 1,
  pageSize: 2,

})
const tableData = ref<PathMenu[]>([])
const tableDataCopy = ref<PathMenu[]>([])
const columnData = [
  { prop: 'date', label: '日期', sortable: true },
  { prop: 'name', label: '名称' },
  { prop: 'path', label: '路径', tag: true },
  { prop: 'fileName', label: '文件名' },
]
// 下载文件
const downloadFile = async (row: any) => {
  const res: any = await downloadFileApi(row)
  
  const { fileName } = row
  // 创建 Blob 对象
  const blob: Blob = new Blob([res.data])
  // 生成下载链接
  const href: string = window.URL.createObjectURL(blob)
  // a 标签
  const a: HTMLAnchorElement = document.createElement('a')
  a.style.display = 'none'
  a.href = href
  // 下载后文件名
  a.download = fileName
  document.body.appendChild(a)
  // 点击下载
  a.click()
  // 下载完成移除元素
  document.body.removeChild(a)
  // 释放掉blob对象
  window.URL.revokeObjectURL(href)
}
// 删除
const deleteFile = (row: PathMenu) => {
  console.log('row', row)
  ElMessageBox.confirm(
    '确定删除文档吗?',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      icon: markRaw(Delete),
    }
  ).then(res => {
    console.log(res)
  }).catch(rej => {
    console.log(rej)
  })
}

const handleSizeChange = (size: number) => {
  console.log('size: ', size, queryInfo);
  tableData.value = tableDataCopy.value.slice(0, size)
}
const handleCurrentChange = (page: number) => {
  console.log('page: ', page, queryInfo);
  tableData.value = tableDataCopy.value.slice(
    (page - 1) * queryInfo.pageSize, queryInfo.pageSize * page
  )
}
const getIndex = (index: number) => {
  return (index + 1) + (queryInfo.pageIndex - 1) * queryInfo.pageSize
}
onMounted(async () => {
  loading.value = true
  const res: any = await getMenus()
  total.value = res.data.length
  tableDataCopy.value = (res.data as PathMenu[]).map((item) => {
    return {
      date: item.date || '',
      name: item.name,
      path: item.path,
      fileName: item.doc,
    }
  })
  tableData.value = tableDataCopy.value.slice(0, queryInfo.pageSize)
  loading.value = false
})
</script>

<style lang='scss' scoped>
  .statistic {
    height: calc(100% - 20px);
    background: #eee;
    overflow-y: auto;
    padding: 10px 15px;
    .el-pagination {
      justify-content: flex-end;
      margin-top: 5px;
    }
  }
  .purple {
    color: #626aef;
  }
  .danger {
    color: #f56c6c;
  }
</style>
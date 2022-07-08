<template>
  <el-dialog
    :model-value.sync="props.showUpload"
    title="上传.md文件"
    width="50%"
    :before-close="handleClose"
  >
    <el-upload
      ref="upload"
      class="upload-demo"
      action=""
      :limit="1"
      :on-exceed="handleExceed"
      :auto-upload="false"
      :on-change="handleBeforeUpload"
    >
      <template #trigger>
        <el-button type="primary">选择文件</el-button>
      </template>
      <el-button class="ml-3" type="success" @click="submitUpload">上传</el-button>
      <template #tip>
        <div class="el-upload__tip text-red">
          仅支持.md文件上传
        </div>
      </template>
    </el-upload>
    <!-- <input type="file" id="input"/>
    <el-button @click="handleBeforeUpload">上传</el-button> -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <!-- <el-button type="primary">Confirm</el-button> -->
      </span>
    </template>
  </el-dialog>
</template>
<script lang='ts' setup>
import { ElMessage, genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { ref } from 'vue';
import { uploadMdFile } from '@/utils/upload'
import { read } from 'fs';
const props = defineProps({
  showUpload: {
    type: Boolean,
  }
})
const emit = defineEmits(['closeUpload'])
const upload = ref<UploadInstance>()
const fileString = ref<string | ArrayBuffer | null>('')
const fileName = ref<string>('')
// 超出限制数量替换
const handleExceed: UploadProps['onExceed'] = (files: File[]) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}
// 上传
const submitUpload = () => {
  // upload.value!.submit()
  // console.log('zzzz')
  const result = uploadMdFile(fileString.value, fileName.value)
  console.log('result', result)
}
// 文件更新
const handleBeforeUpload = (file: any) => {
  console.log(file)
  fileName.value = file.name
  const suffix: string = file.name.substring(file.name.lastIndexOf('.') + 1)
  if (suffix !== 'md') {
    upload.value!.clearFiles()
    return ElMessage.error('仅能上传.md文件')
  }
  const reader = new FileReader()
  reader.readAsText(file.raw, 'UTF-8')
  reader.onload = () => {
    console.log(reader.result)
    fileString.value = reader.result
  }
}
// 关闭
const handleClose = () => {
  emit('closeUpload')
}
</script>
<style lang='scss' scoped>
  .ml-3 {
    margin-left: 30px;
  }
</style>
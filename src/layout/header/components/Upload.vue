<template>
  <el-dialog
    :model-value.sync="props.showUpload"
    title="上传文档"
    width="50%"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleFormRef"
      status-icon
      :model="routerForm"
      :rules="rules"
    >
      <el-form-item prop="routerName" label="路由名称">
        <el-input v-model="routerForm.routerName" placeholder="输入路由名称，如：表单系统" />
      </el-form-item>
      <el-form-item prop="routerPath" label="访问路径">
        <el-input v-model="routerForm.routerPath" placeholder="输入访问路径，如：/form" />
      </el-form-item>
    </el-form>
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
      <el-button class="ml-3" type="success" @click="submitUpload(ruleFormRef)">上传</el-button>
      <template #tip>
        <div class="el-upload__tip text-red">
          仅支持.md文件上传
        </div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <!-- <el-button type="primary">Confirm</el-button> -->
      </span>
    </template>
  </el-dialog>
</template>
<script lang='ts' setup>
import { ElMessage, FormInstance, genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { reactive, ref } from 'vue';
// import { uploadMdFile } from '@/utils/upload'
// import axios from 'axios'
import { checkRouterName, checkRouterPath } from '@/hooks'
import { IRouter } from '@/types';
import { uploadMdFile } from '@/controller/FsController'
const props = defineProps({
  showUpload: {
    type: Boolean,
  }
})
const emit = defineEmits(['closeUpload'])
const upload = ref<UploadInstance>() // 
const fileString = ref<string | ArrayBuffer | null>('') // 文件内容
const fileName = ref<string>('') // 文件名字
const ruleFormRef = ref<FormInstance>() // el-form 表单 ref
// 表单绑定对象
const routerForm = reactive<IRouter>({
  routerName: '',
  routerPath: '',
})
// 校验规则
const rules = reactive({
  routerName: [{ required: true, validator: checkRouterName, trigger: 'blur' }],
  routerPath: [{ required: true, validator: checkRouterPath, trigger: 'blur' }],
})
// 超出限制数量替换
const handleExceed: UploadProps['onExceed'] = (files: File[]) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}
// 上传
const submitUpload = async (formEl: FormInstance | undefined) => {
  if(!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (!fileString.value || !fileName.value) return ElMessage.warning('请上传.md文件')
      const params = {
        fileString: fileString.value,
        fileName: fileName.value,
        routerName: routerForm.routerName,
        routerPath: routerForm.routerPath
      }
      const res: any = await uploadMdFile(params)
    } else {

    }
  })
  
}
// 文件上传
const handleBeforeUpload = (file: any) => {
  // console.log(file)
  fileName.value = file.name
  const suffix: string = file.name.substring(file.name.lastIndexOf('.') + 1)
  if (suffix !== 'md') {
    upload.value!.clearFiles()
    return ElMessage.error('仅能上传.md文件')
  }
  const reader = new FileReader()
  reader.readAsText(file.raw, 'UTF-8')
  reader.onload = () => {
    // console.log(reader.result)
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
<template>
  <div class="algorithm">
    <div class="aligorithm-item">
      <div class="aligorithm-item__title">
        {{ currentQst?.id + '. ' + currentQst?.title }}
      </div>
      <div class="aligorithm-item__content" v-html="currentQst?.content"></div>
    </div>
    <div class="aligorthm-tool">
      <el-button 
        size="small" 
        :disabled="currentQst?.id === 1"
        @click="onSwitchPrevious(currentQst?.id)"
      >
        上一题
      </el-button>
      <span>&nbsp;{{ `${currentQst?.id} / ${questions.length}` }}&nbsp;</span>
      <el-button 
        size="small" 
        :disabled="currentQst?.id === questions.length" 
        @click="onSwitchNext(currentQst?.id)"
      >
        下一题
      </el-button>
    </div>
  </div>
</template>
<script lang='ts' setup>
  import { ref, watch, onMounted } from 'vue';
  import { questions, Question } from './config';
  const props = defineProps({
    code: String
  })
  const emit = defineEmits<{
    (event: 'onSwitch', value: string | undefined): void
  }>()
  const currentQst = ref<Question | null>(questions[0] || null)
  // 切换上一题
  const onSwitchPrevious = (id: number | undefined) => {
    if (currentQst.value) {
      currentQst.value.answer = props.code || ''
    }
    currentQst.value = questions[id ? id - 2 : 0]
  }
  // 切换下一题
  const onSwitchNext = (id: number | undefined) => {
    if (currentQst.value) {
      currentQst.value.answer = props.code || ''
    }
    currentQst.value = questions[id ? id : questions.length - 1]
  }
  // 执行字符串代码
  const onExecute = (code: string) => {
    if (code) {
      new Function('', code)()
    }
  }
  watch([currentQst, () => props.code], ([newQst, newCode], [oldQst, oldCode]) => {
    if (newQst?.id !== oldQst?.id) {
      emit('onSwitch', currentQst.value?.answer)
    }
    onExecute(newCode || '')
  })
  onMounted(() => {
    emit('onSwitch', currentQst.value?.answer)
  })
</script>
<style lang='scss' scoped>
  .algorithm {
    height: calc(100% - 20px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    .aligorithm-item {
      flex: 1;
      overflow-y: auto;
      &::-webkit-scrollbar{
        width: 8px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: lightgray;
        height: 50px;
        border-radius: 5px;
      }
      .aligorithm-item__title {
        font-size: 16px;
        font-weight: 500;
        margin-top: 12px;
      }
      .aligorithm-item__content {
        font-size: 14px;
        line-height: 30px;
        margin-top: 12px;
      }
    }
    .aligorthm-tool {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 4px;
      border-top: 1px solid #eee;
    }
  }
</style>
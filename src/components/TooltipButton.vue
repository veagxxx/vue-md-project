<template>
  <el-tooltip
    :content="content"
    :effect="theme"
    :placement="placement"
    trigger="hover"
  >
    <template #content>
      <slot></slot>
    </template>
    <el-button 
      :class="className" 
      :type="type" 
      :icon="icon" 
      @click="callback"
    >{{ text }}
    </el-button>
  </el-tooltip>
</template>
<script lang='ts' setup>
  const props = defineProps({
    icon: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: 'primary'
    },
    text: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: ''
    },
    callback: {
      type: Function,
      default: () => {}
    },
    placement: {
      type: String,
      default: 'top'
    },
    theme: {
      type: String,
      default: 'light'
    },
  })

</script>
<style lang='scss' scoped>
  .el-button {
    font-size: 120%;
  }
  .purple {
    color: #626aef;
  }
  .danger {
    color: #f56c6c;
  }
  .warning {
    color: #eebe77;
  }
  .hotpink {
    color: hotpink;
  }
</style>
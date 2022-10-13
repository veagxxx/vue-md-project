<template>
  <el-tooltip
    :content="content"
    :effect="theme"
    :placement="placement"
    trigger="hover"
    :disabled="disabled"
  >
    <template #content>
      <slot></slot>
    </template>
    <el-button 
      :class="[`${[className]}`, `${selected ? 'selected' : ''}`]"
      :type="type" 
      :icon="icon" 
      @click="() => callback()"
    >
      {{ text }}
      <template #icon>
        <slot name="icon"></slot>
      </template>
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
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  })

</script>
<style lang='scss' scoped>
  .el-button {
    font-size: 120%;
    &:hover {
      background: #eee;
    }
    :deep(span) {
      margin-left: 0;
    }
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
  .selected {
    background: #eee;
  }
</style>
<template>
  <svg :class="svgClass" aria-hidden="true" v-bind="attrs.onClick">
    <use :xlink:href="iconName" />
  </svg>
</template>
<script lang='ts' setup>
  import { computed, useAttrs } from 'vue';
  const props = defineProps({
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  })
  const attrs = useAttrs()
  const svgClass = computed<string>(() => {
    if (props.className) {
      return 'svg-icon ' + props.className
    } else {
      return 'svg-icon'
    }
  })
  const iconName = computed<string>(() => {
    return `#icon-${props.iconClass}`
  })
</script>
<style lang='scss' scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style> 
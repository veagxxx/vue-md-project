<template>
  <el-table-column 
    :label="colItem.label" 
    :prop="colItem.prop" 
    :align="colItem.align || 'left'"
  >
    <template v-if="colItem.children">
      <template v-for="(item, index) in colItem.children">
        <template v-if="item.children">
          <LevelColumn :key="item.prop" :colItem="item"/>
        </template>
        <el-table-column 
          v-else 
          :label="item.label" 
          :prop="item.prop"
          :align="item.align || 'left'"
        ></el-table-column>
      </template>
    </template>
  </el-table-column>
</template>
<script lang='ts' setup>
  const props = defineProps({
    colItem: {
      type: Object,
      default() {
        return {}
      }
    },
  })
</script>
<style lang='scss' scoped>
  
</style>
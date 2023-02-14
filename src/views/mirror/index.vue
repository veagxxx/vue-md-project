<template>
  <div class="mirror">
    <el-card v-for="(item, index) in componentsList" :key="index + item.name">
      <div class="mirror-left">
        <div class="mirror-left__title">{{ item.name }}</div>
        <component 
          :is="item.component" 
          :code="item.code"
          @onSwitch="(val: string) => onSwitch(val, item)"
        ></component>
      </div>
      <div class="mirror-right">
        <div class="mirror-tool">
          <el-switch
            v-model="item.dark"
            size="small"
            inline-prompt
            active-color="#2c2c2c"
            :active-icon="Moon"
            :inactive-icon="Sunny"
            @change="(val: boolean) => onThemeChange(val, item)"
          />
          <el-popover 
            popper-class="setting-popper" 
            placement="bottom-end" 
            :width="300" 
            trigger="click"
          >
            <template #reference>
              <el-icon title="设置"><Setting /></el-icon>
            </template>
            <div class="mirror-tool__setting">
              <span>TabSize：</span>
              <el-select style="width: 100px" v-model="item.tabSize">
                <el-option
                  v-for="opItem in tabSizeList"
                  :key="opItem.value"
                  :label="opItem.label"
                  :value="opItem.value"
                ></el-option>
              </el-select>
            </div>
            <div class="mirror-tool__setting">
              <span>自动聚焦：</span>
              <el-switch v-model="item.autofocus" size="small"/>
            </div>
          </el-popover>
        </div>
        <Codemirror 
          :modelValue="item.code" 
          :style="{ height }" 
          :tabSize="2" 
          :extensions="item.extensions"
          @blur="onMirrorBlur(item)"
          @change="(val) => onMirrorChange(val)"
        />
      </div>
    </el-card>
  </div>
</template>
<script lang='ts' setup>
  import { ref } from 'vue'
  import { Codemirror } from 'vue-codemirror'
  import { javascript } from "@codemirror/lang-javascript"
  import { oneDark } from "@codemirror/theme-one-dark"
  import { componentsList, ComponentItem } from './components'
  import { Moon, Sunny } from '@element-plus/icons-vue'
  interface Props {
    height?: string;
  }
  // 接受的参数
  const props = withDefaults(defineProps<Props>(), {
      height: '300px'
  })
  const tabSizeList = [
    { label: '2个空格', value: 2 },
    { label: '4个空格', value: 4 },
    { label: '8个空格', value: 8 },
  ]
  const code = ref<string>(``)
  const isChange = ref<boolean>(false)
  const onThemeChange = (value: boolean, item: ComponentItem) => {
    if (value) {
      item.extensions = [javascript(), oneDark]
    } else {
      item.extensions = [javascript()]
    }
  }
  const onMirrorChange = (value: string) => {
    code.value = value
    isChange.value = true
  }
  const onMirrorBlur = (item: ComponentItem) => {
    if (code.value || isChange.value) {
      item.code = code.value
    }
  }
  const onSwitch = (val: string, item: ComponentItem) => {
    item.code = val
    isChange.value = false
    code.value = ''
  }
</script>
<style lang='scss' scoped>
  .mirror {
    height: calc(100% - 20px);
    background: #eee;
    overflow-y: auto;
    padding: 10px 10%;
    .el-card:not(:last-of-type) {
      margin-bottom: 10px;
    }
    :deep(.el-card__body) {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }
    .mirror-left {
      width: 49%;
      height: 324px;
      .mirror-left__title {
        font-weight: bold;
      }
    }
    .mirror-right {
      width: 50%;
      .mirror-tool {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .el-icon {
          margin-left: 6px;
          cursor: pointer;
          font-size: 20px;
        }
      }
    }
    &::-webkit-scrollbar{
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: lightgray;
      height: 50px;
      border-radius: 5px;
    }
  }
  .setting-popper {
    .mirror-tool__setting {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:not(:last-of-type) {
        margin-bottom: 16px;
      }
    }
  }
</style>
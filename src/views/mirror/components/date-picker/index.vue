<template>
  <div class="earth-date-picker" :style="{ width: `${width}px` }">
    <el-popover
      placement="right"
      :width="400"
      trigger="click"
    >
      <template #reference>
        <div class="picker-input__wrapper">
          <input 
            class="picker-inner_input" 
            :value="modelValue" 
            @input="(e: any) => onInput(e.target.value)" 
            :placeholder="placeholder"
            :style="{ width: width }"
          />
          <span class="picker-input_prefix">
            <span class="prefix-icon">
              <el-icon><Calendar/></el-icon>
            </span>
          </span>
          <span 
            class="picker-input_suffix" 
            :class="modelValue && showClose ? 'show-close' : ''"
            @click.stop="clearValue"
          >
            <span class="prefix-icon">
              <el-icon><CircleCloseFilled/></el-icon>
            </span>
          </span>
        </div>
      </template>
      <DatePicker 
        :dateValue="modelValue" 
        @updateDate="onUpdateDate"
      />
    </el-popover>
  </div>
</template>
<script lang='ts' setup>
  import DatePicker from './DatePicker.vue'
  import moment from 'moment';
  defineProps({
    modelValue: {
      type: String,
      default() {
        return moment().format('YYYY-MM-DD')
      }
    },
    placeholder: {
      type: String,
      default: () => '选择日期'
    },
    code: String,
    width: {
      type: [Number, String],
      default: () => 200
    },
    showClose: {
      type: Boolean,
      default: () => true
    }
  })
  const emit = defineEmits(['update:modelValue'])
  const onInput = (value: string) => {
    emit('update:modelValue', value)
  }
  const onUpdateDate = (value: string) => {
    onInput(value)
  }
  const clearValue = () => {
    onInput('')
  }
</script>
<style lang='scss' scoped>
  $picker-height: 26px;
  .earth-date-picker {
    position: relative;
    line-height: $picker-height;
    box-sizing: border-box;
    vertical-align: middle;
    .picker-inner_input {
      outline: none;
      height: $picker-height;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding-left: 30px;
      padding-right: 12px;
      &:focus {
        border-color: var(--el-color-primary);
      }
      &:hover .picker-input_suffix {
        display: 'flex';
      }
    }
    .picker-input_prefix, .picker-input_suffix {
      position: absolute;
      height: 100%;
      display: inline-flex;
      align-items: center;
      color: #aaa;
      line-height: $picker-height;
      top: 0;
      .prefix-icon {
        display: inline-flex;
        align-items: center;
      }
    }
    .picker-input_prefix {
      left: 10px;
    }
    .picker-input_suffix {
      right: 10px;
      color: #ccc;
      display: none;
      cursor: pointer;
    }
  }
  .earth-date-picker:hover .show-close {
    display: flex;
  }
</style>
## CropperV3 组件文档

### 介绍

CropperV3是一个 vue3 图片裁剪组件

### props 

| 属性名           | 类型    | 默认值   | 描述                     |
| ---------------- | ------- | -------- | ------------------------ |
| width            | number  | 700      | 图片宽度                 |
| height           | number  | 400      | 图片高度                 |
| url              | string  | 组件自带 | 图片链接                 |
| cropperBoxWidth  | number  | 350/dpr  | 裁剪盒子宽度             |
| cropperBoxHeight | number  | 350/dpr  | 裁剪盒子高度             |
| cropperWidth     | number  | 200*dpr  | 裁剪图片宽度             |
| cropperHeight    | number  | 200*dpr  | 裁剪图片高度             |
| circle           | boolean | false    | 裁剪图片是否显示圆形     |
| mosaicDeep       | number  | 10       | 马赛克模糊度，越高越模糊 |

### 使用

```vue
<script setup>
	import Cropper from './components/Cropper.vue'
</script>
<template>
	<Cropper :width="500" :height="300" circle/>
</template>
```


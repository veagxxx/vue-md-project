<template>
  <div class="not-found">
    <div class="container">
      <div class="content">
        哎呦！你干嘛~~，走错地方了
      </div>
      <div class="footer">
        <el-button type="primary" @click="() => router.go(-1)">返回上一页</el-button>
        <el-button @click="() => router.push('/')">返回首页</el-button>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
  import { Router, useRouter } from 'vue-router';
  const router: Router = useRouter()
</script>
<style lang='scss' scoped>
  .not-found {
    height: calc(100vh - 20px);
    background: #eee;
    padding: 10px;
    position: relative;
    .container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .content {
        font-size: 200%;
        text-align: center;
        color: #626aef;
        padding: 24px;
      }
      .content::first-letter {
        font-size: 200%;
      }
      .footer {
        display: flex;
        justify-content: center;

      }
    }
  }
  .purple {
    color: #626aef;
  }
</style>
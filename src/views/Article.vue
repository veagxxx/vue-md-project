<template>
  <!-- <article class="markdown-body" v-html="content"></article> -->
  <div class="my-md">
    <div class="editor">
      <md-editor
        v-model="state.text"
        :editorId="state.id"
        preview-only
        :previewTheme="state.theme"
      />
    </div>
    <div class="catalog">
      <div class="affix">
        <md-catalog
          :editorId="state.id"
          :scroll-element="scrollElement"
          :previewTheme="state.theme"
        />
      </div>
    </div>
  </div>
  <el-backtop title="回到顶部"></el-backtop>
</template>
<script lang='ts' setup>
import MdEditor from 'md-editor-v3'
import { reactive } from 'vue';
// import Europa from 'europa'
// const europa = new Europa()
import Turndown from 'turndown'
interface IState {
  theme: string;
  id: string;
  text: string;
}
const turndown = new Turndown()
const { MdCatalog } = MdEditor;
const props = defineProps({
  content: {
    type: String,
  }
})
const state = reactive<IState>({
  theme: 'default',
  id: 'my-editor',
  // text: europa.convert(props.content)
  text: turndown.turndown(props?.content as string)
})
const scrollElement: HTMLElement = document.documentElement;
</script>
<style lang='scss' scoped>
  .my-md {
    display: flex;
    width: 1170px;
    margin: 0 auto;
    .editor {
      width: 75%;
      margin: 0 auto;
      padding-right: 1rem;
    }
    .catalog {
      width: 25%;
      .affix {
        position: sticky;
        top: 10px;
        max-height: calc(100vh - 80px);
        overflow-y: auto;
        .my-catalog {
          height: 100%;
          margin-bottom: 1rem;
        }
      }
      .affix::-webkit-scrollbar{
        width:0;
      }
      .md-catalog  {
        height: 100%;
      }
    }
  }
  
</style>
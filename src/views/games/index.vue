<template>
  <div class="games">
    <div class="games-list">
      <div 
        class="games-item" 
        v-for="(game, index) in gameList" 
        :key="game.name + index"
        :class="[game.path === selectedPath ? 'active' : '']"
        @click="onGameChange(game)"
      >
        <svg-icon :icon-class="game.icon"></svg-icon>
        <div class="games-item__name" v-html="game.name"></div>
      </div>
    </div>
    <div class="games-content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script lang='ts' setup>
  import { useRouter, Router } from 'vue-router';
  import { gameList, Game } from './games'
  import { ref } from 'vue'
  const router: Router = useRouter()
  const selectedPath = ref<string>(router.currentRoute.value.path)
  const onGameChange = (game: Game) => {
    selectedPath.value = game.path
    router.push(game.path)
  }
  const activeColor = (game: Game) => {
    return game.path === selectedPath.value ? '#626aef' : '#000000'
  }
</script>
<style lang='scss' scoped>
  .games {
    display: flex;
    height: 100%;
    .games-list {
      height: calc(100% - 8px);
      width: 180px;
      overflow: auto;
      border-right: #eee 1px solid;
      padding: 4px 6px;
      .games-item {
        width: 100%;
        box-sizing: border-box;
        margin: 2px 0 3px;
        padding: 10px 10px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        cursor: pointer;
        &.active {
          font-size: 15px;
          font-weight: bold;
          color: $color-purple;
          background: rgba(98, 106, 239, 0.2);
        }
        .games-item__name {
          user-select: none;
          text-align: center;
          margin-left: 5px;
        }
      }
    }
    .games-content {
      background: #eee;
      height: calc(100% - 20px);
      padding: 10px;
      flex: 1;
    }
  }
</style>
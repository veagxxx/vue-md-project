<template>
  <div class="gobang">
    <div class="gobang-utils">
      <el-button @click="onStart">开始游戏</el-button>
      <el-button @click="onStart">重新开始</el-button>
      <el-button>白棋优先</el-button>
    </div>
    <div class="gobang-chessboard">
      <canvas id="gobang-canvas"></canvas>
    </div>
    <div class="gobang-player">
      <div class="gobang-player__black" :class="[!player && isGaming ? 'active' : '']">
        <span>黑：{{ chesses[0] }}</span>
      </div>
      <div class="gobang-player__white" :class="[player && isGaming ? 'active' : '']">
        <span>白：{{ chesses[1] }}</span>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup> 
  import { ElMessageBox } from 'element-plus';
  import { onMounted, reactive, ref } from 'vue';
  onMounted(() => {
    initCanvas();
  })
  const scale: number = 2
  const rows: number = 20;
  const cols: number = 20;
  let board = new Array<string[]>(rows).fill([]).map(() => new Array<string>(cols).fill(''))
  const gobang = reactive<{
    width: number;
    height: number;
    ctx: any;
    canvas: any;
  }>({
    width: 600 * scale,
    height: 500 * scale,
    ctx: null as any,
    canvas: null as any,
  })
  const chesses = ref<number[]>([rows * cols / 2, rows * cols / 2])
  const player = ref<number>(0)
  const colors: string[] = ['black', 'white']
  const pieces = reactive<{
    center: number[];
    radius: number;
    color: string;
  }>({
    center: [0, 0],
    radius: Math.floor(gobang.height / scale / cols) - 5,
    color: colors[player.value],
  })
  const isGaming = ref<boolean>(false)
  const initCanvas = () => {
    const gobangEl = document.getElementById('gobang-canvas') as HTMLCanvasElement;
    const ctx = gobangEl.getContext('2d') as CanvasRenderingContext2D;
    gobangEl.style.width = `${gobang.width / scale}px`;
    gobangEl.style.height = `${gobang.height / scale}px`;
    gobangEl.width = gobang.width;
    gobangEl.height = gobang.height;
    gobang.ctx = ctx;
    gobang.canvas = gobangEl;
    initGobangBoard()
    mountEvent(gobangEl)
  }
  // 初始化棋盘
  const initGobangBoard = () => {
    const cellH: number = gobang.height / rows;
    const cellW: number = gobang.width / cols;
    for (let i = 0; i <= rows; i++) {
      drawLine(0, i * cellH, gobang.width, i * cellH);
    }
    for (let i = 0; i <= cols; i++) {
      drawLine(i * cellW, 0, i * cellW, gobang.height);
    }
  }
  // 画线
  const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
    gobang.ctx.beginPath();
    gobang.ctx.moveTo(x1, y1);
    gobang.ctx.lineTo(x2, y2);
    gobang.ctx.stroke();
    gobang.ctx.closePath();
  }
  // 开始游戏
  const onStart = () => {
    onClearBoard()
    isGaming.value = true
    board = new Array<string[]>(rows).fill([]).map(() => new Array<string>(cols).fill(''))
    player.value = 0
    pieces.color = colors[player.value]
  }
  // 落子
  const onGobang = (e: MouseEvent) => {
    const point: number[] = clickPoint(e);
    const [row, col]: number[] = calcRowAndCol(point);
    // 检查是否有落子 || 是否开始游戏
    if (checkBoard(row, col) || !isGaming.value) return;
    pieces.center = calcPiecesCenter(row, col)
    drawPieces()
    updatePlayer(row, col)
    if (checkPlayerWin(row, col)) {
      ElMessageBox.confirm(
        `${board[row][col] === 'black' ? '黑子' : '白子'}玩家获得胜利`,
        '恭喜玩家',
        {
          confirmButtonText: '再来一次',
          cancelButtonText: '返回游戏',
          type: 'success',
        }
      ).then(() => {
        onStart()
      }).catch(() => {
        isGaming.value = false
      })
    }
  }
  // 检查是否赢
  const checkPlayerWin = (row: number, col: number): boolean => {
    const color: string = board[row][col]
    return (
      checkByDirection(row, col, -1, 0, color) ||
      checkByDirection(row, col, 1, 0, color) ||
      checkByDirection(row, col, 0, -1, color) ||
      checkByDirection(row, col, 0, 1, color) ||
      checkByDirection(row, col, -1, -1, color) ||
      checkByDirection(row, col, 1, 1, color) ||
      checkByDirection(row, col, -1, 1, color) ||
      checkByDirection(row, col, 1, -1, color)
    )
  }
  /**
   * 判断是否有连续5个相同棋子
   * @param row 最新落子位置的行
   * @param col 最新落子位置的列
   * @param dx x方向：-1：左，0：原位，1：右
   * @param dy y方向：-1：上，0：原位，1：下
   * @param color 判断的棋子颜色
   */
  const checkByDirection = (row: number, col: number, dx: number, dy: number, color: string) => {
    let count: number = 0
    for (let i = 0; i < 5; i++) {
      if (
        board[row + dy * i] && 
        board[row + dy * i][col + dx * i] && 
        board[row + dy * i][col + dx * i] === color
      ) {
        if (++count === 5) {
          return true
        }
      }
    }
    return false
  }
  // 玩家轮换
  const updatePlayer = (row: number, col: number) => {
    board[row][col] = colors[player.value]
    chesses.value[player.value]--
    player.value ^= 1
    pieces.color = colors[player.value];
  }
  // 画棋子
  const drawPieces = () => {
    const { center, radius, color } = pieces;
    gobang.ctx.beginPath();
    gobang.ctx.arc(center[0], center[1], radius, 0, Math.PI * 2);
    gobang.ctx.fillStyle = color;
    gobang.ctx.fill();
    gobang.ctx.closePath();
  }
  // 检查格子是否有落子
  const checkBoard = (row: number, col: number): boolean => {
    return !!board[row][col]
  }
  // 计算落子圆心
  const calcPiecesCenter = (row: number, col: number) => {
    const cellH: number = gobang.height / rows;
    const cellW: number = gobang.width / cols;
    const x: number = col * cellW + cellW / 2;
    const y: number = row * cellH + cellH / 2;
    return [x, y]
  }
  // 计算行列
  const calcRowAndCol = (point: number[]) => {
    const [x, y]: number[] = point;
    const row: number = Math.floor(y / (Math.floor(gobang.height / cols)));
    const col: number = Math.floor(x / (Math.floor(gobang.width / rows)));
    return [row, col] 
  }
  // 点击位置
  const clickPoint = (e: MouseEvent): number[] => {
    const { left, top } = gobang.canvas!.getBoundingClientRect()
    const point: number[] = [(e.pageX - left) * scale, (e.pageY - top) * scale]
    return point
  }
  const onClearBoard = () => {
    gobang.ctx?.clearRect(0, 0, gobang.width, gobang.height)
    initGobangBoard()
  }
  const mountEvent = (el: HTMLCanvasElement) => {
    el.addEventListener('click', (e: MouseEvent) => onGobang(e))
  }
</script>
<style lang='scss' scoped>
  .gobang {
    width: 100%;
    height: 100%;
    background: #eee;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .gobang-utils, .gobang-player {
      height: 500px;
      background: #fff;
      flex: 1;
      margin: 16px;
      width: 100%;
    }
    .gobang-utils {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .el-button {
        margin: 0 0 12px;
      }
    }
    .gobang-chessboard {
      width: 600px;
      height: 500px;
      background: #fff;
      padding: 2px;
      #gobang-canvas {
        cursor: grab;
        background: var(--el-color-warning);
      }
    }
    .gobang-player {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .gobang-player__black, .gobang-player__white {
        flex: 1;
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: center;
      }
      .active {
        font-size: 15px;
        font-weight: bold;
        color: $color-purple;
        background: rgba(98, 106, 239, 0.2);
      }
    }
  }
</style>
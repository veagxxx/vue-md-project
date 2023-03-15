<template>
  <div class="mine">
    <div class="mine-utils">
      <el-button>💣{{ minesCount }}</el-button>
      <el-button @click="onStart">😊</el-button>
      <el-button>000</el-button>
    </div>
    <el-scrollbar style="padding: 4px 12px;">
      <div class="mine-content">
        <canvas id="mine-canvas"></canvas>
      </div>
    </el-scrollbar>
  </div>
</template>
<script lang='ts' setup>
  import { onMounted, onUnmounted, reactive, ref } from 'vue';
  import { usePoint } from '@/hooks';
  onMounted(() => {
    initMineCanvas();
  })
  onUnmounted(() => {
    unMountEvent(mine.canvas)
  })
  const scale: number = window.devicePixelRatio; // 缩放倍率
  const [rows, cols] = [16, 30]; // 棋盘
  const minesCount = ref<number>(99); // 雷数
  const colors: string[] = ['blue', 'green', 'red', 'darkblue', 'brown', 'lightseagreen', 'black', 'gray']
  const grid = new Array<number[]>(rows).fill([]).map(() => new Array<number>(cols).fill(0));
  const show = new Array<string[]>(rows).fill([]).map(() => new Array<string>(cols).fill('*'));
  const mark = new Array<boolean[]>(rows).fill([]).map(() => new Array<boolean>(cols).fill(false));
  const gaming = ref<boolean>(false);
  const over = ref<boolean>(false)
  const mine = reactive({
    width: 900 * scale,
    height: 480 * scale,
    ctx: null as any,
    canvas: null as any,
  })
  const initArray = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = 0;
        show[i][j] = '*';
        mark[i][j] = false;
      }
    }
  }
  const initMineCanvas = () => {
    const mineEl = document.getElementById('mine-canvas') as HTMLCanvasElement;
    const ctx = mineEl.getContext('2d') as CanvasRenderingContext2D;
    mineEl.style.width = `${mine.width / scale}px`;
    mineEl.style.height = `${mine.height / scale}px`;
    mineEl.width = mine.width;
    mineEl.height = mine.height;
    mine.ctx = ctx;
    mine.canvas = mineEl;
    initMineBoard()
    initGrid()
    mountEvent(mineEl)
  }
  const onStart = () => {
    if (over.value) {
      minesCount.value = 99
      onClear()
      initMineBoard()
      initGrid()
    } 
    gaming.value = true
    over.value = false
  }
  // 游戏结束
  const onGameOver = () => {
    alert('Game Over!!!')
    showAll()
    over.value = true
    gaming.value = false
  }
  // 点击网格
  const onGridClick = (e: MouseEvent) => {
    if (!gaming.value) return
    const [x,  y]: number[] = usePoint(e, mine.canvas, scale)
    const [row, col]: number[] = calcRowAndCol([x, y])
    // console.log([row, col], grid, show)
    if (isMine(row, col) && !mark[row][col]) {
      onGameOver()
    } else {
      onSpread(row, col)
      drawBoard()
    }
    if (minesCount.value === 0) {
      alert('Success!!!')
      gaming.value = false
      over.value = true
    }
  }
  // 绘制数字
  const drawBoard = () => {
    const cellH: number = mine.height / rows;
    const cellW: number = mine.width / cols;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (show[i][j] !== '*' && !mark[i][j]) {
          fillCell(j * cellW, i * cellH, cellW, cellH, '#fff')
          if (show[i][j] !== '0') {
            const x: number = j * cellW + cellW / 2;
            const y: number = i * cellH + cellH / 2;
            drawText(show[i][j], x, y, colors[+show[i][j] - 1])
          }
        }
      }
    }
    lineGrid()
  }
  // 展开
  const onSpread = (row: number, col: number) => {
    if (grid[row][col]) return;
    const count: number = getMine(row, col);
    if (count !== 0) { // 周围雷数不为0
      show[row][col] = `${count}`
      // 标记数等于雷数&&标记错误
      if (getMark(row, col) === count && isMarkError(row, col)) {
        onGameOver()
      } else {
        // 标记数等于雷数&&已经展开（点击数字）
        if (getMark(row, col) === count && show[row][col] !== '*') {
          for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
              if (i >= 0 && j >= 0 && i < rows && j < cols && show[i][j] === '*') {
                let c: number = getMine(i, j)
                if (c === 0) {
                  onSpread(i, j)
                } else {
                  show[i][j] = `${c}`
                }
              }
            }
          } 
        }
      }
    } else { // 雷数0（空白）递归展开
      show[row][col] = `${count}`
      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          if (i >= 0 && j >= 0 && i < rows && j < cols && show[i][j] === '*') {
            onSpread(i, j)
          }
        }
      } 
    }
  }
  // 是否标记错误
  const isMarkError = (row: number, col: number) => {
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && j >= 0 && i < rows && j < cols) {
          if (mark[i][j] !== !!grid[i][j]) {
            return true
          }
        }
      }
    } 
    return false
  }
  // 显示全部
  const showAll = () => {
    const cellH: number = mine.height / rows;
    const cellW: number = mine.width / cols;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x: number = j * cellW + cellW / 2;
        const y: number = i * cellH + cellH / 2;
        if (grid[i][j]) {
          drawText('💣', x, y)
        } else if (show[i][j] === '*') {
          const count: number = getMine(i, j)
          if (count !== 0) {
            drawText(`${count}`, x, y, colors[count - 1])
          }
        }
      }
    }
    lineGrid()
  }
  // 标记
  const onMark = (e: MouseEvent) => {
    e.preventDefault()
    if (!gaming.value) return
    const [x,  y]: number[] = usePoint(e, mine.canvas, scale)
    const [row, col]: number[] = calcRowAndCol([x, y])
    const cellH: number = mine.height / rows;
    const cellW: number = mine.width / cols;
    // 未翻开
    if (show[row][col] === '*' && !mark[row][col]) {
      const cx: number = col * cellW + cellW / 2;
      const cy: number = row * cellH + cellH / 2;
      drawText('🚩', cx, cy)
      mark[row][col] = true
      minesCount.value--
    } else if (mark[row][col]) {
      fillCell(col * cellW, row * cellH, cellW, cellH)
      lineGrid()
      mark[row][col] = false
      minesCount.value++
    }
  }
  // 获取标记数
  const getMark = (row: number, col: number) => {
    return (
      calcMark(row, col, -1, -1) + 
      calcMark(row, col, -1, 0) + 
      calcMark(row, col, -1, 1) + 
      calcMark(row, col, 0, -1) + 
      calcMark(row, col, 0, 1) + 
      calcMark(row, col, 1, -1) +
      calcMark(row, col, 1, 0) + 
      calcMark(row, col, 1, 1)
    )
  }
  // 计算标记
  const calcMark = (i: number, j: number, dx: number, dy: number) => {
    if (mark[i + dx] && mark[i + dx][j + dy]) {
      return 1
    } else { 
      return 0
    }
  }
  // 获取雷数
  const getMine = (row: number, col: number) => {
    return (
      calcMines(row, col, -1, -1) + 
      calcMines(row, col, -1, 0) + 
      calcMines(row, col, -1, 1) + 
      calcMines(row, col, 0, -1) + 
      calcMines(row, col, 0, 1) + 
      calcMines(row, col, 1, -1) +
      calcMines(row, col, 1, 0) + 
      calcMines(row, col, 1, 1)
    )
  }
  // 计算雷数
  const calcMines = (i: number, j: number, dx: number, dy: number) => {
    if (grid[i + dx] && grid[i + dx][j + dy]) {
      return 1
    } else { 
      return 0
    }
  }
  // 是否是雷
  const isMine = (row: number, col: number) => {
    return !!grid[row][col]
  } 
  // 计算行列
  const calcRowAndCol = (point: number[]) => {
    const [x, y]: number[] = point;
    const row: number = Math.floor(y / (mine.height / rows));
    const col: number = Math.floor(x / (mine.width / cols));
    return [row, col] 
  }
  
  // 绘制文字
  const drawText = (text: string, x: number, y: number, color: string = '#000') => {
    mine.ctx.beginPath();
    mine.ctx.font = `${30}px 微软雅黑`
    mine.ctx.textBaseline = 'middle'
    mine.ctx.textAlign = 'center'
    mine.ctx.fillStyle = color
    mine.ctx.fillText(text, x, y + 3)
    mine.ctx.closePath();
  }
  // 初始化随机雷区
  const initRandomMine = () => {
    for (let i = 0; i < minesCount.value; i++) {
      let rRow: number = Math.floor(Math.random() * rows);
      let rCol: number = Math.floor(Math.random() * cols);
      while (grid[rRow][rCol]) {
        rRow = Math.floor(Math.random() * rows);
        rCol = Math.floor(Math.random() * cols);
      }
      grid[rRow][rCol] = 1
    }
  }
  // 初始化网格
  const initGrid = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = 0
      }
    }
    initRandomMine()
  }
  // 覆盖
  const initMineBoard = () => {
    const cellH: number = mine.height / rows;
    const cellW: number = mine.width / cols;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        fillCell(j * cellW, i * cellH, cellW, cellH)
      }
    }
    lineGrid()
  }
  // 画网格线
  const lineGrid = () => {
    const cellH: number = mine.height / rows;
    const cellW: number = mine.width / cols;
    for (let i = 0; i <= rows; i++) {
      drawLine(0, i * cellH, mine.width, i * cellH);
    }
    for (let i = 0; i <= cols; i++) {
      drawLine(i * cellW, 0, i * cellW, mine.height);
    }
  }
  // 填充格子
  const fillCell = (x: number, y: number, w: number, h: number, color: string = '#C0C0C0') => {
    mine.ctx.beginPath();
    mine.ctx.fillStyle = color;
    mine.ctx.fillRect(x, y, w, h);
    mine.ctx.closePath();
  }
  // 画线
  const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
    mine.ctx.beginPath();
    mine.ctx.moveTo(x1, y1);
    mine.ctx.lineTo(x2, y2);
    mine.ctx.lineWidth = 4
    mine.ctx.strokeStyle = '#ececec'
    mine.ctx.stroke();
    mine.ctx.closePath();
  }
  const onClear = () => {
    mine.ctx.clearRect(0, 0, mine.width, mine.height);
    initArray()
  }
  const mountEvent = (el: HTMLCanvasElement) => {
    el.addEventListener('click', (e: MouseEvent) => onGridClick(e))
    el.addEventListener('contextmenu', (e: MouseEvent) => onMark(e))
  }
  const unMountEvent = (el: HTMLCanvasElement) => {
    el.removeEventListener('click', (e: MouseEvent) => onGridClick(e))
    el.removeEventListener('contextmenu', (e: MouseEvent) => onMark(e))
  }
</script>
<style lang='scss' scoped>
  .mine {
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    padding: 5px;
    background: #fff;
    display: flex;
    align-items: center;
    flex-direction: column;
    .mine-utils {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 700px;
    }
    .mine-content {
      width: 100%;
      flex: 1;
      display: flex;
      justify-content: center;
      overflow: auto;
    }
  }
</style>
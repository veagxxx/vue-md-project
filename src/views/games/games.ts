export interface Game {
  name: string;
  path: string;
  icon?: string;
}
export const gameList: Game[] = [
  { name: '五子棋', path: '/games/gobang', icon: 'gobang' },
  { name: '扫雷', path: '/games/mine', icon: 'mine' }
]
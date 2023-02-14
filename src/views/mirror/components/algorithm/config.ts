export interface Question {
  id: number;
  title: string;
  content: string;
  answer: string;
}
export const questions: Question[] = [
  {
    id: 1,
    title: '爬楼梯',
    content: `
    假设你正在爬楼梯。需要 <code>n</code> 阶你才能到达楼顶。<br/>每次你可以爬 <code>1</code> 或 <code>2</code> 个台阶。你有多少种不同的方法可以爬到楼顶呢？
    `,
    answer: `function climbStairs(n) {
  /** code here */ 
}`,
  },
  {
    id: 2,
    title: '不同路径',
    content: `
    一个机器人位于一个 <code>m x n</code> 网格的左上角。<br/>
    机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角。<br/>
    问总共有多少条不同的路径？
    `,
    answer: `function diffrentRoute(m, n) {

}`,
  },
]
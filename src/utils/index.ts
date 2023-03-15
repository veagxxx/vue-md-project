export const debounce = (cb: Function, wait: number = 300) => {
  let timeout: number | null = null;
  return function () {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(cb, wait);
  };
};

export const throttle = (cb: Function, wait: number = 100) => {
  let timer: any = null;
  return (...args: any) => {
    if (!timer) {
      timer = setTimeout(() => {
        cb(args);
        clearTimeout(timer);
        timer = null;
      }, wait);
    }
  };
};

export const matchVariable: RegExp = /[const|let|var]+\s+[\w]+\s*=\s*/;

// 优先队列
export class MyPriorityQueue<T> {
  private readonly data: Array<T>;
  private size: number;
  private readonly cmp: { (a: T, b: T): boolean };
  constructor(cmp = (a: T, b: T) => a < b) {
    this.data = new Array<T>();
    this.size = 0;
    this.cmp = cmp;
  }

  peek(): T | null {
    return this.size == 0 ? null : this.data[0];
  }

  poll(): T | undefined {
    if (this.size == 0) return;
    this._swap(0, --this.size);
    this._shiftDown(0);
    return this.data.pop();
  }

  offer(val: T): void {
    this.data.push(val);
    this._shiftUp(this.size++);
  }

  isEmpty(): boolean {
    return this.size == 0;
  }

  _swap(a: number, b: number): void {
    [this.data[a], this.data[b]] = [this.data[b], this.data[a]];
  }

  _child(index: number): number {
    return (index << 1) + 1;
  }

  _parent(index: number): number {
    return (index - 1) >> 1;
  }

  _shiftDown(index: number): void {
    let child = this._child(index);
    while (child < this.size) {
      if (
        child + 1 < this.size &&
        this.cmp(this.data[child + 1], this.data[child])
      )
        child += 1;
      if (this.cmp(this.data[child], this.data[index])) {
        this._swap(index, child);
        index = child;
        child = this._child(index);
      } else break;
    }
  }

  _shiftUp(index: number): void {
    let parent = this._parent(index);
    while (index) {
      if (this.cmp(this.data[index], this.data[parent])) {
        this._swap(index, parent);
        index = parent;
        parent = this._parent(index);
      } else break;
    }
  }
}

// 路由名称校验
export const checkRouterName = (rule: any, value: any, callback: any) => {
  if (value == '') {
    callback(new Error('请输入路由名称'))
  } else {
    callback()
  }
}
// 访问路径校验
export const checkRouterPath = (rule: any, value: any, callback: any) => {
  if (value == '') {
    callback(new Error('请输入访问'))
  } else {
    if (!isValidPath(value)) {
      callback(new Error('访问路径格式错误'))
    }
    callback()
  }
}
// 访问路径格式校验
const isValidPath = (path: string) => {
  // 路径校验
  const start: RegExp = new RegExp(/^\/[a-z|A-Z]+[0-9]?[a-z|A-Z]?/, "g")
  // 中文校验
  const zhTest: RegExp = new RegExp("[\\u4E00-\\u9FFF]+", "g")
  // 多 / 校验
  const multi: boolean = path.split('').filter((item: string) => item == '/').length > 1
  return start.test(path) && !zhTest.test(path) && !multi
}
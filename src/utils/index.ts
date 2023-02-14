export const debounce = (cb: Function, wait: number = 300) =>  {
  let timeout: number | null = null;
  return function () {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(cb, wait);
  }
}


export const matchVariable: RegExp = /[const|let|var]+\s+[\w]+\s*=\s*/
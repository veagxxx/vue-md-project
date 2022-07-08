## 干货知识点

### 1. 数组扁平化

```js
const flatter = (array) => {
    retrun array.reduce((pre, cur) => {
        [
            ...pre,
        	...(Array.isArray(cur) ? flatter(cur) : [cur]) 
    	]
    }, [])
}
const flatter = (array) => array.reduce((pre, cur) => [...pre, ...(Array.isArray(cur) ? flatter(cur) : [cur])], [])
```

### 2. 台阶问题

有 N 个台阶，一步可以走一梯或者两梯，请问有多少种走法

方法一：递归

```js
const recursionWalk = (n) => {
    if (n <= 2) {
        return n
    }
    return recursionWalk(n - 1) + recursionWalk(n - 2)
}
```

方法二：动态规划

```js
const dynamicWalk = (n) => {
    if (n <= 2) return n
    const dp = []
    dp[1] = 1
    dp[2] = 2
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]
    }
    return dp[n]
}
```

### 3. 一维数组旋转

一维数组旋转45° / 135°

```js
const ratate45deg = (array) => {
    const length = array.length
    const result = new  Array(length).fill().map(() => new Array(length).fill(0))
    for (let i = 0; i < length; i++) {
        result[i][i] = array[i]
    }
    return result
}

const ratate135deg = (array) => {
    const length = array.length
    const result = new  Array(length).fill().map(() => new Array(length).fill(0))
    for (let i = 0; i < length; i++) {
        result[i][length - i - 1] = array[i]
    }
    return result
}
```

### 4. 有效括号

给定一个只包括 ‘(’，‘)’，‘{’，‘}’，‘[’，‘]’ 的字符串 s ，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。

```js
const isValid = (s) => {
    if (s.length == 1) return false
    let leftList = []
    for (let i = 0; i < s.length; i++) {
        // 右括号
        if (s[i] == ')' || s[i] == '}' || s[i] == ']') {
            // 没有左括号，或者左右括号不匹配
            if (!leftList.length || !isMatch(leftList[leftList.length - 1], right)) {
                return false
            } else { // 匹配，移除最后一个左括号，由外往里比较
                leftList.pop()
            }
        } else { // 左括号
            leftList.push(s[i])
        }
    }
    return leftList.length == 0
}
// 判断左右是否匹配
const isMatch = (left, right) => {
    switch(right) {
        case ')':
            return left === '('
        case ']':
            return left === '['
        case '}':
            return left === '{'
        default:
            return false
    }
}
```

### 5. getValue

给定一个对象或数组，函数将返回指定路径的值，否则为 null。

```js
const getValue = (obj, path) => {
  path = path.replace(/\[/g, '.').replace(/\]/g, '')
  const pathList = path.split('.').filter(key => key)
  return pathList.reduce((pre, cur) => {
    return (pre instanceof Object ? pre[cur] : undefined)
  }, obj)
}
getValue({ a: { b: 12 } }, 'a.b')) // 12
```

### 6. 递归实现深拷贝

```js
const deepClone = (obj) => {
    const cloneObj = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object') {
                  cloneObj[key] = deepClone(obj[key])
                } else {
                    cloneObj[key] = obj[key]
                }
            }
        }
    }
    return cloneObj
}


let array = ['xx', 'xx']
for (let i = 0; i < array.length; i++) {
    s.replace(array[i]/g, `\n${array[i]}`)
}
```



### 7. 数组去重

```js
// 方式一：new Set
const unique = (array) => {
    return [...Array.from(new Set(array))]
}

// 方式二：indexOf
const unique = (array) => {
    if (!Array.isArray(array)) return
    let result = []
    for (let i = 0; i < array.length; i++) {
        if (result.indexOf(array[i]) === -1) {
            result.push(array[i])
        }
    }
    return result
}

// 方式三：splice
const unique = (array) => {
    if (!Array.isArray(array)) return
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] == array[i]) {
                array.splice(j, 1)
            }
        }
    }
    return array
}
```
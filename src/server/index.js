const express = require("express")
const bodyParser = require("body-parser")
const fs = require('fs')
const app = express()
// 处理 post 请求的请求体，限制大小最多为 20 兆
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(bodyParser.json({ limit: '20mb' }));
// 跨域设置
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
})

/**
 * 写文件
 */
 app.post('/write', (req, res) => {
  // console.log('req', req.body)
  const { file, fileName, routerName, routerPath } = req.body
  // 先读取路由配置 json 文件
  fs.readFile('src/menus/path.json', 'utf-8', (error, data) => {
    if (error) { 
      return res.json({
        message: '上传失败',
        code: 500
      })
    }
    const menus = JSON.parse(data)
    const pathIndex = menus.findIndex(item => item.path === routerPath)
    const pathItem = {
      "name": routerName,
      "path": routerPath,
      "doc": fileName,
    }
    if (pathIndex >= 0) {
      menus.splice(pathIndex, 1, pathItem)
    } else {
      menus.push(pathItem)
    }
    const menusString = JSON.stringify(menus)
    // 回写 json 文件
    fs.writeFileSync('src/menus/path.json', menusString)
    // console.log(data)
    // 写入 .md 文件
    fs.writeFile(`src/doc/${fileName}`, file, (error) => {
      if (error) {
        res.json({
          message: '上传失败',
          code: 500
        })
      }
      res.json({
        message: '上传成功',
        code: 200
      })
    })
  })
  
})

app.listen(9088, () => {
  console.log('server running...')
})

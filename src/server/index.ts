/**
 * 废弃：tsconfig.json 中的 module 需设置成 "commonJs" 才行，但是设置成 commonjs 后 router 中的 import.meta 以及 await 会报错但是不影响使用，只是看不惯爆红的文件
 * */
import express from 'express'
import bodyParser from 'body-parser'
import * as fs from 'fs'
const app: express.Application = express()
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
  const { file, fileName } = req.body
  // res.send('Hello World')
  fs.writeFile(`src/doc/${fileName}`, file, (error: any) => {
    if (error) {
      return res.json({
        message: '上传失败',
        code: 500
      })
    }
    return res.json({
      message: '上传成功',
      code: 200
    })
  })
})

app.listen(9088, () => {
  console.log('server running...')
})

// export default app
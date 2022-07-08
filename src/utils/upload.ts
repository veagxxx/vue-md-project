/**
 * fs.writeFile(file, data[, options], callback)
 * 参数
     参数使用说明如下：
     file - 文件名或文件描述符。
     data - 要写入文件的数据，可以是 String(字符串) 或 Buffer(缓冲) 对象。
     options - 该参数是一个对象，包含 {encoding, mode, flag}。默认编码为 utf8, 模式为 0666 ， flag 为 'w'
     callback - 回调函数，回调函数只包含错误信息参数(err)，在写入失败时返回。
 */
// var fs = require('fs');
// //writeFile(1, 2, 3)
// //参数1：写入的文件路径，参数2：写入的内容, 参数3：回调函数 error错误对象，写入成功为null
// fs.writeFile("../data/file03.md", "# 斤斤计较", function (error) {
//     if (error) {
//         console.log.error(error);
//         console.log("文件写入失败");
//     }
//     console.log("写入文件成功");
//     //console.log(error);
// });
// //正确的错误处理方式
// fs.readFile("../data/file03.md", function (error, data) {
//     if (error) {
//         console.log("文件读取失败");
//     }else {
//         console.log("文件读取成功:" + data.toString());
//     }
// });


import * as fs from 'fs'
export const uploadMdFile = (file: any, name: string) => {
  fs.writeFile(`@/doc/${name}`, file, (error: any) => {
    if (error) {
      return {
        message: '上传失败',
        code: 500
      }
    }
    return {
      message: '上传成功',
      code: 200
    }
  })
}
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



  // const animationId = ref<number>(0)
  // const resizing = ref<boolean>(false)
  // const initCanvas = () => {
  //   const canvas = <HTMLCanvasElement>document.getElementById('canvas')
  //   const ctx = <CanvasRenderingContext2D>canvas.getContext('2d')
  //   const scale: number = 2
  //   const fontSize: number = 20 * scale
  //   const lineHeight = fontSize * 1.2
  //   const dpr: number = window.devicePixelRatio
  //   const [width, height]: number[] = [
  //     (canvas.parentElement!.offsetWidth - 20) * dpr, 
  //     (canvas.parentElement!.offsetHeight - 20) * dpr
  //   ]
  //   canvas.width = width
  //   canvas.height = height
  //   canvas.style.width = width / scale + 'px'
  //   canvas.style.height = height / scale + 'px'
  //   ctx.lineWidth = 20 * scale
  //   ctx.font = `${fontSize}px 微软雅黑`
  //   ctx.textAlign = 'center'
  //   ctx.textBaseline = 'middle'
  //   const mockData: any = [
  //     {
  //       text: '图表1',
  //       rate: 90,
  //       color: '#ff8800'
  //     },
  //     {
  //       text: '图表2',
  //       rate: 100,
  //       color: 'green'
  //     },
  //   ]
  //   mockData.forEach((item: any) => {
  //     item.runRate = 0,
  //     item.step = item.rate / 100
  //   });
  //   const render = () => {
  //     ctx.clearRect(0, 0, width, height)
  //     mockData.forEach((item: any, index: number) => {
  //       const mt: number = ctx.lineWidth / 2 + index * (ctx.lineWidth - index)
  //       const radius: number = canvas.height / 2
  //       ctx.beginPath()
  //       ctx.strokeStyle = '#eeeeee'
  //       ctx.lineCap = 'round'
  //       ctx.arc(width / 2, radius, radius - mt, 0, Math.PI * 2)
  //       ctx.stroke()

  //       ctx.beginPath()
  //       ctx.strokeStyle = item.color
  //       ctx.lineCap = 'round'
  //       ctx.arc(width / 2, radius, radius - mt, 0, Math.PI / 180 * (360 * item.runRate / 100))
  //       ctx.stroke()

  //       if (item.runRate > item.rate) {
  //         item.runRate = item.rate
  //       } else if (item.runRate < item.rate) {
  //         item.runRate += item.step
  //       }

  //       ctx.fillStyle = item.color
  //       ctx.fillText(
  //         `${item.text}：${item.rate}%`, 
  //         width / 2, 
  //         index * lineHeight + (height - lineHeight * mockData.length) / 2 + lineHeight / 2
  //       )
  //     })
  //     if (!resizing.value) {
  //       animationId.value = window.requestAnimationFrame(render)
  //     }
  //   }
  //   render()
  // }
  // const resizeCanvas = () => {
  //   resizing.value = true
  //   window.cancelAnimationFrame(animationId.value)
  //   initCanvas()
  //   resizing.value = false
  // }
  // onMounted(() => {
  //   window.addEventListener('resize', resizeCanvas)
  //   initCanvas()
  // })
  // onUnmounted(() => {
  //   window.removeEventListener('resize', resizeCanvas)
  // })
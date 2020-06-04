var express = require('express')
var path = require('path')
var router = express.Router()
var multiparty = require('multiparty')
var fs = require('fs')

/* 用户修改头像接口 */
router.post('/img', function (req, res, next) {
  // 定义上传文件存储地址
  const upload_dir = path.resolve("public/images")
  // 生成一个multiparty对象
  var form = new multiparty.Form()
  // 解析请求  回调中err解析错误信息，field formData字段数据，file formData文件数据
  form.parse(req,function (err,fields,file){
    // 解析出错处理
    if(err){
      return res.json({
        state: 1,
        msg: err
      })
      console.log(err)
    }
    // 获取文件数据
    const [chunk] =file.chunk
    // 文件名
    const [filename] = fields.filename
    // 最终存储绝对地址
    const chunk_dir = `${upload_dir}/${filename}`
    // fs读写文件
    let readStream = fs.createReadStream(chunk.path)
    let writeStream = fs.createWriteStream(chunk_dir)
    readStream.pipe(writeStream)
    readStream.on('end',function(){
      fs.unlinkSync(chunk.path)
    })
    // let url = `http://127.0.0.1:3000/images/${filename}`
// 更新数据库user user_photo
// 更新成功
      res.json({
        state: 0,
        msg: '上传成功！',
        url: `http://127.0.0.1:3000/images/${filename}`
      })
  })
})
/* ----用户修改头像接口 */
module.exports = router
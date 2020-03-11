var express = require('express')
var path = require('path')
var router = express.Router()
var db = require('../models/sql')
var multiparty = require('multiparty');
var multer = require('multer')
var fs = require('fs')
var bcrypt = require('bcrypt')

/* 登录接口 */
router.post('/login', function (req, res, next) {
  let { user_tel, user_pass } = req.body
  
  let sql = `select * from users where user_tel=?`
  db(sql, [user_tel], function (err, data) {
    if (err) {
      console.log(err)
      res.json({
        state: 0,
        err: err,
        msg: 'Query error!'
      })
    }

    // 判断用户是否存在
    if (data.length === 0) {
      res.json({
        state: 1,
        msg: '用户不存在！'
      })
    } else {
      // console.log(data[0].user_pass)
      // console.log(user_pass)
      // console.log(bcrypt.compareSync('lily123456',data[0].user_pass))
      if (!bcrypt.compareSync(user_pass,data[0].user_pass)) {
        res.json({
          state: 2,
          msg: '密码错误'
        })
      } else {
        res.json({
          state: 3,
          msg: 'login success',
          data: data[0],
          token: 'token'
        })
      }
    }
  })
})
/* ----登录接口 */

/* 注册接口 */
router.post('/register', function (req, res, next) {
  var { user_tel, user_pass,user_name } = req.body
  // console.log(user_pass)
  /* bcypt加密 */
  let salt = bcrypt.genSaltSync(10)
  user_pass = bcrypt.hashSync(user_pass,salt)
  // console.log(bcrypt.compareSync(user_pass, user_pass1))
  // console.log(user_pass)
	var sql = `insert into users(user_tel,user_pass,user_name) values(?,?,?)`
	db(sql, [user_tel,user_pass,user_name], function (err, data) {
	  if (err) {
	    console.log(err)
	    res.json({
	      state: 0,
	      err: err,
	      msg: '用户已注册！'
	    })
	  }else {
      console.log(data)
				res.json({
          state: 1,
          data: data,
          token: 'token',
					msg: '注册成功',
				})
			}
	})
})
/* ---注册接口 */

/* 用户个人信息接口 */
router.get('/personal', function (req, res, next) {
  var user_id = req.query.user_id
  var sql = `select * from users where user_id=?`
  //操作数据库
  db(sql, [user_id], function (err, data) {
    if (err) {
      console.log(err)
      return res.json({
        err: err,
        msg: '查询数据库出错'
      })
    }
    //查询成功，返回查询结果 data
    res.json({
      data: data[0]
    })
  })
})
/* ---用户个人信息接口 */

/* 用户收藏书籍接口 */
router.post('/collect',function(req,res,next){
  var {book_id,user_id} = req.body
  let sql = `UPDATE users SET user_collect = CONCAT(users.user_collect,?,',') WHERE user_id=?`
  db(sql,[book_id,user_id],function(err,data){
    if(err){
      return res.json({
        err: err,
        msg: '更新数据出错'
      })
    }
    // 插入成功
    res.json({
      msg: '收藏成功！'
    })
  })
})
/* ----用户收藏书籍接口 */

/* 用户修改头像接口 */
router.post('/photo', function (req, res, next) {
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
    // console.log(fields)
    // console.log(file)
    // 获取文件数据
    const [chunk] =file.chunk
    // 文件名
    const [filename] = fields.filename
    // 用户ID
    const [user_id] = fields.userid
    // 最终存储绝对地址
    const chunk_dir = `${upload_dir}/${filename}`
    // fs读写文件
    let readStream = fs.createReadStream(chunk.path)
    let writeStream = fs.createWriteStream(chunk_dir)
    readStream.pipe(writeStream)
    readStream.on('end',function(){
      fs.unlinkSync(chunk.path)
    })
    let url = `http://127.0.0.1:3000/images/${filename}`
// 更新数据库user user_photo
    let sql = `UPDATE users SET user_photo =? WHERE user_id=?`
    db(sql,[url,user_id],function(err,data){
      if(err){
        console.log(err)
        return res.json({
          err: err,
          msg: '更新数据出错'
        })
       
      }
      // 更新成功
      res.json({
        state: 0,
        msg: '上传成功！',
        url: `http://127.0.0.1:3000/images/${filename}`
      })
    })
  })
})
/* ----用户修改头像接口 */
module.exports = router

var express = require('express')
var router = express.Router()
var db = require('../models/sql')

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
      if (data[0].user_pass != user_pass) {
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
	
	var sql = `insert into users(user_tel,user_pass,user_name) values(?,?,?)`
	db(sql, [user_tel,user_pass,user_name], function (err, data) {
	  if (err) {
	    console.log(err)
	    res.json({
	      state: 0,
	      err: err,
	      msg: '用户存在'
	    })
	  }else {
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
  var {url,user_id} = req.body
  let sql = `UPDATE users SET user_photo=? WHERE user_id=?`
  db(sql, [url, user_id], function (err, data) {
    if (err) {
      console.log(err)
      return res.json({
        err: err,
        msg: '更新数据出错'
      })
    }
    // 插入成功
    res.json({
      msg: '上传成功！'
    })
  })
})
/* ----用户修改头像接口 */
module.exports = router

var express = require('express');
var router = express.Router();
var db = require('../models/sql');
// 评论列表
router.post('/book', function (req, res, next) {
    let {book_id,user_id} = req.body
    // console.log(book_id)
    // select * from comment,(select * from users where user_id in (select user_id from comment where book_id = ?))
    let sql = `select comment_id from comment_like where user_id = ? and comment_like.comment_id in (select comment.comment_id from comment where book_id = ? );SELECT * FROM (SELECT * FROM COMMENT WHERE book_id = ?) AS total left join users on users.user_id=total.user_id order by total.comment_date desc`
    db(sql, [user_id,book_id,book_id], function (err, data) {
        if (err) {
          console.log(err)
          return res.json({
              err: err,
              msg: 'Query error!'
          })
         }
        res.json({
          data: data
        })
    })
})
/* 用户的评论 */
router.get('/user', function (req, res, next) {
  let user_id = req.query.user_id
  console.log(user_id)
  let sql = `select * from comment where user_id=? order by comment_date desc`
  console.log('user')
  db(sql, [user_id], function (err, data) {
    if (err) {
      console.log(err)
      return res.json({
        err: err,
        msg: 'Query error!'
      })
    }
    res.json({
      state: 200,
      data: data
    })
  })
})

// 发表评论
router.post('/submit', function (req, res, next) {
    let {comment_text,book_id,user_id,comment_date,comment_rate} = req.body
    let sql = `insert into comment(comment_text,comment_date,book_id,user_id,comment_rate) values(?,?,?,?,?) `
    db(sql, [comment_text,comment_date,book_id,user_id,comment_rate], function (err, data) {
        if (err) {
          console.log(err)
        return res.json({
            err: err,
            msg: 'Query error!'
        })
    }
    res.json({
      data: data.insertId,
      msg: '发表成功！'
    })
  })
})
// 获取 用户对某书评论的点赞
router.post('/userlike', function(req, res, next) {
  let {
    user_id,
    book_id
  } = req.body
  // replace into lately_read(user_id, book_id, chapter) values( ? , ? , ? )
  let sql = `select * from comment_like where user_id = ? and comment_like.comment_id in (select comment.comment_id from comment where book_id = ? )`
  db(sql, [comment_likenum, comment_id, user_id, comment_id], function(err, data) {
    if (err) {
      return res.json({
        err: err,
        msg: 'Query error!'
      })
    }
    res.json({
      data: data,
      msg: '点赞成功'
    })
  })
})
// 点赞
router.post('/addlike', function(req, res, next) {
  let {
    user_id,
    comment_id,
    comment_likenum,
  } = req.body
  // replace into lately_read(user_id, book_id, chapter) values( ? , ? , ? )
  let sql = `update comment set comment_likenum=? where comment_id=?;insert into comment_like(user_id,comment_id) values(?,?)`
  db(sql, [comment_likenum, comment_id, user_id, comment_id], function(err, data) {
    if (err) {
      return res.json({
        err: err,
        msg: 'Query error!'
      })
    }
    res.json({
      data: data,
      msg: '点赞成功'
    })
  })
})
// 取消点赞
router.post('/cancellike', function(req, res, next) {
  let {
    user_id,
    comment_id,
    comment_likenum,
  } = req.body
  // replace into lately_read(user_id, book_id, chapter) values( ? , ? , ? )
  let sql = `update comment set comment_likenum=? where comment_id=?;delete from comment_like where (user_id,comment_id) = (?,?)`
  db(sql, [comment_likenum, comment_id, user_id, comment_id], function(err, data) {
    if (err) {
      console.log(err)
      return res.json({
        err: err,
        msg: 'Query error!'
      })
    }
    res.json({
      data: data,
      msg: '取消点赞成功'
    })
  })
})
module.exports = router;

var express = require('express');
var router = express.Router();
var db = require('../models/sql');
// 评论列表
router.get('/book', function (req, res, next) {
    let book_id = req.query.book_id
    console.log(book_id)
    let sql = `SELECT * FROM (SELECT * FROM COMMIT WHERE book_id = ?) AS total,users WHERE total.user_id = users.user_id`
    db(sql, [book_id], function (err, data) {
        if (err) {
          return res.json({
              err: err,
              msg: 'Query error!'
          })
         }
        console.log(data)
        res.json({
          data: data
        })
    })
})

// 发表评论
router.post('/submit', function (req, res, next) {
    console.log(req.body)
    let {commit_text,book_id,user_id,commit_date} = req.body
    let sql = `insert into commit(commit_text,commit_date,book_id,user_id) values(?,?,?,?) `
    db(sql, [commit_text,commit_date,book_id,user_id], function (err, data) {
        if (err) {
        return res.json({
            err: err,
            msg: 'Query error!'
        })
    }
    console.log(data)
    res.json({
      data: data.insertId,
      msg: '发表成功！'
    })
  })
})
module.exports = router;

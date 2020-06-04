var express = require('express')
var path = require('path')
var router = express.Router()
var db = require('../models/sql')

router.post('/category', function (req, res, next) {
  let channel_name = req.body.channel_name
  let sql = `select * from category where channel=?`
  db(sql,[channel_name],function (err, data) {
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
router.get('/images',function(req,res,next){
  let channel = req.query.channel
  let sql = `select * from images where channel = ?`
  db(sql,[channel],function(err,data){
    if(err){
      return res.json({
        err: err,
        msg: '查询失败'
      })
    }
    res.json({
      state: 200,
      data: data
    })
  })
})
module.exports = router
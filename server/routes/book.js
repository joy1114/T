var express = require('express');
var router = express.Router();
var db = require('../models/sql');
// 出版收藏榜单
router.get('/publishCollect', function (req, res, next) {
  let sql = `SELECT * FROM books WHERE channel="出版" ORDER BY collect_number DESC`
  db(sql, [], function (err, data) {
    if (err) {
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

// 出版新书点击榜单
router.get('/publishNewbook', function (req, res, next) {
  let sql = `SELECT * FROM books WHERE channel="出版" and book_status="新书" ORDER BY vote_number DESC`
  db(sql, [], function (err, data) {
    if (err) {
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

// 出版好评榜单
router.get('/publishFavourable', function (req, res, next) {
  let sql = `SELECT * FROM books WHERE channel="出版" ORDER BY commit_number DESC`
  db(sql, [], function (err, data) {
    if (err) {
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
// 女生完结榜单
router.get('/girlComplate', function (req, res, next) {
  let sql = `SELECT * FROM books WHERE book_status="完结" and channel="女生" ORDER BY commit_number DESC`
  db(sql, [], function (err, data) {
    if (err) {
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
// 女生连载榜单
router.get('/girlContinued', function (req, res, next) {
  let sql = `SELECT * FROM books WHERE book_status="连载" and channel="女生" ORDER BY commit_number DESC`
  db(sql, [], function (err, data) {
    if (err) {
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
// 女生好评榜单
router.get('/girlFavourable', function (req, res, next) {
  let sql = `SELECT * FROM books WHERE channel="女生" ORDER BY commit_number DESC`
  db(sql, [], function (err, data) {
    if (err) {
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
// 男生完结榜单
router.get('/boyComplate', function (req, res, next) {
  let sql = `SELECT * FROM books WHERE book_status="完结" and channel="男生" ORDER BY commit_number DESC`
  db(sql, [], function (err, data) {
    if (err) {
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
// 男生连载榜单
router.get('/boyContinued', function (req, res, next) {
  let sql = `SELECT * FROM books WHERE book_status="连载" and channel="男生" ORDER BY commit_number DESC`
  db(sql, [], function (err, data) {
    if (err) {
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
// 男生好评榜单
router.get('/boyFavourable', function (req, res, next) {
  let sql = `SELECT * FROM books WHERE channel="男生" ORDER BY commit_number DESC`
  db(sql, [], function (err, data) {
    if (err) {
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
 /* 获取轮播商品 首页展示商品 */
router.get('/suggest', function (req, res, next) {
	let sql = `select * from books where suggest = 1`

	db(sql, [], function (err, data) {
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

/* 获取 频道channel表 */
router.get('/channel', function (req, res, next) {

	let sql = `select * from channel`
	db(sql, function (err, data) {
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
/* 获取 分类category表 */
router.get('/category', function (req, res, next) {

	let sql = `select * from category`
	db(sql, function (err, data) {
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

/* 获取 状态status表 */
router.get('/status', function (req, res, next) {

	let sql = `select * from status`
	db(sql, function (err, data) {
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

/*  分类页面查询  */

router.post('/categoryQurry', function (req, res, next) {
	let {channel,category,book_status} = req.body
	let sql,prams
	// 判断是否分类的全部书籍
	if(book_status == '全部'){
		prams = [channel,category]
		sql= `select * from books where channel=? and category=?`
	}else{
		prams = [channel,category,book_status]
		sql= `select * from books where channel=? and category=? and book_status=?`
	}
	db(sql, prams, function (err, data) {
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


/* 获取某本书籍详细信息 */
router.get('/one', function (req, res, next) {
	let book_id = req.query.book_id
	let sql = `select * from books where book_id=?`
	db(sql, [book_id], function (err, data) {
		if (err) {
			console.log(err)
			return res.json({
			err: err,
			msg: 'Query error!'
		})
		}
		res.json({
			data: data[0]
		})
	})
})


router.post('/shelf', function (req, res, next) {
  let {book_ids} = req.body
  let sql = `select * from books where book_id in (?)`
  db(sql, [book_ids], function (err, data) {
    if (err) {
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
module.exports = router;

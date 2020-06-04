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
      state: 200,
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
      state: 200,
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
      state: 200,
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
      state: 200,
			data: data
		})
	})
})

/*  分类页面查询  */

router.post('/categoryQurry', function (req, res, next) {
	let category = req.body.category
	let sql= `select * from books where category=?`
	db(sql, [category], function (err, data) {
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
      state: 200,
			data: data[0]
		})
	})
})
/* 获取热门书籍 */
router.post('/hot', function(req, res, next) {
  let {channel} = req.body
  let sql = `select * from books where channel=? order by read_num desc limit 0,4`
  db(sql, [channel], function(err, data) {
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
router.post('/finishHot', function(req, res, next) {
  let {
    channel
  } = req.body
  let sql = `select * from books where channel=? and book_status ="完本" order by read_num desc limit 0,3`
  db(sql, [channel], function(err, data) {
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
/* 获取书架 */
router.post('/shelf', function (req, res, next) {
  let {book_ids} = req.body
  console.log(book_ids)
  let sql = `select total.book_id,total.book_name,total.author,total.category,total.book_status,total.images,titles,update_time from (select * from books where book_id in (?))as total,booktitles where total.book_id=booktitles.book_id order by booktitles.update_time`
  db(sql, [book_ids], function (err, data) {
    if (err) {
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

/* 获取目录 */
 router.get('/titles', function(req, res, next) {
   let book_id = req.query.bookid
  //  console.log(book_id)
   let sql = `select titles,update_time from booktitles where book_id = ?`
   db(sql,[book_id], function(err, data) {
     if (err) {
       console.log(err)
       return res.json({
         err: err,
         msg: 'Query error!'
       })
     }
     res.json({
       state: 200,
       data: data[0]
     })
   })
 })
 /* 获取书籍章节及内容 */
 router.post('/content', function (req, res, next) {
   let {book_id,title_id} = req.body
  //  console.log(book_id)
   let table = 'book'+book_id.toString()
  //  console.log(title_id)
   /* 表名为字符串  SQL语句拼接 */
   let sql=''
   sql=sql.concat('select * from ', table,' where book_id =',title_id)
  //  console.log(sql)
   db(sql, function (err, data) {
     if (err) {
       console.log(err)
       return res.json({
         err: err,
         msg: 'Query error!'
       })
     }
    //  console.log(data)
     res.json({
       state: 200,
       data: data[0]
     })
   })
 })
 /* 增加收藏数量 */
 router.get('/addcollectnum', function(req, res, next) {
   let book_id = req.query.book_id
   let sql = `update books set collect_num=books.collect_num+1 where book_id=?`
   db(sql, [book_id], function(err, data) {
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
  /* 减少收藏数量 */
  router.post('/reducecollectnum', function(req, res, next) {
    let {dataids} = req.body
    let sql = `update books set collect_num=books.collect_num-1 where book_id in (?)`
    db(sql, [dataids], function(err, data) {
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
 router.get('/addreadnum', function(req, res, next) {
   let book_id = req.query.book_id
   let sql = `update books set read_num=books.read_num+1 where book_id=?`
   db(sql, [book_id], function(err, data) {
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
module.exports = router;

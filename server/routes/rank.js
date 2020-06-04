var express = require('express');
var router = express.Router();
var db = require('../models/sql');
// 出版收藏榜单
router.get('/publishCollect', function(req, res, next) {
    let sql = `SELECT * FROM books WHERE channel="出版" ORDER BY collect_number DESC`
    db(sql, [], function(err, data) {
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
router.get('/publishNewbook', function(req, res, next) {
    let sql = `SELECT * FROM books WHERE channel="出版" and book_status="新书" ORDER BY vote_number DESC`
    db(sql, [], function(err, data) {
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
router.get('/publishFavourable', function(req, res, next) {
    let sql = `SELECT * FROM books WHERE channel="出版" ORDER BY commit_number DESC`
    db(sql, [], function(err, data) {
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
router.get('/girlComplate', function(req, res, next) {
    let sql = `SELECT * FROM books WHERE book_status="完结" and channel="女生" ORDER BY commit_number DESC`
    db(sql, [], function(err, data) {
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
router.get('/girlContinued', function(req, res, next) {
    let sql = `SELECT * FROM books WHERE book_status="连载" and channel="女生" ORDER BY commit_number DESC`
    db(sql, [], function(err, data) {
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
router.get('/girlFavourable', function(req, res, next) {
    let sql = `SELECT * FROM books WHERE channel="女生" ORDER BY commit_number DESC`
    db(sql, [], function(err, data) {
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
router.get('/boyComplate', function(req, res, next) {
    let sql = `SELECT * FROM books WHERE book_status="完结" and channel="男生" ORDER BY commit_number DESC`
    db(sql, [], function(err, data) {
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
router.get('/boyContinued', function(req, res, next) {
    let sql = `SELECT * FROM books WHERE book_status="连载" and channel="男生" ORDER BY commit_number DESC`
    db(sql, [], function(err, data) {
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
router.get('/boyFavourable', function(req, res, next) {
    let sql = `SELECT * FROM books WHERE channel="男生" ORDER BY commit_number DESC`
    db(sql, [], function(err, data) {
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
// rankTopFive阅读榜
router.post('/readrank', function(req, res, next) {
    let {
        channel
    } = req.body
    let sql = `select book_id,book_name from books where channel=? order by read_num desc limit 0,5`
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
            data: data,
            msg: 'chenggong'
        })
    })
})
// rankTopFive好评榜
router.post('/ratingsrank', function(req, res, next) {
    let { channel } = req.body
    let sql = `select book_id,book_name from books where channel=? order by ratings desc limit 0,5`
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
            data: data,
            msg: 'chenggong'
        })
    })
})
// rankTopFive收藏榜
router.post('/collectrank', function(req, res, next) {
    let {
        channel
    } = req.body
    let sql = `select book_id,book_name from books where channel=? order by collect_num desc limit 0,5`
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
            data: data,
            msg: 'chenggong'
        })
    })
})
// rankTopFive更新榜
router.post('/wordnumrank', function(req, res, next) {
    let { channel } = req.body
    let sql = `select book_id,book_name from books where channel=? order by word_count desc limit 0,5`
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
            data: data,
            msg: 'chenggong'
        })
    })
})
module.exports = router;
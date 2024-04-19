const router = require('./route.config');
const { zimuzuSql } = require('../mysql/index.js');
var https = require('https')

// const lastId = 0

router.get('/yyets/list', (req, res) => {
    const page = req.query.page || 1
    const pageCount = req.query.pageCount || 20
    // const sqlstr = "select * from yyets_jx limit ?,?"
    // const sqlstr = `SELECT * FROM yyets_jx WHERE id >= (select id from yyets_jx limit ?, 1) limit ?`
    const sqlstr = `SELECT * FROM yyets_jx a JOIN (select id from yyets_jx limit ?, ?) b ON a.id = b.id`
    const sqlstr2 = "select count(id) as count from yyets_jx"
    const params = [(parseInt(page) - 1) * parseInt(pageCount), parseInt(pageCount)]
    zimuzuSql(sqlstr, params).then(async (data) => {
      const [{ count }] = await zimuzuSql(sqlstr2)
      res.send({
        list: data,
        page: {
          page,
          pageCount,
          count
        }
      })
    })
  })

  module.exports = router;

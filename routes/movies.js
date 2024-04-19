const router = require('./route.config');
const { xiaoshuoSql } = require('../mysql/index.js');
var https = require('https')
const moment = require('moment')
moment.locale('zh-cn')

router.get('/movies/movielist', (req, res) => {
  const page = req.query.page || 1
  const pageCount = req.query.pageCount || 20
  const sqlstr = "select id as mid, title, url, time, description from movies limit ?,?"
  const sqlstr2 = "select count(id) as count from movies"
  const params = [(parseInt(page) - 1) * parseInt(pageCount), parseInt(pageCount)]
  xiaoshuoSql(sqlstr, params).then(async (data) => {
    data.forEach(item => {
      if (item.time) {
        item.time = item.time.split('点击')[0]
      }
    })
    const [{ count }] = await xiaoshuoSql(sqlstr2)
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

router.get('/movies/detail', (req, res) => {
  const mid = req.query.mid
  const sqlstr = `select id as mid, detail_title, detail_type, detail_image, detail_description, detail_desimage, detail_download from movies where id=?`
  // const params = [(parseInt(page) - 1) * parseInt(pageCount), parseInt(pageCount)]
  xiaoshuoSql(sqlstr, [mid]).then(async (data) => {
    res.send({ data: data[0] })
  })
})

router.post('/movies/updatemessage', (req, res) => {
  const name = req.query.name
  const email = req.query.email
  const tel = req.query.tel
  const message = req.query.message
  const time = moment().format('llll')
  const sqlstr = `insert into message_board(name, email, tel, message, time) values(?,?,?,?,?)`
  xiaoshuoSql(sqlstr, [name, email, tel, message, time]).then(async (data) => {
    if (data.status == 210) {
      res.send({ status: data.status, message: '留言失败' })
    } else {
      res.send({ status: 200, message: '留言成功' })
    }
  })
})

router.get('/movies/getmessage', (req, res) => {
  const sqlstr = `select *  from message_board order by id DESC`
  xiaoshuoSql(sqlstr).then(async (data) => {
    console.log(data)
    res.send({
      data: data
    })
  })
})

router.get('/movies/demo', (req, res) => {
  let data = ''
  https.get('https://api.tiankongapi.com/api.php/provide/vod/?ac=list', function (result) {
    result.on("data", function (chunk) {
      data += chunk;
    });
    result.on("end", function () {
      var obj = JSON.parse(data)
      res.send(obj)
    });
  })
})

module.exports = router;

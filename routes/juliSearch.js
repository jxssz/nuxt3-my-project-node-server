const router = require('./route.config');
// const { xiaoshuoSql } = require('../mysql/index.js');
var https = require('https')
// const moment = require('moment')
// moment.locale('zh-cn')

router.get('/movies/search', (req, res) => {
    let data = ''
    const keyword = req.query.keyword || ''
    const page = req.query.page || 1
    console.log(keyword)
    https.get(`https://api.jucili.com/api.php?s=cilimm&q=${keyword}&p=${page}`, function (result) {
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

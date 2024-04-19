const router = require('./route.config');
const { xiaoshuoSql } = require('../mysql/index.js')

/* GET users listing. */
router.get('/login', function (req, res, next) {
  var obj = {
    status: 200,
    data: {
      name: 'jinxiao',
      age: 19
    }
  }
  res.send(obj);
});

/**
 * 注册用户
 */
router.post('/register', (req, res) => {
  // console.log(req, res)
  // status等于1默认有效账户
  const params = { 
    user_name: req.query.name,
    user_password: req.query.password,
   }

  const sqlstr = 'insert into users set ?'
  xiaoshuoSql(sqlstr, params)
    .then(data => {
      // console.log(data)
      if (data.status == 210) {
        res.send({ status: data.status, message: '注册失败' })
      } else {
        res.send({ status: 200, message: '注册成功' })
      }
    })
  // res.end('完成')
})

/**
 * 用户列表
 */
router.get('/userlist', (req, res) => {
  const sqlstr = 'select * from users'
  xiaoshuoSql(sqlstr).then((data) => {
    // console.log(data)
    data.forEach(item => {
      
    })
    res.send(data.map(item => {
      return {
        name: item.user_name,
        password: item.user_password,
        id: item.user_id
      }
    }))
  })
})

module.exports = router;

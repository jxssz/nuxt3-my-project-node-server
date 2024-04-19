var router = require('./route.config');
const multer = require('multer');

/* GET home page. */
router.get('/uploadimg', function(req, res, next) {
    
    res.send({ message: '已发送' })
});

module.exports = router;

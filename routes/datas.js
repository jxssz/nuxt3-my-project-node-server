const router = require('./route.config');
const sql = require('../mysql/index.js')
// var https = require('https')
var http = require('http')
const axios = require('axios')
const ws = require('ws')

router.get('/aaa', function (req, res, next) {
    const WebSocketServer = require('ws').Server
    const wss = new WebSocketServer({ port: 8181 });//服务端口8181
    wss.on('connection', function (ws) {
        //   console.log('服务端：客户端已连接');
        res.send('kehuduanlianjie')
        ws.on('message', function (message) {
            //打印客户端监听的消息
            console.log(JSON.parse(message));
            ws.send(message)
        });
    });
});

module.exports = router;
let http = require('http');
let config = require('../config/config');

let options = {
    path:'/',
    port: config.closePort
}

let req = http.request(options,function(res){
    console.log('成功关闭服务器');
});
req.end();
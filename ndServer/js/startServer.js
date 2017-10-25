let express = require('express');
let config = require('../config/config');
let https = require('https');
let fs = require('fs');
let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();


let server = express();

server.use(bodyParser.json());

//前端资源
server.use('/', express.static(config.staticResourcePath));


//跨域处理
function cors(res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
}

//后端资源 加载
if (config.controllersPath) {
    let ctrlConfig = require(config.controllersPath);
    let controllersRoot = ctrlConfig.root;
    let controllers = ctrlConfig.controllers;
    let rootPath = "/";
    if (controllersRoot) {
        rootPath += controllersRoot + "/";
    }
    if (controllers) {
        for (let ctrl in controllers) {
            if (ctrl.indexOf("upload") > -1) {
                server.use(rootPath + ctrl, upload.any(), function (req, res) {
                    // cors(res);
                    controllers[ctrl](req, res);
                });
            } else {
                server.use(rootPath + ctrl, function (req, res) {
                    // cors(res);
                    controllers[ctrl](req, res);
                });
            }


        }
    }

    server.all('/*',function(req,res){
        controllers["page"](req,res);
    })
}





//http
server.listen(config.port, '127.0.0.1', function () {
    console.log("服务启动中");
});

//https---------
if (config.httpsPath) {
    //获取密钥
    let key = fs.readFileSync(config.httpsPath + "/private.key");
    //获取证书
    let cert = fs.readFileSync(config.httpsPath + "/cert.crt");

    https.createServer({ key: key, cert: cert }, server).listen(config.httpsPort);
}




//关闭进程
let stopServer = express();
stopServer.listen(config.closePort, 'localhost', function () {
});
stopServer.use('/', function (req, res) {
    res.send('关闭服务器');
    console.log('服务器关闭');
    setTimeout(() => process.exit(), 0);
})
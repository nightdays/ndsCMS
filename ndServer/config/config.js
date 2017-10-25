const port = 8081;

const staticResourcePath = `../../front`;

const controllersPath = `../../back`;

const httpsPath = ``;

//https 端口号 默认为443
const httpsPort = 443;

//服务器关闭端口号 13001
const closePort = 13001; 

module.exports = {
    port:port,
    staticResourcePath : staticResourcePath.trim(),
    controllersPath : controllersPath.trim() + "/Controller.js",
    httpsPath : httpsPath.trim(),
    httpsPort : httpsPort,
    closePort : closePort
}


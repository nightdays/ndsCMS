let mysql = require('mysql');
let initSql = require('./initSql.js');
let fs = require('fs');
let pathUtil = require('path');
let itemPath = pathUtil.resolve(__dirname, '..');
let backPath = pathUtil.join(itemPath, 'back');
let frontPath = pathUtil.join(itemPath, 'front');
let ejs = require('ejs');
var str = ejs.render("html<%=name %>", { name: '123' });


let dboptionWithDB = {
    host: 'localhost',
    user: 'root',
    password: 'Nuoyadb_1',
    database: 'ndsCMS'
}

let dboption = {
    host: 'localhost',
    user: 'root',
    password: ''
}

function query(sql, dbOption) {
    return new Promise(function (resovle, reject) {
        let dbconnect = null;
        if (dbOption) {
            dbconnect = mysql.createConnection(dbOption);
        } else {
            dbconnect = mysql.createConnection(dboptionWithDB);
        }
        dbconnect.connect();
        dbconnect.query(sql, function (error, results) {
            dbconnect.end();
            if (!error) {
                resovle(results);
            } else {
                reject(error);
            }
        });
    });
}

function checkExist(table, key, keyValue) {
    return query(`select count(1) as n from ${table} where ${key} = "${keyValue}"`);
}

function arrayToObject(array,key,value){
    let obj = {};
    for(let item of array){
        obj[item[key]] = item[value];
    }
    return obj;
}

let createDB = async function (callback) {
    let result = await query("show databases", dboption);
    let flag = false;
    for (let db of result) {
        if (db.Database == 'ndscms') {
            flag = true;
            break;
        }
    }
    if (flag) {
        await query("drop database ndsCMS", dboption);
        flag = await query("create database ndsCMS", dboption);
    }
    else {
        flag = await query("create database ndsCMS", dboption);
    }

    if (flag) {
        for (let sql of initSql.initTable) {
            await query(sql);
        }
        for (let sql of initSql.initData) {
            await query(sql);
        }
    }

    callback();
}


let controllers = {

    addTemplate: async function (req, res) {
        let name = req.body.name;
        let code = req.body.code;
        let path = req.body.path;
        let result = await checkExist('t_template', 'code', code);
        if (result[0].n > 0) {
            res.send({ res: "该模板码已经存在" });
        } else {
            await query(`insert into t_template values ("${name}","${code}","")`);
            // fs.mkdirSync(pathUtil.join(frontPath, path));
            res.send({ res: "success" });
        }
    },

    addPage: async function (req, res) {
        let name = req.body.name;
        let code = req.body.code;
        let template_code =req.body.template_code;
        let result = await checkExist('t_page', 'code', code);
        if (result[0].n > 0) {
            res.send({ res: "该页面已经存在" });
        } else {
            await query(`insert into t_page values ("${name}","${code}","${template_code}")`);
            // fs.mkdirSync(pathUtil.join(frontPath, path));
            res.send({ res: "success" });
        }
    },

    saveTemplate: async function (req, res) {
        let code = req.body.code;
        let value = req.body.value;
        let path =req.body.path;
        await query(`update t_template set value = "${value}" where code = "${code}"`);
        // fs.writeFileSync(pathUtil.join(frontPath, path, 'index.html'), value, { 'flag': 'w' });
        res.send({ res: "success" });
    },

    deleteTemplate: async function (req, res) {
        let code = req.body.code;
        await query(`delete from t_template where code = "${code}"`);
        res.send({ res: "success" });
    },

    getTemplate: async function (req, res) {
        let code = req.body.code;
        let result = await query(`select * from t_template  where code = "${code}"`);
        res.send({ data: result[0] });
    },

    getPage: async function (req, res) {
        let code = req.body.code;
        let result = await query(`select * from t_page  where code = "${code}"`);
        res.send({ data: result[0] });
    },

    getTemplateList: async function (req, res) {
        let code = req.body.code;
        let result = await query(`select * from t_template`);
        res.send({ data: result });
    },

    
    getPageList: async function (req, res) {
        let code = req.body.code;
        let result = await query(`select * from t_page`);
        res.send({ data: result });
    },

    initDB: function (req, res) {
        createDB(() => {
            res.send("创建成功");
        });
    },

    page: async function(req,res){
        let code = pathUtil.basename(req.path);
        if(!code){
            code = "index";
        }
        let result = await query(`select t.value from t_page p join t_template t on p.template_code = t.code  where p.code = "${code}"`);
        if(result==0){
            res.send("404");
            return;
        }
        let orginHtml = result[0].value;
        let temps = await query(`select * from t_template`);
        let temp = arrayToObject(temps,'code','value');
        let html  = ejs.render(orginHtml, {temp:temp});
        res.send(html);
    }
}






module.exports = {
    root: "",
    controllers: controllers
}
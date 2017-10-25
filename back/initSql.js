let initTable = [
    `
        create table t_config (
            name varchar(20),
            code varchar(20),
            value varchar(20)
        )
    `,
    `
        create table t_template (
            name varchar(20),
            code varchar(20),
            value text
        )
    `,
    `
        create table t_page (
            name varchar(20),
            code varchar(20),
            template_code varchar(20)
        )
    `
]

let initData = [
    `insert into t_template values ('首页','index','')`,
    `insert into t_page values ('首页','index','index')`
]


module.exports = {
    initTable: initTable,
    initData: initData
}
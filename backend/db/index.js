
// 导入 mysql 模块
const mysql = require('mysql2')

require('dotenv').config()
// 创建数据库连接对象
const db = mysql.createPool({
    host: process.env.DB_HOST, // 连接ububtu服务器上的mysql
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

// 向外共享 db 数据库连接对象
module.exports = db

// 导入 mysql 模块
const mysql = require('mysql2')

// 创建数据库连接对象
const db = mysql.createPool({
    host: '192.168.64.9', // 连接ububtu服务器上的mysql
    user: 'user1',
    password: 'Mima123$',
    database: 'my_db_01'
})

// 向外共享 db 数据库连接对象
module.exports = db
 

/* 这段代码运行有故障
// 通过 SSH 隧道来连接 远程ubuntu的mysql

const { Client } = require('ssh2');
const mysql = require('mysql');

// SSH连接配置
const sshConfig = {
    host: '192.168.64.9', // SSH服务器的IP地址
    port: 22,               // SSH端口，通常为22
    username: 'lexie', // SSH用户名
    password: '555789123', // SSH密码
};

// 创建SSH客户端
const sshClient = new Client();

let db

sshClient.on('ready', () => {
    console.log('SSH连接成功');

    // 设置SSH隧道
    sshClient.forwardOut(
        '127.0.0.1', // 本地地址
        3306,        // 本地端口
        'localhost', // 目标数据库服务器的IP地址
        3306,        // 数据库端口
        (err, stream) => {
            if (err) {
                console.error('SSH隧道创建失败:', err);
                return;
            }

            // 创建数据库连接对象
            const db = mysql.createConnection({
                host: '127.0.0.1', // 本地地址
                port: 3306,        // 使用转发的端口
                user: 'user1',     // MySQL用户名
                password: 'Mima123$', // MySQL密码
                database: 'my_db_01', // 要连接的数据库
                stream,            // 使用SSH隧道
            });

            db.connect((err) => {
                if (err) {
                    console.error('数据库连接失败:', err);
                    return;
                }
                console.log('数据库连接成功');
            });
        }
    );
}).connect(sshConfig);

module.exports = db
*/

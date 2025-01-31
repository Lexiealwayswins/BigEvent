/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
//导入数据库操作模块
const db = require('../db/index')
// 导入加密密码模块
const bcrypt = require('bcryptjs')
// 导入 Token 的包
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')

// 注册新用户的处理函数
exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body
    // console.log(userinfo)
    // 判断数据是否合法，这个在expressJoi中间件已经验证过了，所以这里注释掉
    // if (!userinfo.username || !userinfo.password){
    //     return res.send({status: 1, message: '用户名或密码不能为空！'})
    // }

    // 定义 SQL 语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message})
            return res.cc(err)
        }
        // 判断用户名是否被占用
        if (results.length > 0) {
            // console.log(results)
            // return res.send({status: 1, message: '用户名被占用，请更换其他用户名！'})
            return res.cc('用户名被占用，请更换其他用户名！')
        }

        // 调用 bcrypt.hashSync() 对密码进行加密
        // console.log(userinfo)
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // console.log(userinfo)

        // 插入用户的 SQL 语句
        const sql = 'insert into ev_users set ?'
        db.query(sql, {username: userinfo.username, password: userinfo.password}, (err, results) => {
            // 执行 SQL 语句失败
            if (err) {
                // return res.send({ status: 1, message: err.message})
                return res.cc(err)
            }
            // SQL 语句执行成功，但影响行数不为 1
            if (results.affectedRows !== 1) {
                // console.log(results)
                // return res.send({status: 1, message: '注册用户失败，请稍后再试  ！'})
                return res.cc('注册用户失败，请稍后再试  ！')
            }

            // 注册用户成功
            // res.send({ status: 0, message: '注册成功！'})
            res.cc('注册成功！', 0)
        })
        
    })
    
}

// 登录的处理函数
exports.login = (req, res) => {
    // 接受表单的数据
    const userinfo = req.body
    // 定义 SQL 语句
    const sql = 'select * from ev_users where username=?'
    // 执行 SQL 语句, 根据用户名查询用户的信息
    db.query(sql, userinfo.username, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功， 但是获取到的数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败！ ')
        // TODO： 判断密码是否正确
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if(!compareResult) return res.cc('登录失败！')

        // 在服务器端生成 Token 的字符串
        const user = { ...results[0], password: '', user_pic: '' }
        // console.log(user)
        // 对用户的信息进行加密，生成Token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        // console.log(tokenStr)
        // 调用 res.send()将Token响应给客户端
        res.send({
            status: 0,
            message: '登录成功！',
            token: 'Bearer ' + tokenStr,
        })
    })
}


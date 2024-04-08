const http = require('http')
const NeDB = require('nedb')
const querystring = require('querystring')
var db = new NeDB({
    filename: './user.db',
    autoload: true,
})
http.createServer((req, res) => {
    let postData = ''
    res.writeHead(200, {
        'Content-Type': 'text/html;charset=utf8'
    })
    req.on('data', (chunk) => {
        postData += chunk
    })
    let url = req.url
    if (url == '/register') {
        req.on('end', () => {
            let postObj = querystring.parse(postData)
            db.findOne({
                uname: postObj.uname
            }, (err, docs) => {
                if (docs) {
                    res.end('Id已存在')
                } else {
                    db.insert({
                        uname: postObj.uname,
                        passwd: postObj.passwd
                    })
                    res.end('注册成功')
                }
            })
        })
    } else if (url == '/login') {
        req.on('end', () => {
            let postObj = querystring.parse(postData)
            db.findOne({
                uname: postObj.uname,
                passwd: postObj.passwd
            }, (err, doc) => {
                if (err) throw err
                if (doc) {
                    res.write(doc.uname)
                    res.end('登录成功')
                } else {
                    res.end('登录失败')
                }
            })
        })
    }
}).listen(8080, () => { console.log('8080...') })
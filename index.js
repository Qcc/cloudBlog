var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var cfg = require('./config/default');
var pkg = require('./package');
var MongoStore = require('connect-mongo')(session);
var router = require('./router/route');
// 连接数据库
require('./db/mongo');

var app = express();

// 设置模板目录
app.set('views',__dirname + '/views');
// 设置模板引擎为 ejs
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public', {
  redirect: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
// session 中间件
app.use(session({
  name: cfg.session.key,// 设置 cookie 中保存 session id 的字段名称
  secret: cfg.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: cfg.session.resave,// 强制更新 session
  saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
  cookie: cfg.session.maxAge,// 过期时间，过期后 cookie 中的 session id 自动删除
  store: new MongoStore({// 将 session 存储到 mongodb
    url: cfg.mongodb// mongodb 地址
  })
}));

// 设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
};
router(app);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
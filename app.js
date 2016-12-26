var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 登录所需要的session
var session = require('express-session');

// cors跨域资源共享
// var cors = require('cors'); // 已卸载

// 指定该网站的的默认url
var index = require('./routes/index');
// 指定app.use('/taoquanzhong', taoquanzhong)下的入口js
var taoquanzhong = require('./routes/taoquanzhong/index');
// user
var user = require('./routes/user/index');

var app = express();

// 登录模块
app.use(session({ 
    secret: 'secret',
    cookie:{ 
        maxAge: 1000*60*30
    }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//模板后缀由.ejs替换成.html
app.engine('html', require('ejs').renderFile); // or app.engine("html",require("ejs").__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 跨域资源共享
// app.use(cors()); // 已卸载

app.use(function (req, res, next){ 
    // console.log(req.session.user);
    res.locals.user = req.session.user;   // 从session 获取 user对象
    res.locals.localhost = req.headers['host'];   // 获取当前访问页面的host（域名）
    var err = req.session.error;   //获取错误信息
    delete req.session.error;
    res.locals.message = "";   // 展示的信息 message
    if(err){ 
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
    }
    next();  //中间件传递
});

// 检查用户是否登录中间件，所有需要登录权限的页面都使用此中间件
function checkLogin (req, res, next) {
  if (req.session.user) {
    next();//检验到用户已登入，转移权限阁下一个路由
  } else {
    res.redirect('/user/login.html');//否则，页面重定位，不执行下面路由
  }
} 

app.use('/', index);
// 由debugeditor定义的index.js寻址，这里默认指定views下面的/debugeditor所有路径
app.use('/taoquanzhong', taoquanzhong);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// 引用http-proxy
var httpProxy = require('http-proxy');
httpProxy.createProxyServer({target: 'http://localhost:7000'}).listen(80);

module.exports = app;

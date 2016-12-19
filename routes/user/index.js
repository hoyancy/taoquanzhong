var express = require('express');
// 登录所需要的session
var session = require('express-session');
var router = express.Router();

var userDao = require('../../dao/userDao');

/* GET register page. */
router.get('/register.html', function(req, res, next) {
    res.render('user/register.html');
});

/* GET login page. */
router.get('/login.html', function(req, res, next) {
	req.session.referer = req.headers['referer'];
    res.render('user/login.html');
});

// 注册时增加用户
//TODO 同时支持get,post
router.get('/addUser.json', function(req, res, next) {
	console.log('22222222222222222222222222222222222222222222');
	userDao.add(req, res, next);
	// res.json('33333333333');
});
 
router.get('/login.json', function(req, res, next) {
	userDao.queryByAccount(req, res, next);
	// res.json('33333333333');
});

/* GET logout page. */
router.get("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
	console.log(req.session.user);
	req.session.user = null;
	console.log(req.session.user);
	req.session.error = null;
	// if (req.session.originalUrl) {  // 如果存在原始请求路径，将用户重定向到原始请求路径
	// 	var redirectUrl = req.session.originalUrl;
	// 	console.log(redirectUrl);
	// 	req.session.originalUrl = null;  // 清空 session 中存储的原始请求路径
	// } else {  // 不存在原始请求路径，将用户重定向到根路径
	res.redirect(req.headers['referer']);
	// }
	console.log('lgoout!');
});

// router.get('/queryAll', function(req, res, next) {
// 	userDao.queryAll(req, res, next);
// });
 
// router.get('/query', function(req, res, next) {
// 	userDao.queryByAccount(req, res, next);
// });
 
// router.get('/deleteUser', function(req, res, next) {
// 	userDao.delete(req, res, next);
// });
 
// router.post('/updateUser', function(req, res, next) {
// 	userDao.update(req, res, next);
// });

module.exports = router;

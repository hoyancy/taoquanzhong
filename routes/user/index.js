var express = require('express');
// 登录所需要的session
var session = require('express-session');
var router = express.Router();

var userDao = require('../../dao/userDao');

/* GET register page. */
router.get('/register.html', function(req, res, next) {
    res.render('user/register.html', { referrer: req.query.referrer});
});

/* GET login page. */
router.get('/login.html', function(req, res, next) {
	req.session.referer = req.headers['referer'];
    res.render('user/login.html');
});

// 注册，增加用户
//TODO 同时支持get,post
router.get('/addUser.json', function(req, res, next) {
	// 调用dao中userDao.js中的add方法
	userDao.add(req, res, next);
});

// 登录，查询用户
router.get('/login.json', function(req, res, next) {
	userDao.queryByAccount(req, res, next);
});

/* GET logout page. */
router.get("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
	req.session.user = null;
	req.session.error = null;
	// 返回到刚刚登出的页面
	res.redirect(req.headers['referer']);
});

/* GET recommendNumOfPeople. */
router.get("/recommend_num.json",function(req,res){    // ajax获取推荐人数
	userDao.recommendNumOfPeople(req, res, next);
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

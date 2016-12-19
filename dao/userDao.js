// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./userSqlMapping');
 
// 使用连接池，提升性能
var pool  = mysql.createPool($util.extend({}, $conf.mysql));
 
// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code:'1',
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
};
 
module.exports = {
	add: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			// 获取前台页面传过来的参数
			var param = req.query || req.params;
 
			// 建立连接，向表中插入值
			// 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
			connection.query($sql.insert, [param.account, param.password], function(err, result) {
				if(result) {
					result = {
						code: 200,
						msg:'增加成功'
					};    
				}
 
				// 以json形式，把操作结果返回给前台页面
				jsonWrite(res, result);
 
				// 释放连接 
				connection.release();
			});
		});
	},
	queryByAccount: function (req, res, next) {
		// var id = +req.query.id; // 为了拼凑正确的sql语句，这里要转下整数
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryByAccount, req.query.account, function(err, result) {
				// if(req.query.password == )
				// RowDataPacket 转为obj数组对象，无语该数组请取0来获取对象
				var userinfo = JSON.parse(JSON.stringify(result));
				var redirectUrl = '';
				if(err){ 										//错误就返回给原post处（login.html) 状态码为500的错误
					// res.send(500);
					console.log(err);
				}else if(!result){ 								//查询不到用户名匹配信息，则用户名不存在
					req.session.error = '用户名不存在';
					// res.send(404);							//	状态码返回404
				//	res.redirect("/login");
				}else{ 
					if(userinfo[0].password != req.query.password){ 	//查询到匹配用户名的信息，但相应的password属性不匹配
						req.session.error = "密码错误";
						// res.send(404);
					//	res.redirect("/login");
					}else{ 									//信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
						req.session.user = userinfo;
						if (req.session.originalUrl) {  // 如果存在原始请求路径，将用户重定向到原始请求路径
							var redirectUrl = req.session.originalUrl;
							console.log(redirectUrl);
							req.session.originalUrl = null;  // 清空 session 中存储的原始请求路径
						} else {  // 不存在原始请求路径，将用户重定向到根路径
							var redirectUrl = '/';
						}
						// res.send(200);
						// res.redirect("/taoquanzhong/index.html");
										console.log(777777777);
					}
				}
				// if(info[0].password == req.query.password){
				// 	// 将用户信息写入session
				// 	req.session.user = info;
				// 	if (req.session.originalUrl) {  // 如果存在原始请求路径，将用户重定向到原始请求路径
				// 		var redirectUrl = req.session.originalUrl;
				// 		console.log(redirectUrl);
				// 		req.session.originalUrl = null;  // 清空 session 中存储的原始请求路径
				// 	} else {  // 不存在原始请求路径，将用户重定向到根路径
				// 		var redirectUrl = '/';
				// 	}
				// }
				console.log(req.session);
				jsonWrite(res, req.session.referer);
				connection.release();
			});
		});
	}
	// delete: function (req, res, next) {
	// 	// delete by Id
	// 	pool.getConnection(function(err, connection) {
	// 		var id = +req.query.id;
	// 		connection.query($sql.delete, id, function(err, result) {
	// 			if(result.affectedRows > 0) {
	// 				result = {
	// 					code: 200,
	// 					msg:'删除成功'
	// 				};
	// 			} else {
	// 				result = void 0;
	// 			}
	// 			jsonWrite(res, result);
	// 			connection.release();
	// 		});
	// 	});
	// },
	// update: function (req, res, next) {
	// 	// update by id
	// 	// 为了简单，要求同时传name和age两个参数
	// 	var param = req.body;
	// 	if(param.name == null || param.age == null || param.id == null) {
	// 		jsonWrite(res, undefined);
	// 		return;
	// 	}
 
	// 	pool.getConnection(function(err, connection) {
	// 		connection.query($sql.update, [param.name, param.age, +param.id], function(err, result) {
	// 			// 使用页面进行跳转提示
	// 			if(result.affectedRows > 0) {
	// 				res.render('suc', {
	// 					result: result
	// 				}); // 第二个参数可以直接在jade中使用
	// 			} else {
	// 				res.render('fail',  {
	// 					result: result
	// 				});
	// 			}
 
	// 			connection.release();
	// 		});
	// 	});
 
	// },
	// queryById: function (req, res, next) {
	// 	var id = +req.query.id; // 为了拼凑正确的sql语句，这里要转下整数
	// 	pool.getConnection(function(err, connection) {
	// 		connection.query($sql.queryById, id, function(err, result) {
	// 			jsonWrite(res, result);
	// 			connection.release();
 
	// 		});
	// 	});
	// },
	// queryAll: function (req, res, next) {
	// 	pool.getConnection(function(err, connection) {
	// 		connection.query($sql.queryAll, function(err, result) {
	// 			jsonWrite(res, result);
	// 			connection.release();
	// 		});
	// 	});
	// }
 
};
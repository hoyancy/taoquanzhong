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

			// 查询是否已经注册
			connection.query($sql.queryByAccount, req.query.account, function(err, res_register) {
				var res_rows = {};
				if(res_register.length != 0) {
					res_rows = {
						code: 10001,
						msg:'用户已存在'
					};

					// 以json形式，把操作结果返回给前台页面
					jsonWrite(res, res_rows);
	
					// 释放连接 
					connection.release(); 
				}else{
					// 建立连接，向表中插入值
					// 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
					connection.query($sql.insert, [param.account, param.password, param.referrer], function(err, res_add) {
						if(res_add) {
							res_rows = {
								code: 200,
								msg:'注册成功'
							};    
						}

						// 以json形式，把操作结果返回给前台页面
						jsonWrite(res, res_rows);
		
						// 释放连接 
						connection.release(); 
					});
				}
			});
		});
	},
	queryByAccount: function (req, res, next) {
		// var id = +req.query.id; // ID需要强制转为整数
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryByAccount, req.query.account, function(err, res_login) {
				// if(req.query.password == )
				// RowDataPacket 转为obj数组对象，无语该数组请取0来获取对象
				var res_rows = {};
				var userinfo = JSON.parse(JSON.stringify(res_login));
				var redirectUrl = '';
				if(err){ 										//错误就返回给原post处（login.html) 状态码为500的错误
					res_rows = {
						code: 500,
						msg:'connection error'
					};

					// 以json形式，把操作结果返回给前台页面
					jsonWrite(res, res_rows);
	
					// 释放连接 
					connection.release(); 
				}else if(res_login.length == 0){ 								//查询不到用户名匹配信息，则用户名不存在
					res_rows = {
						code: 10002,
						msg:'用户不存在'
					};

					// 以json形式，把操作结果返回给前台页面
					jsonWrite(res, res_rows);
	
					// 释放连接 
					connection.release(); 
				}else{ 
					if(userinfo[0].password != req.query.password){ 	//查询到匹配用户名的信息，但相应的password属性不匹配
						res_rows = {
							code: 10004,
							msg:'密码错误'
						};

						// 以json形式，把操作结果返回给前台页面
						jsonWrite(res, res_rows);

						// 释放连接 
						connection.release(); 
					}else{
						// 信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
						req.session.user = userinfo;
						res_rows = {
							code: 200,
							msg:'登录成功',
							referer:req.session.referer
						};

						// 以json形式，把操作结果返回给前台页面
						jsonWrite(res, res_rows);
		
						// 释放连接 
						connection.release(); 
					}
				}
			});
		});
	},
	recommendNumOfPeople: function (req, res, next) {
		// that.recommend_num2 = 1000;
		// var promise = new Promise(function(resolve, reject) {
		// 	var recommend_num = 44;
		// 	pool.getConnection(function(err, connection) {
		// 			// 查询推荐人数
		// 			connection.query($sql.recommendNumOfPeople, user_id, function(err, result) {

		// 				var recommend_info = JSON.parse(JSON.stringify(result));
		// 				recommend_num = recommend_info[0].recommendNum;
		// 				console.log(recommend_num);
		// 					if (result){
		// 						resolve(recommend_num);
		// 					} else {
		// 						reject(error);
		// 					}
		// 				console.log('到了查询推荐人数嘛1111');
		// 			});
		// 		})
		// });
		// promise.then(function(val) {
		// 	console.log(val)
		// 	console.log('到了promise吗');
		// 	connection.release();
		// that.recommend_num2 = val;
		// }, function(error) {
		// 	console.log('promise error');
		// });
		// console.log(that.recommend_num2);
		// 		return that.recommend_num2;
		pool.getConnection(function(err, connection) {
					    console.log('有道这里dddddd吗');
						console.log(req.query.account);
			// 查询推荐人数
			connection.query($sql.recommendNumOfPeople, req.query.account, function(err, result) {

console.log(result);
				var res_rows = {};
				var recommend_info = JSON.parse(JSON.stringify(result));
				// 将推荐人数存放在session中
				var recommend_num = recommend_info[0].recommendNum;

				if(result) {
					res_rows = {
						code: 200,
						msg:'ok',
						recommend_num: recommend_num
					};    
				}

				// 以json形式，把操作结果返回给前台页面
				jsonWrite(res, res_rows);

				// 释放连接 
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
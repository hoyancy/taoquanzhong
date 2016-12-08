var express = require('express');
var request = require('request');
var rp = require('request-promise'); // request第三方接口时，使用promise
var querystring = require('querystring'); // 序列化req.query
var router = express.Router();

/* GET home page. */
router.get('/index.html', function(req, res, next) {
    res.render('taoquanzhong/index.html', { type: 'index' });
});

// 淘需求
router.get('/need.html', function(req, res, next) {
    res.render('taoquanzhong/need.html', {type: 'need'});
});

// 淘喜欢
router.get('/like.html', function(req, res, next) {
    res.render('taoquanzhong/like.html', {type: 'like'});
});

// 淘标签
router.get('/tag.html', function(req, res, next) {
    res.render('taoquanzhong/tag.html', {type: 'tag'});
});


// 查权重
router.get('/taoka_weight.json', function (req, res, next) {

    // promise调用第三方接口查数据
    var taoka_data = {};
    var url = querystring.unescape(querystring.stringify(req.query)); // 将req.query序列化后并解码

    rp(url)
    .then(function (htmlString) {
        taoka_data = JSON.parse(htmlString); // JSON.parse将字符串序列化为object，JSON.stringify(obj)将对象转为js字符串
        res.json(taoka_data);
    })
    .catch(function (err) {
        console.log('error-yancy')
    });


    // request('http://www.taoka123.com/api/taoka_weight?account=929392796lzy&api_key=30f387b84ebaadf8efe518e00f1583a6bak', function (error, response, body) {
    //     // console.log(response.body);
    //     // taoka_data = response.body;
    //     taoka_data = {"status":0,"result":[{"name":"222代办服务","score":20,"price":100},{"name":"羽绒服","score":13,"price":206},{"name":"靴子","score":13,"price":102},{"name":"居家鞋","score":13,"price":19},{"name":"智能健康","score":13,"price":99},{"name":"锡纸\/油纸","score":13,"price":18},{"name":"毛呢外套","score":6,"price":1180},{"name":"家居拖鞋\/凉拖\/棉拖\/居家鞋","score":6,"price":24}],"integral":1967}
    //     console.log(taoka_data);
    // });

    // 模拟weight数据
    // taoka_data = {"status":0,"result":[{"name":"222代办服务","score":20,"price":100},{"name":"羽绒服","score":13,"price":206},{"name":"靴子","score":13,"price":102},{"name":"居家鞋","score":13,"price":19},{"name":"智能健康","score":13,"price":99},{"name":"锡纸\/油纸","score":13,"price":18},{"name":"毛呢外套","score":6,"price":1180},{"name":"家居拖鞋\/凉拖\/棉拖\/居家鞋","score":6,"price":24}],"integral":1967}
    // console.log(taoka_data);

    // 模拟need数据
    // taoka_data = {
    //     "status": 0,
    //     "result": [
    //         {
    //             "id": 529560326150, // 宝贝ID
    //             "pic": "//img.alicdn.com/bao/uploaded/i4/443276638/TB2YNSesXXXXXaFXpXXXXXXXXXX_!!443276638.jpg", // 宝贝图片链接
    //             "title": "东北地摊火盆炉韩式烧烤炉户外木炭烤肉炉商用上排烟炭炉韩国碳炉", // 宝贝标题
    //             "price": 106, // 宝贝价格
    //             "info": "根据你浏览的\"烧烤炉/烤架\"推荐" // 宝贝信息
    //         },
    //         {
    //             "id": 524309600034,
    //             "pic": "//img.alicdn.com/bao/uploaded/i3/TB1.P.1NVXXXXbTXFXXXXXXXXXX_!!0-item_pic.jpg",
    //             "title": "哈斯勒姆电烧烤炉 韩式家用电烤炉 无烟烤肉机电烤盘铁板烧烤肉锅",
    //             "price": 49.9,
    //             "info": "根据你浏览的\"烧烤炉\"推荐"
    //         }
    //     ],
    //     "integral": 1081 //剩余次数
    // }

    // 模拟like数据
    // taoka_data = {
    //     "status": 0,
    //     "result": [
    //         {
    //             "id": 540073207426, // 宝贝ID
    //             "pic": "//img.alicdn.com/bao/uploaded/i1/TB1TDIBOXXXXXbWXVXXXXXXXXXX_!!0-item_pic.jpg", // 宝贝图片链接
    //             "sale": 21, // 宝贝销量
    //             "price": 599, // 宝贝价格
    //             "title": "Edifier/漫步者 W855BT蓝牙4.1语音通话无线有线双用头戴式耳机" //宝贝标题
    //         },
    //         {
    //             "id": 521908067272,
    //             "pic": "//img.alicdn.com/bao/uploaded/i4/TB1P8PTGFXXXXbVXXXXXXXXXXXX_!!0-item_pic.jpg",
    //             "sale": 1,
    //             "price": 65,
    //             "title": "烧烤炉子户外烤肉碳烤架工具手提便携式家用木炭野外烤箱套装"
    //         }
    //     ]
    // }

    // 模拟tag数据
    // taoka_data = {
    //     "status": 0,
    //     "result": [
    //         "烘培爱好者",
    //         "萌宠大作战"
    //     ],
    //     "avatar": "https://wwc.alicdn.com/avatar/getAvatar.do?userNick=a1169858647_3&width=80&height=80&type=sns&_input_charset=UTF-8", // 头像
    //     "integral": 1080 //剩余次数
    // }

    // 模拟返回数据
    // res.json(taoka_data); // 直接返回json格式数据
});

// app.get('/products/:id', function(req, res, next){
//   res.json({msg: 'This is CORS-enabled for all origins!'});
// });
module.exports = router;
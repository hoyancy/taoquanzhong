/**
 * Created by Yancy on 16-12-2.
 */
seajs.use(["/config/debugeditor/modules/template/3.1.0/template"], function(template){
    var main = {
        init: function() {
            this.bind();
        },
        bind: function() {
            $('#form_search').submit(function(){
                main.query();
                return false;
            });

            // 打开QQ聊天
            $('.qq_chat').click(function(){
                var qq_src = 'http://wpa.qq.com/msgrd?v=3&uin=517221264&site=qq&menu=yes';
                $('.qq_iframe').attr('src', qq_src);
            });

            // 买号绑定
            $('#bind_account').click(function(){
                $('#img_bind_account').attr('class', 'hide');
                $('#div_bind_account').removeClass('hide');
                main.getBindQrcode();
            });

            // 关闭定时发送的check_bind请求
            $('.js-close-check').click(function(){
                clearTimeout(main.timer);
            });
        },
        query: function(page){
            //获取params
            var params = $('#form_search').serializeObject();
            var action_type = $('#action_type').val();
            console.log(action_type);
            params['url'] = {};
            var data = {};
            data['params'] = params;
            data['url'] = {};
            switch(action_type){
                case 'weight':
                    data['url'] = 'http://www.taoka123.com/api/taoka_weight';
                    break;
                case 'need':
                    data['url'] = 'http://www.taoka123.com/api/taoka_need';
                    break;
                case 'like':
                    data['url'] = 'http://www.taoka123.com/api/like';
                    break;
                case 'tag':
                    data['url'] = 'http://www.taoka123.com/api/tags';
                    break;
            }

            $.ajax({
                type: 'get',
                contentType: 'application/json',
                url: '/taoquanzhong/taoka_weight.json',
                dataType: 'json',
                data: data,
                success: function (data) {
                    if(data.status === 0){
                        var html = template("tpl_list", {list: data.result});
                        $("#table_list").html(html);
                    }else{
                        alert('该请求有正确响应，但是请求不到数据');
                        console.log(data);
                    }
                },
                error: function () {
                    alert('taoka_weight请求数据未有正确响应');
                }
            });
        },
        getBindQrcode: function(){
            var params = {};
            params['url'] = 'http://www.taoka123.com/index/get_bind_qrcode.html';

            $.ajax({
                type: 'get',
                contentType: 'application/json',
                url: '/taoquanzhong/get_bind_qrcode.json',
                dataType: 'json',
                data: params,
                success: function (res) {
                    if(res.status === 0){
                        $('#div_bind_account').attr('class', 'hide');
                        $('#img_bind_account').removeClass('hide');
                        $('#img_bind_account').attr('src', res.url);
                        function send(){
                            main.timer = setTimeout(function(){
                                main.checkBind(res.lgToken);
                                send();
                            }, 1500);
                        }
                        send();
                    }else{
                        alert('getBindQrcode error');
                    }
                },
                error: function () {
                    alert('get_bind_qrcode请求有误');
                }
            });
        },
        checkBind: function(params){
            var data = {};
            data['url'] = 'http://www.taoka123.com/index/check_bind.html?lgToken=' + params + '&platform=tqz';

            $.ajax({
                type: 'get',
                contentType: 'application/json',
                url: '/taoquanzhong/check_bind.json',
                dataType: 'json',
                data: data,
                success: function (res) {
                    if(res.status === 0){
                        $('#p_bind_tips').html('绑定成功！');
                        clearTimeout(main.timer);
                    }else{
                        console.log('check_bind请求中，得不到正确返回就一直请求，直到关闭为止');
                    }
                },
                error: function () {
                    clearTimeout(main.timer);
                    console.log('check_bind请求有误');
                }
            });
        }
    };

    main.init();
});

// 序列化表单
jQuery.prototype.serializeObject = function(){  
    var a, o, h, i, e;  
    a = this.serializeArray();  
    o = {};  
    h = o.hasOwnProperty;  
    for(i = 0; i<a.length; i++){  
        e = a[i];  
        if(!h.call(o,e.name)){  
            o[e.name]=e.value;  
        }  
    }  
    return o;  
};  
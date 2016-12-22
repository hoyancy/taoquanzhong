seajs.use(["/config/debugeditor/modules/md5/1.0.0/md5"], function(Md5){
    var main = {
        init: function() {
            this.bind();
        },
        bind: function() {
            $('#form_query').submit(function(){
                var password = $('#password').val(),
                    password_again = $.trim($('#password_again').val());

                if(password != password_again){
                    alert('两次输入的密码不一致，请重新设置');
                }else{
                    main.query();
                }

                return false;
            });
        },
        query: function(page){
            //获取params
            var params = $('#form_query').serializeObject();

            params['password'] = Md5(params['password']);

            $.ajax({
                type: 'get',
                contentType: 'application/json',
                url: '/user/addUser.json',
                dataType: 'json',
                data: params,
                success: function (res) {
                    if(res.code === 200){
                        alert(res.msg);
                        location.href = '/';
                    }else{
                        alert(res.code + ', ' + res.msg);
                    }
                },
                error: function () {
                    alert('注册错误!');
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
seajs.use(["/config/debugeditor/modules/md5/1.0.0/md5"], function(Md5){
    var main = {
        init: function() {
            this.bind();
        },
        bind: function() {
            $("#btn_register").click(function(){ 
                location.href = 'register.html';
            });

            $('#form_login').submit(function(){
                main.query();
                return false;
            });
        },
        query: function(page){
            //获取params
            var params = $('#form_login').serializeObject();

            params['password'] = Md5(params['password']);

            $.ajax({
                type: 'get',
                contentType: 'application/json',
                url: '/user/login.json',
                // async: false, //选择同步，不然还没请求完就回填了
                dataType: 'json',
                data: params,
                success: function (res) {
                    if(res.code === 200){
                        location.href = res.referer;
                    }else{
                        alert(res.code + ', ' + res.msg);
                    }
                },
                error: function () {
                    alert('error login!');
                    // location.href = '/user/login.html';
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
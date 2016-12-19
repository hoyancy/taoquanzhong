seajs.use(["/config/debugeditor/modules/md5/1.0.0/md5"], function(md5){
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
            var params = $('#form_login').serialize();

            console.log(params);

            $.ajax({
                type: 'get',
                contentType: 'application/json',
                url: '/user/login.json',
                // async: false, //选择同步，不然还没请求完就回填了
                dataType: 'json',
                data: params,
                success: function (refererUrl) { 
                    location.href = refererUrl;
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
seajs.use(["/config/debugeditor/modules/md5/1.0.0/md5"], function(md5){
    var main = {
        init: function() {
            this.bind();
        },
        bind: function() {
            $('#form_query').submit(function(){
                main.query();
                return false;
            });
        },
        query: function(page){
            //获取params
            var params = $('#form_query').serialize();

            $.ajax({
                type: 'get',
                contentType: 'application/json',
                url: '/user/addUser.json',
                // async: false, //选择同步，不然还没请求完就回填了
                dataType: 'json',
                data: params,
                success: function (data) {
                    console.log("success register!");
                },
                error: function () {
                    alert('error regiter!');
                }
            });
        }
    };

    main.init();
});
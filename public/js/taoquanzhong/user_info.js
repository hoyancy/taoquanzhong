seajs.use(["/config/debugeditor/modules/template/3.1.0/template"], function(template){
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

            // 异步获取推荐人数
            $.ajax({
                type: 'get',
                contentType: 'application/json',
                url: '/taoquanzhong/recommend_num.json',
                dataType: 'json',
                data: params,
                success: function (res) {
                    if(res.code === 200){
                        var html = template("tpl_list", {recommend_num: res.recommend_num});
                        $("#table_list").html(html);
                    }else{
                        alert(res.code + ', ' + res.msg);
                    }
                },
                error: function () {
                    alert('请求有误');
                }
            });
        }
    };

    main.init();
});
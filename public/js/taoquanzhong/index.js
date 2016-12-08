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
        },
        query: function(page){
            //获取params
            var params = $('#form_search').serialize();
            var action_type = $('#action_type').val();
            console.log(action_type);
            var url = '';
            switch(action_type){
                case 'weight':
                    var url = 'http://www.taoka123.com:81/api/taoka_weight?' + params;
                    break;
                case 'need':
                    var url = 'http://www.taoka123.com:81/api/taoka_need?' + params;
                    break;
                case 'like':
                    var url = 'http://www.taoka123.com:81/api/like?' + params;
                    break;
                case 'tag':
                    var url = 'http://www.taoka123.com:81/api/tags?' + params;
                    break;
            }
            console.log(params);

            $.ajax({
                type: 'get',
                contentType: 'application/json',
                url: '/taoquanzhong/taoka_weight.json',
                // async: false, //选择同步，不然还没请求完就回填了
                dataType: 'json',
                data: url,
                success: function (data) {
                    var html = template("tpl_list", {list: data.result});
                    $("#table_list").html(html);
                    console.log(data.result);
                },
                error: function () {
                    alert('请求有误');
                }
            });
        }
    };

    main.init();
});
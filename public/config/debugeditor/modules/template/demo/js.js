seajs.use(["/config/debugeditor/modules/template/3.0.0/template"], function(template){
    var str = template("code", {list: "tom", user:{name: "html"}});
    $("#test").html(str);
});
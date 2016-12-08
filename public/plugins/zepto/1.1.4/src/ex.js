$.CLICK = 'click';

// tips
(function($){
    // 模板结构
    var BOX_HTML = '<div class="msg-mode hide"><div class="msg-text text-center" data-key="content"></div></div>';
    var LOADING_HTML = '<img src="data:image/gif;base64,R0lGODlhEAAQAIAAAP///////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJAAABACwAAAEADQAOAAACH4wfAMimnVZ0Mq6n6jwPwqwxoEd6HYVkk4puZxo2bwEAIfkECQAAAQAsAAABAA8ADgAAAiGMHwDIqH1eWpOp9W6ThsM/eZ12UY4GgiJEmhu1sq46BwUAIfkECQAAAQAsAAABAA8ADAAAAh6MHwDIqH1eWpOp9W6ThsM/eZ12UY4Ggp4Ynua4UQUAIfkECQAAAQAsAAABAA8ADgAAAiGMHwDIqH1eWpOp9W6ThsM/eZ12UY4GppYJZeI5gm/LGgUAIfkECQAAAQAsAwABAAwADgAAAh6MA3B7yaigcVC5FGXLr3fMLaDHUFOGSalGmRupLQUAIfkECQAAAQAsAAABAA8ADgAAAiGMHwDIqA1fWnBOWo3MVe3jLWEzch1mMZ61OpT0qWgWBwUAIfkECQAAAQAsAAADAA8ADAAAAh2MAaaBy61QcvBMh7G8Ub7agdkIit9zLtDKUS35FgAh+QQJAAABACwAAAEADwAOAAACIIwfAMiofV5acC5Zcd1MaeNdXhNym/ZZk+pQUhpRZloAADs=" />';
    var guid = function(){
        var r = parseInt(Math.random()*100000, 10),
            t = (new Date()).getTime();

        t = t.toString();
        r = r.toString();
        return t + r;
    };

    function Tips(){
        // 弹层窗口浮层
        this._wrap = $(BOX_HTML).attr({
            id: 'tips_guid_' + guid()
        }).appendTo('body');
    }

    Tips.prototype = {
        show: function(title){
            var str = title || '';
            // this._wrap.show();
            this._$('content').html(str);
            this._wrap.removeClass('hide').addClass('show');
            setTimeout(function(){
                $.tips.hide();
            }, 2500);
        },
        hide: function(){
            this._$('content').html('');
            this._wrap.removeClass('show').addClass('hide');
            // this._wrap.hide();
        },
        error: function(o){
            var cfg = {
                retcode: 0,
                retmsg: 'ok'
            };
            
            if($.isPlainObject(o)){
                $.extend(cfg, o);
            }

            var str = '[' + cfg.retcode + ']' + cfg.retmsg;
            this.show(str);
        },
        showLoading: function(title){
            var str = LOADING_HTML + (title || '加载中...');
            Tips.loading.show(str);
        },
        hideLoading: function(){
            Tips.loading.hide();
        },
        _$: function(key){
            return this._wrap.find('[data-key=' + key + ']');
        }
    };

    // 静态方法
    Tips.loading = new Tips();

    // 注册到zepto
    $.tips = new Tips();
})(Zepto);

// Ajax Extent
(function($) {
    // 常量配置
    var CONST_LOCK = 'lock',
        CONST_XHR_STATUS = 'xhr-status',
        CONST_DEFAULT_TEXT = 'default-text';

    // Zepto Ajax
    var $_ajax = $.ajax;

    function ajax(o) {
        var node = null,
            fn = null,
            xhr_status = '';

        if (o && o.lock) {

            node = (typeof o.lock === 'string') ? $(o.lock) : o.lock;
            xhr_status = node.data(CONST_XHR_STATUS);

            if (xhr_status === CONST_LOCK) {
                return false;
            }

            lock(node);

            // 串行请求时在success方法解锁
            if ($.isFunction(o.success)) {
                fn = o.success;
                o.success = function(data, status, xhr){
                    fn.apply(o.context, [data, status, xhr]);
                    unlock(node);
                }
            }else{
                o.success = function(data, status, xhr){
                    unlock(node);
                }
            }

            // 请求完成后解锁
            if ($.isFunction(o.complete)) {
                fn = o.complete;
                o.complete = function(xhr, status) {
                    fn.apply(o.context, [xhr, status]);
                    unlock(node);
                };
            } else {
                o.complete = function(xhr, status) {
                    unlock(node);
                };
            }

        }else{
            
            // 全局监听事件
            $(document).one('ajaxStart', function(e) {
                // loading 显示
                $.tips.showLoading();
            }).one('ajaxStop', function(e) {
                // loading 消失
                $.tips.hideLoading();
            });

        }

        // 锁定
        function lock(elem) {
            var node = (typeof elem === 'string') ? $(elem) : elem,
                val = node.is('input') ? 'val' : 'html',
                loading_txt = node.data('loading-text') || '请求中...',
                default_txt = node[val]();

            node.data(CONST_XHR_STATUS, CONST_LOCK).data(CONST_DEFAULT_TEXT, default_txt).prop('disabled', true).addClass('btn-disabled');
            !!loading_txt && node[val](loading_txt);
        }

        // 解锁
        function unlock(elem) {
            var node = (typeof elem === 'string') ? $(elem) : elem,
                val = node.is('input') ? 'val' : 'html',
                default_txt = node.data(CONST_DEFAULT_TEXT);

            node.data(CONST_XHR_STATUS, null).prop('disabled', false).removeClass('btn-disabled');
            node[val](default_txt);
        }

        $_ajax(o);
    }

    /**
     * Ajax
     * @param  string type 请求类型GET,POST
     * @return function
     */
    function factory(type) {
        return function(url, data, success, dataType, lock) {
            // 兼容无参数模式
            if($.isFunction(data)){
                dataType = success;
                success = data;
                data = null;
            }

            ajax({
                url: url,
                data: data,
                type: type || 'POST',
                success: success || function() {},
                dataType: dataType || 'json',
                lock: lock || null
            });
        };
    }

    $.ajax = ajax;
    $.get = factory('GET');
    $.post = factory('POST');

    // 获取select元素选中的option
    $.fn.option = function(){
        return (0 in this) ? $(this[0]).find('option').filter(function(){return this.selected;}) : null;
    };
})(Zepto);

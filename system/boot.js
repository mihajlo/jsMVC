try {
    if (window.production) {
        console.log = function () {};
        console.error = function () {};
        console.warn = function () {};
        console.info = function () {};

    }
} catch (e) {}
__remove_childs();

try {
    console.w = function (str) {
        console.warn('%c' + str, 'font-weight:bold; color:darkorange;');
    };

    console.i = function (str) {
        console.info('%c' + str, 'font-weight:bold; color:green;');
    };
    console.l = function (str) {
        console.log('%c' + str, 'font-weight:bold; color:blue;');
    };
    console.e = function (str) {
        console.error('%c' + str, 'font-weight:bold; color:red;');
    };
} catch (e) {}
var fw = {
    getJS: function (path) {
        console.l('Try to load...: ' + path);

        // if(__require_once(path)){
        try {
            jQuery.ajaxSetup({
                async: false
            });
            if (jQuery.getScript(path)) {
                console.i('Loaded: ' + path);
                __remove_childs();
                //document.head.getElementsByTagName('script')[document.head.getElementsByTagName('script').length-1].remove();
                return true;
            } else {
                console.e('Can\'t load: ' + path);
                return false;
            }
            jQuery.ajaxSetup({
                async: true
            });
        } catch (e) {

            if (__require_once(path)) {
                console.i('Loaded: ' + path);
                __remove_childs();
                //document.head.getElementsByTagName('script')[document.head.getElementsByTagName('script').length-1].remove();
                return true;
            } else {
                console.e('Can\'t load: ' + path);
                return false;
            }
        }


    },
    helper: {},
    lib: {},
    controller: {},
    model: {},
    view: {},
    load: {
        loaded_libs: [],
        loaded_helpers: [],
        loaded_controllers: [],
        loaded_models: [],
        loaded_views: [],
        library: function (lib_path, callback) {
            if (!callback) {
                callback = false;
            }
            for (i = 0; i < fw.load.loaded_libs.length; i++) {
                if (fw.load.loaded_libs[i] === lib_path) {
                    console.w('Already loaded library: ' + lib_path);
                    if (callback) {
                        callback();
                    }
                    return true;
                }
            }
            if (fw.getJS(lib_path)) {
                fw.load.loaded_libs.push(lib_path);
                if (callback) {
                    callback();
                }
            }
        },
        helper: function (helper_name, remove_global) {
            if (!fw.helper) {
                fw.helper = {};
            }
            for (i = 0; i < fw.load.loaded_helpers.length; i++) {
                if (fw.load.loaded_helpers[i] === helper_name) {
                    console.w('Already loaded helper: ' + helper_name);
                    return true;
                }
            }
            if (!eval('fw.helper.' + helper_name)) {
                fw.getJS('system/helpers/' + helper_name + '.js');
                var f_body = eval(helper_name + '.toString().replace(\'' + helper_name + '\',\'\');');

                if (remove_global) {
                    eval(helper_name + '=function(){console.e("This helper is available only in fw.helper.' + helper_name + '");};');
                }
                eval('fw.helper.' + helper_name + '=' + f_body);
                fw.load.loaded_helpers.push(helper_name);
                return true;
            }
            if (eval(helper_name)) {
                console.w('Already loaded helper system/helpers/' + helper_name + '.js');
            }
        },
        controller: function (controller) {
            for (i = 0; i < fw.load.loaded_controllers.length; i++) {
                if (fw.load.loaded_controllers[i] === controller) {
                    console.w('Controller already loaded : ' + controller);
                    return true;
                }
            }
            fw.getJS('app/controllers/' + controller + '.js');
            fw.load.loaded_controllers.push(controller);
            eval('fw.controller.' + controller + '=' + controller + ';');
            eval('' + controller + '=false;');
        },
        model: function (model) {
            for (i = 0; i < fw.load.loaded_models.length; i++) {
                if (fw.load.loaded_models[i] === model) {
                    console.w('Model already loaded : ' + model);
                    return true;
                }
            }
            fw.getJS('app/models/' + model + '.js');
            fw.load.loaded_models.push(model);
            eval('fw.model.' + model + '=' + model + ';');
            eval('' + model + '=false;');
        }

        ,
        view: function (view) {
            for (i = 0; i < fw.load.loaded_views.length; i++) {
                if (fw.load.loaded_views[i] === view) {
                    console.w('View already loaded : ' + view);
                    return true;
                }
            }
            fw.getJS('app/views/' + view + '.js');
            fw.load.loaded_views.push(view);
            eval('fw.view.' + view + '=' + view + ';');
            eval('' + view + '=false;');
        }
    }

};



fw.getJS('app/config.js');

//auto loading libs from config
for (i = 0; i < fw.config.libs.length; i++) {
    //console.log(fw.config.libs[i]);
    if (fw.config.libs[i].src) {
        //if (fw.config.libs[i].load) {
        fw.load.library(fw.config.libs[i].src);
        //}
    }
    if (fw.config.libs[i].callback) {
        fw.config.libs[i].callback.call();
    }
}



(function ($) {
    // Attrs
    $.fn.attrs = function (attrs) {
        var t = $(this);
        if (attrs) {
            // Set attributes
            t.each(function (i, e) {
                var j = $(e);
                for (var attr in attrs) {
                    j.attr(attr, attrs[attr]);
                };
            });
            return t;
        } else {
            // Get attributes
            var a = {},
                r = t.get(0);
            if (r) {
                r = r.attributes;
                for (var i in r) {
                    var p = r[i];
                    if (typeof p.nodeValue !== 'undefined') a[p.nodeName] = p.nodeValue;
                }
            }
            return a;
        }
    };
})(jQuery);




fw.config.helpers.push({
    name: 'str_replace',
    global: true
});
//auto loading helpers from config
for (h = 0; h < fw.config.helpers.length; h++) {
    //console.log(fw.config.libs[i]);
    if (fw.config.helpers[h].name) {
        if (!fw.config.helpers[h].global) {
            fw.load.helper(fw.config.helpers[h].name, true);
        } else {
            fw.load.helper(fw.config.helpers[h].name);
        }
    }
}

//auto loading models from config
for (m = 0; m < fw.config.models.length; m++) {
    fw.load.model(fw.config.models[m]);
}

fw.load.controller(fw.config.default_controller);
eval('fw.controller.' + fw.config.default_controller + '.' + fw.config.ready_method + ';');


//events  auto binding
jQuery(document).ready(function () {
    fw.loadTemp();
    fw.apply();
    fw.getJS('app/events.js');

});
jQuery(document).ajaxComplete(function (event, request, settings) {
    fw.apply();
});

jQuery(document).on('keyup', function () {
    fw.apply();
});




var foo = document.getElementsByTagName('script');
while (foo.firstChild) foo.removeChild(foo.firstChild);


function __remove_childs() {
    try {
        for (nn = document.getElementsByTagName('script').length - 1; nn >= 0; nn--) {
            document.head.removeChild(document.getElementsByTagName('script')[nn]);
        }
    } catch (e) {}
}

function ____file_get_contents(e, t, n, r, i) {
    var s, o = [],
        u = [],
        a = 0,
        f = 0,
        l = "",
        c = -1,
        h = 0,
        p = null,
        d = false;
    var v = function (e) {
        return e.substring(1) !== ""
    };
    this.php_js = this.php_js || {};
    this.php_js.ini = this.php_js.ini || {};
    var m = this.php_js.ini;
    n = n || this.php_js.default_streams_context || null;
    if (!t) {
        t = 0
    }
    var g = {
        FILE_USE_INCLUDE_PATH: 1,
        FILE_TEXT: 32,
        FILE_BINARY: 64
    };
    if (typeof t === "number") {
        h = t
    } else {
        t = [].concat(t);
        for (f = 0; f < t.length; f++) {
            if (g[t[f]]) {
                h = h | g[t[f]]
            }
        }
    }
    if (h & g.FILE_BINARY && h & g.FILE_TEXT) {
        throw "You cannot pass both FILE_BINARY and FILE_TEXT to ____file_get_contents()"
    }
    if (h & g.FILE_USE_INCLUDE_PATH && m.include_path && m.include_path.local_value) {
        var y = m.include_path.local_value.indexOf("/") !== -1 ? "/" : "\\";
        e = m.include_path.local_value + y + e
    } else if (!/^(https?|file):/.test(e)) {
        l = this.window.location.href;
        c = e.indexOf("/") === 0 ? l.indexOf("/", 8) - 1 : l.lastIndexOf("/");
        e = l.slice(0, c + 1) + e
    }
    var b;
    if (n) {
        b = n.stream_options && n.stream_options.http;
        d = !!b
    }
    if (!n || d) {
        var w = this.window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest;
        if (!w) {
            throw new Error("XMLHttpRequest not supported")
        }
        var E = d ? b.method : "GET";
        var S = !!(n && n.stream_params && n.stream_params["phpjs.async"]);
        if (m["phpjs.ajaxBypassCache"] && m["phpjs.ajaxBypassCache"].local_value) {
            e += (e.match(/\?/) == null ? "?" : "&") + (new Date).getTime()
        }
        w.open(E, e, S);
        if (S) {
            var x = n.stream_params.notification;
            if (typeof x === "function") {
                if (0 && w.addEventListener) {} else {
                    w.onreadystatechange = function (e) {
                        var t = {
                            responseText: w.responseText,
                            responseXML: w.responseXML,
                            status: w.status,
                            statusText: w.statusText,
                            readyState: w.readyState,
                            evt: e
                        };
                        var n;
                        switch (w.readyState) {
                        case 0:
                            x.call(t, 0, 0, "", 0, 0, 0);
                            break;
                        case 1:
                            x.call(t, 0, 0, "", 0, 0, 0);
                            break;
                        case 2:
                            x.call(t, 0, 0, "", 0, 0, 0);
                            break;
                        case 3:
                            n = w.responseText.length * 2;
                            x.call(t, 7, 0, "", 0, n, 0);
                            break;
                        case 4:
                            if (w.status >= 200 && w.status < 400) {
                                n = w.responseText.length * 2;
                                x.call(t, 8, 0, "", w.status, n, 0)
                            } else if (w.status === 403) {
                                x.call(t, 10, 2, "", w.status, 0, 0)
                            } else {
                                x.call(t, 9, 2, "", w.status, 0, 0)
                            }
                            break;
                        default:
                            throw "Unrecognized ready state for ____file_get_contents()"
                        }
                    }
                }
            }
        }
        if (d) {
            var T = b.header && b.header.split(/\r?\n/);
            var N = false;
            for (f = 0; f < T.length; f++) {
                var C = T[f];
                var k = C.search(/:\s*/);
                var L = C.substring(0, k);
                w.setRequestHeader(L, C.substring(k + 1));
                if (L === "User-Agent") {
                    N = true
                }
            }
            if (!N) {
                var A = b.user_agent || m.user_agent && m.user_agent.local_value;
                if (A) {
                    w.setRequestHeader("User-Agent", A)
                }
            }
            p = b.content || null
        }
        if (h & g.FILE_TEXT) {
            var O = "text/html";
            if (b && b["phpjs.override"]) {
                O = b["phpjs.override"]
            } else {
                var M = m["unicode.stream_encoding"] && m["unicode.stream_encoding"].local_value || "UTF-8";
                if (b && b.header && /^content-type:/im.test(b.header)) {
                    O = b.header.match(/^content-type:\s*(.*)$/im)[1]
                }
                if (!/;\s*charset=/.test(O)) {
                    O += "; charset=" + M
                }
            }
            w.overrideMimeType(O)
        } else if (h & g.FILE_BINARY) {
            w.overrideMimeType("text/plain; charset=x-user-defined")
        }
        try {
            if (b && b["phpjs.sendAsBinary"]) {
                w.sendAsBinary(p)
            } else {
                w.send(p)
            }
        } catch (_) {
            return false
        }
        s = w.getAllResponseHeaders();
        if (s) {
            s = s.split("\n");
            for (a = 0; a < s.length; a++) {
                if (v(s[a])) {
                    u.push(s[a])
                }
            }
            s = u;
            for (f = 0; f < s.length; f++) {
                o[f] = s[f]
            }
            this.$http_response_header = o
        }
        if (r || i) {
            if (i) {
                return w.responseText.substr(r || 0, i)
            }
            return w.responseText.substr(r)
        }
        return w.responseText
    }
    return false
}

function __require(e) {
    var t = this.window.document;
    var n = t.documentElement.nodeName !== "HTML" || !t.write;
    var r = this.____file_get_contents(e);
    if (!r) {
        return false
    }
    var i = t.createElementNS && n ? t.createElementNS("http://www.w3.org/1999/xhtml", "script") : t.createElement("script");
    i.type = "text/javascript";
    var s = navigator.userAgent.toLowerCase();
    if (s.indexOf("msie") !== -1 && s.indexOf("opera") === -1) {
        i.text = r
    } else {
        i.appendChild(t.createTextNode(r))
    }
    if (typeof i !== "undefined") {
        t.getElementsByTagNameNS && n ? t.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "head")[0] ? t.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "head")[0].appendChild(i) : t.documentElement.insertBefore(i, t.documentElement.firstChild) : t.getElementsByTagName("head")[0].appendChild(i);
        var o = {};
        o[this.window.location.href] = 1;
        this.php_js = this.php_js || {};
        if (!this.php_js.includes) {
            this.php_js.includes = o
        }
        if (!this.php_js.includes[e]) {
            this.php_js.includes[e] = 1;
            return 1
        } else {
            return ++this.php_js.includes[e]
        }
    }
    return 0
}

function __require_once(e) {
    var t = {};
    t[this.window.location.href] = 1;
    try {
        php_js_shared
    } catch (n) {
        php_js_shared = {}
    }
    if (!php_js_shared.includes) {
        php_js_shared.includes = t
    }
    if (!php_js_shared.includes[e]) {
        if (this.__require(e)) {
            return true
        }
    } else {
        return true
    }
    return false
};




//wrap execute repeat logic and convert into {{ js var here }} syntax
fw.repeatTranslate = function (el) {
    //START repeat multiplaing
    //debugger
    if (!el) {
        var el = jQuery('repeat');
    }




    jQuery.each(jQuery(el), function (k, v) {

        jQuery.each(jQuery(v).find('repeat'), function (kk, vv) {
            jQuery(vv).html(escape(jQuery(vv).html()));
        });

        var htmlAll = '';
        var curHtml = jQuery(v).html();

        //var tmpRepeat = jQuery(v).find('repeat').html();
        //jQuery(v).find('repeat').html('');


        var modelStr = jQuery(v).attr('model');
        var model = eval(modelStr);
        var nn = 0;

        model.forEach(function (item) {
            curHtml = jQuery(v).html();
            //console.i(modelStr);
            curHtml = str_replace('{{', '{{' + modelStr + '[' + nn + '].', curHtml);
            htmlAll += curHtml;
            nn++;
        });
        jQuery(v)[0].outerHTML = htmlAll;

    });
    jQuery.each(jQuery('repeat'), function (kk, vv) {
        jQuery(vv).html(unescape(jQuery(vv).html()));
    });
    //END repeat multiplaing
};


//wrap {{  js var here  }}
fw.tempWrap = function () {
    //START fixed parsing

    var bodyHtml = jQuery('body').html();
    //try {
    var countTmps = (bodyHtml.match(/{{/g) || []).length;
    for (i = 0; i < countTmps; i++) {

        if (jQuery('body').html().indexOf('{{') >= 0) {
            var startTmp = bodyHtml.indexOf('{{') + 2;
            var endTmp = bodyHtml.indexOf('}}');
            var varString = bodyHtml.substring(startTmp, endTmp);
            bodyHtml = bodyHtml.replace('{{', '').replace('}}', '');

            try {
                var varValue = eval(varString);
            } catch (e) {
                varValue = false;
            }
            if (!varValue) {
                varValue = varString;
            }
            bodyHtml = bodyHtml.replace(varString, varValue);
            jQuery('body').html(bodyHtml);
        }
    }
    jQuery('body').css('visibility', '');
};

fw.loadTemp = function () {
    jQuery.each(jQuery('fw-include'), function (k, v) {
        jQuery.ajaxSetup({
            async: false
        });
        jQuery(v)[0].outerHTML = jQuery.get($(v).attr('src')).responseText;
        jQuery.ajaxSetup({
            async: true
        });
    });
};



fw.apply = function () {
    try {
        if (jQuery('repeat').length) {
            jQuery('body').css('visibility', 'hidden');
        }
        //fw.repeatTranslate();
        setTimeout(function () {
            jQuery('body').css('visibility', 'hidden');
            fw.repeatTranslate();


            if (jQuery('repeat').length) {
                setTimeout(function () {
                    fw.tempWrap();
                }, 1);
            } else {
                fw.tempWrap();
            }
        }, 1);



    } catch (e) {
        //console.w(e);
    }
}

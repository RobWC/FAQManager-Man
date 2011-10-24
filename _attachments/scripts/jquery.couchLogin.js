// Copyright Chris Anderson 2011
// Apache 2.0 License
// jquery.couchLogin.js
// 
// Example Usage (loggedIn and loggedOut callbacks are optional): 
//    $("#mylogindiv").couchLogin({
//        loggedIn : function(userCtx) {
//            alert("hello "+userCtx.name);
//        }, 
//        loggedOut : function() {
//            alert("bye bye");
//        }
//    });

(function($) {
    $.fn.couchLogin = function(opts) {
        var elem = $(this);
        opts = opts || {};
        function initWidget() {
            $.couch.session({
                success : function(r) {
                    var userCtx = r.userCtx;
                    if (userCtx.name) {
                        elem.empty();
                        elem.append(loggedIn(r));
                        if (opts.loggedIn) {opts.loggedIn(userCtx)}
                    } else if (userCtx.roles.indexOf("_admin") != -1) {
                        elem.html(templates.adminParty);
                    } else {
                        elem.html(templates.loggedOut);
                        if (opts.loggedOut) {opts.loggedOut()}
                    };
                }
            });
        };
        initWidget();
        function doLogin(name, pass) {
            $.couch.login({name:name, password:pass, success:initWidget});
        };
        elem.delegate("a[href=#login]", "click", function() {
            elem.html(templates.loginForm);
            elem.find('input[name="name"]').focus();
        });
        elem.delegate("form.login", "submit", function() {
            doLogin($('input[name=name]', this).val(),
                $('input[name=password]', this).val());
            return false;
        });
        elem.delegate("a[href=#logout]", "click", function() {
            $.couch.logout({success : initWidget});
        });
    };
    function loggedIn(r) {
        var div = $('<span><span id="username">' + r.userCtx.name + '</span> <a href="#logout">Logout</a></span>');
        //$('span#username').text(r.userCtx.name); // you can get the user name here
        return div;
    }
})(jQuery);

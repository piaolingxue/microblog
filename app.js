
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes');

var MongoStore = require('connect-mongo');
var settings = require('./settings');



var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    // express cookie 解析中间件
    app.use(express.cookieParser());
    // express.session 提供会话支持
    app.use(express.session({
        secret: settings.cookieSecret,
        store: new MongoStore({
            db: settings.db
        })
    }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

app.dynamicHelpers({
    user: function(req, res){
        return req.session.user;
    },

    error: function(req, res){
        var err = req.flash('error');

        if (err.length){
            return err;
        }
        else {
            return null;
        }
    },

    success: function(req, res){
        var succ = req.flash('success');

        if (succ.length){
            return succ;
        }
        else {
            return null;
        }
    }
});

function checkNotLogin(req, res, next){
    if (req.session.user){
        req.flash('error', '已登入');
        return res.redirect('/');
    }
    next();
};


function checkLogin(req, res, next){
    if (!req.session.user){
        req.flash('error', '未登入');
        return res.redirect('/login');
    }
    next();
};

// Routes

app.get('/', routes.index);
app.get('/u/:user', routes.user);
app.post('/post', checkLogin, routes.post);
app.get('/reg', checkNotLogin, routes.reg);
app.post('/reg', checkNotLogin, routes.doReg);
app.get('/login', checkNotLogin, routes.login);
app.post('/login', checkNotLogin, routes.doLogin);
app.get('/logout', checkLogin, routes.logout);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

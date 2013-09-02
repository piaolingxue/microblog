
/*
 * GET home page.
 */
var crypto = require('crypto');
var User = require('../models/user');



exports.index = function(req, res){
    res.render('index', { title: '首页' });
};


exports.user = function(req, res){
    
};

exports.post = function(req, res){

};

exports.reg = function(req, res){
    res.render('reg', { title: '用户注册'});
};

exports.doReg = function(req, res){
    if (req.body['password-repeat'] != req.body['password']){
        req.flash('error', '两次输入的口令不一致');
        return res.redirect('/reg');
    }
    
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    console.log('password' + password);
    var newUser = new User({
        name: req.body.username,
        password: password
    });

    // check if exist this user
    User.get(newUser.username, function(err, user){
        if (user){
            err = 'Username already exists!';
        }
        if (err){
            req.flash('error', err);
            return res.redirect('/reg');
        }
        
        // if not exist then add one
        newUser.save(function(err){
            if (err){
                req.flash('error', err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success', '注册成功');
            res.redirect('/');
        });

    });
};

exports.login = function(req, res){
    
};

exports.doLogin = function(req, res){
    
};

exports.logout = function(req, res){
    
};







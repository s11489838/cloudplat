'use strict';

var users = require('mongoose').model('users');

var getErrorMessage = function (err) {
    // Define the error message variable
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }
    return message;
};

exports.Home = function (req, res) {
    res.redirect('/user/login');
}

exports.LoginGET =  function (req, res, next) {
    if (!req.user) {
        res.render('login', {
            messages: req.flash('error') || req.flash('info') || ''
        });
    } else {
        return res.redirect('/list');
    }
};

exports.signup = function (req, res) {
    if (!req.user) {
        res.render('signup', {
            messages: req.flash('error') || req.flash('info') || ''
        });
    } else {
        return res.redirect('/');
    }
}

exports.signupPOST = function (req, res) {
    if (!req.user) {
        var newAcc = {username: req.body.name, password: req.body.passwd};
        var account = new users(newAcc);
        var message = null;
        account.save(function (err) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/user/signup');
            }
            req.login(account, function (err) {
                if (err) return next(err);
                return res.redirect('/list');
            });
        });
    }
    else {
        return res.redirect('/');
    }
}

exports.Logout = function (req, res) {
    req.logout();
    res.redirect('/user/login');
}

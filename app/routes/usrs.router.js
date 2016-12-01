'use strict'

var users = require('../controller/usrs.controller.js'),
    passport = require('passport');

module.exports = function (app, router) {
    app.use('/user', router);

    router.get('/', users.Home);

    router.route('/login').get(users.LoginGET)
        .post(passport.authenticate('local', {
            successRedirect: '/list',
            failureRedirect: '/user/login',
            failureFlash: true
        }))
        .put(function (req, res) {
            res.redirect('/user/signup')
        });
    router.route('/signup')
        .get(users.signup)
        .post(users.signupPOST);

    router.get('/logout', users.Logout);
}
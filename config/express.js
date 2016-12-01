'use strict';

var express = require('express'),
    session = require('cookie-session'),
    bodyParser = require('body-parser'),
    fileUpload = require('express-fileupload'),
    favicon = require('serve-favicon'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport');

var credentials = require('./const/credentials');

module.exports = function () {
    var app = express();

    app.use(bodyParser.urlencoded({extended: false}))
    app.use(favicon(__dirname + '/image/auntiemo.png'))
    app.use(bodyParser.json());
    app.use(fileUpload());
    app.use(methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method
            delete req.body._method
            return method
        }
    }))

    app.set('trust proxy', 1);
    app.use(session({
        name: 'session',
        keys: ['asd','qwer'],
        secret : credentials.sessionSecret,
        maxAge: 5 * 60 * 1000
    }));

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    // Configure the flash messages middleware
    app.use(flash());
    // Configure the Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    var router1 = express.Router();
    var router2 = express.Router();
    require('../app/routes/api.router')(app, router1);
    require('../app/routes/usrs.router')(app, router2);
    require('../app/routes/trunk.router.js')(app);

    app.use(express.static(__dirname + '/public'));

    return app;
}
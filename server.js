'use strict'

// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

var mongoose = require('./config/mongoose');
var passport = require('./config/passport');
var express = require('./config/express');

var db = mongoose();
var app = express();
var passport = passport();

var config = require('./config/config');
app.listen(config.port, '0.0.0.0', function () {
    console.log("Listening port: " + config.port);
});
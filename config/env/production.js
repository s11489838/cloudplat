'use strict';

var cfenv = require('cfenv');

module.exports = {
    db: 'mongodb://crap:passw0rd@ds159767.mlab.com:59767/santiago',
    appEnv: cfenv.getAppEnv(),
    port: cfenv.getAppEnv().port ||8099
};
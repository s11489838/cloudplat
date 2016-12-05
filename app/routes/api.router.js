'use strict'
var apis= require('../controller/api.controller.js');
module.exports = function (app,router) {
	app.use('/api', router);
	router.get('/', apis.Home)

	router.post('/create', apis.Create);

	router.get('/read', apis.Query);

	router.get('/read/*', apis.QueryItems);}
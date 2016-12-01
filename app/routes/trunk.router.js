var restaurantController = require('../controller/restaurants.controller.js');
var passport = require('passport');

module.exports = function (app) {
    app.get('/', restaurantController.Home);

    app.get('/list', isAuthenticated, restaurantController.listLocation);

    app.get('/resp', isAuthenticated, restaurantController.Response);

    app.get('/item/create', isAuthenticated, restaurantController.itemCreate);

    app.get('/item/:id', isAuthenticated, restaurantController.itemDetail);

    app.get('/item/:id/:name/rate', isAuthenticated, restaurantController.itemRate);

    app.post('/item/:id/:action', isAuthenticated, restaurantController.itemAction);

    app.get('/item/:id/delete', isAuthenticated, restaurantController.itemDelete);

    app.get('/item/:id/edit', isAuthenticated, restaurantController.itemEdit);

    function isAuthenticated(req, res, next) {
        if (req.user)
            return next();
        req.flash('error', 'Unauthenticated Access!');
        res.redirect('/');
    }
};

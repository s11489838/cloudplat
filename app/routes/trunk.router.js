var restaurantController = require('../controller/restaurants.controller.js');
var passport = require('passport');

/**
 *  listLocation => main page listing location
 *  Response => response page
 *  itemCreate => create item page
 *  itemDetail => load item detail
 *  itemRate => rating
 *      input : username, id
 *
 *  itemAction =>
 *  itemDelete =>
 *  itemEdit =>
 **/

module.exports = function (app) {
    app.get('/', restaurantController.Home);

    app.post('/list', isAuthenticated, restaurantController.listLocation)
        .get('/list', isAuthenticated, restaurantController.listLocation);

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

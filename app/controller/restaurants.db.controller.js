'use strict'

var restaurant = require('mongoose').model('restaurants');
module.exports = {
    findAll: function (query, from, callback) {
        var projection = '';
        console.log('Action : ' + from)
        switch (from) {
            case 'api':
                projection = '-img.data';
                restaurant.select(projection)
                    .find(query)
                    .exec(function (err, item) {
                        callback(item);
                    });
                break;
            case 'list':
                restaurant.find(query).exec(function (err, item) {
                    callback(item);
                });
                break;
            case 'review':
                projection = {_id: 1, name: 1, rating: 1};
                restaurant.aggregate({$unwind: '$rating'},
                    {
                        $match: {
                            'rating.by': query.by,
                            name: query.name
                        }
                    })
                    .exec(function (err, items) {
                        console.log(items.length);
                        if (items.length >= 1)
                            callback(true);
                        else
                            callback(false);
                    });
                break;
        }
    },
    find: function (id, action, callback) {
        var projection = '';
        restaurant.findById(id).select(projection).exec()
            .then(function (item) {
                callback(item)
            });
    },
    grantEditDoc: function (id, user, callback) {
        var projection = '-img.data'
        restaurant.findById(id).select(projection).exec()
            .then(function (item) {
                if (item.by == user) {
                    callback(item);
                } else {
                    callback(false);
                }
            });
    },
    deleteOne: function (id, user, callback) {
        restaurant.findById(id).exec()
            .then(function (item) {
                if (item.by == user) {
                    item.remove()
                    callback(item);
                } else {
                    callback(false);
                }
            });
    },
    Create: function (newJson, callback) {
        var newRest = new restaurant(newJson)
        newRest.save(function (err, item) {
            if (err) {
                console.log(err)
                return callback(false, err);
            } else {
                return callback(item.username);
            }
        });
    },
    Update: function (id, user, newJson, action, callback) {
        console.log(id, newJson, action, user)
        restaurant.findById(id).exec()
            .then(function (item) {
                if (action == 'rate') {
                    item.rating.push(newJson)
                    item.save()
                } else if (action == 'edit' && user == item.by) {
                    item.update({$set: newJson}, function (err, item) {
                        console.log(err)
                    })
                    item.save()
                } else {
                    return callback(false)
                }
                return callback(item)
            });
    }

}
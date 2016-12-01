'use strict'

var restaurant = require('mongoose').model('restaurants');
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
module.exports = {
    getDocs: function (query, from, callback) {
        var projection = '';
        if (from == 'api')
            projection = '-img.data'
        else
            projection = {_id: 1, name: 1};
        restaurant.find(query).select(projection).exec()
            .then(function (items) {
                callback(items)
            });
    },
    getDoc: function (id, action, callback) {
        var projection = '';
        restaurant.findById(id).select(projection).exec()
            .then(function (item) {
                callback(item)
            });
    },
    grantEditDoc: function (id, user,callback) {
        var projection = '-img.data'
        restaurant.findById(id).select(projection).exec()
            .then(function (item) {
                console.log(item)
                if (item.by == user) {
                    callback(item);
                } else {
                    callback(false);
                }
            });
    },
    delDoc: function (id, user, callback) {
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
    saveDocs: function (newJson, callback) {
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
    updateDoc: function (id, user, newJson, action, callback) {
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
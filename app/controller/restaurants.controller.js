var restaurantsDBHelper = require('./restaurants.db.controller.js')
var credentials = require('../../config/const/credentials');
console.log(credentials.googleAPI);
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
    res.redirect('/user');
}
exports.listLocation = function (req, res) {
    var query = {};
    restaurantsDBHelper.getDocs(query, 'list', function (value) {
        res.render("item_list", {
            restaurant: value,
            criteria: JSON.stringify(query),
            noDocs: value.length,
            user: req.user.username,
            msg: req.flash('error') || req.flash('info')
        });
    });

}
exports.Response = function (req, res) {
    res.render("resp", req.session['resp']);
}
exports.itemCreate = function (req, res) {
    res.render("item_create", {
        action: "Create",
        orgJson: null,
        messages: req.flash('error') || req.flash('info')
    });
}
exports.itemDetail = function (req, res) {
    restaurantsDBHelper.getDoc(req.params.id, 'read', function (value) {
        var imgSrc = "";
        if (value.img.data != null) {
            imgSrc = 'data:' + value.img.contentType + ';base64,';
            imgSrc += new Buffer(value.img.data, 'base64');
        }
        res.render("item", {info: value, imgSrc: imgSrc, api: credentials});
    });
}
exports.itemAction = function (req, res) {
    var passJson = {}
    if (req.params.action == 'rate') {
        passJson = req.body;
        passJson.by = req.user.username;
    } else if (req.params.action == 'edit') {
        passJson = {
            address: {
                zipcode: req.body.zipcode,
                building: req.body.building,
                coord: {
                    lat: req.body.lat,
                    lon: req.body.lon
                }
            },
            borough: req.body.borough,
            cuisine: req.body.cuisine,
            name: req.body.name,
        }
        if (!req.body.filename) {
            console.log("empty")
            passJson.img = {}
        } else if (req.files.imgFile.name && req.files.imgFile.name != req.body.oldname) {
            console.log("change")
            passJson.img = {
                data: new Buffer(req.files.imgFile.data).toString('base64'),
                contentType: req.files.imgFile.mimetype,
                filename: req.files.imgFile.name
            }
        } else {
            console.log("no change")
        }

    }
    restaurantsDBHelper.updateDoc(req.params.id, req.session.id, passJson, req.params.action, function (value) {
        if (value == false) {
            req.flash('error', 'Update no success');
        } else {
            req.flash('info', 'Document update Success!!!');
        }
        res.redirect('/list')
    })
}
exports.itemRate = function (req, res) {
    res.render("item_rate", {name: req.params.name});
}

exports.itemDelete = function (req, res) {
    restaurantsDBHelper.delDoc(req.params.id, req.user.username, function (value) {
        if (value == false) {
            req.flash('error', 'You are not the owner, action denied.');
        } else {
            req.flash('info', 'Document delete Successful!!!');
        }
        return res.redirect('/list')
    })
}
exports.itemEdit = function (req, res) {
    restaurantsDBHelper.grantEditDoc(req.params.id,req.user.username, function (value) {
        if (value == false) {
            req.flash('error', 'You are not the owner, action denied.');
            return res.redirect('/list')
        } else {
            res.render("item_create", {
                action: "Edit", orgJson: value,
                messages: req.flash('error') || req.flash('info')
            });
        }
    });
}
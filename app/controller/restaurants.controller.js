var restaurantsDBHelper = require('./restaurants.db.controller.js')
var credentials = require('../../config/const/credentials');

exports.Home = function (req, res) {
    res.redirect('/user');
}
exports.listLocation = function (req, res) {
    var query = {};
    if (req.body.from == 'search') {
        console.log(req.body.search_param);
        console.log(req.body.search_criteria);
        switch (req.body.search_param) {
            case 'restaurant':
                query['name'] = new RegExp(req.body.search_criteria, "i");
                break;
            case 'user':
                query['by'] = new RegExp(req.body.search_criteria, "i");
                break;
            case'cuisine':
                query['cuisine'] = new RegExp(req.body.search_criteria,"i");
                break;
        }
    }
    restaurantsDBHelper.findAll(query, 'list', function (value) {
        res.render("item_list", {
            restaurant: value,
            criteria: query,
            noDocs: value.length || 0,
            user: req.user.username,
            msg: req.flash('error') || req.flash('info')
        });
    });

}
exports.itemCreate = function (req, res) {
    res.render("item_create", {
        action: "Create",
        orgJson: null,
        messages: req.flash('error') || req.flash('info')
    });
}
exports.itemDetail = function (req, res) {
    restaurantsDBHelper.find(req.param('id'), 'read', function (value) {
        var imgSrc = "";
        if (value.img.data != null) {
            imgSrc = 'data:' + value.img.contentType + ';base64,';
            imgSrc += new Buffer(value.img.data, 'base64');
        }
        res.render("item", {
            info: value,
            imgSrc: imgSrc,
            api: credentials,
            messages: req.flash('error') || req.flash('info')
        });
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
    restaurantsDBHelper.Update(req.params.id, req.session.id, passJson, req.params.action, function (value) {
        if (value == false) {
            req.flash('error', 'Update no success');
        } else {
            req.flash('info', 'Document update Success!!!');
        }
        res.redirect('./')
    })
}
exports.itemRate = function (req, res) {
    var query = {};
    query['by'] = req.user.username;
    query['name'] = req.param('name');
    console.log(JSON.stringify(query));
    restaurantsDBHelper.findAll(query, 'review', function (items) {
        if (items) {
            req.flash('error', 'you cannot rate it twice.');
            return res.redirect('/item/' + req.param('id'));
        } else
            return res.render("item_rate", {name: query.name});
    });
};

exports.itemDelete = function (req, res) {
    restaurantsDBHelper.deleteOne(req.params.id, req.user.username, function (value) {
        if (value == false) {
            req.flash('error', 'You are not the owner, action denied.');
        } else {
            req.flash('info', 'Document delete Successful!!!');
        }
        return res.redirect('/list')
    })
};
exports.itemEdit = function (req, res) {
    restaurantsDBHelper.grantEditDoc(req.params.id, req.user.username, function (value) {
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
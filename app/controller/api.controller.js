var users = require('./restaurants.db.controller.js')
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
    res.json(packageInfo);
}
exports.Create = function (req, res) {
    var resJson = {},
        newJson = {};
    if (req.body.from == 'form') {
        newJson = {
            address: {
                zipcode: req.body.zipcode,
                building: req.body.building,
                coord: []
            },
            borough: req.body.borough,
            cuisine: req.body.cuisine,
            name: req.body.name,
            by: req.user.username,
            img: {}
        }
        if (req.body.lat != '') {
            newJson.address.coord = {
                lat: req.body.lat,
                lon: req.body.lon
            }
        }
        if (!req.files.imgFile.name) {
            newJson.img = {
                data: null,
                contentType: null,
                filename: null
            }
        } else {
            newJson.img = {
                data: new Buffer(req.files.imgFile.data).toString('base64'),
                contentType: req.files.imgFile.mimetype,
                filename: req.files.imgFile.name
            }
        }

        users.saveDocs(newJson, function (value,err) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/item/create')
            } else {
                resJson["status"] = true;
                resJson["words"] = "Success to create, click back to the new item page." +
                    "<br>" +
                    " The new Item id is: " + value;
                resJson["_id"] = value;
                resJson["backUrl"] = '/item/' + value;
            }
            req.flash('info','Create Success');
            return res.redirect('../list')
        })
    } else {
        users.saveDocs(newJson, function (value) {
            if (value == false) {
                resJson["status"] = "failed";
            } else {
                resJson["status"] = "ok";
                resJson["_id"] = value;
            }
            res.json(resJson);
        })
    }
}
exports.Query = function (req, res) {
    users.getDocs({}, 'api', function (value) {
        res.json(value);
    });
}
exports.QueryItems = function (req, res) {

    var urlParams = req.params['0'].replace(/\/$/, '').split('/'),
        readQuery = {},
        resJson = {},
        errorQueryJson = {"Response": "Please make a correct query"};

    if (urlParams.length != 0 && urlParams.length % 2 == 0) {
        for (var i = 0; i < urlParams.length; i++) {
            if (i % 2 == 0 && urlParams[i].match(/name|borough|cuisine/)) {
                readQuery[urlParams[i]] = urlParams[++i].replace(/\+/, ' ');
                resJson = readQuery
            } else {
                return res.json({})
            }
        }
    } else {
        return res.json({})
    }
    users.getDocs(resJson, 'api', function (value) {
        res.json(value);
    });
}
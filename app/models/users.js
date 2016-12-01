var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

var usersSchema = new Schema({
    username: {
        type: String,
        validate: [/[a-z]/, "Special Character not allowed"],
        unique: 'Username is used, please choose another',
        required: 'Username is required',
        trim: true
    },
    password: {
        type: String,
        required:'Password required',
        validate: [
            function (password) {
                return password && password.length > 6;
            }, 'Password should be longer'
        ]
    },
    salt: {
        type: String
    }
});
usersSchema.plugin(uniqueValidator);
/*usersSchema.pre('save', function (next) {
 if (this.password) {
 this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
 this.password = this.hashPassword(this.password);
 }

 next();
 });*/

// Create an instance method for hashing a password
/*usersSchema.methods.hashPassword = function (password) {
 return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
 };*/

// Create an instance method for authenticating user
usersSchema.methods.authenticate = function (password) {
    return password === this.password;
};

mongoose.model('users', usersSchema);
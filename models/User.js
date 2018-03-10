var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');
var jwt = require('jsonwebtoken');

var User = bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: true,

    initialize: function() {
        this.on('saving', this.hashPassword, this);
    },

    hashPassword: function(model, attrs, options) {
        var password = options.patch ? attrs.password : model.get('password');
        if (!password) { return; }
        return new Promise(function(resolve, reject) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, null, function(err, hash) {
                    if (options.patch) {
                        attrs.password = hash;
                    }
                    model.set('password', hash);
                    resolve();
                });
            });
        });
    },

    comparePassword: function(password, done) {
        var model = this;
        bcrypt.compare(password, model.get('password'), function(err, isMatch) {
            done(err, isMatch);
        });
    },

    hidden: ['password', 'passwordResetToken', 'passwordResetExpires'],

    virtuals: {
        gravatar: function() {
            if (!this.get('email')) {
                return 'https://gravatar.com/avatar/?s=200&d=retro';
            }
            var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
            return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
        }
    }
}, staticFunc());
function staticFunc() {
    function getUserByApiReq(req) {
        var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
        var decoded = jwt.decode(token);
        console.log(req.headers)
        new User({ id: decoded.sub })
            .fetch()
            .then(function(user) {
                if (user != null){
                    return {
                        data : user
                    }
                }else {
                    return {
                        data : 0,
                        msg : 'no user in db'
                    }
                }
            })
            .catch(function (err) {
                return {
                    data : 0,
                    msg : err
                }
            })
    }

    return {
        getUserByApiReq : getUserByApiReq
    }
}
module.exports = User;

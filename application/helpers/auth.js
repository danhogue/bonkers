var bcrypt = require('bcryptjs'),
    Q = require('q'),
    jwt = require('jsonwebtoken'),
    User = require('../models/user');


exports.localReg = function (email, password) {
    var deferred = Q.defer();
    var hash = bcrypt.hashSync(password, 8);

    User.get({
        user_id: email
    }, function(err, user) {
        if (err) {
            console.log("ERROR WHILE ATTEMPTING TO REGISTER USER");
            deferred.reject(err);
        }
        if (!user) {
            var new_user = {
                "user_id": email,
                "password": hash,
                "created_date": Math.floor((new Date()).getTime() / 1000),
                "user_enabled": false,
                "avatar": "/img/default-avatar.png",
                "default_account_id": "demo",
                "profile":{}
            };
            User.put(new_user, function (err, data) {
                if (err) {
                    console.log(err);
                    deferred.reject(err);
                }
                deferred.resolve(new_user);
            })
        } else {
            console.log("USER ALREADY EXISTS IN DATABASE");
            deferred.resolve(false);
        }
    });

    return deferred.promise;
};

exports.localJWTAuth = function (email, password) {
    var deferred = Q.defer();

    User.get({
        user_id: email
    }, function(err, user) {

        if (err) {
            console.log("ERROR WHILE ATTEMPTING TO FIND USER");
            deferred.reject(err);
        }

        if (user) {
            if (!bcrypt.compareSync(password, user.password)) {
                console.log("PASSWORDS NOT MATCH");
                deferred.resolve(false);
            } else {
                if (!user.user_enabled) {
                    console.log("USER NOT ENABLED");
                    deferred.resolve(false);
                } else {
                    console.log("AUTHENTICATING");
                    var payload = {
                        "iss": "Bonkers",
                        "scopes": ["admin", "some_thing", "another_thing"],
                        "sub": {
                            user_id: user.user_id
                        }
                    };
                    user.access_token = jwt.sign(payload, process.env.SECRET, {
                        expiresIn: 60*60*3
                    });
                    deferred.resolve(user);
                }
            }
        } else {
            console.log("COULD NOT FIND USER");
            deferred.resolve(false);
        }
    });

    return deferred.promise;
};

exports.ensureValidToken = function(req, res, next) {
    console.log("CHECKING TOKEN");
    var token = (req.body && req.body.access_token) ||
                (req.query && req.query.access_token) ||
                 req.headers['x-access-token'] ||
                 req.cookies['x-access-token'];
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
            console.log(err);
            return res.redirect('/signin?redirect_path=' + req.originalUrl);
        } else {
            req.user = decoded.sub;
            return next();
        }
    });
};

exports.invalidateToken = function(req, res, next) {
    res.clearCookie('x-access-token');
    return next(req, res);
};

exports.checkIfSignedIn = function(req, res, cb) {
    var token = (req.body && req.body.access_token) ||
        (req.query && req.query.access_token) ||
        req.headers['x-access-token'] ||
        req.cookies['x-access-token'];
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
            cb(false);
        } else {
            cb(true)
        }
    });
};


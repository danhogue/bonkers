var express = require('express'),
    app = module.exports = express(),
    auth = require('../helpers/auth'),
    jwt = require('jsonwebtoken'),
    Cloud = require('../models/account');

app.use(auth.ensureValidToken);

app.get('/', function (req, res){
    return res.render('account', {user: req.user});
});


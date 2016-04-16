var express = require('express'),
    app = module.exports = express(),
    auth = require('../../helpers/auth'),
    swig = require('swig');

// templates
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Configure express for static files
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));

// routes
app.get('/', function (req, res){
    res.render("index");
});

app.get('/top', function (req, res){
    res.render("top");
});

app.get('/hello', function (req, res){
    res.send("hello");
});

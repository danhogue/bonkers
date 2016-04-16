require('dotenv').config({path: '../.env'});

var express = require('express'),
    swig = require('swig'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    auth = require('./helpers/auth');


//===============EXPRESS================
// Configure Express
var app = express();
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// Configure http redirect to https middleware. Redirect if env option HTTP_REDIRECT=true
app.use(function(req, res, next) {
    if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https') && process.env.HTTP_REDIRECT == 'true') {
        res.redirect('https://' + req.get('Host') + req.url);
    }
    else {
        next();
    }
});

//===============PASSPORT=================
passport.use('local-signup', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        auth.localReg(email, password)
            .then(function (user) {
                if (user) {
                    console.log("REGISTERED: " + user.email);
                    done(null, user, {success: true, message:"You are successfully registered"});
                }
                if (!user) {
                    console.log("COULD NOT REGISTER");
                    done(null, false, {success: false, message:"Could not register"});
                }
            })
            .fail(function (err){
                console.log(err.body);
                done(null, false, {success: false, message: "Error"});
            });
    }
));

passport.use('local-jwt-signin', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        auth.localJWTAuth(email, password)
            .then(function (user) {
                if (user) {
                    console.log("LOGGED IN AS: " + user);
                    done(null, user, {success: true, message:"You are successfully signed in"});
                }
                if (!user) {
                    console.log("COULD NOT LOG IN");
                    done(null, false, {success: false, message:"Could not sign in"});
                }
            })
            .fail(function (err){
                console.log(err.body);
            });
    }
));


//===============LOCALIZATION================
var i18n = new require('i18n-2');

i18n.expressBind(app, {
    // setup some locales - other locales default to en silently
    locales: ['en', 'es'],
    defaultLocale: 'en',
    cookieName: 'locale'
});

// set up the middleware
app.use(function(req, res, next) {
    req.i18n.setLocaleFromQuery();
    req.i18n.setLocaleFromCookie();
    next();
});


//=======TEMPLATES AND STATIC FILES========
// Configure express to use swig templates
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
swig.setDefaults({ cache: false });
app.set('view cache', process.env.CACHE);

// Configure express for static files
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/img", express.static(__dirname + "/img"));


//===============ROUTES===============
app.get('/', function (req, res){
    return res.render('index');
});

app.get('/register', function(req, res){
    return res.render('register');
});

app.get('/forgotpassword', function (req, res){
    return res.render('forgotpassword');
});

app.get('/signin', function(req, res){
    auth.checkIfSignedIn(req, res, function(signed_in){
        if (signed_in) {
            return res.redirect('/apps');
        } else {
            return res.render('signin', {redirect_path: req.query.redirect_path});
        }
    });
});

app.get('/signout', function(req, res){
    auth.invalidateToken(req, res, function(req, res){
        return res.redirect('/');
    });
});

app.get('/404', function (req, res){
    return res.render('404');
});

//==============AJAX ROUTES===============
app.post('/register', function(req, res, next) {
    passport.authenticate('local-signup',
        function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send(info);
            }
            return res.send(info);
        })(req, res, next);
});

app.post('/authenticate', function(req, res, next) {
    passport.authenticate('local-jwt-signin', {session: false},
        function(err, user, info) {
            if (err) {
                return next(err);
            }
            info.redirect = req.body.redirect_path;
            if (!info.redirect){
                info.redirect = '/apps/' + user.default_app_id;
            }
            res.cookie('x-access-token', user.access_token);
            return res.send(info);
        })(req, res, next);
});

//==========ROUTE CONTROLLERS==============
app.use('/apps', require('./controllers/apps.js'));
app.use('/api', require('./controllers/api.js'));
app.use('/account', require('./controllers/account.js'));

//==========APP CONTROLLERS==============
app.use('/demo', require('./apps/demo/app.js'));

//==========ERROR HANDLERS==============
app.use(function(req, res, next){
    res.status(404);

    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }

    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    res.type('txt').send('Not found');
});

//===============START APP=================
app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port 3000...')
});

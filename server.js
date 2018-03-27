var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');

// Load environment variables from .env file
dotenv.load();

// Models
var User = require('./models/User');
// Controllers
var userController = require('./controllers/user');
var contactController = require('./controllers/contact');
var clientController = require('./controllers/client');
var deliveryController = require('./controllers/delivery_controller');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/lib', express.static(path.join(__dirname, 'node_modules')));

app.use(function(req, res, next) {
    req.isAuthenticated = function() {
        var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
        try {
            return jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (err) {
            return false;
        }
    };

    if (req.isAuthenticated()) {
        var payload = req.isAuthenticated();
        new User({ id: payload.sub })
            .fetch()
            .then(function(user) {
                req.user = user;
                next();
            });
    } else {
        next();
    }
});

app.post('/contact', contactController.contactPost);
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
app.post('/signup', userController.signupPost);
app.post('/login', userController.loginPost);
app.post('/forgot', userController.forgotPost);
app.post('/reset/:token', userController.resetPost);
app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);


//API

app.get('/api/v1/clients', clientController.getAllClient);
app.get('/api/delivery/deliveries', deliveryController.getAllDeliveries);
app.post('/api/delivery/new', deliveryController.newDeliveryPost);
app.post('/api/delivery/update', deliveryController.updateDelivery);
app.post('/api/delivery/delete', deliveryController.deleteDelivery);
//app.post('/api/delivery/get_active_delivery', deliveryController.getOneActiveDeliveryByPasportAndName);
app.post('/api/delivery/check_active_delivery', deliveryController.checkActiveDeliveryByPasportAndName);
app.post('/api/delivery/confirm_delivery', deliveryController.confirmDelivey);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'app', 'index.html'));
});
app.get('/confirm', function(req, res) {
    res.sendFile(path.join(__dirname, 'confirm_app', 'confirm.html'));
});

app.get('*', function(req, res) {
    res.redirect('/#' + req.originalUrl);
});

// Production error handler
if (app.get('env') === 'production') {
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.sendStatus(err.status || 500);
    });
}

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;

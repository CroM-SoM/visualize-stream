//Setup web server and socket
var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('./services/logger.js')
var models = require('./models');

app.set('port', process.env.PORT || PORT);

var server = app.listen(app.get('port'), function () {
    console.log("NODE_ENV: " + process.env.NODE_ENV + ' server listening on port ' + server.address().port);
});

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// ROUTES
require('./routes/index')(app);

//Setup rotuing for app
app.use(express.static(__dirname + '/public'));

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);

models.sequelize.query('CREATE EXTENSION IF NOT EXISTS hstore').then(function () {
    models.sequelize.sync().then(function () {
        console.log('Database ready!');
    });
});


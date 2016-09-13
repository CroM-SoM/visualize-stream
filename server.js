//Setup web server and socket
var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('./services/logger.js')
var models = require('./models');

app.set('port', process.env.PORT || PORT);

var moment = require('moment');
var path = require('path');
var favicon = require('serve-favicon');

var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/config/tsconfig.json')[env];


/**/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set('view engine', 'ejs');
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(cookieParser());
app.use(express.static('./dist')); 		// set the static files location /public/img will be /img for users
// Configuring required for passport

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
/**/
// ROUTES
require('./routes/index')(app);

models.sequelize.query('CREATE EXTENSION IF NOT EXISTS hstore').then(function () {
    models.sequelize.sync().then(function () {
        console.log('Database ready!');
    });
});

var server = app.listen(app.get('port'), function () {
  console.log("NODE_ENV: " + process.env.NODE_ENV + ' server listening on port ' + server.address().port);
});

module.exports = app;

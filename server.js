//Setup web server and socket


var express         = require('express');
var app             = express();
var PORT            = process.env.PORT || 8080;
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');

app.set('port', process.env.PORT || PORT);

var server = app.listen(app.get('port'), function () {
  console.log("NODE_ENV: "+process.env.NODE_ENV+' server listening on port ' + server.address().port);
});

var twitter = require('twitter'),
    http = require('http'),

    io = require('socket.io').listen(server);

var winston = require('winston'),
    fs = require('fs'),
    path = require('path');

var dir = './logs';
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

var filename = path.join(__dirname,'/logs/', 'created-data.log');

try { fs.unlinkSync(filename); }
catch (ex) { }

//
// Create a new winston logger instance with two tranports: Console, and File
//
//

var logger = new winston.Logger({
  level: 'info',
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: filename })
  ]
});

//
// Replaces the previous transports with those in the
// new configuration wholesale.
//
logger.configure({
  level: 'verbose',
  transports: [
    new (require('winston-daily-rotate-file'))({ filename: filename })
  ]
});

setTimeout(function () {
  //
  // Remove the file, ignoring any errors
  //
  try { fs.unlinkSync(filename); }
  catch (ex) { }
}, 1000);



//Setup twitter stream api
var twit = new twitter({
  consumer_key: 'aIiEO0MSjEMBcOr7oicfaGFyQ',
  consumer_secret: 'BEGDT8LGgsctelJkf3RuRxPdDbj5AHV8IbZC2c3dtcGCW9MPWP',
  access_token_key: '519395465-7R4UKVRCi2MuIJVX2ECW8rttVReXg1XGlwuWAcWo',
  access_token_secret: 'Tp3g7sOwnNxbvBYdq8reQMVKpIR0DXtCltMFl9dpkLQ0c'
}),
stream = null;


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



//Create web sockets connection.
io.sockets.on('connection', function (socket) {

  socket.on("start tweets", function() {

    if(stream === null) {
      //Amsterdam
      //North Latitude: 52.430950 South Latitude: 52.318274 East Longitude: 5.068373 West Longitude: 4.728856
        //Connect to twitter stream passing in filter for entire world. 52.430950, 52.318274, 52.318274, 4.728856
        twit.stream('statuses/filter', {'locations':'4.734421,52.290423,4.975433,52.431065'}, function(s) {
            stream = s;
            stream.on('data', function(data) {
              // Does the JSON result have coordinates
              console.log("Data coming :"+JSON.stringify(data));
              logger.log('info', JSON.stringify(data));


              if (data.coordinates){
                if (data.coordinates !== null){
                  //If so then build up some nice json and send out to web sockets
                  var outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1],"place":data.place.full_name,"url": data.user.profile_image_url,"userName":data.user.screen_name,"location":data.user.location,"text":data.text,"lang":data.user.lang,"time_zone":data.user.time_zone};

                  socket.broadcast.emit("twitter-stream", outputPoint);

                  //Send out to web sockets channel.
                  socket.emit('twitter-stream', outputPoint);
                }
                else if(data.place){
                  if(data.place.bounding_box.type === 'Polygon'){
                    // Calculate the center of the bounding box for the tweet
                    var coord, _i, _len;
                    var centerLat = 0;
                    var centerLng = 0;

                    for (_i = 0, _len = coords.length; _i < _len; _i++) {
                      coord = coords[_i];
                      centerLat += coord[0];
                      centerLng += coord[1];
                    }

                /*
                    north = 44.1;
                    south = -9.9;
                    east = -22.4;
                    west = 55.2;
                    x_center = x_left + (x_right - x_left) / 2
                    y_center = y_bottom + (y_top - y_bottom) / 2*/

                    centerLat = centerLat / coords.length;
                    centerLng = centerLng / coords.length;

                    // Build json object and broadcast it
                    var outputPoint = {"lat": centerLat,"lng": centerLng,"place":data.place.full_name,"url": data.user.profile_image_url,"userName":data.user.screen_name,"location":data.user.location,"text":data.text,"lang":data.user.lang,"time_zone":data.user.time_zone};
                    socket.broadcast.emit("twitter-stream", outputPoint);

                  }
                }
              }

              stream.on('limit', function(limitMessage) {
                return console.log(limitMessage);
              });

              stream.on('warning', function(warning) {
                return console.log(warning);
              });

              stream.on('disconnect', function(disconnectMessage) {
                return console.log(disconnectMessage);
              });
          });
      });
    }
  });

    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
    socket.emit("connected");
});


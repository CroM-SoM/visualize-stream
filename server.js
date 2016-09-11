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

var twitter = require('twitter'),
    http = require('http'),

    io = require('socket.io').listen(server);

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



models.sequelize.query('CREATE EXTENSION IF NOT EXISTS hstore').then(function () {
    models.sequelize.sync().then(function () {
        console.log('Database ready!');
    });
});

//Create web sockets connection.

var center = function(arr){
    var minX, maxX, minY, maxY;
    for(var i=0; i< arr.length; i++){
        minX = (arr[i][0] < minX || minX == null) ? arr[i][0] : minX;
        maxX = (arr[i][0] > maxX || maxX == null) ? arr[i][0] : maxX;
        minY = (arr[i][1] < minY || minY == null) ? arr[i][1] : minY;
        maxY = (arr[i][1] > maxY || maxY == null) ? arr[i][1] : maxY;
    }
    return [(minX + maxX) /2, (minY + maxY) /2];
}

io.sockets.on('connection', function (socket) {

    socket.on("start tweets", function () {

        if (stream === null) {
            //Amsterdam
            //North Latitude: 52.430950 South Latitude: 52.318274 East Longitude: 5.068373 West Longitude: 4.728856
            //Connect to twitter stream passing in filter for entire world. 52.430950, 52.318274, 52.318274, 4.728856
            twit.stream('statuses/filter', {'locations': '4.734421,52.290423,4.975433,52.431065'}, function (s) {
                stream = s;
                stream.on('data', function (data) {
                    // Does the JSON result have coordinates
                    console.log("Data coming :" + JSON.stringify(data));
                    //logger.Stream('info', JSON.stringify(data));

                    models.sequelize.transaction(function (t) {
                        if(data.coordinates != null){
                            cords=data.coordinates.coordinates
                        }
                        return models.stream.create({
                     /*           created_at: data.created_at,
                                text: data.text,
                                id_str: data.id_str,
                                name: data.user.name,
                                screen_name: data.user.screen_name,
                                location: data.user.location,
                                description: data.user.description,
                                time_zone: data.user.time_zone,
                                geo_enabled: data.user.geo_enabled,
                                lang: data.user.lang,
                                coordinates: cords,
                                place_type: data.place.place_type,
                                place_name: data.place.name,
                                place_full_name: data.place.full_name,
                                place_country_code: data.place.country_code,
                                place_country: data.place.country,
                                bounding_box_type: data.place.bounding_box.type,
                                bounding_coordinates: data.place.bounding_box.coordinates,
                                bounding_attributes: data.place.bounding_box.attributes,
                                timestamp_ms: data.place.bounding_box.timestamp_ms,*/
                                row: data
                            }
                            , {transaction: t}).then(function (stream) {
                            logger.Stream('info', stream.id_str);
                        });
                    });


                    if (data.coordinates) {
                        if (data.coordinates !== null) {
                            //If so then build up some nice json and send out to web sockets
                            var outputPoint = {
                                "lat": data.coordinates.coordinates[0],
                                "lng": data.coordinates.coordinates[1],
                                "place": data.place.full_name,
                                "url": data.user.profile_image_url,
                                "userName": data.user.screen_name,
                                "location": data.user.location,
                                "text": data.text,
                                "lang": data.user.lang,
                                "time_zone": data.user.time_zone
                            };

                            socket.broadcast.emit("twitter-stream", outputPoint);

                            //Send out to web sockets channel.
                            socket.emit('twitter-stream', outputPoint);
                        }
                        else if (data.place) {
                            if (data.place.bounding_box.type === 'Polygon') {

                                // Calculate the center of the bounding box for the tweet

                                /*var tt= [[[4.7289,52.278227],[4.7289,52.431229],[5.079207,52.431229],[5.079207,52.278227]]]
                                var coord_ = center(tt[0]);
                                for(var i=0;i<coord_.length;i++){
                                    console.log("[]"+coord_[i]);
                                }
                                */

                                var coord = data.place.bounding_box.coordinates
                                var coord_mean = center(coord[0]);

                                console.log("[]"+coord_mean);

                                centerLat = centerLat / coords.length;
                                centerLng = centerLng / coords.length;

                                // Build json object and broadcast it
                                var outputPoint = {
                                    "lat": coord_mean[0],
                                    "lng": coord_mean[1],
                                    "place": data.place.full_name,
                                    "url": data.user.profile_image_url,
                                    "userName": data.user.screen_name,
                                    "location": data.user.location,
                                    "text": data.text,
                                    "lang": data.user.lang,
                                    "time_zone": data.user.time_zone
                                };
                                socket.broadcast.emit("twitter-stream", outputPoint);

                            }
                        }
                    }

                    stream.on('limit', function (limitMessage) {
                        return console.log(limitMessage);
                    });

                    stream.on('warning', function (warning) {
                        return console.log(warning);
                    });

                    stream.on('disconnect', function (disconnectMessage) {
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
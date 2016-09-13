var logger = require('../services/logger.js')
var models = require('../models');

//Setup twitter stream api
var twitter = require('twitter')
var twit = new twitter({
    consumer_key: 'aIiEO0MSjEMBcOr7oicfaGFyQ',
    consumer_secret: 'BEGDT8LGgsctelJkf3RuRxPdDbj5AHV8IbZC2c3dtcGCW9MPWP',
    access_token_key: '519395465-7R4UKVRCi2MuIJVX2ECW8rttVReXg1XGlwuWAcWo',
    access_token_secret: 'Tp3g7sOwnNxbvBYdq8reQMVKpIR0DXtCltMFl9dpkLQ0c'
  }),
  stream = null;

var service = module.exports = {

  streamUser:function(id){

  },

  startStream: function () {

    twit.stream('statuses/filter', {'locations': '4.734421,52.290423,4.975433,52.431065'}, function (s) {
      stream = s;
      stream.on('data', function (data) {
        // Does the JSON result have coordinates
        console.log("Data coming :" + JSON.stringify(data));
        //logger.Stream('info', JSON.stringify(data));

        models.sequelize.transaction(function (t) {
          if (data.coordinates != null) {
            cords = data.coordinates.coordinates
          }
          return models.stream.create({
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

              console.log("[]" + coord_mean);

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
            }
          }
        }

        stream.on('limit', function (limitMessage) {
          console.log("Limit 420 API :P");
          return console.log(limitMessage);
        });

        stream.on('warning', function (warning) {
          return console.log(warning);
        });

        stream.on('disconnect', function (disconnectMessage) {
          return console.log(disconnectMessage);
        });

        stream.on('error', function (error) {
          console.log("Limit 420 API :@:");
          return console.log(error);
        });


      });
    });

  }
}

var center = function (arr) {
  var minX, maxX, minY, maxY;
  for (var i = 0; i < arr.length; i++) {
    minX = (arr[i][0] < minX || minX == null) ? arr[i][0] : minX;
    maxX = (arr[i][0] > maxX || maxX == null) ? arr[i][0] : maxX;
    minY = (arr[i][1] < minY || minY == null) ? arr[i][1] : minY;
    maxY = (arr[i][1] > maxY || maxY == null) ? arr[i][1] : maxY;
  }
  return [(minX + maxX) / 2, (minY + maxY) / 2];
}

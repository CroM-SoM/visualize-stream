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

  twitterAPI:twit,

  streamUser:function(id){

  },

  startStream: function () {
    twit.stream('statuses/filter', {'locations': '4.734421,52.290423,4.975433,52.431065'}, function (s) {
      stream = s;
      stream.on('data', function (data) {
        // Does the JSON result have coordinates
        //console.log("Data coming :" + JSON.stringify(data));
        console.log(data.text);
        //logger.Stream('info', JSON.stringify(data));
        var statusObj = {status: "Hi @" + data.user.screen_name + ", Welcome to CroMSoM!"}

        //call the post function to tweet something
       /* twit.post('statuses/update', statusObj,  function(error, tweetReply, response){
          //if we get an error print it out
          if(error){
            console.log(error);
          }

          //print the text of the tweet we sent out
          console.log(tweetReply.text);
        });
        */

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
      });

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

  }
}

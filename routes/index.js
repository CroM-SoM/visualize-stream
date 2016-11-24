/**
 * Created by a.kabakibi on 8/1/2016.
 */

var fs = require('fs');


var express = require('express');
var path = require('path'),
  rootPath = path.normalize(__dirname + '/../'),
  router = express.Router();

var streamService = require('../services/streamer.js')

var logger = require('../services/logger.js')
var models = require('../models');

var request = require('request');

//API
module.exports = function (app) {

  app.use('/', router);

  try {
    streamService.startStream();
  } catch (e) {
    console.log("@@" + e)
  }

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('*', function (req, res) {
    // load the single view file (angular will handle the page changes on the front-end)
    //console.log("@: "+path.join(__dirname, '../dist', 'index.html'));
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });


  router.get('/stream/between/:Rang1/:Rang2', function (req, res) {
    models.stream.findAll({
      where: {id: {$between: [req.params.Rang1, req.params.Rang2]}},
      raw: true
    }).then(function (rows) {
      res.json(StreamFormat(rows));
    })
  });

  router.get('/stream/spotlight/:Text', function (req, res) {
    //  console.log("Spotlight " + req.params.Text)
    request.post(
      'http://cromsom.nl:2222/rest/annotate/',
      {
        headers: {
          'Accept': 'application/json'
        },
        form: {
          text: req.params.Text,
          confidence: 0.5
        }
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          //console.log("res @ " + body);
          res.json({Spotlight: JSON.parse(body)});
        }
        else
          console.log("error @ " + error + " : " + JSON.stringify(response) + " : " + body)
      }
    );

  });


// TODO: below is Hannes' mess

  function getStuff(spotlightObj) {
    var resources = []
    var classes = []

    if (!spotlightObj.Spotlight.Resources) {
      console.warn('no resources in ', spotlightObj)
      return ({resources: resources, classes: classes})
    }

    spotlightObj.Spotlight.Resources.map(function (e) {
      if (resources.indexOf(e['@URI']) < 0) {
        resources.push(e['@URI'])

      }
      var typeArr = e['@types'].split(',').map(function (t) {
        if (t.trim() != '' && classes.indexOf(t) < 0) {
          classes.push(t)
        }
      })

    });
    return ({resources: resources, classes: classes})
  }


  function intersect_safe(a, b) {
    var ai = 0, bi = 0;
    var result = [];

    while (ai < a.length && bi < b.length) {
      if (a[ai] < b[bi]) {
        ai++;
      }
      else if (a[ai] > b[bi]) {
        bi++;
      }
      else /* they're equal */
      {
        result.push(a[ai]);
        ai++;
        bi++;
      }
    }

    return result.length;
  }

// TODO:  0.5 is a guess
  function similarity(stuffa, stuffb) {
    return intersect_safe(stuffa.resources, stuffb.resources) + 0.5 * intersect_safe(stuffa.classes, stuffb.classes)
  }

  var events = JSON.parse(fs.readFileSync('events.JSON', 'utf8'));

  var events2 = []

// TODO: this could be cached in a DB table but does not have to be

  events.items.concept.map(function (concept) {
    // console.log(concept)
    if (!concept.tours) {
      return;
    }
    concept.tours.map(function (tour) {
      if (!tour.events) {
        return;
      }
      tour.events.map(function (event) {

        var eventstr = concept.desc + ' ' + concept.short_text + ' ' + tour.desc + ' ' + event.long_desc;

        request.get(
          'http://localhost:8080/stream/spotlight/' + encodeURIComponent(eventstr),
          function (error, response, body) {
            if (!error && response.statusCode == 200) {

              events2.push({event: event, sets: getStuff(JSON.parse(body))})

            }
            else
              console.log("error @ " + error + " : " + JSON.stringify(response) + " : " + body)
          }
        );
      });
    });
  });


//var mstuff = {'gouda' : getStuff(}


// tweet text goes in here returns events plus rankings

  router.post('/stream/similarity/:Text', function (req, res) {

    // var mstuff = {'gouda' : getStuff(JSON.parse(fs.readFileSync('/Users/hannes/Desktop/gouda.json', 'utf8')))}

    request.get(
      'http://localhost:8080/stream/spotlight/' + encodeURIComponent(req.params.Text),
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var ret = [];
          var thisreq_sets = getStuff(JSON.parse(body));
          events2.map(function (event) {
            event.similarity = similarity(thisreq_sets, event.sets)
            if (event.similarity > 0) {
              ret.push(event);
            }
            console.log(event);
          })

          if(ret.length>0){

            var statusObj = {status:req.body.user_name.screen_name+" , "+ret[0].event.place}
            //call the post function to tweet something
            streamService.twitterAPI.post('statuses/update', statusObj, function (error, tweetReply, response) {
              if (!error) {
                console.log("##"+{response: response, tweetReply: tweetReply});
                //res.json({response: response, tweetReply: tweetReply});
              }
            })

            models.suggestions.create({
              user_id: req.body.user_id,
              tourist: req.body.tourist,
              event: ret
            }).then(function (results) {
            })

          }else{
            models.suggestions.create({
              user_id: req.body.user_id,
              tourist: req.body.tourist,
              event: ret
            }).then(function (results) {
            })
          }

          res.json({text: req.params.Text, similar_events: ret});

        }
        else {
          console.log("error @ " + error + " : " + JSON.stringify(response) + " : " + body)
          res.json(response);
        }
      }
    );


  });

  // End of Hannes' mess

  router.get('/stream/wiki/:Text', function (req, res) {
    // console.log("Spotlight " + req.params.Text)
    request.get(
      'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + req.params.Text + '&limit=5&namespace=0&format=json',
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          //console.log("res @ " + body);
          res.json({Spotlight: JSON.parse(body)});
        }
        else
          console.log("error @ " + error + " : " + JSON.stringify(response) + " : " + body)
      }
    );

  });

  //var day = 24 * 60 * 60 * 1000;
  //var week = day*7;
  router.get('/stream/days/:Days', function (req, res) {
    models.stream.findAll({
      where: {
        "row.timestamp_ms": {
          $overlap: [new Date(), new Date(new Date() - (24 * 60 * 60 * 1000) * req.params.Days)]
        }
      }
    }).then(function (rows) {
      res.json({count: rows.length, data: rows});
    })
  });

  router.get('/stream/data/user/:userID', function (req, res) {
    models.stream.findAll({
      where: {
        "row.user.id": req.params.userID
      }
    }).then(function (rows) {
      res.json({count: rows.length, data: rows});
    })
  });

  router.get('/stream/api/user/:userID/:Ntimes', function (req, res) {

    streamService.twitterAPI.get('statuses/user_timeline', {
      user_id: req.params.userID,
      count: req.params.Ntimes
    }, function (error, tweets, response) {
      if (!error) {
        res.json({count: tweets.length, data: tweets});
      }
    });
  });

  router.get('/stream/api/user/:userID', function (req, res) {

    streamService.twitterAPI.get('statuses/user_timeline', {user_id: req.params.userID}, function (error, tweets, response) {
      if (!error) {
        res.json({count: tweets.length, data: tweets});
      }
    });
  });

  router.post('/stream/api/user/suggestion', function (req, res) {

    var statusObj = {status: req.body.event}
    //call the post function to tweet something
    streamService.twitterAPI.post('statuses/update', statusObj, function (error, tweetReply, response) {
      if (!error) {
        console.log({response: response, tweetReply: tweetReply});
        res.json({response: response, tweetReply: tweetReply});
      }
    });

  });


  router.post('/stream/save', function (req, res) {
    console.log("POST");
    console.log(req.body.row + " " + req.body.result_1 + " " + req.body.result_2 + " " + req.body.result_3)

    models.analysis.create({
      row: req.body.row,
      result_1: req.body.result_1,
      result_2: req.body.result_2,
      result_3: req.body.result_3,
    }).then(function (results) {
      res.json({success: true, data: results});
    });
  });

  router.post('/stream/suggestion', function (req, res) {
    console.log("POST");
    models.suggestions.create({
      user_id: req.body.user_id,
      tourist: req.body.tourist,
      event: req.body.event
    }).then(function (results) {
      res.json({success: true, data: results});
    })
  });


}

var StreamFormat = function (data) {
  var coordinatesArray;
  var stream = []
  for (var i = 0; i < data.length; i++) {

    if (data[i].row.coordinates == null) {
      if (data[i].row.place) {
        if (data[i].row.place.bounding_box.type === 'Polygon') {
          var coord = data[i].row.place.bounding_box.coordinates
          var coord_mean = center(coord[0]);
          coordinatesArray = coord_mean;
        }
      }
    } else {
      coordinatesArray = data[i].row.coordinates;
    }

    stream.push({
      id: data[i].row.id,
      id_str: data[i].row.id_str,
      text: data[i].row.text,
      coordinates: coordinatesArray,
      user: {
        id: data[i].row.user.id,
        id_str: data[i].row.user.id_str,
        location: data[i].row.user.location,
        name: data[i].row.user.name,
        screen_name: data[i].row.user.screen_name,
        time_zone: data[i].row.user.time_zone,
        lang: data[i].row.user.lang,
        profile_background_image_url: data[i].row.user.profile_background_image_url
      },
      place: {
        id: data[i].row.place.id,
        type: data[i].row.place.type,
        name: data[i].row.place.name,
        full_name: data[i].row.place.full_name,
        country_code: data[i].row.place.country_code,
        country: data[i].row.place.country
      }
    })

  }
  return stream;
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

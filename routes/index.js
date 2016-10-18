/**
 * Created by a.kabakibi on 8/1/2016.
 */

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

    request(
      {
        method: 'POST',
        url: 'http://spotlight.sztaki.hu:2222/rest/annotate/'+req.params.Text,
        headers: {
          'Accept':'application/json'
        },
        form: {confidence:'0.35'}
      }, function (error, response, body) {
        if (!error && response.statusCode == 200)
          console.log("res @ "+body)
        else
          console.log("error @ "+error+" : "+ JSON.stringify(response)+" : "+ body)
      })
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


  router.post('/stream/save', function (req, res) {
    console.log("POST");
    console.log(req.body.row+" "+req.body.result_1+" "+req.body.result_2+" "+req.body.result_3)

    models.analysis.create({
         row:req.body.row,
         result_1: req.body.result_1,
         result_2: req.body.result_2,
         result_3:req.body.result_3,
      }).then(function (results) {
         res.json({success: true, data: results});
      });
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

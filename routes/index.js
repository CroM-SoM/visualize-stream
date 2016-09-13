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

//API
module.exports = function (app) {

  app.use('/', router);

  streamService.startStream();

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
      res.json(rows);
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

}

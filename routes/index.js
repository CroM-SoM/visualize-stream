/**
 * Created by a.kabakibi on 8/1/2016.
 */

var express = require('express');
var path = require('path'),
    rootPath = path.normalize(__dirname + '/../'),
    router = express.Router();

var fs = require('fs'),
    readline = require('readline');
var walk = require('walk');
var files = [];
var lineReader = [];
var json = [];

var logger = require('../services/logger.js')
var models = require('../models');

var checkLogs = function (callback) {
    console.log('checking logs ... every 20 sec');

// Walker options
    var walker = walk.walk('logs', {followLinks: false});

    walker.on('file', function (root, stat, next) {
        // Add this file to the list of files
        files.push(root + '/' + stat.name);
        next();
    });

    walker.on('end', function () {

        for (var x in files) {
            var fileName = files[x];
            lineReader[x] = readline.createInterface({
                input: fs.createReadStream(fileName),
                output: process.stdout,
                terminal: false
            });

            lineReader[x].on('line', function (line) {
                // handle line of every fileName
                json.push(line);
            });
        }
    });
}

/*
checkLogs();
//setInterval(checkLogs,1200000);
var jsonData = []
for (var i = 0; i < json.length; i++) {
    jsonData.push(JSON.parse(JSON.parse(json[i]).message));
}
models.sequelize.transaction(function (t) {
    return models.stream.create({
            row: jsonData
        }
        , {transaction: t}).then(function (stream) {
        logger.Stream('info', stream.id_str);
    });
});*/


//API
module.exports = function (app) {
    app.use('/', router);


    router.get('/stream/top', function (req, res) {
        models.stream.findAll().then(function (rows) {
            res.json(rows);
        })
    });

    router.get('/data', function (req, res) {
        models.stream.findAll().then(function (rows) {
            res.json(rows);
        })
    });

}
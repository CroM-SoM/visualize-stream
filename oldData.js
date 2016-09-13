
var logger = require('./services/logger.js')
var models = require('./models');

var fs = require('fs'),
  readline = require('readline');
var walk = require('walk');
var files = [];
var lineReader = [];
var json = [];


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
        callback(line);
      });
    }
  });
}

checkLogs(function (line) {
  models.sequelize.transaction(function (t) {
    return models.stream.create({
        row: JSON.parse(JSON.parse(line).message)
      }
      , {transaction: t}).then(function (stream) {
      console.log("Done: " + stream)
    });
  });
});

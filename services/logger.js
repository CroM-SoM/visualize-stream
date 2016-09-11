var winston = require('winston'),
    fs = require('fs'),
    logDir = 'logs', moment = require('moment'),
    logger, path = require('path');

winston.setLevels(winston.config.npm.levels);
winston.addColors(winston.config.npm.colors);
var foldernames = {
    Stream: 'Stream',
    System: 'System',
    Debugger: 'Debugger'
}

var folderStream = path.join(logDir, foldernames.Stream)
var folderSystem = path.join(logDir, foldernames.System)
var folderDebugger = path.join(logDir, foldernames.Debugger)


// Create the directory if it does not exist
if (!fs.existsSync(logDir))fs.mkdirSync(logDir);
if (!fs.existsSync(folderStream)) fs.mkdirSync(folderStream);
if (!fs.existsSync(folderSystem))    fs.mkdirSync(folderSystem);
if (!fs.existsSync(folderDebugger))    fs.mkdirSync(folderDebugger);

var debug = new winston.Logger({
    levels: {
        info: 'info'
    },
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            }, level: 'info', colorize: true
        })
    ]
});
debug.configure({
    level: 'verbose',
    transports: [
        new (require('winston-daily-rotate-file'))({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
            filename: 'debug',
            dirname: folderDebugger,
            datePattern: 'yyyyMMdd.log',
            level: 'info',
            /*maxFiles: 2, maxsize: 10485760, colorize: true, tailable: true,
             json: true,*/
            exitOnError: false
        })
    ]
});


var info = new winston.Logger({
    levels: {
        info: 'info'
    },
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            }, level: 'info', colorize: true
        })
    ]
});
info.configure({
    level: 'verbose',
    transports: [
        new (require('winston-daily-rotate-file'))({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
            filename: 'info',
            dirname: folderSystem,
            datePattern: 'yyyyMMdd.log',
            level: 'info',
            /*maxFiles: 2, maxsize: 10485760, colorize: true, tailable: true,
             json: true,*/
            exitOnError: false
        })
    ]
});


var Error = new winston.Logger({
    levels: {
        info: 'error'
    },
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            }, level: 'info', colorize: true
        })
    ]
});
Error.configure({
    level: 'verbose',
    transports: [
        new (require('winston-daily-rotate-file'))({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
            filename: 'error',
            dirname: folderSystem,
            datePattern: 'yyyyMMdd.log',
            level: 'info',
            /*maxFiles: 2, maxsize: 10485760, colorize: true, tailable: true,
             json: true,*/
            exitOnError: false
        })
    ]
});

var Stream = new winston.Logger({
    levels: {
        info: 'info'
    },
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            }, level: 'info', colorize: true
        })
    ]
});

Stream.configure({
    level: 'verbose',
    transports: [
        new (require('winston-daily-rotate-file'))({
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
            filename: 'Stream',
            dirname: folderStream,
            datePattern: 'yyyyMMdd.log',
            level: 'info',
            /*maxFiles: 2, maxsize: 10485760, colorize: true, tailable: true,
             json: true,*/
            exitOnError: false
        })
    ]
});

var exports = {
    winston: winston,
    debug: function (msg) {
        debug.info(msg);
    },
    info: function (msg) {
        if (!global.blHasConsoleOutput && info.transports['console'] != null) info.remove(winston.transports.Console)
        info.info(msg);
    },
    error: function (msg) {
        Error.error(msg);
    },
    Stream: function (msg) {
        if (!global.blHasConsoleOutput && Stream.transports['console'] != null) Stream.remove(winston.transports.Console)
        Stream.info(msg);
    }
}
module.exports = exports;
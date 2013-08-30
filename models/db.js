var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongo').Connection;
var Server = require('mongo').Server;

module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {}));














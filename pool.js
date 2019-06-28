//load modules
var mysql = require('mysql');
var config = require('./config').database;

var pool = mysql.createPool({
    connectionLimit : 50,
    socketPath : config.socketPath,
    user       : config.user,
    password   : config.password,
    database   : config.database,
});

module.exports = pool;
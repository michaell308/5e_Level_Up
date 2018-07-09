//load modules
var mysql = require('mysql');
var config = require('./config').database;

var pool = mysql.createPool({
    connectionLimit : 50,
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database
});

module.exports = pool;
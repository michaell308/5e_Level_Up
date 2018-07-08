var port = process.env.PORT || 3000,
    express = require('express'),
    app = express(),
    path = require("path"),
    bodyParser = require('body-parser'),
    urlencodedParser = bodyParser.urlencoded({ extended:false }),
    mysql = require('mysql'),
    config = require('./config');

app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.json());


app.post('/', urlencodedParser, function(req,res) {
    console.log(req.body);
    console.log(req.body.level);
    console.log(req.body.class);
    /*var connection = mysql.createConnection({
    host : '',
    user : '',
    password : '',
    database : ''
    });*/
    var connection = mysql.createConnection(config.database);
    connection.connect();
    connection.query('SELECT id FROM test_table', function (err, rows, fields) {
      if (err) throw err;
      res.send(JSON.stringify(rows[0].id));
      connection.end();
    })
});

app.listen(port, function() {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});

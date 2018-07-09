var port = process.env.PORT || 3000,
    express = require('express'),
    app = express(),
    path = require("path"),
    bodyParser = require('body-parser'),
    urlencodedParser = bodyParser.urlencoded({ extended:false }),
    pool = require('./pool');

app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.json());


app.post('/', urlencodedParser, function(req,res) {
    console.log(req.body);
    console.log(req.body.level);
    console.log(req.body.class);
    pool.query('SELECT id FROM test_table', function(err, rows, fields) {
      if (err) throw err;
      console.log(rows[0].id);
    });
});

app.listen(port, function() {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});

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
    if (req.body.level !== undefined) {
        pool.query('CALL level_up(?,?)',[req.body.class, req.body.level], function(err, rows, fields) {
          if (err) throw err;
          res.send(rows[0][0]);
        });
    }
    else if (req.body.feature !== undefined) {
        pool.query('CALL get_feature(?)',req.body.feature, function(err, rows, fields) {
          if (err) throw err;
          res.send(rows[0][0]);
        });
    }
});

app.listen(port, function() {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});

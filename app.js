var port = process.env.PORT || 3000,
    express = require('express'),
    app = express(),
    path = require("path"),
    bodyParser = require('body-parser'),
    urlencodedParser = bodyParser.urlencoded({ extended:false }),
    pool = require('./pool');

app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.json());

var classes = ["Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger",
 "Rogue", "Sorcerer", "Warlock", "Wizard"];
app.post('/', urlencodedParser, function(req,res) {
    if (req.body.level !== undefined) {
        var level = req.body.level;
        if (isNaN(level) || level % 1 !== 0) {
            res.send("Error: Level is not a number");
        } 
        else if (level === "" || level < 1 || level > 19) {
            res.send("Error: Level should be between 1-19")
        }
        else if (!classes.includes(req.body.class)) {
            res.send("Error: Invalid class");
        }
        else {
            pool.query('CALL level_up(?,?)',[req.body.class, parseInt(level)+1], function(err, rows, fields) {
              if (err) throw err;
              res.send(rows[0][0]);
            });
        }
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

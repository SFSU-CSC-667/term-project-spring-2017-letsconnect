var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

// Setting up module for PostgreSQL to be utilized in NodeJS
var pg = require('pg');
pg.defaults.ssl = true;

var conString = (process.env.DATABASE_URL);
var sess;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/land', function(request, response) {
  response.render('pages/land');
});

app.post('/land', function(req, res){
  pg.connect(conString, function(err, client, done) {
	    if (err) {
	      return console.error('error fetching client from pool', err);
	    }
	    console.log("connected to database");

	    client.query('INSERT INTO temp_user(id, fname, lname) VALUES(DEFAULT, $1, $2)', [req.body.fname, req.body.lname], function(err, result) {

	      if (err) {
	        return console.error('error running query', err);
	      }
        done();
	      res.redirect('/db');
	    });
	});
});

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM temp_user', function(err, result) {
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
      done();
    });
  });
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.get('/times', function(request, response) {
    var result = ''
    var times = process.env.TIMES || 5
    for (i=0; i < times; i++)
      result += i + ' ';
  response.send(result);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

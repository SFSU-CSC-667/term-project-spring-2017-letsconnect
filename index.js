var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

var pg = require('pg');
pg.defaults.ssl = true;
var conString = (process.env.DATABASE_URL);
var sess;


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// app.use(morgan('dev'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/land', function(request, response) {
  response.render('pages/land');
});

app.post('/land', function(request, response){
  pg.connect(conString, function(err, client, done) {
	    if (err) {
	      return console.error('error fetching client from pool', err);
	    }
	    console.log("connected to database");

	    client.query('INSERT INTO temp_user(fname, lname) VALUES($1, $2)', [req.body.fname, req.body.lname], function(err, result) {
	      done();
	      if (err) {
	        return console.error('error running query', err);
	      }

	      res.redirect('/db');
	    });
	});
});

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
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

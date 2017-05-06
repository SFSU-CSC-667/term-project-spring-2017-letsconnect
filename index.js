// var cool = require('cool-ascii-faces');
var express = require('express');
var bodyParser = require('body-parser');
var socketIO = require('socket.io');
var path = require('path');
var logger = require('morgan');
var app = express();
// Setting up module for PostgreSQL to be utilized in NodeJS
var pg = require('pg');
pg.defaults.ssl = true;
// Setting up crypto for hashing
var crypto = require('crypto');
var hash = crypto.createHash('sha256');
var sess;

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/', function(req, res){

  // for registering an account
  console.log("Request body: " + req.body);
  console.log("First name: "+ req.body.fname);
  console.log("Last name:" + req.body.lname);
  console.log("Database URL: " + process.env.DATABASE_URL);

  var fname = req.body.fname;
  var lname = req.body.lname;
  var username = req.body.username;
  var email = req.body.remail;
  var password = req.body.rpassword;
  var confpass = req.body.rconfirmpassword;
    
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");

    client.query('INSERT INTO users (id, first_name, last_name, username, email, password) VALUES (DEFAULT,$1, $2, $3, $4, $5)', [fname, lname, username, email, password]function(err, result) {

      if (err) {
        return console.error('error running query', err);
      }
      done();
      res.redirect('/db');
    });
  });
});

app.get('/land', function(request, response) {

  response.render('pages/land');

});

app.post('/land', function(req, res){

  console.log("Request body: " + req.body);
  console.log("First name: "+ req.body.fname);
  console.log("Last name:" + req.body.lname);
  console.log("Database URL: " + process.env.DATABASE_URL);

  var fname = req.body.fname;
  var lname = req.body.lname;
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");

    client.query('INSERT INTO temp_user VALUES(DEFAULT, $1, $2)', [fname, lname], function(err, result) {

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

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

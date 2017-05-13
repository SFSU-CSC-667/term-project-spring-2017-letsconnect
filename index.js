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

  console.log("Request body: " + req.body);
  console.log("first_name: "+ req.fname);
  console.log("last_name:" + req.body.lname);
  console.log("Database URL: " + process.env.DATABASE_URL);

  var fname = req.body.fname;
  var lname = req.body.lname;
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");

    client.query('INSERT INTO users VALUES(DEFAULT, $1, $2)', [fname, lname], function(err, result) {

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

    client.query('INSERT INTO users VALUES(DEFAULT, $1, $2)', [fname, lname], function(err, result) {

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
    client.query('SELECT * FROM users', function(err, result) {
      if (err)
      { console.error(err); response.send("Error " + err); }
      else
      { response.render('pages/db', {results: result.rows} ); }
      done();
    });
  });
});


app.get('/editprofile', function(request, response) {
  response.render('pages/editprofile');
});


app.post('/editprofile', function(req, res){

  console.log("Request body: " + req.body);
  console.log("First name: "+ req.body.fname);
  console.log("Last name:" + req.body.lname);
  console.log("Username:" + req.body.uname);
  console.log("Email:" + req.body.email);
  console.log("Database URL: " + process.env.DATABASE_URL);
  
 
  
  var fname = req.body.fname;
  var lname = req.body.lname;
  var uname = req.body.uname;
  var email = req.body.email;
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('UPDATE users SET username = ($1), email = ($2), first_name = ($3), last_name = ($4) WHERE id = ($5)', [uname, email, fname, lname, 2], function(err, result) {

      if (err) {
        return console.error('error running query', err);
      }
      done();
      res.redirect('/db');
    });
  });
});

 


app.get('/deleteprofile', function(request, response) {
  response.render('pages/deleteprofile');
});



app.post('/deleteprofile', function(req, res){

  console.log("Request body: " + req.body);
  console.log("Username:" + req.body.uname);
  console.log("Database URL: " + process.env.DATABASE_URL);
  
  const data = {uname: req.body.uname};
  
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('DELETE users WHERE username = ($1)', [data.uname], function(err, result) {

      if (err) {
        return console.error('error running query', err);
      }
      done();
      res.redirect('/db');
    });
  });
});





app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

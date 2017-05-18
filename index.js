// var cool = require('cool-ascii-faces');
var express = require('express');
var bodyParser = require('body-parser');
var socketIO = require('socket.io');
var path = require('path');
var logger = require('morgan');
var pg = require('pg');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var app = express();

// Setting up module for PostgreSQL to be utilized in NodeJS

pg.defaults.ssl = true;

// Setting up crypto for hashing
// algorithm: sha256
// encoding type: utf-8
// format for the hash: hex
var crypto = require('crypto');
var hash = crypto.createHash('sha256');

// set up sessions
app.set('trust proxy', 1);

app.use(session({
  store: new (require('connect-pg-simple')(session))(),
  conString: process.env.DATABASE_URL,
  secret: "some secret",
  resave: false,
  cookie: { maxAge: 60 * 60 * 1000 } // 30 days 
}));


var sess;

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  sess = request.session;
  response.render('pages/index');
});

app.post('/', function(request, response){

  // for registering an account
  console.log(request.body);
  console.log("First name: "+ request.body.fname);
  console.log("Last name:" + request.body.lname);
  console.log("Database URL: " + process.env.DATABASE_URL);

  var fname = request.body.fname;
  var lname = request.body.lname;
  var username = request.body.username;
  var email = request.body.remail;
  var password = request.body.rpassword;

  // hash password
  var hash = require('crypto')
    .createHash('sha256')
    .update(password, 'utf-8')
    .digest('hex');

      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");

    client.query('INSERT INTO users VALUES(DEFAULT, $1, $2 ,$3, $4, $5)', [username, email, hash,fname, lname], function(err, result) {

      if (err) {
        return console.error('error running query', err);
      }

      sess = request.session;
      sess.email = email;
      sess.username = username;

      done();
      res.redirect('/db');
    });
  });
});

app.post('/land', function(req, res){

  console.log("Request body: " + req.body);
  console.log("email: "+ req.body.logemail);
  console.log("password:" + req.body.logpassword);
  console.log("Database URL: " + process.env.DATABASE_URL);

  var email = req.body.logemail;
  var password = req.body.logpassword;
  var username;

  var hash = require('crypto')
    .createHash('sha256')
    .update(password, 'utf-8')
    .digest('hex');

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database in land");

    var query = client.query('SELECT username AS username, id AS id FROM users WHERE email = $1 AND password = $2', [email, hash], function(err, result) {

      query.on("row", function (row, result){
        result.addRow(row);
        username = rwo.username;
      });
      query.on("end", function (result) {
        client.end();
      });

      if (err) {
        return console.error('error running query', err);
      }
      
      if(result.rowCount ===1){
        console.log(result.rows);
        // set up a session
        sess = req.session;
        sess.email = email;
        sess.username = result.rows[0].username;
        sess.userid = result.rows[0].id;
        console.log("session information")
        console.log(sess.email);
        console.log(sess.username);
        console.log(sess.userid);
        done();
        res.redirect('/db');
      }else{
        console.log('No match.:(')
        done(); 
        res.redirect('/');
      }
      
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

app.get('/logout', function(request,response){
  // end session, route to /
  
  sess = request.session;
  if(sess.email){
    // destroy session
    request.session.destroy(function(err){
      if(err){
        console.log(err);
      }else{
        res.redirect('/');
      }
    })
  };
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


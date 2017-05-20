const express = require( 'express' );
const router = express.Router();

var pg = require('pg');
pg.defaults.ssl = true;

var sess;
var logged = false;

router.get( '/', ( request, response ) => {
  sess = request.session;
  console.log(sess);
  if(sess.email){
    logged = true;
    response.render('lobby', {logged: logged});
  }
  else{
    logged = false;
    response.render('loggedout', {logged: logged});
  }
  //response.render( 'index' );
});

router.post('/', function(request, response){

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

      client.end();
      done();
      logged = true;
      res.redirect('/lobby');
    });
  });
});

router.get('/test-a', function(request, response){
  response.render('test-a', {logged: logged});
});

router.post('/test-a', function(request, response){
  console.log("Inside post.");
  var fname = request.body.fname;
  var lname = request.body.lname;
  var uname = request.body.username;
  var email = request.body.email;
  var pword = request.body.password;
  var gwon = 0;
  var glost = 0;
  var flistid = 0;
  var avatid = 0;

  var today = new Date();
  var joinDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  var hash = require('crypto')
  .createHash('sha256')
  .update(pword, 'utf-8')
  .digest('hex');


  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");

    client.query('INSERT INTO users VALUES(DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 )', [uname, email, hash, fname, lname, avatid, joinDate, gwon, glost, flistid], function(err, result) {

      if (err) {
        return console.error('error running query', err);
      }
      done();
      client.end();
      response.redirect('/login');
    });
  });
});

router.get('/login', function(request,response){
  response.render('login', {logged: logged});
});

router.post('/login', function(request,response){

  console.log(request.body);
  var email = request.body.email;
  var password = request.body.password;

  var hash = require('crypto')
  .createHash('sha256')
  .update(password, 'utf-8')
  .digest('hex');

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database in login");
    var query = client.query('SELECT username AS username, id AS id FROM users WHERE email = $1 AND password = $2', [email, hash], function(err, result) {

      query.on("row", function (row, result){
        result.addRow(row);
        username = row.username;
        client.end();
      });
      query.on("end", function (result) {
        client.end();
      });

      if (err) {
        return console.error('error running query', err);
      }
      if(result.rowCount === 1){
        //Login successful
        console.log(result.rows);
        // set up a session
        sess = request.session;
        sess.email = email;
        sess.username = result.rows[0].username;
        sess.userid = result.rows[0].id;
        console.log("Creating session -- Login successful")
        done();
        logged = true;
        response.redirect('/');
      }else{
        //Login unsuccessful
        console.log('No match.:(')
        done();
        response.redirect('/');
      }
    });
  });
});

router.get('/test-b', function(request, response){
  response.render('test-b', {logged: logged});
});

router.post('/test-b', function(request, response){
  console.log("Inside post.");
  var uname = request.body.username;
  var email = request.body.email;
  var pword = request.body.password;


  var hash = require('crypto')
  .createHash('sha256')
  .update(pword, 'utf-8')
  .digest('hex');

  var sess = request.session;
  if(sess.email){
    logged = true;
    var userid = sess.userid;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }
      console.log("connected to database");

      client.query('DELETE FROM users WHERE users.id = $1 ', [userid], function(err, result) {

        if (err) {
          return console.error('error running query', err);
        }
        done();
        client.end();

        response.redirect('/logout');
      });
    });
  }
  else{
    response.redirect('/test-a');
  }

});

router.get('/test-c', function(request, response){
  response.render('test-c', {logged: logged});
});

router.get('/game', function(request,response){
  response.render('game', {logged: logged});
})

router.get('/db', function(request, response){
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM users', function(err, result) {
      if (err)
      { console.error(err); response.send("Error " + err); }
      else
      { console.log(result.rows); response.render('db', {results: result.rows}); }
      done();
      client.end();
    });
  });
});

router.get('/logout', function(request,response){
  // end session, route to /

  sess = request.session;
  console.log(sess);
  if(sess.email){
    // destroy session
    request.session.destroy(function(err){
      if(err){
        console.log(err);
      }else{
        logged = false;
        console.log("Session destroyed.");
      }
    })
  };
  response.redirect('/');
});

router.get('/lobby', function(request, response){
  console.log("In lobby route.");
  var sess = request.session;
  if(sess.email){
    console.log("Lobby:  Session exists.");
    logged = true;
    var userid = sess.userid;
    var results;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      console.log("Created database connection object.");
      if (err) {
        return console.error('error fetching client from pool', err);
      }
      console.log("connected to database");

      client.query('SELECT from game_users WHERE user_id = $1', [userid], function(err, result) {
        console.log(result);
        if (err) {
          return console.error('error running query', err);
          client.end();
        }
        if(result.rows){

          client.end();
          done();
          response.render('lobby', {results: result.rows});
        }
        else{
          console.log("No active games for this user");
          response.render('lobby', {logged: logged});
        }
      });
    });

  }
  else{
    logged = false;
    response.redirect('/');
  }
});

module.exports = router;

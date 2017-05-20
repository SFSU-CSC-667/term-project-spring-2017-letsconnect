const express = require( 'express' )
const path = require( 'path' )
const favicon = require( 'serve-favicon' )
const logger = require( 'morgan' )
const cookieParser = require( 'cookie-parser' )
const bodyParser = require( 'body-parser' );
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);

const routes = require( './routes/index' )

const app = express()

var crypto = require('crypto');
var hash = crypto.createHash('sha256');
var session = require('express-session');
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

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)

app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
});

// set up sessions
app.set('trust proxy', 1);

app.use(session({
  store: new (require('connect-pg-simple')(session))(),
  conString: process.env.DATABASE_URL,
  secret: "some secret",
  resave: false,
  cookie: { maxAge: 60 * 60 * 1000 } // 30 days
}));

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app

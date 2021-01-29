const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const { User } = require('./db');
// const GoogleStrategy = require("passport-google-oauth");

// We need to make sure our local NODE_ENV variable is in fact set to 'development'
// Node may have actually done this for you when you installed it! If not though, be sure to do that.
if (process.env.NODE_ENV === 'development') {
  require('../secretkey'); // this will mutate the process.env object with your secrets.
}

// Middlewares are functions that have access to the request object (req), the response object (res), and the next middleware function in the application's request-response cycle.

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session middleware (for authentication)
// by default, session information will be stored in memory for the life of your server process.
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'some secret key',
    resave: false,
    saveUninitialized: false
  })
);

// Passport is an authentication middleware for Node that authenticates requests
// initialize passport (* must be after our 'session' middleware)
// initialize() is a middle-ware that initialises Passport.
app.use(passport.initialize());
// // establishes `req.user` for any middleware that runs after it
app.use(passport.session());

//Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.

// serialize user (performed once per session after 'req.login' is invoked)
passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
    // done() is an internal passport function that takes care of supplying user credentials after user has successfully authenticated
  } catch (error) {
    done(error);
  }
});

// deserialize user run every subsequent request that contains a serialized user
passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => done(null, user))
    .catch(done);
});

// you'll of course want static middleware so your browser can request things like your 'bundle.js', css files, and images.
app.use(express.static(path.join(__dirname, '../public')));

// Any routes or other various middlewares should go here!
app.use('/api', require('./api'));
app.use('/auth', require('./auth'));

// Make sure this is right at the end of your server logic!
// (However, if you have middleware to serve up 404s, that go would before this as well, or inside ~server/api/index.js)
//Because we generally want to build single-page applications (or SPAs), our server should send its index.html for any requests that don't match one of our API routes.
app.get('*', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// The only thing after this might be a piece of middleware to serve up 500 errors for server problems
// error handling middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error');
});

const test = input => {
  console.log('hello!');
};

module.exports = app;

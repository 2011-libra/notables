const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const session = require('express-session');

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session middleware for authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'some secret key',
    resave: false,
    saveUninitialized: false
  })
);

// static middleware
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/code', require('./docker'));

// serve main page after middleware
app.get('*', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error');
});

module.exports = app;

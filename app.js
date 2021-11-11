require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var logger = require('morgan');
var passport = require('passport');
var MongoStore = require('connect-mongo');
var expressLayouts = require('express-ejs-layouts');
var app = express();

var { indexRouter, authRouter, uploadRouter } = require('./routes');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session middleware with mongodb session storage
app.use(session({
  secret: process.env.secret,
  saveUninitialized: true,
  resave: false,
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URI,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    collectionName: 'sessions'
  })
}));
app.use(passport.initialize());
app.use(passport.session());

// handling routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error', { layout: 'layouts/main', title: 'Error' });
});

module.exports = app;

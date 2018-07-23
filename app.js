var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const ldap = require('ldapjs');
const assert = require('assert');

const ldapSettings = require('./library/ldapSettings');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var groupsRouter = require('./routes/group');
var organizationalUnitsRouter = require('./routes/orgunit');
var otherRouter = require('./routes/other');
var monitoringRouter = require('./routes/monitoring');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/group', groupsRouter);
app.use('/ou', organizationalUnitsRouter);
app.use('/other', otherRouter);
app.use('/monitor', monitoringRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000,function () {
  console.log("server is run! at 3000 port!")
});

module.exports = app;

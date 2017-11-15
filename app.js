var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var apiCalendar = require('./routes/apiCalendar');
var apiBusStop = require('./routes/apiBusStop');

var database = require('./miband/database');
database.initializeDatabase();
var proximity = require('./extensions/proximity');
var logger2 = require("./extensions/logger");

var sse = require('./miband/sse');
var sseRoute = require('./routes/sseMiband');
connectionsSSE = []; // global variable for connections
sendToAllSse = function (data) {
  for (let i = 0; i < connectionsSSE.length; i++) {
    connectionsSSE[i].sseSend(data);
    logger2.append("sseSend");
  }
}
var mibandScanner = require('./miband/mibandScanner');

sendOnProximityOnly = false;
useDiagram = true;
currentLeafCount = -1;
currentAppleCount = -1;
if (sendOnProximityOnly) {
  console.log("App: Scan and send only on proximity.");
  proximity.onProximityChange(val => {
    mibandScanner.startScanning(false);
  })
} else {
  console.log("App: Scan and send always.");
  mibandScanner.startScanning(true);
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/calendar', apiCalendar);
app.use('/api/busstop', apiBusStop);
app.post('/api/leaves', function (req, res) {
  currentLeafCount = req.query.current;
  logger2.append("leavesChanged");
  res.end();
});
app.post('/api/apples', function (req, res) {
  currentAppleCount = req.query.current;
  logger2.append("applesChanged");
  res.end();
});

app.use(sse);
app.use('/sse/miband', sseRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

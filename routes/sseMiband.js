var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.sseSetup();
  connectionsSSE.push(res); // global variable
})

module.exports = router;

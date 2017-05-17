var express = require('express');
var router = express.Router();
var busStopScraper = require('../extensions/busStopScraper');

/* GET home page. */
router.get('/:busstop', function (req, res, next) {
    busStopScraper.getData(req.params.busstop).then(function (response) {
        console.log("Success!", response);
        res.json(response);
    }, function (error) {
        console.error("Failed!", error);
        res.json(error);
    });
});

module.exports = router;

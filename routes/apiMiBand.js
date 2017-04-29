var express = require('express');
var router = express.Router();
var miBand = require('../miband/miband');

/* GET home page. */
router.get('/', function (req, res, next) {
	miBand.getMiBandData().then(function (response) {
		console.log("Success!", response.steps);
		res.json({ uuid: response.uuid, steps: response.steps, rssi: response.rssi });
	}, function (error) {
		console.error("Failed!", error);
		res.json(error);
	});
});

module.exports = router;

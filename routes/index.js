var express = require('express');
var router = express.Router();
var getMiBandData = require('../miband/miband');

/* GET home page. */
router.get('/', function (req, res, next) {

	getMiBandData.then(function (response) {
		console.log("Success!", response);
	}, function (error) {
		console.error("Failed!", error);
	});

	res.render('index', { title: 'Express' });
});

module.exports = router;

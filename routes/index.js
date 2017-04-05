var express = require('express');
var router = express.Router();

var noble = require('noble'); // https://github.com/sandeepmistry/noble/wiki/Getting-started

/* GET home page. */
router.get('/', function(req, res, next) {

noble.startScanning();

	noble.on('stateChange', function(state) {
	  if (state === 'poweredOn') {
	    noble.startScanning();
	  } else {
	    noble.stopScanning();
	  }
	});

	noble.on('discover', function(peripheral) {
	    console.log('Found device with local name: ' + peripheral.advertisement.localName);
	    console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
	    console.log();
		if(peripheral.advertisement.localName=="MI1S"){

		peripheral.connect(function(error) {
		    console.log('connected to peripheral: ' + peripheral.uuid);
		    peripheral.discoverServices(['fee0'], function(error, services) {
		      var deviceInformationService = services[0];
		      console.log('discovered device information service');

		      deviceInformationService.discoverCharacteristics(['ff06'], function(error, characteristics) {
			var manufacturerNameCharacteristic = characteristics[0];
			console.log('discovered manufacturer name characteristic');

			manufacturerNameCharacteristic.read(function(error, data) {
			  // data is a buffer
			  //console.log('manufacture name is: ' + data.toString('utf8'));
				console.log('data read: ' + data.toString('utf8'));
				dataUint8Array = new Uint8Array(data);
				console.log('steps: ' + dataUint8Array[0] |  (dataUint8Array[1] << 8) |  (dataUint8Array[2] << 16) |  (dataUint8Array[3] << 24));
			});
		      });
		    });
		  });

		}
	});

  res.render('index', { title: 'Express' });
});

module.exports = router;

var express = require('express');
var router = express.Router();

var noble = require('noble'); // https://github.com/sandeepmistry/noble/wiki/Getting-started
var REALTIME_STEPS_UUID = 'ff06';
var SERVICE_UUID = 'fee0';
var DEVICE_NAME = 'MI1S';
var BATTERY_INFO_UUID = 'ff0c';

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
		
		if(peripheral.advertisement.localName==DEVICE_NAME){
			console.log('device RSSI information: ' + peripheral.rssi + 'db');
			peripheral.connect(function(error) {
				console.log('connected to peripheral: ' + peripheral.uuid);

				peripheral.discoverServices([SERVICE_UUID], function(error, services) {
					var deviceInformationService = services[0];
					console.log('discovered device information service');

					deviceInformationService.discoverCharacteristics([REALTIME_STEPS_UUID ], function(error, characteristics) {
						var realtimeStepsCharacteristic = characteristics[0];
						console.log('discovered realtime steps characteristic');

						realtimeStepsCharacteristic.read(function(error, data) {
							var steps = (data[3] << 24) | (data[2] << 16) | (data[1] << 8) | data[0];
							console.log('Steps Counter: ' + steps);
						});
					});

					deviceInformationService.discoverCharacteristics([BATTERY_INFO_UUID ], function(error, characteristics) {
						var batteryInfoCharacteristic = characteristics[0];
						console.log('discovered battery characteristic');

						batteryInfoCharacteristic.read(function(error, data) {
							if(error){
								console.error(error);
							}
							var batteryLevel = data[0];
						});
					});

				});
			});
		}
	});

  res.render('index', { title: 'Express' });
});

module.exports = router;

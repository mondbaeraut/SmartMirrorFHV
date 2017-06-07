// Modules
try {
    var noble = require('noble'); // https://github.com/sandeepmistry/noble/wiki/Getting-started
} catch (e) {
    console.error("Just run npm install lul");
}
var database = require('./database');

// Constants
var REALTIME_STEPS_UUID = 'ff06';
var SERVICE_UUID = 'fee0';
var DEVICE_NAME = 'MI1S';
var BATTERY_INFO_UUID = 'ff0c';

var RSSI_THRESHOLD = -70;

// load values via bluetooth
module.exports.startScanning = !noble ? function () {
    function sendDummy() {
        connectionsSSE.forEach(c => {
            c.sseSend({
                "uuid":"77cdab9136fa40f4ae5f8400331ad47f",
                "rssi":-74,
                "steps":87,
                "stepsNew":0,
                "dailyStepsTotal":665
            });
        });
    }
    sendDummy();
    setInterval(sendDummy, 10000);
} : function () {
    // start scanning when function is called
    var serviceUUIDs = [SERVICE_UUID]; // default: [] => all
    var allowDuplicates = false; // default: false

    // stop scanning when bluetooth is powered off and start when its on
    noble.on('stateChange', function (state) {
        if (state === 'poweredOff') {
            noble.stopScanning();
            console.error('Bluetooth has been turned off!');
        } else {
            noble.startScanning(serviceUUIDs, allowDuplicates);
            console.log('start scanning for BLE devices with service id ' + SERVICE_UUID);
        }
    });

    // read data when device is discovered
    noble.on('discover', function (peripheral) {
        noble.stopScanning();
        console.log('--- BLE Device Found ---');
        console.log('Found device with local name: ' + peripheral.advertisement.localName);
        console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);

        // only read data from given device
        if (peripheral.advertisement.localName === DEVICE_NAME) {
            console.log('device RSSI information: ' + peripheral.rssi + 'db');
            if (peripheral.rssi > RSSI_THRESHOLD) {
                peripheral.connect(function (error) {
                    if (error) {
                        console.error('error connecting to peripheral', error);
                    }

                    console.log('connected to peripheral: ' + peripheral.uuid);
                    peripheral.discoverServices([SERVICE_UUID], function (error, services) {
                        if (error) {
                            console.error('error discovering service', error);
                        }

                        var deviceInformationService = services[0];
                        console.log('discovered device information service ' + services);
                        deviceInformationService.discoverCharacteristics([REALTIME_STEPS_UUID], function (error, characteristics) {
                            var realtimeStepsCharacteristic = characteristics[0];
                            console.log('discovered realtime steps characteristic');
                            if (realtimeStepsCharacteristic == null) {
                                noble.stopScanning();
                                console.error('Steps characteristic not found!');
                            } else {
                                realtimeStepsCharacteristic.read(function (error, data) {
                                    if (error) {
                                        console.error('error reading realtime steps characteristic', error);
                                    }

                                    peripheral.disconnect(); // otherwise errors occur on next connect

                                    var steps = (data[3] << 24) | (data[2] << 16) | (data[1] << 8) | data[0];
                                    var data = { uuid: peripheral.uuid, rssi: peripheral.rssi, steps: steps };
                                    console.log(data);

                                    // database operations
                                    database.getDailyBandSteps(data.uuid).then(function (responseDb) {
                                        console.log('DB response: ' + JSON.stringify(responseDb));
                                        var stepsOld = 0;

                                        if (responseDb != '') {
                                            stepsOld = responseDb[0].steps;
                                        }

                                        database.insertUpdateDailySteps(responseDb, data.uuid, data.steps).then(function () {
                                            data.stepsNew = data.steps - stepsOld;
                                            database.getDailyStepsTotal().then(function (dailyStepsTotal) {
                                                data.dailyStepsTotal = dailyStepsTotal + data.stepsNew; // add new steps, because insert / update is async
                                                console.log(JSON.stringify(data));

                                                // send to all sse connections
                                                for (var i = 0; i < connectionsSSE.length; i++) {
                                                    connectionsSSE[i].sseSend(data)
                                                }

                                                noble.startScanning(serviceUUIDs, allowDuplicates);
                                                console.log('start scanning for BLE devices with service id ' + SERVICE_UUID);
                                            });
                                        });

                                    }, function (error) {
                                        console.error(error);
                                    });
                                });
                            }
                        });
                    });
                });
            } else { // otherwise start scanning again
                console.log('not in range');
                noble.startScanning(serviceUUIDs, allowDuplicates);
                console.log('start scanning for BLE devices with service id ' + SERVICE_UUID);
            }
        } else { // otherwise start scanning again
            console.log('wrong device name');
            noble.startScanning(serviceUUIDs, allowDuplicates);
            console.log('start scanning for BLE devices with service id ' + SERVICE_UUID);
        }
    });
}

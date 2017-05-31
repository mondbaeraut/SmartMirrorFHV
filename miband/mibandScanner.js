// Modules
var noble = require('noble'); // https://github.com/sandeepmistry/noble/wiki/Getting-started
var database = require('./database');

// Constants
var REALTIME_STEPS_UUID = 'ff06';
var SERVICE_UUID = 'fee0';
var DEVICE_NAME = 'MI1S';
var BATTERY_INFO_UUID = 'ff0c';

var RSSI_THRESHOLD = -70;

// get miband data
// TODO database operations into scanning function
module.exports.getMiBandData = function () {
    return new Promise(function (resolve, reject) {
        readData().then(function (responseBand) {
            console.log('MiBand data read ' + responseBand.uuid);


        }, function (error) {
            reject(error);
        })
    });
}

// load values via bluetooth
module.exports.startScanning = function () {
    // start scanning when function is called
    var serviceUUIDs = [SERVICE_UUID]; // default: [] => all
    var allowDuplicates = false; // default: false

    // stop scanning when bluetooth is powerded off
    noble.on('stateChange', function (state) {
        if (state === 'poweredOff') {
            noble.stopScanning();
            console.error('Bluetooth has been turned off!');
        } else {
            noble.startScanning(serviceUUIDs, allowDuplicates);
            console.log('start scanning for BLE devices with service id ' + SERVICE_UUID);
        }
    });

    // when device is detected read data
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

                                    peripheral.disconnect();

                                    var steps = (data[3] << 24) | (data[2] << 16) | (data[1] << 8) | data[0];

                                    var data = { uuid: peripheral.uuid, rssi: peripheral.rssi, steps: steps };

                                    console.log(data);

                                    database.getDailyBandSteps(data.uuid).then(function (responseDb) {
                                        console.log(JSON.stringify(responseDb));
                                        var stepsOld = 0;
                                        if (responseDb == '') {
                                            console.log('no data found, inserting new record');
                                            database.insertDailySteps(data.uuid, data.steps);
                                        } else {
                                            console.log('data found, updating record');
                                            stepsOld = responseDb[0].steps;
                                            database.updateDailySteps(data.uuid, data.steps);
                                        }
                                        data.stepsNew = data.steps - stepsOld;
                                        database.getDailyStepsTotal().then(function (dailyStepsTotal) {
                                            console.log(dailyStepsTotal, 'daily steps total');
                                            data.dailyStepsTotal = dailyStepsTotal + data.stepsNew;
                                            console.log(JSON.stringify(data));

                                            // send to all sse connections
                                            for (var i = 0; i < connectionsSSE.length; i++) {
                                                connectionsSSE[i].sseSend(data)
                                            }
                                        });
                                    }, function (error) {
                                        console.error(error);
                                    });



                                    console.log('data read');
                                });
                            }
                        });
                    });
                });
            } else { // otherwise start scanning again
                console.log('not in range');
            }
        } else { // otherwise start scanning again
            console.log('wrong device name');
        }

        noble.startScanning(serviceUUIDs, allowDuplicates);
        console.log('start scanning for BLE devices with service id ' + SERVICE_UUID);
    });
}

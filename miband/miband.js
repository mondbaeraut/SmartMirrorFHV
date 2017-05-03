// Modules
var noble = require('noble'); // https://github.com/sandeepmistry/noble/wiki/Getting-started

// Constants
var REALTIME_STEPS_UUID = 'ff06';
var SERVICE_UUID = 'fee0';
var DEVICE_NAME = 'MI1S';
var BATTERY_INFO_UUID = 'ff0c';

// get miband data
module.exports.getMiBandData = function () {
    return new Promise(function (resolve, reject) {
        readData().then(function (responseBand) {
            database.getDailyBandSteps(responseBand.uuid).then(function (responseDb) {
                console.log(JSON.stringify(responseDb));
                if (responseDb == '') {
                    console.log('no data found, inserting new record');
                    database.insertDailySteps(responseBand.uuid, responseBand.steps);
                } else {
                    console.log('data found, updating record');
                    database.updateDailySteps(responseBand.uuid, responseBand.steps);
                }
                resolve(responseBand);
            }, function (error) {
                reject(error);
            });
        }, function (error) {
            reject(error);
        })
    });
}

// load values via bluetooth
function readData() {
    return new Promise(function (resolve, reject) {
        var data = {};

        // start scanning when API is called
        var serviceUUIDs = [SERVICE_UUID]; // default: [] => all
        var allowDuplicates = false; // default: false
        if (noble.state === 'poweredOn') {
            noble.startScanning(serviceUUIDs, allowDuplicates);
            console.log('start scanning for BLE devices with service id ' + SERVICE_UUID);
        } else {
            reject({error: 'Bluetooth is not turned on!'});
        }

        // stop scanning when bluetooth is powerded off
        noble.on('stateChange', function (state) {
            if (state === 'poweredOff') {
                noble.stopScanning();
                reject({error: 'Bluetooth is not turned on!'});
            }
        });

        // when device is detected read data
        noble.on('discover', function (peripheral) {
            noble.stopScanning(); // stop when peripheral found
            console.log('Found device with local name: ' + peripheral.advertisement.localName);
            console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
            console.log();

            // only read data from given device
            if (peripheral.advertisement.localName === DEVICE_NAME) {
                console.log('device RSSI information: ' + peripheral.rssi + 'db');
                data.rssi = peripheral.rssi;
                peripheral.connect(function (error) {
                    if (error) {
                        noble.stopScanning();
                        reject(error);
                    }

                    console.log('connected to peripheral: ' + peripheral.uuid);
                    data.uuid = peripheral.uuid;

                    peripheral.discoverServices([SERVICE_UUID], function (error, services) {
                        if (error) {
                            noble.stopScanning();
                            reject(error);
                        }

                        var deviceInformationService = services[0];
                        console.log('discovered device information service ' + services);

                        deviceInformationService.discoverCharacteristics([REALTIME_STEPS_UUID], function (error, characteristics) {
                            var realtimeStepsCharacteristic = characteristics[0];
                            console.log('discovered realtime steps characteristic');
                            if (realtimeStepsCharacteristic == null) {
                                noble.stopScanning();
                                reject('Steps characteristic not found!');
                            } else {
                                realtimeStepsCharacteristic.read(function (error, data) {
                                    if (error) {
                                        noble.stopScanning();
                                        reject(error);
                                    }

                                    var steps = (data[3] << 24) | (data[2] << 16) | (data[1] << 8) | data[0];
                                    console.log('Steps Counter: ' + steps);
                                    data.steps = steps;

                                    resolve(data);

                                    noble.stopScanning();
                                });
                            }
                        });

                        /*deviceInformationService.discoverCharacteristics([BATTERY_INFO_UUID ], function(error, characteristics) {
                            var batteryInfoCharacteristic = characteristics[0];
                            console.log('discovered battery characteristic');
     
                            batteryInfoCharacteristic.read(function(error, data) {
                                if(error){
                                    console.error(error);
                                }
                                var batteryLevel = data[0];
                            });
                        });*/

                    });
                });
            } else { // otherwise start scanning again
                noble.startScanning(serviceUUIDs, allowDuplicates);
                console.log('start scanning for BLE devices with service id ' + SERVICE_UUID);
            }
        });
    })
}


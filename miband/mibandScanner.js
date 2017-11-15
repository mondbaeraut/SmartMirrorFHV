// Modules
const { promisify } = require('util');
try {
    var Noble = require('noble'); // https://github.com/sandeepmistry/noble/wiki/Getting-started

    // promisify noble callbacks
    var Peripheral = require('noble/lib/peripheral.js');
    Peripheral.prototype.connectAsync = promisify(Peripheral.prototype.connect);
    Peripheral.prototype.disconnectAsync = promisify(Peripheral.prototype.disconnect);
    Peripheral.prototype.discoverServicesAsync = promisify(Peripheral.prototype.discoverServices);

    var Service = require('noble/lib/service.js');
    Service.prototype.discoverCharacteristicsAsync = promisify(Service.prototype.discoverCharacteristics);

    var Characteristic = require('noble/lib/characteristic.js');
    Characteristic.prototype.readAsync = promisify(Characteristic.prototype.read);
} catch (e) {
    console.error("BT: Just run npm install lul", e);
}
let Database = require('./database');

// Constants
const REALTIME_STEPS_UUID = 'ff06';
const SERVICE_UUID = 'fee0';
const DEVICE_NAME = 'MI1S';
const BATTERY_INFO_UUID = 'ff0c';

const RSSI_THRESHOLD = -80; // about 1m distance

// tracker numbers
var trackerNumbers = new Map();
// uuid - tracker number
trackerNumbers.set('c80f1087e943', '1');
trackerNumbers.set('c80f1086bf65', '2');
trackerNumbers.set('c80f1087e691', '3');

let gKeepScanning;

function startDummyScanning() {
    function sendDummy() {
        connectionsSSE.forEach(c => {
            c.sseSend({
                "uuid": "77cdab9136fa40f4ae5f8400331ad47f",
                "rssi": -74,
                "steps": 87,
                "stepsNew": 0,
                "dailyStepsTotal": 665
            });
        });
    }
    sendDummy();
    if (gKeepScanning) {
        setInterval(sendDummy, 10000);
    }
}

async function forceDisconnect(peripheral) {
    console.log(`BT: Testing force disconnect from tracker #${trackerNumbers.get(peripheral.uuid)}.`);
    if (peripheral.state != 'disconnected') {
        await peripheral.disconnectAsync();
        console.log(`BT: Forced disconnect from tracker #${trackerNumbers.get(peripheral.uuid)}.`);
    }
}

async function readDeviceInformation(peripheral) {
    await peripheral.connectAsync();

    // force disconnect in case of hang up
    let disconnectTimeout = setTimeout(() => forceDisconnect(peripheral), 10000);

    let services = await peripheral.discoverServicesAsync([SERVICE_UUID]);        
    let deviceInformationService = services[0];

    let characteristics = await deviceInformationService.discoverCharacteristicsAsync([REALTIME_STEPS_UUID, BATTERY_INFO_UUID]);
    let realtimeStepsCharacteristic = characteristics[0];
    let batteryCharacteristic = characteristics[1];

    let batteryData = await batteryCharacteristic.readAsync();
    let batteryLevel = batteryData[0];
    let batteryCharges = 0xffff & (0xff & batteryData[7] | (0xff & batteryData[8] << 8));

    let stepData = await realtimeStepsCharacteristic.readAsync();
    let steps = (stepData[3] << 24) | (stepData[2] << 16) | (stepData[1] << 8) | stepData[0];

    await peripheral.disconnectAsync();
    clearTimeout(disconnectTimeout);

    let result = {
        batteryLevel: batteryLevel,
        batteryCharges: batteryCharges,
        steps: steps
    };

    console.log(`BT: Successfully read tracker #${trackerNumbers.get(peripheral.uuid)} information: ${JSON.stringify(result)}`);
    return result;    
}

async function onDiscoverAsync(peripheral) {
    Noble.stopScanning();

    let deviceUuid = peripheral.uuid;
    let deviceRssi = peripheral.rssi;
    let deviceName = peripheral.advertisement.localName;
    let trackerNumber = trackerNumbers.get(deviceUuid);    

    // only read data from given device
    if (deviceName !== DEVICE_NAME) {
        console.log(`BT: Non-tracker device (${deviceName}) discovered.`);
    } else if (deviceRssi < RSSI_THRESHOLD) {
        console.log(`BT: Discovered tracker #${trackerNumber}, but was not in range (signal strength ${deviceRssi}).`);
    } else {        
        console.log(`BT: Discovered tracker #${trackerNumber} in range (signal strength ${deviceRssi}).`);
        try {
            let deviceInformation = await readDeviceInformation(peripheral);

            let responseDb = await Database.getDailyBandSteps(deviceUuid);
            let stepsOld = 0;

            if (responseDb != '') {
                stepsOld = responseDb[0].steps;
            }

            await Database.insertUpdateDailySteps(responseDb, deviceUuid, deviceInformation.steps);
                        
            let data = {
                number: trackerNumber,
                steps: deviceInformation.steps,
                batteryLevel: deviceInformation.batteryLevel,
                batteryCharges: deviceInformation.batteryCharges,
                stepsNew: deviceInformation.steps - stepsOld,
                dailyStepsTotal: await Database.getDailyStepsTotal()
            };

            if (data.stepsNew > 0) {
                sendToAllSse(data);
            }
        } catch (error) {
            console.error(error);
        }
    }
    if (gKeepScanning) {
        scheduleScanning();            
    }
}

function startNobleScanning() {
    // start scanning when function is called

    // stop scanning when bluetooth is powered off and start when its on
    Noble.on('stateChange', function (state) {
        if (state === 'poweredOff') {
            Noble.stopScanning();
            console.error('BT: Bluetooth has been turned off!');
        } else {
            scheduleScanning();
        }
    });

    // read data when device is discovered
    Noble.on('discover', onDiscoverAsync);
}

function scheduleScanning() {
    setTimeout(function () {
        Noble.startScanning([SERVICE_UUID], false);
        console.log('BT: Scanning for tracker...');
    }, 500);
}

// load values via bluetooth
module.exports.startScanning = function(keepScanning) {
    gKeepScanning = keepScanning;
    if (Noble) {
        startNobleScanning();
    } else {
        startDummyScanning();
    }
}

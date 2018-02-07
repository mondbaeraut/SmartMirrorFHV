// Modules
const { promisify } = require('util');
const { EventEmitter } = require('events');
try {
    var Noble = require('noble'); // https://github.com/sandeepmistry/noble/wiki/Getting-started

    // promisify noble callbacks
    const Peripheral = require('noble/lib/peripheral.js');
    const Service = require('noble/lib/service.js');
    const Characteristic = require('noble/lib/characteristic.js');

    Peripheral.prototype.connectAsync = promisify(Peripheral.prototype.connect);
    Peripheral.prototype.disconnectAsync = promisify(Peripheral.prototype.disconnect);
    Peripheral.prototype.discoverServicesAsync = promisify(Peripheral.prototype.discoverServices);

    Service.prototype.discoverCharacteristicsAsync = promisify(Service.prototype.discoverCharacteristics);

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

const trackerNumbers = new Map(); // uuid - tracker number
trackerNumbers.set('c80f1087e943', '1');
trackerNumbers.set('c80f1086bf65', '2');
trackerNumbers.set('c80f1087e691', '3');

class MibandScanner extends EventEmitter {
    start() {
        console.log('BT: start');
        startNobleScanning();
    }
}

const emitter = new MibandScanner();

async function forceDisconnect(peripheral) {
    console.log(`BT: Testing force disconnect from tracker #${trackerNumbers.get(peripheral.uuid)}.`);
    if (peripheral.state !== 'disconnected') {
        await peripheral.disconnectAsync();
        console.log(`BT: Forced disconnect from tracker #${trackerNumbers.get(peripheral.uuid)}.`);
    }
}

async function readDeviceInformation(peripheral) {
    if (peripheral.state !== 'connected') {
        await peripheral.connectAsync();
    } else {
        console.log('BT: Already connected...');
        await forceDisconnect(peripheral);
    }

    // force disconnect in case of hang up
    //let disconnectTimeout = setTimeout(() => forceDisconnect(peripheral), 10000);

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
    //clearTimeout(disconnectTimeout);

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
                emitter.emit('steps', data);
            }
        } catch (error) {
            console.error(error);
        }
    }
    startScanning();
}

function startNobleScanning() {
    // read data when device is discovered
    Noble.on('discover', onDiscoverAsync);

    // stop scanning when bluetooth is powered off and start when its on
    Noble.on('stateChange', function (state) {
        console.log(`BT: stateChange -> ${state}`);
        if (state === 'poweredOn') {
            startScanning();
        } else {
            Noble.stopScanning();
        }
    });
}

function startScanning() {
    setTimeout(function () {
        if (Noble.state === 'poweredOn') {
            Noble.startScanning([SERVICE_UUID], false);
            console.log('BT: Scanning for tracker...');
        }
    }, 500);
}

// load values via bluetooth
module.exports = emitter;
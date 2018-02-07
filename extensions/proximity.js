const SerialPort = require("serialport");
const { EventEmitter } = require('events');

let port = new SerialPort("/dev/ttyACM0", error => {
    if (error) {
        console.log("Proximity: Serial port could not be opened.", error)
    }
});

const emitter = new EventEmitter();

port.on("data", data => {
    console.log(`Proximity: ${data}`)
    emitter.emit('change', data);
});

module.exports = emitter;
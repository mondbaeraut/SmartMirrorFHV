let SerialPort = require("serialport");

let port = new SerialPort("/dev/ttyACM0", error => {
    if (error) {
        console.log("Proximity: Serial port could not be opened.", error)
    }
});

let callbacks = [];

port.on("data", data => {
    console.log(`Proximity: ${data}`)
});

module.exports.onProximityChange = function(callback) {
    callbacks.push(callback);
}
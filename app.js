const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const bluetoothHelper = require('./miband/bluetooth-helper');
const mibandScanner = require('./miband/mibandScanner');
const proximity = require('./extensions/proximity');

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(express.static(__dirname + '/public'));

let currentProximity;
proximity.on('change', data => currentProximity = data);
let router = express.Router();
router.get('/proximity', (req, res) => {
    res.json(currentProximity);
});
router.post('/pause', (req, res) => {
    sockets.forEach(socket => socket.emit("stop"));
    res.end();
});
router.post('/resume', (req, res) => {
    sockets.forEach(socket => socket.emit("start"));
    res.end();
});
app.use(router);

const sockets = [];
io.on('connection', async function (socket) {
    console.log("Client connected");
    sockets.push(socket);
    socket.on('disconnect', (reason) => {
        const index = sockets.indexOf(socket);
        if (index >= 0) {
            sockets.splice(index, 1);
        }
    })
});

mibandScanner.start();
mibandScanner.on('steps', steps => sockets.forEach(socket => socket.emit("steps", steps)));

//setInterval(bluetoothHelper.restart, 10000);

server.listen(3000);
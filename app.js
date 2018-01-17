const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const mibandScanner = require('./miband/mibandScanner');

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(express.static(__dirname + '/public'));

const sockets = [];

io.on('connection', async function (socket) {
    console.log("Client connected");
    sockets.push(socket);
    mibandScanner.startScanning();
});

sendToAllSse = data => sockets.forEach(socket => socket.emit("data", data));

server.listen(3000);
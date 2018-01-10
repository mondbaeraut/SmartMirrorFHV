const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
    console.log('a user connected');
});

server.listen(3000);
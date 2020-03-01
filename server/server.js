const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

// Express ocupa algunos métodos interno de http
const app = express();
let server = http.createServer(app);

const publicPath = path.resolve(__dirname, '../public');

app.use(express.static(publicPath));

// IO = Esta es la comunicación del backend
module.exports.io = socketIO(server);
require('./sockets/socket');

const port = process.env.PORT || 3000;

server.listen(port, err => {
    if (err) throw new Error(err);
    console.log(`Servidor corriendo en puerto ${ port }`);
});
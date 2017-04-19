'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 5000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on('message', function (receiver, data, messageId) {
	if (!receiver || !data || !messageId){
		return;
	}
	if (socket.io.connected[receiver]) {
		socket.io.connected[receiver].emit('message', data);
		if (socket.io.connected[socket.id]) {
			socket.io.connected[socket.id].emit('message:'+messageId, true);
		}
	}else{
		if (socket.io.connected[socket.id]) {
			socket.io.connected[socket.id].emit('message:'+messageId, false);
		}
	}
  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 5*60*1000);

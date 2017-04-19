'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 5000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
	.use(express.static('static'))
	.use((req, res) => res.sendFile(INDEX))
	.set('origins', '*:*')
	.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = socketIO(server);
const clients = [];
function getClientByUserId(userId) {
	for (var i = 0, len = clients.length; i < len; ++i) {
		var c = clients[i];
		if (c.userId == userId) {
			return c;
		}
	}
	return null;
}

io.on('connection', (client) => {
	//console.log('Client connected');
	client.on('setUser', function (userId, customData) {
		//console.log('setUser', userId, customData);
		var clientInfo = new Object();
		clientInfo.userId = userId;
		clientInfo.customData = customData;
		clientInfo.clientId = client.id;
		clients.push(clientInfo);
	});
	client.on('disconnect', function (data) {
		//console.log('disconnect', data);
		for (var i = 0, len = clients.length; i < len; ++i) {
			var c = clients[i];
			if (c.clientId == client.id) {
				clients.splice(i, 1);
				break;
			}
		}
	});
	client.on('message', function (userId, message, messageId) {
		//console.log('message', userId, message, messageId);
		if (!userId || !message || !messageId) {
			return;
		}
		var receiverData = getClientByUserId(userId);
		//console.log('getClientByUserId', receiverData);
		if (receiverData) {
			client.broadcast.to(receiverData.clientId).emit('message', message);
			client.emit('message:' + messageId, true);
			//console.log('message:' + messageId, true);
		} else {
			client.emit('message:' + messageId, false);
			//console.log('message:' + messageId, false);
		}
	});
});

setInterval(() => io.emit('time', new Date().toTimeString()), 5 * 60 * 1000);

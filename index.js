'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const _ = require('lodash');

const PORT = process.env.PORT || 5000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use('/static', express.static(__dirname + '/static'))
  .use((req, res) => res.sendFile(INDEX))
  .set('origins', '*:*')
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = socketIO(server);
const clients = [];

function getClientsByUserId(userId) {
  userId = userId.trim().toLowerCase();
  return _.filter(clients, { userId: userId });
}

function createClient(clientId, userId, password, customData) {
  userId = userId.trim().toLowerCase();

  var clientInfo = new Object();
  clientInfo.userId = userId;
  clientInfo.password = password;
  clientInfo.customData = customData;
  clientInfo.clientId = clientId;

  var foundedClients = getClientsByUserId(userId);
  if (
    foundedClients.length > 0 &&
    foundedClients.length !==
      _.filter(foundedClients, { password: password }).length
  ) {
    return false;
  } else {
    clients.push(clientInfo);
    return clientInfo;
  }
}

io.on('connection', (client) => {
  client.on('login', function (userId, password, customData) {
    if (createClient(client.id, userId, password, customData)) {
      client.emit('loginResult', true);
    } else {
      client.emit('loginResult', false);
    }
  });
  client.on('disconnect', function (data) {
    for (var i = 0, len = clients.length; i < len; ++i) {
      var c = clients[i];
      if (c.clientId == client.id) {
        clients.splice(i, 1);
        break;
      }
    }
  });
  client.on('message', function (userId, message, messageId) {
    if (!userId || !message || !messageId) {
      return;
    }
    var receiverClients = getClientsByUserId(userId);
    var result = [];
    for (var i = 0, len = receiverClients.length; i < len; i++) {
      if (receiverClients[i]) {
        client.broadcast
          .to(receiverClients[i].clientId)
          .emit('message', message);
        result.push(receiverClients[i].clientId);
      }
    }
    if (result.length > 0) {
      client.emit('messageResult#' + messageId, true);
    } else {
      client.emit('messageResult#' + messageId, false);
    }
  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 5 * 60 * 1000);

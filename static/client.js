var socket = null;
$(document).ready(function () {
  $('#connect').prop('disabled', false);
  $('#receiverId').prop('disabled', true);
  $('#message').prop('disabled', true);
  $('button[type=submit]').prop('disabled', true);
  $('#connect').on('click', function () {
    $('#connect').html('Reconnect');
    $('#receiverId').prop('disabled', false);
    $('button[type=submit]').prop('disabled', false);
    $('#message').prop('disabled', false);
    if (socket) {
      socket.close();
    }
    var baseUrl = $('head > base').first().attr('href');
    console.log(baseUrl);
    socket =
      baseUrl && baseUrl !== '/'
        ? io('', {
            path: `${baseUrl}socket.io/`,
          })
        : io();
    socket.on('time', function (timeString) {
      console.log('Server time: ' + timeString);
    });
    socket.on('message', function (message) {
      alert(message);
    });
    socket.on('loginResult', function (result) {
      if (!result) {
        alert('Login - fail');
      }
    });
    socket.emit('login', $('#senderId').val());
    return false;
  });
  $('#userForm').on('submit', function () {
    if (socket) {
      var messageId = new Date().getMilliseconds();
      socket.on('messageResult#' + messageId, function (result) {
        if (!result) {
          alert('Sent message - fail');
        }
      });
      socket.emit(
        'message',
        $('#receiverId').val(),
        $('#message').val(),
        messageId
      );
    }
    return false;
  });
});

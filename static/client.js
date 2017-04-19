var socket = null;
$(document).ready(function () {
    $('#connect').prop("disabled", false);
    $('#receiverId').prop("disabled", true);
    $('#message').prop("disabled", true);
    $('button[type=submit]').prop("disabled", true);
    $('#connect').on('click', function () {
        $('#connect').prop("disabled", true);
        $('#receiverId').prop("disabled", false);
        $('button[type=submit]').prop("disabled", false);
        $('#message').prop("disabled", false);
        socket = io();
        socket.on('time', function (timeString) {
            console.log('Server time: ' + timeString);
        });
        socket.on('message', function (message) {
            alert(message);
            console.log('Message: ', message);
        });
        socket.emit('setUser', $('#senderId').val());
        return false;
    });
    $('#userForm').on('submit', function () {
        if (socket) {
            var messageId = (new Date()).getMilliseconds();
            console.log('message:' + messageId);
            socket.on('message:' + messageId, function (result) {
                console.log('message:' + messageId, result);
                if (!result) {
                    alert('message:' + messageId + ' - fail');
                }
            });
            console.log('message', $('#receiverId').val(), $('#message').val(), messageId);
            socket.emit('message', $('#receiverId').val(), $('#message').val(), messageId);
        }
        return false;
    });
});
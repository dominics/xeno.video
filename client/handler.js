'use strict';

module.exports = function () {
    var socket = io.connect(window.location.host);

    socket.on('tv', function (message) {
        console.log('Received tv message', message);
    });
};
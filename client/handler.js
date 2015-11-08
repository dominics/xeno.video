module.exports = function () {
    var socket = io.connect(window.tv.host);

    socket.on('tv', function (message) {
        console.log('Received tv message', message);
    });
};
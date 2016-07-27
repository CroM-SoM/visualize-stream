'use strict'

if (io !== undefined) {
    // Storage for WebSocket connections
    var socket = io.connect('/');

    socket.on('twitter-stream', function(data) {

        console.log(data);

        var div = document.getElementById('twitter-messages');

        div.innerHTML = div.innerHTML + '<li class="tweet-stream">' + data.text + '"><hr></li>';


    })

};



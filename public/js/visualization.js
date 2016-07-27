'use strict'

if (io !== undefined) {
    // Storage for WebSocket connections
    var socket = io.connect('/');

    socket.on('twitter-stream', function(data) {

        console.log(data);

        var div = document.getElementById('twitter-messages');

        div.innerHTML = div.innerHTML + '<li class="tweet-stream">' + data.text + '"><hr></li>';

		
		// Create an svg container bind it.
        var svgContainer = d3.select("body").append("svg")
            .attr("width", 100)
            .attr("height", 100)
            .style("fill", "purple");

		};


    })

};



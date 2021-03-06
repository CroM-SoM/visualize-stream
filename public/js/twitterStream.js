function initialize() {
    //Setup Google Map
    var myLatlng = new google.maps.LatLng(52.3413359, 4.8522708);
    var light_grey_style = [{ "featureType": "landscape", "stylers": [{ "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] }, { "featureType": "poi", "stylers": [{ "saturation": -100 }, { "lightness": 51 }, { "visibility": "simplified" }] }, { "featureType": "road.highway", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "road.arterial", "stylers": [{ "saturation": -100 }, { "lightness": 30 }, { "visibility": "on" }] }, { "featureType": "road.local", "stylers": [{ "saturation": -100 }, { "lightness": 40 }, { "visibility": "on" }] }, { "featureType": "transit", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": -25 }, { "saturation": -100 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00" }, { "lightness": -25 }, { "saturation": -97 }] }];
    var myOptions = {
        zoom: 12,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        styles: light_grey_style
    };


    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    //Setup heat map and link to Twitter array we will append data to
    var heatmap;
    var liveTweets = new google.maps.MVCArray();
    /*
    heatmap = new google.maps.visualization.HeatmapLayer({
      data: liveTweets,
      radius: 25
    });
    heatmap.setMap(map);*/

    if (io !== undefined) {
        // Storage for WebSocket connections
        var socket = io.connect('/');

        // This listens on the "twitter-steam" channel and data is 
        // received everytime a new tweet is receieved.
        socket.on('twitter-stream', function(data) {

            //Add tweet to the heat map array.
            var tweetLocation = new google.maps.LatLng(data.lng, data.lat);
            liveTweets.push(tweetLocation);

            var contentString = '<div id="content">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<h1 id="firstHeading" class="firstHeading">' + data.place + '</h1>' +
                '<div id="bodyContent"><p><b>' + data.text + '</b><br>' + data.location;

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            //Flash a dot onto the map quickly
            var img = 'css/icon_bludot.png'
            var image = "css/small-dot-icon.png";
            var ico = "http://image.flaticon.com/icons/svg/34/34469.svg";
            var marker = new google.maps.Marker({
                position: tweetLocation,
                map: map,
                icon: img,
                title: 'new tweet'
            });
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });

            // Log json object.
            // console.log(data);

            // Create html string.
            function create(htmlStr) {
                var frag = document.createDocumentFragment(),
                    temp = document.createElement('li');
                temp.innerHTML = htmlStr;
                while (temp.firstChild) {
                    frag.appendChild(temp.firstChild);
                }
                return frag;
            }

            // String for live tweets including link to profile and profilepicture.
            var userProfile = '<li class="tweet-stream">' +
                '<img src="' + data.url + '">' +
                '<a target="_blank" href="https://twitter.com/' + data.userName + '">' +
                data.userName + '</a>' + data.text + '<hr></li>';

            // String that displays location, language and timezone, if set by user.
            var userPreference = '<li class="tweet-stream">' + data.location +
                '<span>+</span>' + data.place + '<span>+</span>' + data.time_zone +
                '<span>+</span>' + data.lang + '<hr></li>';

            // Get html elements.
            var twitterStream = document.getElementById('twitter-messages');
            var twitterPreference = document.getElementById('twitter-location');

            var fragment = create(userProfile);
            var fragmentLocation = create(userPreference);

            // Insert new list items before older ones. 
            twitterStream.insertBefore(fragment, twitterStream.childNodes[0]);
            twitterPreference.insertBefore(fragmentLocation, twitterPreference.childNodes[0]);

            /*setTimeout(function(){
        marker.setMap(null);
      },3000);
   */
        });

        // Listens for a success response from the server to 
        // say the connection was successful.
        socket.on("connected", function(r) {

            //Now that we are connected to the server let's tell 
            //the server we are ready to start receiving tweets.
            socket.emit("start tweets");
        });
    }
}

function getWeather() {
    navigator.geolocation.getCurrentPosition(
        locationSuccess,
        locationError,
        {timeout: 15000, maximumAge: 60000}
    );
}

function locationError(err) {
    console.log("Error requesting location");
}

function locationSuccess(pos) {
    // API URL
    var url = "https://api.forecast.io/forecast/" +
              "APIKEYGOESHERE" +
              pos.coords.latitude + "," + pos.coords.longitude;

    // Send request
    xhrRequest(url, 'GET', function(reponseText) {
        var json = JSON.parse(reponseText);

        // Get the apparent temperature and transform it to Celsius
        var temperature = Math.round(
            (json.currently.apparentTemperature - 32) * (5 / 9)
        );

        var conditions = json.currently.summary;

        // Debugging
        console.log("Temperature: " + temperature);
        console.log("Conditions: " + conditions);

        // Assemble dictionary using our keys
        var dictionary = {
            "KEY_TEMPERATURE": temperature,
            "KEY_CONDITIONS": conditions
        }

        // Send to Pebble
        Pebble.sendAppMessage(
            dictionary,
            function(e) {
                console.log("Weather info sent to Pebble successfully");
            },
            function(e) {
                console.log("Error sending weather info to Pebble");
            }
        );
    });
}

function xhrRequest(url, type, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        callback(this.responseText);
    };
    xhr.open(type, url);
    xhr.send();
}

// Listen for when an AppMessage is received
Pebble.addEventListener("appmessage", function(e) {
    getWeather();
});

// Listen for when the watchface is opened
Pebble.addEventListener("ready", function(e) {
    getWeather();
});

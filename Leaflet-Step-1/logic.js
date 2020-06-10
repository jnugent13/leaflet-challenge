var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

// Perform a GET request to the query URL
d3.json(url, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    };

    function pointToFeature(feature, layer) {
        var colorList = ["#99ff33", "#ccff99", "#ffcc66", "#ff9900", "#ff6600", "#ff3300"]

        var color="";
        if (feature.properties.mag > 5) {
            color = colorList[5];
        }
        else if (feature.properties.mag > 4) {
            color = colorList[4];
        }
        else if (feature.properties.mag > 3) {
            color = colorList[3];
        }
        else if (feature.properties.mag > 2) {
            color = colorList[2];
        }
        else if (feature.properties.mag > 1) {
            color = colorList[1];
        }
        else {
            color = colorList[0];
        }

        var markerStyle = {
            radius: feature.properties.mag * 1000,
            color: color,
            fillOpacity: 0.75,
        }; 

    };

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToFeature: pointToFeature,
        onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
};

function createMap(earthquakes) {
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    });

    // Create a baseMaps object to hold the streetmap layer
    var baseMaps = {
        "Street Map": streetmap
    };

    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    var myMap = L.map("map", {
        center: [37.7749, -122.4194],
        zoom: 5,
        layers: [streetmap, earthquakes],
      });
    
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
};
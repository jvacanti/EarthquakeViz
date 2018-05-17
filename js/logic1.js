

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers)

  function createMarkers(response) {
      console.log(response);
      // pull the "features" property off of response.data
      var features = response.features
      // initialize an array to hold markers
      var quakeMarkers = [];
    
      // loop through the features array
      for (var index = 0; index < features.length; index++) {
        var quake = features[index];
    
        function chooseColor(mag) {
          switch (mag) {
            case 0:
              return "green";
            case 1:
              return "yellow";
            case 1-2:
              return "orange";
            case 2-3:
              return "green";
            case 5:
              return "purple";
            case 5:
              return "purple";
            default:
              return "black";
          }
        }
        // for each quake, create a marker and bind a popup with the quake's info
        var quakeMarker = L.geoJson(quake,{
        pointToLayer: function (feature, latlong){
          return L.circleMarker(latlong,{
          fillOpacity: 0.75,
          color: "white",
          fillColor: chooseColor(feature.properties.mag),
          radius: feature.properties.mag * 5
        })
          .bindPopup("<h3>Magnitude: " + feature.properties.mag + "<h3><h3>Place: " + feature.properties.place + "<h3>");
        }})
        // add the marker to the quakeMarkers array
      quakeMarkers.push(quakeMarker);
      }
      //console.log(features[0].geometry.coordinates[1], features[0].geometry.coordinates[0])
    
      // create a layer group made from the bike markers array, pass it into the createMap function
      return createMap(L.layerGroup(quakeMarkers))
      // createMarkers("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").addTo(map)
    }
  
    


  function createMap(quakeMarkers) {
  
    // create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVudiIsImEiOiJjamd5YW5qMWEwMnRwMnpvMW96ZDB1MG0wIn0.Y4sP1qoy-ELlOyjcRabCtQ", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18
    });
  
    // create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // create an overlayMaps object to hold the bikefeatures layer
    var overlayMaps = {
      "Earthquakes": quakeMarkers
    };

    // Create the map object with options
    var map = L.map("map-id", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [lightmap, quakeMarkers]
    });

  // create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);}

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < features.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(map);
// This will let you use the .remove() function later on
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
}

// mapbox public access token
// next iteration: retrieve from .yaml file
mapboxgl.accessToken = 'pk.eyJ1Ijoic2hlbGJ5LWdyZWVuIiwiYSI6ImNrMHNobWdrNTAwZW8zYnA5czQ5cWh4ankifQ.TWYVyG-n0cmhTGvKg31eow';

// initialize map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-84.2808401571308, 30.438425645531353], 
    zoom: 12,
    scrollZoom: true
});

// load the map
map.on('load', function () {
    
    // points layer data
    map.addSource("points", {
        type: "geojson",
        data: "https://raw.githubusercontent.com/shelbygreen/utility-moratorium/main/pastdue_withdelinquency.geojson"
    });

    // parks layer data
    map.addSource("parks", {
        type: "geojson",
        data: "https://raw.githubusercontent.com/shelbygreen/utility-moratorium/main/parkpoints.geojson"
    });

    // neighborhoods layer data
    map.addSource("hoods", {
        type: "geojson",
        data: "https://raw.githubusercontent.com/shelbygreen/utility-moratorium/main/Neighborhoods.geojson"
    });

    // parcels layer data
    map.addSource("parcels", {
        type: "geojson",
        data: "https://raw.githubusercontent.com/shelbygreen/utility-moratorium/main/parcels.json"
    });

// // outline for base layer - neighborhoods layer styling
// map.addLayer({
//   'id': 'hoods-layer',
//   'source': 'hoods',
//   'type': 'line',
//   'layout': {},
//   // 'filter': ['!=', 'delinquency', '0'],
//   "paint": {
//     'line-color': '#fff',
//     // 'line-width': 1
//   }
// }, 'waterway-label');

// base layer - neighborhoods layer styling
map.addLayer({
    'id': 'hoods-layer',
    'source': 'hoods',
    'type': 'line',
    'layout': {},
    // 'filter': ['==', 'HOA_NAME', 'PROVIDENCE NA', 'LAFAYETTE PARK NA'],
    "paint": {
    'line-color': '#FD8419',
    // 'fill-opacity': 0.5
    }
}, 'waterway-label');

// points layer styling
map.addLayer({
    'id': 'points-layer',
    'source': 'points',
    'type': 'circle',
    'layout': {},
    'filter': ['!=', 'delinquency', '0'],
    "paint": {
        'circle-color': [
            'match',
            ['get', 'delinquency'],
            'march2020', 'tomato', // #FB3B3B red, haven't paid since march 2020
            'jan2021', 'cornflowerblue', // #1988FD, blue, haven't paid since january 2021
            'march2021', 'lightseagreen', // haven't paid since march 2021 -- at risk
            '#ccc'
        ],
    'circle-radius': 3
    }
}, 'waterway-label');

// parks layer styling
// map.addLayer({
//   'id': 'parks-layer',
//   'source': 'parks',
//   'type': 'circle',
//   'layout': {},
//   // 'filter': ['!=', 'delinquency', '0'],
//   "paint": {
//       'circle-color': 'forestgreen',
//     'circle-radius': 6
//   }
// }, 'waterway-label');

// // parcels layer styling
// map.addLayer({
//   'id': 'parcels-layer',
//   'source': 'parcels',
//   'type': 'line',
//   'layout': {},
//   'minzoom': 14,
//   // 'filter': ['!=', 'delinquency', '0'],
//   "paint": {
//     'line-color': '#ccc',
//     'line-width': 1
//   }
// }, 'waterway-label');

})

// click on the points layer
map.on('click', 'points-layer', function(e) {
    var acct = map.queryRenderedFeatures(e.point, { layers: ['points-layer'] });
    var props = acct[0].properties;

    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML('<b>Payment Date:</b></b> ' + props.LastPaymentMonth + '/' + props.LastPaymentYear + '<br>' +
    '<b>Payment Amount:</b></b> ' + '$' + props.LastPayAmount +
    '<b>Address:</b></b> ' + props.Address)
    .addTo(map);

})

// click on the neighborhoods layer
map.on('click', 'hoods-layer', function(e) {
    var acct = map.queryRenderedFeatures(e.point, { layers: ['hoods-layer'] });
    var props = acct[0].properties;

    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML('<b>Neighborhood:</b></b> ' + props.HOA_NAME)
    .addTo(map);

})
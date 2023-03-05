// Description: This file contains the code for the map and the legend.
import addMarkersFromGeoJSON from './addMarkersFromGeoJSON.js';
import { MAPBOX_USERNAME_1, MAPBOX_STYLE_ID_1, MAPBOX_ACCESS_TOKEN_1, MAPBOX_USERNAME_2, MAPBOX_STYLE_ID_2, MAPBOX_ACCESS_TOKEN_2 } from './config.js';

// Set initial map properties
const zoom = 12;
const lat = 41.02;
const lng = 29;

// Set Mapbox links and URLs
const mapboxLink = '<a href="http://mapbox.com">Mapbox</a>';
const mapboxUrl = `https://api.mapbox.com/styles/v1/${MAPBOX_USERNAME_1}/${MAPBOX_STYLE_ID_1}/tiles/256/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN_1}`;
const mapboxUrl2 = `https://api.mapbox.com/styles/v1/${MAPBOX_USERNAME_2}/${MAPBOX_STYLE_ID_2}/tiles/256/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN_2}`;
const mapboxAttrib = `&copy; ${mapboxLink} Contributors`;

// Create map layers
const mapboxMap = L.tileLayer(mapboxUrl, { attribution: mapboxAttrib });
const mapboxMap2 = L.tileLayer(mapboxUrl2, { attribution: mapboxAttrib });

// Set up map configuration
const mapConfig = {
  layers: [mapboxMap],
  minZoom: 12,
  maxZoom: 18,
};

// Create map and add layers
const map = L.map("map", mapConfig).setView([lat, lng], zoom);
const baseLayers = {
  "Mert's Style": mapboxMap,
  "Ekin's Style": mapboxMap2
};
L.control.layers(baseLayers).addTo(map);

// Limiting the map
function getBounds() {
  const southWest = new L.LatLng(40.58684, 29.73175);
  const northEast = new L.LatLng(41.68317, 28.05084);
  return new L.LatLngBounds(southWest, northEast);
}

// Set maxBounds
map.setMaxBounds(map.getBounds());


// Create legend
const legend = L.control({ position: "bottomleft" });

legend.onAdd = function () {
  const div = L.DomUtil.create("div", "description");
  L.DomEvent.disableClickPropagation(div);
  div.innerHTML = `
    <b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. 
    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
    when an unknown printer took a galley of type and scrambled it to make a type specimen book...
  `;
  return div;
};

legend.addTo(map);

// Add markers from GeoJSON
addMarkersFromGeoJSON(map, '../data/rehber.geojson');



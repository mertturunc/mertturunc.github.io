function addMarkersFromGeoJSON(map, geoJSONUrl) {
    let markers = L.markerClusterGroup();

    const iconOptions = {
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      };
      
    fetch(geoJSONUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const icons = {
            1: L.icon({ iconUrl: '../icons/SVG/rating1.svg', ...iconOptions }),
            2: L.icon({ iconUrl: '../icons/SVG/rating2.svg', ...iconOptions }),
            3: L.icon({ iconUrl: '../icons/SVG/rating3.svg', ...iconOptions }),
            4: L.icon({ iconUrl: '../icons/SVG/rating4.svg', ...iconOptions }),
            5: L.icon({ iconUrl: '../icons/SVG/rating5.svg', ...iconOptions })
          };
        L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                const rating = feature.properties.Rating;
                const icon = icons[rating];
                return L.marker(latlng, { icon });
              },
            onEachFeature: function(feature, layer) {
                const { Name: name, Rating: rating, Notes: notes, "Last Visit": lastVisit, "Blog Post": blogPost } = feature.properties;
            
                const popupContent = `
                  <b>${name}</b><br>
                  Rating: ${rating}<br>
                  Notes: ${notes}<br>
                  Last Visit: ${lastVisit}<br>
                  Blog Post: ${blogPost}
                `;
                layer.bindPopup(popupContent);
                markers.addLayer(layer);          }
        });
        map.addLayer(markers);
      });
  }

export default addMarkersFromGeoJSON;

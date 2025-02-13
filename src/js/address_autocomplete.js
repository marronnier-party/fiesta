import L from 'leaflet';

document.addEventListener('DOMContentLoaded', () => {
  const addressInput = document.querySelector('[data-address-autocomplete]');
  const map = document.querySelector('#location-map');
  let marker;
  let timeout;
  
  if (!addressInput) return;
  
  const updateMap = (lat, lng, zoom = 15) => {
    if (!map) return;
    
    const leafletMap = map.querySelector('leaflet-map');
    if (!leafletMap) return;
    
    leafletMap.setAttribute('latitude', lat);
    leafletMap.setAttribute('longitude', lng);
    leafletMap.setAttribute('zoom', zoom);
    
    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      marker = L.marker([lat, lng]).addTo(leafletMap.map);
    }
  };
  
  addressInput.addEventListener('input', (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const query = e.target.value;
      if (query.length < 3) return;
      
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
          if (data[0]) {
            const result = data[0];
            document.querySelector('[name="location:city"]').value = result.address.city || result.address.town;
            document.querySelector('[name="location:postal_code"]').value = result.address.postcode;
            document.querySelector('[name="location:country"]').value = result.address.country;
            document.querySelector('[name="location:latitude"]').value = result.lat;
            document.querySelector('[name="location:longitude"]').value = result.lon;
            
            updateMap(result.lat, result.lon);
          }
        });
    }, 500);
  });
});
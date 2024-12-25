import mapboxgl from 'mapbox-gl';

// Calculate if a point is visible on the globe
function isPointVisible(map: mapboxgl.Map, lng: number, lat: number): boolean {
  const center = map.getCenter();
  const zoom = map.getZoom();
  
  // Calculate the angular distance between the point and the center of view
  const R = 6371; // Earth's radius in km
  const φ1 = center.lat * Math.PI / 180;
  const φ2 = lat * Math.PI / 180;
  const Δφ = (lat - center.lat) * Math.PI / 180;
  const Δλ = (lng - center.lng) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
           Math.cos(φ1) * Math.cos(φ2) *
           Math.sin(Δλ/2) * Math.sin(Δλ/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  // Adjust visibility threshold based on zoom level
  const threshold = Math.max(90 - (zoom * 5), 30);
  
  // Convert distance to angular distance
  const angularDistance = (distance / R) * (180 / Math.PI);
  
  return angularDistance <= threshold;
}

export const updateMarkerVisibility = (map: mapboxgl.Map, markers: mapboxgl.Marker[]) => {
  if (!map || !markers.length) return;

  const center = map.getCenter();
  const bearing = map.getBearing();
  const pitch = map.getPitch();

  markers.forEach(marker => {
    const coordinates = marker.getLngLat();
    const isVisible = isPointVisible(map, coordinates.lng, coordinates.lat);
    
    const element = marker.getElement();
    
    if (isVisible) {
      element.style.opacity = '1';
      element.style.transition = 'opacity 0.3s ease-in-out';
    } else {
      element.style.opacity = '0';
      element.style.transition = 'opacity 0.3s ease-in-out';
    }
  });
};
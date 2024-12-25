import mapboxgl from 'mapbox-gl';

export const updateMarkerVisibility = (map: mapboxgl.Map, markers: mapboxgl.Marker[]) => {
  const center = map.getCenter();
  const cameraBearing = map.getBearing();
  const cameraPitch = map.getPitch();
  
  // Convert pitch to radians
  const pitchRadians = (cameraPitch * Math.PI) / 180;
  
  markers.forEach((marker) => {
    const markerLngLat = marker.getLngLat();
    
    // Calculate the great circle distance between the center point and marker
    const lambda1 = (center.lng * Math.PI) / 180;
    const lambda2 = (markerLngLat.lng * Math.PI) / 180;
    const phi1 = (center.lat * Math.PI) / 180;
    const phi2 = (markerLngLat.lat * Math.PI) / 180;
    
    // Haversine formula for great circle angle
    const deltaLambda = lambda2 - lambda1;
    const deltaPhi = phi2 - phi1;
    
    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    // Convert to degrees
    const angle = (c * 180) / Math.PI;
    
    // Calculate the bearing between center and marker
    const y = Math.sin(deltaLambda) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) -
             Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
    let bearing = Math.atan2(y, x);
    bearing = (bearing * 180) / Math.PI;
    bearing = (bearing + 360) % 360;
    
    // Adjust bearing based on camera bearing
    const adjustedBearing = (bearing - cameraBearing + 360) % 360;
    
    // Calculate visibility threshold based on pitch
    const threshold = 90 + (cameraPitch / 2);
    
    // Check if marker is visible based on angle and adjusted bearing
    const isVisible = angle <= threshold && Math.abs(adjustedBearing - 180) <= threshold;
    
    const element = marker.getElement();
    element.style.opacity = isVisible ? '1' : '0';
    element.style.pointerEvents = isVisible ? 'auto' : 'none';
    
    // Add smooth transition
    element.style.transition = 'opacity 0.3s ease-in-out';
  });
};
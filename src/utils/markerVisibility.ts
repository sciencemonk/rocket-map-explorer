import mapboxgl from 'mapbox-gl';

export const updateMarkerVisibility = (map: mapboxgl.Map, markers: mapboxgl.Marker[]) => {
  const center = map.getCenter();
  const cameraBearing = map.getBearing();

  markers.forEach((marker) => {
    const markerLngLat = marker.getLngLat();
    
    const angle = Math.atan2(
      Math.sin(markerLngLat.lng - center.lng) * Math.cos(markerLngLat.lat),
      Math.cos(center.lat) * Math.sin(markerLngLat.lat) -
      Math.sin(center.lat) * Math.cos(markerLngLat.lat) * Math.cos(markerLngLat.lng - center.lng)
    );

    const angleDeg = ((angle * 180) / Math.PI + 360) % 360;
    const adjustedAngle = (angleDeg - cameraBearing + 360) % 360;
    const isVisible = Math.abs(adjustedAngle - 180) <= 90;
    
    const element = marker.getElement();
    element.style.opacity = isVisible ? '1' : '0';
    element.style.pointerEvents = isVisible ? 'auto' : 'none';
  });
};
import mapboxgl from 'mapbox-gl';

export const flyToLocation = (
  map: mapboxgl.Map,
  longitude: number,
  latitude: number
) => {
  map.flyTo({
    center: [longitude, latitude],
    zoom: 5,
    duration: 2000,
    essential: true
  });
};
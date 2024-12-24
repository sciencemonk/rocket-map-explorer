import { Launch } from '@/types';
import mapboxgl from 'mapbox-gl';

interface CreateMarkerProps {
  launch: Launch;
  map: mapboxgl.Map;
  onClick: (launch: Launch) => void;
}

export const createLaunchMarker = ({ launch, map, onClick }: CreateMarkerProps): mapboxgl.Marker => {
  const el = document.createElement('div');
  el.className = 'relative group';
  
  const markerContainer = document.createElement('div');
  markerContainer.className = 'w-8 h-8 flex items-center justify-center transform -translate-y-1/2';
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '32');
  svg.setAttribute('height', '32');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', '#FF4444');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.style.filter = 'drop-shadow(0 0 8px rgba(255, 68, 68, 0.8))';
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z');
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '10');
  circle.setAttribute('r', '3');
  
  svg.appendChild(path);
  svg.appendChild(circle);
  markerContainer.appendChild(svg);
  el.appendChild(markerContainer);

  const marker = new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
    offset: [0, 0]
  })
    .setLngLat([launch.longitude, launch.latitude])
    .addTo(map);

  el.addEventListener('click', () => onClick(launch));
  
  return marker;
};
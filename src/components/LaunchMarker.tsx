import { Launch } from '@/types';
import mapboxgl from 'mapbox-gl';
import { Rocket } from 'lucide-react';

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
  
  // Rocket icon path
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z');
  
  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttribute('d', 'M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z');
  
  const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path3.setAttribute('d', 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0');
  
  const path4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path4.setAttribute('d', 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5');

  svg.appendChild(path);
  svg.appendChild(path2);
  svg.appendChild(path3);
  svg.appendChild(path4);
  
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
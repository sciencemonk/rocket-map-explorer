import { Launch } from '@/types';
import mapboxgl from 'mapbox-gl';
import { Rocket } from 'lucide-react';

interface CreateMarkerProps {
  launch: Launch;
  map: mapboxgl.Map;
  onClick: (launch: Launch) => void;
}

export const createLaunchMarker = ({ launch, map, onClick }: CreateMarkerProps): mapboxgl.Marker => {
  // Create marker element
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.width = '24px';
  el.style.height = '24px';
  el.style.position = 'relative';
  el.style.cursor = 'pointer';
  
  // Create SVG container
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', '#FF4444');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.style.filter = 'drop-shadow(0 0 8px rgba(255, 68, 68, 0.8))';

  // Add rocket paths
  const paths = [
    'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
    'M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z',
    'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0',
    'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'
  ];

  paths.forEach(d => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  });

  el.appendChild(svg);

  // Add tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'absolute whitespace-nowrap px-2 py-1 bg-black/80 text-white text-xs rounded';
  tooltip.style.bottom = '100%';
  tooltip.style.left = '50%';
  tooltip.style.transform = 'translateX(-50%) translateY(-8px)';
  tooltip.style.opacity = '0';
  tooltip.style.transition = 'opacity 0.2s';
  tooltip.style.pointerEvents = 'none';
  tooltip.textContent = launch.name;

  el.appendChild(tooltip);

  // Show/hide tooltip on hover
  el.addEventListener('mouseenter', () => {
    tooltip.style.opacity = '1';
  });
  el.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
  });

  // Create and add the marker
  const marker = new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat([launch.longitude, launch.latitude])
    .addTo(map);

  el.addEventListener('click', () => onClick(launch));
  
  return marker;
};
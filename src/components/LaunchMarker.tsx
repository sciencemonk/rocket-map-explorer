import { Launch } from '@/types';
import mapboxgl from 'mapbox-gl';

interface CreateMarkerProps {
  launch: Launch;
  map: mapboxgl.Map;
  onClick: (launch: Launch) => void;
}

export const createLaunchMarker = ({ launch, map, onClick }: CreateMarkerProps): mapboxgl.Marker => {
  // Create marker element
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.width = '32px';
  el.style.height = '32px';
  el.style.position = 'relative';
  el.style.cursor = 'pointer';
  el.style.transformOrigin = 'center';
  el.style.transform = 'translate(-50%, -50%)';
  
  // Create image element
  const img = document.createElement('img');
  img.src = '/lovable-uploads/65a76590-13f3-41e7-b2e9-e8a253727f5c.png';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.filter = 'drop-shadow(0 0 8px rgba(255, 68, 68, 0.8))';
  img.style.transform = 'scale(1.2)';
  
  el.appendChild(img);

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
    anchor: 'center',
    rotationAlignment: 'map',
    pitchAlignment: 'map'
  })
    .setLngLat([launch.longitude, launch.latitude])
    .addTo(map);

  el.addEventListener('click', () => onClick(launch));
  
  return marker;
};
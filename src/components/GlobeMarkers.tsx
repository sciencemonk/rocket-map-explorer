import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Launch } from '@/types';

interface GlobeMarkersProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  launches: Launch[];
  onMarkerClick: (launch: Launch) => void;
}

const GlobeMarkers = ({ map, launches, onMarkerClick }: GlobeMarkersProps) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    launches.forEach((launch) => {
      const el = document.createElement('div');
      el.className = 'w-4 h-4 bg-primary rounded-full glow cursor-pointer';
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([launch.longitude, launch.latitude])
        .addTo(map.current!);

      el.addEventListener('click', () => onMarkerClick(launch));
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
    };
  }, [launches, onMarkerClick, map]);

  return null;
};

export default GlobeMarkers;
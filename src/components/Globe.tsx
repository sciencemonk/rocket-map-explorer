import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Launch } from '@/types';
import { MapPin } from 'lucide-react';

interface GlobeProps {
  launches: Launch[];
  onMarkerClick: (launch: Launch) => void;
}

const Globe = ({ launches, onMarkerClick }: GlobeProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState(localStorage.getItem('mapbox_token') || '');
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const handleSaveToken = () => {
    localStorage.setItem('mapbox_token', mapboxToken);
    window.location.reload();
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      projection: 'globe',
      zoom: 1.5,
      center: [0, 20],
      pitch: 45,
    });

    map.current = newMap;

    newMap.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    newMap.scrollZoom.disable();

    newMap.on('style.load', () => {
      newMap.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });
    });

    // Rotation animation
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
      if (!newMap) return;
      
      const zoom = newMap.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = newMap.getCenter();
        center.lng -= distancePerSecond;
        newMap.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    newMap.on('mousedown', () => {
      userInteracting = true;
    });
    
    newMap.on('dragstart', () => {
      userInteracting = true;
    });
    
    newMap.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    newMap.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    newMap.on('moveend', () => {
      spinGlobe();
    });

    spinGlobe();

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      // Remove map
      newMap.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  // Update markers when launches change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    launches.forEach((launch) => {
      const el = document.createElement('div');
      el.className = 'w-8 h-8 text-primary cursor-pointer hover:text-primary/80 transition-colors';
      
      // Create SVG icon
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '32');
      svg.setAttribute('height', '32');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      
      // Add map-pin path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z');
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '12');
      circle.setAttribute('cy', '10');
      circle.setAttribute('r', '3');
      
      svg.appendChild(path);
      svg.appendChild(circle);
      el.appendChild(svg);

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat([launch.longitude, launch.latitude])
        .addTo(map.current);

      el.addEventListener('click', () => onMarkerClick(launch));
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [launches, onMarkerClick]);

  if (!mapboxToken) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <input
          type="password"
          className="px-4 py-2 bg-secondary rounded"
          placeholder="Enter Mapbox token"
          value={mapboxToken}
          onChange={(e) => setMapboxToken(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-primary rounded"
          onClick={handleSaveToken}
        >
          Save Token
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
    </div>
  );
};

export default Globe;
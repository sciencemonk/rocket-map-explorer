import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Launch } from '@/types';

interface GlobeProps {
  launches: Launch[];
  onMarkerClick: (launch: Launch) => void;
}

const Globe = ({ launches, onMarkerClick }: GlobeProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState(localStorage.getItem('mapbox_token') || '');
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const handleSaveToken = () => {
    localStorage.setItem('mapbox_token', mapboxToken);
    window.location.reload();
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      projection: 'globe',
      zoom: 1.5,
      center: [0, 20],
      pitch: 45,
    });

    mapInstance.current = map;

    map.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.scrollZoom.disable();

    map.on('style.load', () => {
      map.setFog({
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
      if (!mapInstance.current) return;
      
      const zoom = mapInstance.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = mapInstance.current.getCenter();
        center.lng -= distancePerSecond;
        mapInstance.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    map.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.on('moveend', () => {
      spinGlobe();
    });

    spinGlobe();

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Remove map
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [mapboxToken]);

  // Update markers when launches change
  useEffect(() => {
    if (!mapInstance.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    launches.forEach((launch) => {
      const el = document.createElement('div');
      el.className = 'w-4 h-4 bg-primary rounded-full glow cursor-pointer';
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([launch.longitude, launch.latitude])
        .addTo(mapInstance.current!);

      el.addEventListener('click', () => onMarkerClick(launch));
      markersRef.current.push(marker);
    });
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
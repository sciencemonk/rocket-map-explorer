import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Launch } from '@/types';
import { createLaunchMarker } from './LaunchMarker';
import { flyToLocation } from '@/utils/mapUtils';

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

  const handleLaunchClick = (launch: Launch) => {
    if (map.current) {
      flyToLocation(map.current, launch.longitude, launch.latitude);
    }
    onMarkerClick(launch);
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
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      newMap.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    launches.forEach((launch) => {
      const marker = createLaunchMarker({
        launch,
        map: map.current!,
        onClick: handleLaunchClick
      });
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [launches]);

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

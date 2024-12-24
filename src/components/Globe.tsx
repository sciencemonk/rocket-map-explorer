import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Launch } from '@/types';
import { createLaunchMarker } from './LaunchMarker';
import { flyToLocation } from '@/utils/mapUtils';
import { useToast } from '@/hooks/use-toast';

interface GlobeProps {
  launches: Launch[];
  onMarkerClick: (launch: Launch) => void;
}

const Globe = ({ launches, onMarkerClick }: GlobeProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  const handleLaunchClick = (launch: Launch) => {
    if (map.current) {
      flyToLocation(map.current, launch.longitude, launch.latitude);
    }
    onMarkerClick(launch);
  };

  useEffect(() => {
    const initializeMap = async () => {
      try {
        if (!mapContainer.current) return;

        // Use the token directly for now
        mapboxgl.accessToken = 'pk.eyJ1IjoibWljaGFlbGFvIiwiYSI6ImNtNTE1dDhuMzFzemYycXEzbGZqNXRnM2kifQ.MLtu0XCi-r56Whozb0VXgw';
        
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
          setMapLoaded(true);
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

      } catch (error) {
        console.error('Error initializing map:', error);
        toast({
          title: "Error",
          description: "Unable to load map. Please try again later.",
          variant: "destructive",
        });
      }
    };

    initializeMap();

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [toast]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    console.log('Adding markers for launches:', launches);

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    launches.forEach((launch) => {
      if (launch.latitude && launch.longitude) {
        console.log('Creating marker for launch:', launch.name, 'at:', launch.latitude, launch.longitude);
        const marker = createLaunchMarker({
          launch,
          map: map.current!,
          onClick: handleLaunchClick
        });
        markersRef.current.push(marker);
      } else {
        console.warn('Missing coordinates for launch:', launch.name);
      }
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [launches, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
    </div>
  );
};

export default Globe;

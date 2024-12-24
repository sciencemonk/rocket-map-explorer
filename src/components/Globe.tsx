import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Launch } from '@/types';
import { createLaunchMarker } from './LaunchMarker';
import { flyToLocation } from '@/utils/mapUtils';
import { useToast } from '@/hooks/use-toast';
import { setupGlobeAnimation } from '@/utils/globeAnimation';
import { updateMarkerVisibility } from '@/utils/markerVisibility';

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

  const navigateToLaunch = (launch: Launch) => {
    if (map.current && launch.latitude && launch.longitude) {
      flyToLocation(map.current, launch.longitude, launch.latitude);
    }
  };

  const handleLaunchClick = (launch: Launch) => {
    navigateToLaunch(launch);
    onMarkerClick(launch);
  };

  // Expose navigation method through a custom property
  useEffect(() => {
    if (mapContainer.current) {
      mapContainer.current.navigateToLaunch = (launch: Launch) => {
        if (launch.latitude && launch.longitude) {
          navigateToLaunch(launch);
        }
      };
    }
  }, [mapLoaded]);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        if (!mapContainer.current) return;

        mapboxgl.accessToken = 'pk.eyJ1IjoibWljaGFlbGFvIiwiYSI6ImNtNTE1dDhuMzFzemYycXEzbGZqNXRnM2kifQ.MLtu0XCi-r56Whozb0VXgw';
        
        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/satellite-v9',
          projection: 'globe',
          zoom: 1.7,
          center: [0, 0],
          pitch: 35,
          minZoom: 1,
          bearing: 0,
          dragRotate: true,
          touchZoomRotate: true,
          touchPitch: true,
          interactive: true
        });

        map.current = newMap;

        newMap.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
            showZoom: true,
            showCompass: true,
          }),
          'top-right'
        );

        newMap.on('style.load', () => {
          newMap.setFog({
            color: 'rgb(255, 255, 255)',
            'high-color': 'rgb(200, 200, 225)',
            'horizon-blend': 0.2,
          });
          setMapLoaded(true);
          
          setTimeout(() => {
            newMap.resize();
          }, 100);
        });

        const handleVisibility = () => updateMarkerVisibility(newMap, markersRef.current);
        newMap.on('rotate', handleVisibility);
        newMap.on('pitch', handleVisibility);
        newMap.on('zoom', handleVisibility);
        newMap.on('move', handleVisibility);

        setupGlobeAnimation(newMap);

        const handleResize = () => {
          if (newMap) {
            newMap.resize();
          }
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
        };

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

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    launches.forEach((launch) => {
      if (launch.latitude && launch.longitude) {
        const marker = createLaunchMarker({
          launch,
          map: map.current!,
          onClick: handleLaunchClick
        });
        markersRef.current.push(marker);
      }
    });

    if (map.current) {
      updateMarkerVisibility(map.current, markersRef.current);
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [launches, mapLoaded]);

  return (
    <div className="relative w-full h-full flex items-start">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
    </div>
  );
};

export default Globe;
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Launch } from '@/types';

interface GlobeProps {
  launches: Launch[];
  onMarkerClick: (launch: Launch) => void;
}

const Globe = ({ launches, onMarkerClick }: GlobeProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    const map = L.map(mapContainer.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      worldCopyJump: true,
    });

    mapInstance.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add navigation controls
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    // Custom marker icon with glow effect
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div class="w-4 h-4 bg-primary rounded-full glow"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    // Update markers when launches change
    launches.forEach((launch) => {
      const marker = L.marker([launch.latitude, launch.longitude], {
        icon: customIcon
      }).addTo(map);

      marker.on('click', () => onMarkerClick(launch));
      markersRef.current.push(marker);
    });

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
  }, [launches, onMarkerClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
      <style jsx global>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        .glow {
          box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073;
          animation: glow 1.5s ease-in-out infinite alternate;
        }
        @keyframes glow {
          from {
            box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #e60073;
          }
          to {
            box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073;
          }
        }
      `}</style>
    </div>
  );
};

export default Globe;
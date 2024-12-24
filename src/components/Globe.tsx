import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Launch } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface GlobeProps {
  launches: Launch[];
  onMarkerClick: (launch: Launch) => void;
}

const Globe = ({ launches, onMarkerClick }: GlobeProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { toast } = useToast();

  // Fetch token from Supabase on component mount
  useEffect(() => {
    const fetchMapboxToken = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'mapbox_token')
        .single();

      if (error) {
        console.error('Error fetching Mapbox token:', error);
        // Fallback to localStorage if Supabase fails
        const localToken = localStorage.getItem('mapbox_token');
        if (localToken) {
          setMapboxToken(localToken);
          // Migrate token to Supabase
          handleSaveToken(localToken);
        }
        return;
      }

      if (data) {
        setMapboxToken(data.value);
      }
    };

    fetchMapboxToken();
  }, []);

  const handleSaveToken = async (token: string) => {
    const { error: upsertError } = await supabase
      .from('settings')
      .upsert(
        { 
          key: 'mapbox_token', 
          value: token,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'key' }
      );

    if (upsertError) {
      console.error('Error saving token:', upsertError);
      toast({
        title: "Error saving token",
        description: "There was a problem saving your Mapbox token. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setMapboxToken(token);
    // Remove from localStorage as we're now using Supabase
    localStorage.removeItem('mapbox_token');
    toast({
      title: "Token saved",
      description: "Your Mapbox token has been saved successfully.",
    });
    window.location.reload();
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      projection: 'globe',
      zoom: 1.5,
      center: [0, 20],
      pitch: 45,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.scrollZoom.disable();

    map.current.on('style.load', () => {
      map.current?.setFog({
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
      if (!map.current) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('moveend', () => {
      spinGlobe();
    });

    spinGlobe();

    return () => {
      map.current?.remove();
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
      el.className = 'w-4 h-4 bg-primary rounded-full glow cursor-pointer';
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([launch.longitude, launch.latitude])
        .addTo(map.current!);

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
          onClick={() => handleSaveToken(mapboxToken)}
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
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

export const useGlobeRotation = (map: React.MutableRefObject<mapboxgl.Map | null>) => {
  useEffect(() => {
    if (!map.current) return;

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

    const handleMouseDown = () => {
      userInteracting = true;
    };

    const handleDragStart = () => {
      userInteracting = true;
    };

    const handleMouseUp = () => {
      userInteracting = false;
      spinGlobe();
    };

    const handleTouchEnd = () => {
      userInteracting = false;
      spinGlobe();
    };

    const handleMoveEnd = () => {
      spinGlobe();
    };

    map.current.on('mousedown', handleMouseDown);
    map.current.on('dragstart', handleDragStart);
    map.current.on('mouseup', handleMouseUp);
    map.current.on('touchend', handleTouchEnd);
    map.current.on('moveend', handleMoveEnd);

    spinGlobe();

    return () => {
      if (!map.current) return;
      map.current.off('mousedown', handleMouseDown);
      map.current.off('dragstart', handleDragStart);
      map.current.off('mouseup', handleMouseUp);
      map.current.off('touchend', handleTouchEnd);
      map.current.off('moveend', handleMoveEnd);
    };
  }, [map]);
};
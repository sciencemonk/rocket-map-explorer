import mapboxgl from 'mapbox-gl';

export const setupGlobeAnimation = (map: mapboxgl.Map) => {
  const secondsPerRevolution = 240;
  const maxSpinZoom = 5;
  const slowSpinZoom = 3;
  let userInteracting = false;
  let spinEnabled = true;

  function spinGlobe() {
    if (!map) return;
    
    const zoom = map.getZoom();
    if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
      let distancePerSecond = 360 / secondsPerRevolution;
      if (zoom > slowSpinZoom) {
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }
      const center = map.getCenter();
      center.lng -= distancePerSecond;
      map.easeTo({ center, duration: 1000, easing: (n) => n });
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
};
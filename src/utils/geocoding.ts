export const geocodeLocation = async (location: string): Promise<{ lat: number; lon: number } | null> => {
  try {
    // First get the Mapbox token from our secure endpoint
    const tokenResponse = await fetch('/api/mapbox-token');
    const { token } = await tokenResponse.json();
    
    if (!token) {
      console.error('No Mapbox token available');
      return null;
    }

    // Use Mapbox's geocoding API
    const query = encodeURIComponent(location);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&limit=1`
    );
    
    const data = await response.json();
    
    if (data.features && data.features[0]) {
      const [lon, lat] = data.features[0].center;
      return {
        lat,
        lon
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

export const geocodeLocation = async (location: string): Promise<{ lat: number; lon: number } | null> => {
  try {
    const query = encodeURIComponent(location);
    const response = await fetch(`${NOMINATIM_API}?q=${query}&format=json&limit=1`);
    const data = await response.json();
    
    if (data && data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};
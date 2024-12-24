import { Launch, LaunchResponse } from '@/types';
import { geocodeLocation } from '@/utils/geocoding';

export const fetchLaunches = async (): Promise<Launch[]> => {
  try {
    const response = await fetch('https://fdo.rocketlaunch.live/json/launches/next/5');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: LaunchResponse = await response.json();
    
    // Process launches sequentially to avoid rate limiting
    const launches = [];
    for (const launch of data.result) {
      const location = launch.pad.name;
      const coordinates = await geocodeLocation(location);
      
      launches.push({
        id: launch.id.toString(),
        name: launch.name,
        date: launch.date_str,
        location: location,
        details: launch.launch_description,
        provider: launch.provider.name,
        latitude: coordinates?.lat || parseFloat(launch.pad.latitude),
        longitude: coordinates?.lon || parseFloat(launch.pad.longitude)
      });
    }
    
    return launches;
  } catch (error) {
    console.error('Error fetching launches:', error);
    throw error;
  }
};
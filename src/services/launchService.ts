import { Launch, RocketLaunchResponse } from '@/types';

export const fetchLaunches = async (): Promise<Launch[]> => {
  try {
    const response = await fetch('https://fdo.rocketlaunch.live/json/launches/next/5');
    if (!response.ok) {
      throw new Error('Failed to fetch launches');
    }
    
    const data: RocketLaunchResponse = await response.json();
    
    return data.launches.map((launch) => ({
      id: launch.id.toString(),
      name: launch.name,
      date: launch.sort_date,
      location: launch.pad.name,
      details: launch.launch_description,
      provider: launch.provider.name,
      latitude: parseFloat(launch.pad.latitude),
      longitude: parseFloat(launch.pad.longitude),
    }));
  } catch (error) {
    console.error('Error fetching launches:', error);
    throw error;
  }
};
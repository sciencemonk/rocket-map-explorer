import { Launch, LaunchResponse } from '@/types';
import { geocodeLocation } from '@/utils/geocoding';
import { supabase } from '@/integrations/supabase/client';

export const fetchLaunches = async (): Promise<Launch[]> => {
  try {
    // Fetch API key from Supabase
    const { data, error: keyError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'ROCKETLAUNCH_API_KEY')
      .single();

    if (keyError || !data) {
      console.error('Error fetching API key:', keyError);
      throw new Error('Failed to fetch API key');
    }

    const apiKey = data.value;
    if (!apiKey) {
      throw new Error('API key not found in settings');
    }

    const response = await fetch('https://fdo.rocketlaunch.live/json/launches/next/30', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data2: LaunchResponse = await response.json();
    
    // Process launches sequentially to avoid rate limiting
    const launches = [];
    for (const launch of data2.result) {
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
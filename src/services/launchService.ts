import { FirecrawlService } from './firecrawlService';
import { Launch } from '@/types';

export const fetchLaunches = async (): Promise<Launch[]> => {
  try {
    const result = await FirecrawlService.crawlWebsite('https://www.rocketlaunch.live');
    
    if (!result.success) {
      throw new Error(result.error);
    }

    // Parse the scraped data to extract launch information
    const launches: Launch[] = [];
    const launchElements = result.data.querySelectorAll('.launch');
    
    launchElements.forEach((element: any, index: number) => {
      const name = element.querySelector('.mission')?.textContent?.trim() || 'Unknown Mission';
      const dateStr = element.querySelector('.date')?.textContent?.trim() || new Date().toISOString();
      const location = element.querySelector('.location')?.textContent?.trim() || 'Unknown Location';
      const provider = element.querySelector('.provider')?.textContent?.trim() || 'Unknown Provider';
      const details = element.querySelector('.details')?.textContent?.trim() || 'No details available';
      
      // Extract coordinates from location (this is a simplified example)
      // In reality, you might need to use a geocoding service
      const coordinates = getCoordinatesFromLocation(location);
      
      launches.push({
        id: `launch-${index}`,
        name,
        date: dateStr,
        location,
        details,
        provider,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      });
    });
    
    return launches;
  } catch (error) {
    console.error('Error fetching launches:', error);
    throw error;
  }
};

// Helper function to get coordinates from location names
// This is a simplified example - in production, you'd want to use a proper geocoding service
const getCoordinatesFromLocation = (location: string) => {
  // Example mapping of common launch sites
  const launchSites: Record<string, { latitude: number; longitude: number }> = {
    'Cape Canaveral': { latitude: 28.3922, longitude: -80.6077 },
    'Kennedy Space Center': { latitude: 28.5728, longitude: -80.6490 },
    'Vandenberg': { latitude: 34.7420, longitude: -120.5724 },
    'Baikonur': { latitude: 45.9646, longitude: 63.3052 },
    'Kourou': { latitude: 5.2322, longitude: -52.7693 },
  };

  // Check if the location contains any known launch site
  for (const [site, coords] of Object.entries(launchSites)) {
    if (location.toLowerCase().includes(site.toLowerCase())) {
      return coords;
    }
  }

  // Default to Cape Canaveral if location is not recognized
  return launchSites['Cape Canaveral'];
};
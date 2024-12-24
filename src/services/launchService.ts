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
    // Add parsing logic here based on the scraped data structure
    
    return launches;
  } catch (error) {
    console.error('Error fetching launches:', error);
    throw error;
  }
};
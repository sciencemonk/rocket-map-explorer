import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLaunches } from '@/services/launchService';
import { Launch } from '@/types';
import Globe from '@/components/Globe';
import LaunchList from '@/components/LaunchList';
import LaunchModal from '@/components/LaunchModal';

const Index = () => {
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);

  const { data: launches = [], isLoading, error } = useQuery({
    queryKey: ['launches'],
    queryFn: fetchLaunches,
  });

  const handleLaunchClick = (launch: Launch) => {
    setSelectedLaunch(launch);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex flex-1">
        <div className="w-1/3 p-4 border-r border-border">
          <h1 className="text-2xl font-bold mb-4">Upcoming Launches</h1>
          {isLoading ? (
            <p>Loading launches...</p>
          ) : error ? (
            <p className="text-destructive">Error loading launches</p>
          ) : (
            <LaunchList launches={launches} onLaunchClick={handleLaunchClick} />
          )}
        </div>
        <div className="w-2/3 flex items-center justify-center relative">
          <Globe launches={launches} onMarkerClick={handleLaunchClick} />
        </div>
      </div>
      <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">
        Created by{' '}
        <a 
          href="https://www.instagram.com/astroathens" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          AstroAthens
        </a>
      </div>
      <LaunchModal
        launch={selectedLaunch}
        onClose={() => setSelectedLaunch(null)}
      />
    </div>
  );
};

export default Index;
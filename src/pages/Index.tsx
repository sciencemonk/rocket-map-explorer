import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLaunches } from '@/services/launchService';
import { Launch } from '@/types';
import Globe from '@/components/Globe';
import LaunchList from '@/components/LaunchList';
import LaunchModal from '@/components/LaunchModal';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const isMobile = useIsMobile();

  const { data: launches = [], isLoading, error } = useQuery({
    queryKey: ['launches'],
    queryFn: fetchLaunches,
  });

  const handleLaunchClick = (launch: Launch) => {
    setSelectedLaunch(launch);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-secondary/50 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>🌍</span>
          Space Globe
        </h1>
        <div className="text-sm text-muted-foreground">
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
      </nav>
      <div className={`flex flex-1 ${isMobile ? 'flex-col' : 'flex-row'}`}>
        {isMobile ? (
          <>
            <div className="h-[50vh] w-full">
              <Globe launches={launches} onMarkerClick={handleLaunchClick} />
            </div>
            <div className="w-full p-4">
              <h1 className="text-2xl font-bold mb-4">Upcoming Launches</h1>
              {isLoading ? (
                <p>Loading launches...</p>
              ) : error ? (
                <p className="text-destructive">Error loading launches</p>
              ) : (
                <LaunchList launches={launches} onLaunchClick={handleLaunchClick} />
              )}
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
      <LaunchModal
        launch={selectedLaunch}
        onClose={() => setSelectedLaunch(null)}
      />
    </div>
  );
};

export default Index;
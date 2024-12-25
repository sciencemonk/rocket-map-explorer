import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLaunches } from '@/services/launchService';
import { Launch } from '@/types';
import Globe from '@/components/Globe';
import LaunchList from '@/components/LaunchList';
import LaunchModal from '@/components/LaunchModal';
import Footer from '@/components/Footer';
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

  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-secondary/50 backdrop-blur-sm border-b border-border px-6 py-4 transition-colors duration-200">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 
            onClick={handleLogoClick}
            className="text-2xl font-bold text-white flex items-center gap-2 whitespace-nowrap cursor-pointer hover:text-primary/80 transition-colors"
          >
            <span className="animate-pulse">🌍</span>
            Space Globe
          </h1>
          <div className="text-sm text-muted-foreground text-right">
            <span className="text-xs sm:text-sm">Created by{' '}</span>
            <a 
              href="https://www.instagram.com/astroathens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors text-xs sm:text-sm"
            >
              AstroAthens
            </a>
          </div>
        </div>
      </nav>
      <div className={`flex flex-1 ${isMobile ? 'flex-col' : 'flex-row'}`}>
        {isMobile ? (
          <>
            <div className="h-[50vh] w-full">
              <Globe launches={launches} onMarkerClick={handleLaunchClick} />
            </div>
            <div className="w-full p-4 animate-fade-in">
              <h1 className="text-2xl font-bold mb-4">Upcoming Launches</h1>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-destructive bg-destructive/10 p-4 rounded-lg">
                  Error loading launches. Please try again later.
                </div>
              ) : (
                <LaunchList launches={launches} onLaunchClick={handleLaunchClick} />
              )}
            </div>
          </>
        ) : (
          <>
            <div className="w-1/3 p-4 border-r border-border animate-fade-in">
              <h1 className="text-2xl font-bold mb-4">Upcoming Launches</h1>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-destructive bg-destructive/10 p-4 rounded-lg">
                  Error loading launches. Please try again later.
                </div>
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
      <Footer />
      <LaunchModal
        launch={selectedLaunch}
        onClose={() => setSelectedLaunch(null)}
      />
    </div>
  );
};

export default Index;
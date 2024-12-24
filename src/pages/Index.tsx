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
    <div className="min-h-screen flex">
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
      <div className="w-2/3 relative">
        <Globe launches={launches} onMarkerClick={handleLaunchClick} />
      </div>
      <LaunchModal
        launch={selectedLaunch}
        onClose={() => setSelectedLaunch(null)}
      />
    </div>
  );
};

export default Index;
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLaunches } from '@/services/launchService';
import { Launch } from '@/types';
import Globe from '@/components/Globe';
import LaunchList from '@/components/LaunchList';
import LaunchModal from '@/components/LaunchModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FirecrawlService } from '@/services/firecrawlService';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [apiKey, setApiKey] = useState('');
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const { toast } = useToast();

  const { data: launches = [], isLoading, error } = useQuery({
    queryKey: ['launches'],
    queryFn: fetchLaunches,
    enabled: !!FirecrawlService.getApiKey(),
  });

  const handleSaveApiKey = () => {
    FirecrawlService.saveApiKey(apiKey);
    toast({
      title: "API Key Saved",
      description: "Your Firecrawl API key has been saved successfully.",
    });
    setApiKey('');
  };

  const handleLaunchClick = (launch: Launch) => {
    setSelectedLaunch(launch);
  };

  if (!FirecrawlService.getApiKey()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Welcome to Space Globe</h1>
            <p className="text-muted-foreground">
              Please enter your Firecrawl API key to start tracking rocket launches.
            </p>
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter your Firecrawl API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={handleSaveApiKey}
              disabled={!apiKey}
            >
              Save API Key
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
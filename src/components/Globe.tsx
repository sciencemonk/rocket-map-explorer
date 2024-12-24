import { Launch } from '@/types';
import { useMapbox } from '@/hooks/useMapbox';
import { useGlobeRotation } from '@/hooks/useGlobeRotation';
import GlobeMarkers from './GlobeMarkers';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GlobeProps {
  launches: Launch[];
  onMarkerClick: (launch: Launch) => void;
}

const Globe = ({ launches, onMarkerClick }: GlobeProps) => {
  const { mapContainer, map, isLoading, error } = useMapbox();
  useGlobeRotation(map);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
      <GlobeMarkers map={map} launches={launches} onMarkerClick={onMarkerClick} />
    </div>
  );
};

export default Globe;
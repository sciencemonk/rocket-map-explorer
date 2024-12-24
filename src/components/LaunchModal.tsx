import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Launch } from '@/types';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';

interface LaunchModalProps {
  launch: Launch | null;
  onClose: () => void;
  onGoToSite?: (launch: Launch) => void;
}

const LaunchModal = ({ launch, onClose, onGoToSite }: LaunchModalProps) => {
  if (!launch) return null;

  const handleGoToSite = () => {
    if (onGoToSite && launch) {
      onGoToSite(launch);
    }
  };

  return (
    <Dialog open={!!launch} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{launch.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Launch Date</h4>
            <p className="text-sm">
              {format(new Date(launch.date), "PPP 'at' p")}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Location</h4>
            <p className="text-sm">{launch.location}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Mission Details</h4>
            <p className="text-sm">{launch.details}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Launch Provider</h4>
            <p className="text-sm">{launch.provider}</p>
          </div>
          <Button 
            onClick={handleGoToSite}
            className="w-full mt-4"
          >
            <MapPin className="mr-2" />
            Go to Launch Site
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LaunchModal;
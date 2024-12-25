import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Launch } from '@/types';
import { format } from 'date-fns';

interface LaunchModalProps {
  launch: Launch | null;
  onClose: () => void;
}

const LaunchModal = ({ launch, onClose }: LaunchModalProps) => {
  if (!launch) return null;

  return (
    <Dialog open={!!launch} onOpenChange={onClose}>
      <DialogContent className="fixed top-20 right-4 max-w-[400px] shadow-xl bg-background/95 backdrop-blur-sm border-primary/20">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LaunchModal;
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Launch } from '@/types';
import { format, isValid, parseISO } from 'date-fns';

interface LaunchModalProps {
  launch: Launch | null;
  onClose: () => void;
}

const LaunchModal = ({ launch, onClose }: LaunchModalProps) => {
  if (!launch) return null;

  const formatDate = (dateStr: string) => {
    try {
      // First try parsing as ISO date
      const date = parseISO(dateStr);
      if (isValid(date)) {
        return format(date, "PPP 'at' p");
      }
      
      // If that fails, try parsing as regular date
      const fallbackDate = new Date(dateStr);
      if (isValid(fallbackDate)) {
        return format(fallbackDate, "PPP 'at' p");
      }
      
      // If all parsing fails, return the original string
      return dateStr;
    } catch (error) {
      console.error('Error parsing date:', error);
      return dateStr;
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
              {formatDate(launch.date)}
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
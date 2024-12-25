import { Launch } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';

interface LaunchListProps {
  launches: Launch[];
  onLaunchClick: (launch: Launch) => void;
}

const LaunchList = ({ launches, onLaunchClick }: LaunchListProps) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, "PPP 'at' p");
    } catch (error) {
      console.error('Error parsing date:', error);
      return dateStr;
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-2rem)] w-full rounded-lg">
      <div className="space-y-4 p-4">
        {launches.map((launch) => (
          <Card
            key={launch.id}
            className="p-4 hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-lg"
            onClick={() => onLaunchClick(launch)}
          >
            <h3 className="font-bold text-lg text-primary">{launch.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(launch.date)}
            </p>
            <p className="text-sm mt-2 flex items-center gap-2">
              <span className="text-primary">📍</span>
              {launch.location}
            </p>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default LaunchList;
export interface Launch {
  id: string;
  name: string;
  date: string;
  location: string;
  details: string;
  provider: string;
  latitude: number;
  longitude: number;
}

export interface RocketLaunchResponse {
  result: string;
  count: number;
  launches: {
    id: string;
    name: string;
    sort_date: string;
    pad: {
      name: string;
      latitude: string;
      longitude: string;
    };
    launch_description: string;
    provider: {
      name: string;
    };
  }[];
}
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

export interface LaunchResponse {
  result: Array<{
    id: string;
    name: string;
    date_str: string;
    pad: {
      name: string;
      latitude: string;
      longitude: string;
      location: {
        name: string;
        country: string;
      };
    };
    launch_description: string;
    provider: {
      name: string;
    };
  }>;
}
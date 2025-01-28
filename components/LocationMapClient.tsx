'use client'; // Mark this as a Client Component

import dynamic from 'next/dynamic';

const LocationMap = dynamic(() => import('./LocationMap'), {
  ssr: false, // Disable SSR for Leaflet
});

interface LocationMapClientProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

const LocationMapClient: React.FC<LocationMapClientProps> = ({ latitude, longitude, locationName }) => {
  return <LocationMap latitude={latitude} longitude={longitude} locationName={locationName} />;
};

export default LocationMapClient;
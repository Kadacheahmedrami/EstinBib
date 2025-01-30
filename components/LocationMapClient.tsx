'use client'; // Mark this as a Client Component

import dynamic from 'next/dynamic';
import {LocationMapProps} from '@/types/_types'


const LocationMap = dynamic(() => import('./LocationMap'), {
  ssr: false, // Disable SSR for Leaflet
});


const LocationMapClient: React.FC<LocationMapProps> = ({ latitude, longitude, locationName }) => {
  return <LocationMap latitude={latitude} longitude={longitude} locationName={locationName} />;
};

export default LocationMapClient;
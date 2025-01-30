import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {LocationMapProps} from '@/types/_types'
// Fix for default marker icons in Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});



// Component to handle map click events
const MapClickHandler: React.FC<{ onMapClick: () => void }> = ({ onMapClick }) => {
  const map = useMap();

  useEffect(() => {
    const handleClick = () => {
      onMapClick();
    };

    map.on('click', handleClick);

    // Cleanup event listener on unmount
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);

  return null;
};

const LocationMap: React.FC<LocationMapProps> = ({ latitude, longitude, locationName }) => {
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  const handleMapClick = () => {
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="w-full md:max-w-[800px] z-0 max-w-2xl mt-8 mx-auto text-center">
  
      <div className="w-full h-[260px]  rounded-lg border-2 border-gray-200 shadow-md overflow-hidden">
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          className="w-full h-full cursor-pointer"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[latitude, longitude]} icon={defaultIcon}>
            <Popup>
              {locationName} <br /> Click anywhere on the map to open in Google Maps.
            </Popup>
          </Marker>
          <MapClickHandler onMapClick={handleMapClick} />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationMap;
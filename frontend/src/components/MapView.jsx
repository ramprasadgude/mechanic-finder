import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { FaWrench, FaStar } from 'react-icons/fa';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const MapView = ({ mechanics, onRequest }) => {
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  
  // Try to find an average location or default to continental US roughly
  let center = { lat: 39.8283, lng: -98.5795 };
  let zoom = 4;

  if (mechanics && mechanics.length > 0) {
    const validMechanics = mechanics.filter(m => m.geometry && m.geometry.coordinates && m.geometry.coordinates.length === 2 && m.geometry.coordinates[0] !== 0);
    if (validMechanics.length > 0) {
      // coordinates are [longitude, latitude].
      const lats = validMechanics.map(m => m.geometry.coordinates[1]);
      const lngs = validMechanics.map(m => m.geometry.coordinates[0]);
      center = {
        lat: lats.reduce((a, b) => a + b, 0) / lats.length,
        lng: lngs.reduce((a, b) => a + b, 0) / lngs.length
      };
      zoom = 11;
    }
  }

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  if (loadError || !import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-gray-200 relative z-10 flex flex-col items-center justify-center bg-white text-center p-8">
        <FaWrench className="text-5xl text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Map Configuration Required</h2>
        <p className="text-gray-600">Please add your <code className="bg-gray-100 px-2 py-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to the <code className="bg-gray-100 px-2 py-1 rounded">frontend/.env</code> file to enable Google Maps integration.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative z-10">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={{
          // Use default light Google Maps styling instead of dark theme overrides
          disableDefaultUI: false
        }}
      >
        {mechanics?.map((mechanic) => {
          if (!mechanic.geometry || !mechanic.geometry.coordinates || mechanic.geometry.coordinates.length < 2) return null;
          
          return (
            <Marker
              key={mechanic._id}
              position={{ lat: mechanic.geometry.coordinates[1], lng: mechanic.geometry.coordinates[0] }}
              onClick={() => setSelectedMechanic(mechanic)}
            />
          );
        })}

        {selectedMechanic && (
          <InfoWindow
            position={{ lat: selectedMechanic.geometry.coordinates[1], lng: selectedMechanic.geometry.coordinates[0] }}
            onCloseClick={() => setSelectedMechanic(null)}
          >
            <div className="p-2 min-w-[200px] text-zinc-900">
              <h3 className="font-bold text-lg mb-1">{selectedMechanic.name}</h3>
              <p className="text-gray-400 text-sm mb-2 font-medium">{selectedMechanic.specialty}</p>
              <div className="flex items-center gap-1 text-blue-600 text-sm mb-3">
                <FaStar />
                <span className="font-bold text-black">{selectedMechanic.rating ? selectedMechanic.rating.toFixed(1) : 'New'}</span>
                <span className="text-gray-500 text-xs ml-1">({selectedMechanic.numOfReviews} reviews)</span>
              </div>
              {onRequest && selectedMechanic.available && (
                <button
                  onClick={() => onRequest(selectedMechanic)}
                  className="w-full bg-blue-600 text-white py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Request Service
                </button>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;

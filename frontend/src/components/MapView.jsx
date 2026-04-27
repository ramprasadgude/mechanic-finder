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
      <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-zinc-800 relative z-10 flex flex-col items-center justify-center bg-zinc-900 text-center p-8">
        <FaWrench className="text-5xl text-brand-red mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Map Configuration Required</h2>
        <p className="text-zinc-400">Please add your <code className="bg-zinc-800 px-2 py-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to the <code className="bg-zinc-800 px-2 py-1 rounded">frontend/.env</code> file to enable Google Maps integration.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center bg-zinc-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-zinc-800 relative z-10">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={{
          styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#263c3f" }],
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ color: "#6b9a76" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#212a37" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9ca5b3" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#746855" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#1f2835" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#f3d19c" }],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#2f3948" }],
            },
            {
              featureType: "transit.station",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#515c6d" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#17263c" }],
            },
          ]
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
              <p className="text-zinc-600 text-sm mb-2 font-medium">{selectedMechanic.specialty}</p>
              <div className="flex items-center gap-1 text-brand-red text-sm mb-3">
                <FaStar />
                <span className="font-bold text-black">{selectedMechanic.rating ? selectedMechanic.rating.toFixed(1) : 'New'}</span>
                <span className="text-zinc-500 text-xs ml-1">({selectedMechanic.numOfReviews} reviews)</span>
              </div>
              {onRequest && selectedMechanic.available && (
                <button
                  onClick={() => onRequest(selectedMechanic)}
                  className="w-full bg-brand-red text-white py-2 rounded-lg font-bold text-sm shadow-[0_0_10px_rgba(234,0,41,0.3)] hover:bg-brand-red-light transition-colors"
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

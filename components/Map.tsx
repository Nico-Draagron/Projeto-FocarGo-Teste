

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { CollectionPoint } from '../types';
import { MATERIAL_CONFIG } from '../gamificationData';

// Custom Icons Generator
const createCustomIcon = (emoji: string) => {
  return L.divIcon({
    html: `<div style="font-size: 32px; text-align: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); transform: translateY(-50%);">${emoji}</div>`,
    className: 'custom-marker-container',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const userIcon = L.divIcon({
  html: '<div style="font-size: 24px; background: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 4px rgba(15, 143, 109, 0.4);">📍</div>',
  className: 'custom-marker-container',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

interface MapViewProps {
  collectionPoints: CollectionPoint[];
  userLocation?: { lat: number; lng: number };
}

export const MapView = ({ collectionPoints = [], userLocation }: MapViewProps) => {
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(null);
  const [filters, setFilters] = useState<string[]>([]);

  const defaultCenter: [number, number] = [-23.5505, -46.6333]; // São Paulo Center
  const mapCenter: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : defaultCenter;

  const getMarkerIcon = (type: string) => {
    const icons: Record<string, string> = {
      cooperative: '♻️',
      electronics: '⚡',
      ecopoint: '🌿',
      pharmacy: '💊'
    };
    return createCustomIcon(icons[type] || '📍');
  };

  const filteredPoints = filters.length > 0 
    ? collectionPoints.filter(p => filters.includes(p.type))
    : collectionPoints;

  const toggleFilter = (filter: string) => {
    if (filter === 'all') {
      setFilters([]);
    } else {
      setFilters(prev => 
        prev.includes(filter) 
          ? prev.filter(f => f !== filter)
          : [...prev, filter]
      );
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] flex flex-col bg-white rounded-3xl overflow-hidden relative border border-gray-100 shadow-sm animate-in fade-in">
      
      {/* Header with Filters */}
      <div className="absolute top-4 left-4 right-4 z-[500] pointer-events-none">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/20">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => toggleFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                filters.length === 0 
                  ? 'bg-teal text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {['cooperative', 'electronics', 'ecopoint', 'pharmacy'].map(f => (
              <button 
                key={f}
                onClick={() => toggleFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors capitalize ${
                  filters.includes(f) 
                    ? 'bg-teal text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'cooperative' ? 'Cooperatives' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative z-0">
        <MapContainer 
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={true}
          className="leaflet-container"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>
                <div className="text-center font-bold">You are here</div>
              </Popup>
            </Marker>
          )}

          {filteredPoints.map(point => (
            <Marker 
              key={point.id}
              position={[point.location.lat, point.location.lng]}
              icon={getMarkerIcon(point.type)}
              eventHandlers={{
                click: () => setSelectedPoint(point)
              }}
            >
              <Popup>
                <div className="text-center">
                  <div className="text-2xl mb-1">{point.photo}</div>
                  <h4 className="font-bold text-sm">{point.name}</h4>
                  <p className="text-xs text-gray-500 capitalize">{point.type}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Detail Card (Bottom Sheet) */}
      {selectedPoint && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] p-6 z-[600] max-h-[60vh] overflow-y-auto animate-in slide-in-from-bottom-4 border-t border-gray-100">
          <button 
            onClick={() => setSelectedPoint(null)}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            ×
          </button>

          <div className="flex items-start gap-4 mb-5">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
              {selectedPoint.photo}
            </div>
            <div className="flex-1">
              <span className="inline-block bg-teal/10 text-teal px-2 py-0.5 rounded-md text-[10px] font-black uppercase mb-1 tracking-wider capitalize">
                {selectedPoint.type}
              </span>
              <h2 className="text-xl font-black text-dark leading-tight">{selectedPoint.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{selectedPoint.address}</p>
            </div>
          </div>

          <div className="mb-5">
            <h3 className="font-bold text-gray-400 text-xs uppercase mb-2">Accepted Materials</h3>
            <div className="flex flex-wrap gap-2">
              {selectedPoint.acceptedMaterials.map(m => {
                 const config = MATERIAL_CONFIG[m];
                 return (
                  <span 
                    key={m} 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-transform hover:scale-105"
                    style={{ 
                      backgroundColor: config ? `${config.color}15` : '#f3f4f6',
                      color: config ? config.color : '#6b7280',
                      border: `1px solid ${config ? `${config.color}30` : '#e5e7eb'}`
                    }}
                  >
                    <span>{config?.icon}</span>
                    <span>{config?.name || m}</span>
                  </span>
                 );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
              <span className="text-2xl">🕒</span>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Hours</p>
                <p className="text-xs font-bold text-dark">{selectedPoint.hours}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Rating</p>
                <p className="text-xs font-bold text-dark">{selectedPoint.rating}/5.0</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <a 
              href={`tel:${selectedPoint.phone}`} 
              className="flex-1 bg-white border-2 border-gray-100 text-dark py-3.5 rounded-xl font-bold text-center hover:bg-gray-50 hover:border-gray-200 transition-colors"
            >
              📞 Call
            </a>
            <button className="flex-1 bg-gradient-to-r from-teal to-teal-light text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
              <span>🧭</span> Navigate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

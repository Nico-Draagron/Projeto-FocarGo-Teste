
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CollectionPoint } from '../types';
import { MATERIAL_CONFIG } from '../gamificationData';
import { Card } from './UI';
import { motion, AnimatePresence } from 'framer-motion';

interface MapViewProps {
  collectionPoints: CollectionPoint[];
  userLocation?: { lat: number; lng: number };
}

// Component to handle map center updates
const MapUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 14);
    }, [center, map]);
    return null;
};

export const MapView = ({ collectionPoints, userLocation }: MapViewProps) => {
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(null);
  const [filters, setFilters] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>(userLocation ? [userLocation.lat, userLocation.lng] : [-23.5881, -46.6383]);

  // Simulating user location if not provided
  useEffect(() => {
      if (!userLocation && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (pos) => setCurrentLocation([pos.coords.latitude, pos.coords.longitude]),
              (err) => console.log("Location denied, using default"),
              { enableHighAccuracy: true }
          );
      }
  }, [userLocation]);

  const getMarkerIcon = (type: string) => {
    const icons: Record<string, string> = {
      cooperative: '♻️',
      electronics: '⚡',
      ecopoint: '🌿',
      pharmacy: '💊'
    };
    return L.divIcon({
      html: `<div class="custom-marker">${icons[type] || '📍'}</div>`,
      className: 'custom-marker-container',
      iconSize: [40, 40],
      iconAnchor: [20, 20] // Center the icon
    });
  };

  const userIcon = L.divIcon({
      html: '<div class="user-marker">👤</div>',
      className: 'custom-marker-container',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
  });

  const filteredPoints = filters.length > 0 
    ? collectionPoints.filter(p => filters.includes(p.type))
    : collectionPoints;

  return (
    <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] flex flex-col bg-white rounded-3xl overflow-hidden relative border border-gray-100 shadow-sm">
      {/* Map Header & Filters */}
      <div className="absolute top-4 left-4 right-4 z-[500] flex flex-col gap-2 pointer-events-none">
        <div className="pointer-events-auto overflow-x-auto no-scrollbar pb-1">
            <div className="flex gap-2">
                <button 
                    onClick={() => setFilters([])}
                    className={`px-4 py-2 rounded-full text-sm font-bold shadow-md transition-colors ${filters.length === 0 ? 'bg-teal text-white' : 'bg-white text-gray-600'}`}
                >
                    Todos
                </button>
                {['cooperative', 'electronics', 'ecopoint', 'pharmacy'].map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilters(filters.includes(f) ? filters.filter(x => x !== f) : [...filters, f])}
                        className={`px-4 py-2 rounded-full text-sm font-bold shadow-md transition-colors capitalize ${
                            filters.includes(f) ? 'bg-teal text-white' : 'bg-white text-gray-600'
                        }`}
                    >
                        {f === 'cooperative' ? 'Cooperativas' : f}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative z-0">
        <MapContainer 
          center={currentLocation} 
          zoom={14} 
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={currentLocation} />

          {/* User Marker */}
          <Marker position={currentLocation} icon={userIcon}>
              <Popup>Você está aqui</Popup>
          </Marker>

          {/* Collection Points */}
          {filteredPoints.map(point => (
            <Marker 
              key={point.id}
              position={[point.location.lat, point.location.lng]}
              icon={getMarkerIcon(point.type)}
              eventHandlers={{
                click: () => setSelectedPoint(point)
              }}
            >
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Bottom Sheet Details */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-[600] max-h-[60vh] overflow-y-auto"
          >
            <button 
              onClick={() => setSelectedPoint(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
            >
              ×
            </button>

            <div className="flex items-start gap-4 mb-4">
                 <div className="text-5xl">{selectedPoint.photo}</div>
                 <div>
                      <span className="inline-block bg-teal/10 text-teal px-2 py-0.5 rounded text-[10px] font-black uppercase mb-1">
                          {selectedPoint.type}
                      </span>
                      <h2 className="text-xl font-black text-dark leading-tight">{selectedPoint.name}</h2>
                      <p className="text-sm text-gray-500">{selectedPoint.address}</p>
                 </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                {[...selectedPoint.acceptedMaterials].map(m => (
                    <span 
                        key={m} 
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
                        style={{ backgroundColor: `${MATERIAL_CONFIG[m]?.color}20`, color: MATERIAL_CONFIG[m]?.color }}
                    >
                        {MATERIAL_CONFIG[m]?.icon} {MATERIAL_CONFIG[m]?.name}
                    </span>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                     <span className="text-xl">🕒</span>
                     <div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase">Horário</p>
                         <p className="text-xs font-bold text-dark">{selectedPoint.hours}</p>
                     </div>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                     <span className="text-xl">⭐</span>
                     <div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase">Avaliação</p>
                         <p className="text-xs font-bold text-dark">{selectedPoint.rating}/5.0</p>
                     </div>
                 </div>
            </div>

            <div className="flex gap-3">
                 <a href={`tel:${selectedPoint.phone}`} className="flex-1 bg-gray-100 text-dark py-3 rounded-xl font-bold text-center hover:bg-gray-200">
                     Ligar
                 </a>
                 <button className="flex-1 bg-teal text-white py-3 rounded-xl font-bold hover:bg-teal-dark flex items-center justify-center gap-2 shadow-lg">
                     <span>🧭</span> Navegar
                 </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

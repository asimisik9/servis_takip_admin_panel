import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet marker ikonlarını düzelt (webpack/vite sorunu)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Otobüs ikonu oluştur
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const LiveMap = ({ busLocations = {} }) => {
  // Ankara merkez koordinatları (varsayılan)
  const defaultCenter = [39.9334, 32.8597];
  const [center, setCenter] = useState(defaultCenter);

  useEffect(() => {
    // Eğer en az bir otobüs varsa, ilk otobüsün konumunu merkez yap
    const locations = Object.values(busLocations);
    if (locations.length > 0 && locations[0]) {
      setCenter([locations[0].latitude, locations[0].longitude]);
    }
  }, [busLocations]);

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: '500px', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {Object.entries(busLocations).map(([busId, location]) => {
        if (!location || !location.latitude || !location.longitude) return null;
        
        return (
          <Marker 
            key={busId}
            position={[location.latitude, location.longitude]}
            icon={busIcon}
          >
            <Popup>
              <div>
                <strong>Otobüs ID: {busId}</strong>
                <br />
                Enlem: {location.latitude.toFixed(6)}
                <br />
                Boylam: {location.longitude.toFixed(6)}
                <br />
                {location.timestamp && (
                  <>
                    Zaman: {new Date(location.timestamp).toLocaleTimeString('tr-TR')}
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default LiveMap;

// components/MapPicker.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to handle map click events when in edit mode
function LocationMarker({ position, setPosition, onLocationSelect, readOnly }) {
  const map = useMapEvents({
    click(e) {
      if (readOnly) return; // Don't allow clicks in read-only mode
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
    },
  });

  // Center the map on marker when position changes
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position ? <Marker position={position} /> : null;
}

export default function MapPicker({ onSelect, readOnly = false, initialPosition = null }) {
  // Default to Nepal if no position is provided
  const defaultPosition = { lat: 28.3949, lng: 84.1240 };
  const [position, setPosition] = useState(initialPosition || defaultPosition);
  const zoom = 7;

  // When position changes, call the onSelect callback if provided
  useEffect(() => {
    if (position && onSelect && !readOnly) {
      onSelect(position);
    }
  }, [position, onSelect, readOnly]);

  // When initialPosition changes, update the position state
  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  return (
    <div className="map-picker-container" style={{ height: '400px', width: '100%' }}>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationSelect={onSelect}
          readOnly={readOnly}
        />
      </MapContainer>

      {!readOnly && (
        <div className="map-instructions" style={{ marginTop: '10px', textAlign: 'center' }}>
          <p>Click on the map to select a location</p>
        </div>
      )}
    </div>
  );
}

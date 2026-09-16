import React, { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";


// ==========================================
// UPDATE MAP CENTER
// ==========================================

const MapUpdater = ({
  providerLatitude,
  providerLongitude,
  customerLatitude,
  customerLongitude,
}) => {
  const map = useMap();

  useEffect(() => {
    const centerLatitude =
      (providerLatitude + customerLatitude) / 2;

    const centerLongitude =
      (providerLongitude + customerLongitude) / 2;

    map.setView(
      [centerLatitude, centerLongitude],
      map.getZoom()
    );
  }, [
    providerLatitude,
    providerLongitude,
    customerLatitude,
    customerLongitude,
    map,
  ]);

  return null;
};


// ==========================================
// TRACKING MAP
// ==========================================

const TrackingMap = ({
  latitude,
  longitude,
  customerLatitude,
  customerLongitude,
}) => {

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={true}
      style={{
        height: "350px",
        width: "100%",
        borderRadius: "16px",
      }}
    >

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      {/* UPDATE MAP CENTER */}

      {customerLatitude !== null &&
        customerLongitude !== null && (
          <MapUpdater
            providerLatitude={latitude}
            providerLongitude={longitude}
            customerLatitude={customerLatitude}
            customerLongitude={customerLongitude}
          />
        )}


      {/* PROVIDER MARKER */}

      <Marker
        position={[
          latitude,
          longitude,
        ]}
      >
        <Popup>
          Provider Location
        </Popup>
      </Marker>


      {/* CUSTOMER MARKER */}

      {customerLatitude !== null &&
        customerLongitude !== null && (

          <Marker
            position={[
              customerLatitude,
              customerLongitude,
            ]}
          >
            <Popup>
              Your Location
            </Popup>
          </Marker>

        )}

    </MapContainer>
  );
};

export default TrackingMap;
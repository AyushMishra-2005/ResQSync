"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";

// 🔥 Fix marker issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// 🔥 Custom Icons
const userIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const workerIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

type Worker = {
  _id: string;
  name: string;
  phone: string;
  skills: string[];
  location: {
    coordinates: [number, number]; // [lng, lat]
  };
};

type Props = {
  workers: Worker[];
  userLocation: {
    lat: number;
    lng: number;
  };
};

export default function MapView({ workers, userLocation }: Props) {

  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3;
    const toRad = (x: number) => (x * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) / 1000;
  };

  // 🔥 Range count
  const rangeCounts = {
    r500: 0,
    r1000: 0,
    r1500: 0,
  };

  const groupedWorkers = workers.map((worker) => {
    const [lng, lat] = worker.location.coordinates;

    const distance = getDistance(
      userLocation.lat,
      userLocation.lng,
      lat,
      lng
    );

    let range = "far";

    if (distance <= 0.5) {
      range = "near";
      rangeCounts.r500++;
    } else if (distance <= 1.0) {
      range = "mid";
      rangeCounts.r1000++;
    } else if (distance <= 1.5) {
      range = "far";
      rangeCounts.r1500++;
    }

    return { worker, lat, lng, distance, range };
  });

  return (
    <div style={{ position: "relative" }}>

      {/* 🔥 RANGE UI */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 10,
          background: "white",
          padding: "10px 14px",
          borderRadius: "10px",
          zIndex: 1000,
          fontSize: "14px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <p>🟢 0–500m: {rangeCounts.r500}</p>
        <p>🟠 500–1000m: {rangeCounts.r1000}</p>
        <p>🔴 1000–1500m: {rangeCounts.r1500}</p>
      </div>

      <MapContainer
        key={`${userLocation.lat}-${userLocation.lng}`}
        center={[userLocation.lat, userLocation.lng]}
        zoom={14}
        style={{ height: "700px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🔴 USER LOCATION */}
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
        >
          <Popup>🚨 Emergency Location</Popup>
        </Marker>

        {/* 🟢 WORKERS */}
        {groupedWorkers.map(({ worker, lat, lng, distance, range }) => {

          const formattedDistance =
            distance < 1
              ? `${(distance * 1000).toFixed(0)} m`
              : `${distance.toFixed(2)} km`;

          return (
            <Marker
              key={worker._id}
              position={[lat, lng]}
              icon={workerIcon}
            >
              <Popup>
                <div style={{ minWidth: "180px" }}>
                  <b style={{ fontSize: "15px" }}>
                    👷 {worker.name || "Volunteer"}
                  </b>

                  <br />

                  📞 {worker.phone || "N/A"}

                  <br />

                  📍 {formattedDistance} away

                  <br />

                  🔹 Range: {range}

                  <br />

                  🛠 Skills:
                  <div style={{ marginTop: "4px" }}>
                    {worker.skills && worker.skills.length > 0 ? (
                      worker.skills.map((skill, i) => (
                        <span
                          key={i}
                          style={{
                            display: "inline-block",
                            background: "#e0f2fe",
                            color: "#0369a1",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            marginRight: "4px",
                            marginTop: "4px",
                          }}
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span>No skills listed</span>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 🔥 RANGE CIRCLES */}
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={500}
          pathOptions={{ color: "green", fillOpacity: 0.1 }}
        />

        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={1000}
          pathOptions={{ color: "orange", fillOpacity: 0.08 }}
        />

        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={1500}
          pathOptions={{ color: "red", fillOpacity: 0.05 }}
        />
      </MapContainer>
    </div>
  );
}
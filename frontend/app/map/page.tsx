"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


const MapView = dynamic(() => import("../../components/Mapview"), {
  ssr: false,
});

type Worker = {
  _id: string;
  name: string;
  phone: string;
  skills: string[];
  location: {
    coordinates: [number, number];
  };
};

export default function MapPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [assignedId, setAssignedId] = useState<string | null>(null);
  const router = useRouter();

  // 🔥 Distance function
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

  // Assign function
  

const handleAssignWorker = async (workerId: string) => {
  try {
    const requestId = localStorage.getItem("selectedRequestId");

    if (!requestId) {
      toast.error("No request found ❌");
      return;
    }

    // Loading toast
    toast.loading("Assigning worker...", { id: "assignWorker" });

    const res = await fetch("http://localhost:8000/api/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workerId,
        requestId,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed");
    }

    await res.json();

    setAssignedId(workerId);

    // Success toast (replaces loading)
    toast.success("Worker assigned successfully ", { id: "assignWorker" });

    // optional small delay so user can read toast
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);

  } catch (err) {
    console.error(err);

    //  Error toast (replaces loading)
    toast.error("Failed to assign worker ", { id: "assignWorker" });
  }
};

  useEffect(() => {
  const w = localStorage.getItem("workers");
  const req = localStorage.getItem("request");

  if (w) {
    setWorkers(JSON.parse(w));
  }

  if (req) {
    const parsedReq = JSON.parse(req);

    // 🔥 THIS IS YOUR EMERGENCY LOCATION
    setUserLocation({
      lat: parsedReq.location.lat,
      lng: parsedReq.location.lng,
    });
  }
}, []);

  if (!userLocation) return <p>Loading map...</p>;

  //  Sort workers by distance
  const sortedWorkers = [...workers]
    .map((worker) => {
      const [lng, lat] = worker.location.coordinates;

      const distance = getDistance(
        userLocation.lat,
        userLocation.lng,
        lat,
        lng
      );

      return { ...worker, lat, lng, distance };
    })
    .sort((a, b) => a.distance - b.distance);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f3f4f6" }}>

      {/* 🗺️ LEFT → MAP */}
      <div style={{ flex: 2, padding: "16px", height: "100%" }}>
        <div
          style={{
            height: "100%",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            background: "white",
          }}
        >
          <MapView workers={workers} userLocation={userLocation} />
        </div>
      </div>

      {/* 📋 RIGHT → LIST */}
      <div
        style={{
          flex: 1,
          background: "#ffffff",
          borderLeft: "1px solid #e5e7eb",
          overflowY: "auto",
          padding: "20px",
        }}
      >
        <h2
          style={{
            marginBottom: "18px",
            fontSize: "20px",
            fontWeight: "700",
            color: "#111827",
          }}
        >
          Nearby Volunteers
        </h2>

        {sortedWorkers.map((worker, index) => {
          const formattedDistance =
            worker.distance < 1
              ? `${(worker.distance * 1000).toFixed(0)} m`
              : `${worker.distance.toFixed(2)} km`;

          return (
            <div
              key={worker._id}
              style={{
                background: index === 0 ? "#ecfdf5" : "#ffffff",
                padding: "16px",
                borderRadius: "16px",
                marginBottom: "14px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                border: index === 0 ? "2px solid #10b981" : "1px solid #e5e7eb",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* HEADER */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b style={{ fontSize: "16px", color: "#111827" }}>
                  {worker.name || "Volunteer"}
                </b>

                {index === 0 && (
                  <span
                    style={{
                      background: "#10b981",
                      color: "white",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      fontSize: "11px",
                    }}
                  >
                    Nearest
                  </span>
                )}
              </div>

              {/* INFO */}
              <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>
                📞 {worker.phone || "N/A"}
              </p>

              <p
                style={{
                  fontSize: "13px",
                  color: "#374151",
                  fontWeight: "500",
                }}
              >
                📍 {formattedDistance} away
              </p>

              {/* BUTTON */}
              <button
                onClick={() => handleAssignWorker(worker._id)}
                disabled={assignedId === worker._id}
                style={{
                  marginTop: "12px",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: "600",
                  cursor: assignedId === worker._id ? "not-allowed" : "pointer",
                  background:
                    assignedId === worker._id ? "#9ca3af" : "#1a4d2e",
                  color: "white",
                }}
              >
                {assignedId === worker._id ? "Assigned" : "Assign"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
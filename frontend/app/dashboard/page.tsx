"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRef } from "react";
import toast from "react-hot-toast";

const G = {
  dark: "#0f3320",
  main: "#1a4d2e",
  light: "#2d6a4f",
  yellow: "#f5c518",
  cream: "#f5f0e8",
  creamDark: "#ede8df",
  muted: "#6b7280",
};

export default function Dashboard() {
  const hasSynced = useRef<boolean>(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const [loading, setLoading] = useState(false);

  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"report" | "requests">("report");

  useEffect(() => {
    if (!user) return;
    const email = user.emailAddresses?.[0]?.emailAddress;
    if (email === ADMIN_EMAIL) {
      setRole("ngo");
    } else {
      setRole("user");
    }
  }, [user]);

  useEffect(() => {
    if (!user || hasSynced.current) return;
    const syncUser = async (): Promise<void> => {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/sync`, {
          clerkId: user.id,
          name: user.firstName || user.fullName || "User",
          email: user.emailAddresses?.[0]?.emailAddress || "",
        });
        hasSynced.current = true;
      } catch (err: any) {
        console.error("Error syncing user:", err.response?.data || err.message);
      }
    };
    syncUser();
  }, [user]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/request`,
        );
        setRequests(res.data.requests);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };
    fetchRequests();
  }, []);

  // ✅ FIX: Filter by r.user?.clerkId (not r.clerkId)
  const myRequests = requests.filter((r) => r.user?.clerkId === user?.id);
  const activeRequests = requests.filter((r) => r.status === "pending");
  const myRequestsCount = myRequests.length;

  const getLocation = () => {
    setLocationStatus("loading");
    toast.loading("Detecting location...", { id: "location" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("done");
        toast.success("Location captured", { id: "location" });
      },
      () => {
        setLocationStatus("error");
        toast.error("Failed to get location", { id: "location" });
      },
    );
  };

  const handleAssign = async (req: any): Promise<void> => {
    try {
      toast.loading("Finding nearby workers...", { id: "assign" });
      const payload = {
        category: req.category,
        priority: req.priority,
        location: {
          latitude: req.location.lat,
          longitude: req.location.lng,
        },
      };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/worker/nearby`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error("Failed to fetch nearby workers");
      const data = await res.json();
      toast.success(`Found ${data.workers?.length || 0} workers nearby`, {
        id: "assign",
      });
      localStorage.setItem("selectedRequestId", req._id);
      localStorage.setItem("workers", JSON.stringify(data.workers));
      localStorage.setItem("request", JSON.stringify(req));
      router.push("/map");
    } catch (err) {
      console.error("Error in handleAssign:", err);
      toast.error("Failed to find workers", { id: "assign" });
    }
  };

  const handleSubmit = async () => {
    if (!message || !location || !user) return;
    setLoading(true);
    toast.loading("Sending request...", { id: "submit" });
    try {
      const aiRes = await fetch(
        "https://resqsync-engine.onrender.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: message }),
        },
      );
      const aiData = await aiRes.json();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          text: message,
          category: aiData.category,
          priority: aiData.priority,
          location: {
            latitude: location.lat,
            longitude: location.lng,
          },
        }),
      });
      toast.success("Emergency sent successfully", { id: "submit" });
      setMessage("");
      setLocation(null);
      setLocationStatus("idle");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send", { id: "submit" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      toast.loading("Deleting request...", { id: "delete" });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/request/${id}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Failed");
      setRequests((prev) => prev.filter((r) => r._id !== id));
      toast.success("Request deleted", { id: "delete" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete", { id: "delete" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const initials =
    user?.firstName?.[0] ||
    user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ||
    "?";

  const ms = (t: string) => new Date(t).getTime();

  const isToday = (t: string) => {
    const d = new Date(t);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  const activeCount = requests.filter((r) => r.status === "pending").length;

  const volunteersCount = (() => {
    try {
      const workers = JSON.parse(localStorage.getItem("workers") || "[]");
      return workers.length;
    } catch {
      return 0;
    }
  })();

  const resolvedTodayCount = requests.filter(
    (r) => r.status === "assigned" && isToday(r.updatedAt || r.createdAt),
  ).length;

  const avgResponse = (() => {
    const assigned = requests.filter((r) => r.status === "assigned");
    if (assigned.length === 0) return "—";
    const totalMs = assigned.reduce((acc, r) => {
      const start = ms(r.createdAt);
      const end = ms(r.updatedAt || r.createdAt);
      return acc + (end - start);
    }, 0);
    const avgMs = totalMs / assigned.length;
    const mins = Math.floor(avgMs / 60000);
    const secs = Math.floor((avgMs % 60000) / 1000);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  })();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: G.cream,
        fontFamily: "var(--font-geist-sans), sans-serif",
      }}
    >
      {/* ── NAVBAR ── */}
      <nav
        style={{
          background: G.dark,
          padding: "0 40px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            background: G.main,
            borderRadius: 50,
            padding: "6px 18px 6px 6px",
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: G.yellow,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 14,
              color: G.dark,
              marginRight: 8,
            }}
          >
            R
          </div>
          <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>
            ResQSync
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: role === "ngo" ? G.yellow : "rgba(255,255,255,0.12)",
              borderRadius: 50,
              padding: "5px 14px",
            }}
          >
            <span style={{ fontSize: 14 }}>{role === "ngo" ? "🏥" : "🙋"}</span>
            <span
              style={{
                color: role === "ngo" ? G.dark : "white",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {role === "ngo" ? "NGO Admin" : "Community User"}
            </span>
          </div>

          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: G.yellow,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 14,
              color: G.dark,
            }}
          >
            {initials}
          </div>

          <button
            onClick={handleSignOut}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.8)",
              fontSize: 12,
              fontWeight: 600,
              padding: "6px 14px",
              borderRadius: 50,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "rgba(255,255,255,0.8)";
            }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        {/* ── WELCOME ── */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: G.dark,
              marginBottom: 4,
            }}
          >
            Hello, {user?.firstName || "Friend"} 👋
          </h1>
          <p style={{ color: G.muted, fontSize: 15 }}>
            {role === "ngo"
              ? "Manage incoming requests and coordinate your volunteers."
              : "Report an emergency or check your active requests."}
          </p>
        </div>

        {role === "user" ? (
          <>
            {/* ── TABS ── */}
            <div
              style={{
                display: "flex",
                gap: 4,
                background: "white",
                borderRadius: 14,
                padding: 4,
                marginBottom: 24,
                border: `1px solid ${G.creamDark}`,
                width: "fit-content",
              }}
            >
              {(["report", "requests"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "8px 24px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "all 0.2s",
                    background: activeTab === tab ? G.dark : "transparent",
                    color: activeTab === tab ? "white" : G.muted,
                  }}
                >
                  {tab === "report" ? "🚨 Report Emergency" : `📋 My Requests${myRequestsCount > 0 ? ` (${myRequestsCount})` : ""}`}
                </button>
              ))}
            </div>

            {activeTab === "report" ? (
              !submitted ? (
                <div
                  style={{
                    background: "white",
                    borderRadius: 24,
                    padding: 36,
                    border: `1px solid ${G.creamDark}`,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginBottom: 28,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: G.dark,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                      }}
                    >
                      🚨
                    </div>
                    <div>
                      <h2
                        style={{ fontSize: 20, fontWeight: 800, color: G.dark }}
                      >
                        Report an Emergency
                      </h2>
                      <p style={{ fontSize: 13, color: G.muted, marginTop: 2 }}>
                        Describe your situation — help is on the way
                      </p>
                    </div>
                  </div>

                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 700,
                      color: G.dark,
                      marginBottom: 8,
                    }}
                  >
                    Describe the situation
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. There is a flood in our area, we need immediate help with food and medical aid..."
                    rows={4}
                    style={{
                      width: "100%",
                      borderRadius: 14,
                      padding: "14px 16px",
                      fontSize: 14,
                      resize: "none",
                      outline: "none",
                      marginBottom: 24,
                      background: G.cream,
                      border: `1.5px solid ${G.creamDark}`,
                      color: G.dark,
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      transition: "border 0.2s",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = G.main)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = G.creamDark)
                    }
                  />

                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 700,
                      color: G.dark,
                      marginBottom: 10,
                    }}
                  >
                    Your Location
                  </label>
                  <button
                    onClick={getLocation}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: 14,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      marginBottom: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      transition: "all 0.2s",
                      background:
                        locationStatus === "done" ? "#dcfce7" : G.cream,
                      border: `1.5px solid ${locationStatus === "done" ? "#16a34a" : G.creamDark}`,
                      color: locationStatus === "done" ? "#16a34a" : G.muted,
                    }}
                  >
                    {locationStatus === "loading" && (
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          border: `2px solid ${G.main}`,
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          display: "inline-block",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                    )}
                    {locationStatus === "idle" && "📍 Detect My Location"}
                    {locationStatus === "loading" && "Detecting your location..."}
                    {locationStatus === "done" &&
                      `✓ Captured (${location?.lat.toFixed(4)}, ${location?.lng.toFixed(4)})`}
                    {locationStatus === "error" && "❌ Failed — tap to retry"}
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={!message || locationStatus !== "done" || loading}
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: 14,
                      fontSize: 16,
                      fontWeight: 800,
                      cursor:
                        message && locationStatus === "done" && !loading
                          ? "pointer"
                          : "not-allowed",
                      transition: "all 0.2s",
                      background:
                        message && locationStatus === "done" && !loading
                          ? G.dark
                          : G.creamDark,
                      color:
                        message && locationStatus === "done" && !loading
                          ? "white"
                          : G.muted,
                      border: "none",
                      boxShadow:
                        message && locationStatus === "done" && !loading
                          ? "0 8px 24px rgba(15,51,32,0.25)"
                          : "none",
                      opacity: loading ? 0.7 : 1,
                    }}
                    onMouseOver={(e) => {
                      if (message && locationStatus === "done" && !loading)
                        e.currentTarget.style.background = G.main;
                    }}
                    onMouseOut={(e) => {
                      if (message && locationStatus === "done" && !loading)
                        e.currentTarget.style.background = G.dark;
                    }}
                  >
                    {loading ? "Sending..." : "Send Emergency Alert →"}
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    background: G.dark,
                    borderRadius: 24,
                    padding: "56px 36px",
                    textAlign: "center",
                    marginBottom: 24,
                  }}
                >
                  <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                  <h2
                    style={{
                      fontSize: 26,
                      fontWeight: 900,
                      color: "white",
                      marginBottom: 8,
                    }}
                  >
                    Alert Sent Successfully!
                  </h2>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      marginBottom: 32,
                      fontSize: 15,
                      lineHeight: 1.7,
                    }}
                  >
                    Your request has been received and volunteers are being
                    matched to your location right now.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      // ✅ Refresh requests so My Requests tab updates
                      axios
                        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/request`)
                        .then((res) => setRequests(res.data.requests))
                        .catch(console.error);
                    }}
                    style={{
                      background: G.yellow,
                      color: G.dark,
                      border: "none",
                      padding: "14px 36px",
                      borderRadius: 50,
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Send Another Report →
                  </button>
                </div>
              )
            ) : (
              /* ── MY REQUESTS TAB ── */
              <div
                style={{
                  background: "white",
                  borderRadius: 24,
                  padding: 28,
                  border: `1px solid ${G.creamDark}`,
                }}
              >
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: G.dark,
                    marginBottom: 20,
                  }}
                >
                  Your Requests
                </h2>

                {/* ✅ FIX: filter by r.user?.clerkId, show ALL user's requests (not just pending) */}
                {myRequests.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "48px 24px",
                      color: G.muted,
                    }}
                  >
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: G.dark }}>
                      No requests yet
                    </p>
                    <p style={{ fontSize: 13, marginTop: 6 }}>
                      Your emergency reports will appear here.
                    </p>
                  </div>
                ) : (
                  myRequests.map((req) => (
                    <div
                      key={req._id}
                      style={{
                        padding: "18px 16px",
                        borderRadius: 14,
                        border: `1px solid ${G.creamDark}`,
                        marginBottom: 12,
                        background: G.cream,
                      }}
                    >
                      {/* ✅ FIX: show req.text (what was submitted) not req.problem */}
                      <p style={{ fontWeight: 700, color: G.dark, marginBottom: 6 }}>
                        {req.text || req.problem || "No description"}
                      </p>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                        <span
                          style={{
                            fontSize: 11,
                            padding: "3px 10px",
                            borderRadius: 20,
                            background: "#e0f2fe",
                            color: "#0369a1",
                            fontWeight: 600,
                          }}
                        >
                          📂 {req.category || "General"}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            padding: "3px 10px",
                            borderRadius: 20,
                            background:
                              req.priority === "HIGH"
                                ? "#fee2e2"
                                : req.priority === "MEDIUM"
                                  ? "#fef3c7"
                                  : "#dcfce7",
                            color:
                              req.priority === "HIGH"
                                ? "#dc2626"
                                : req.priority === "MEDIUM"
                                  ? "#d97706"
                                  : "#16a34a",
                            fontWeight: 700,
                          }}
                        >
                          ⚡ {req.priority || "LOW"}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            padding: "3px 10px",
                            borderRadius: 20,
                            background: req.status === "pending" ? "#fee2e2" : "#dcfce7",
                            color: req.status === "pending" ? "#dc2626" : "#16a34a",
                            fontWeight: 600,
                          }}
                        >
                          {req.status === "pending" ? "⏳ Pending" : "✅ Assigned"}
                        </span>
                      </div>

                      <p style={{ fontSize: 11, color: G.muted, marginBottom: 10 }}>
                        🕒 {new Date(req.createdAt).toLocaleString()}
                      </p>

                      {/* Only allow delete if still pending */}
                      {req.status === "pending" && (
                        <button
                          onClick={() => handleDelete(req._id)}
                          style={{
                            background: "#fee2e2",
                            color: "#dc2626",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: 50,
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* QUICK STATS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
                marginTop: 16,
              }}
            >
              {[
                {
                  icon: "📋",
                  label: "My Requests",
                  val: myRequestsCount,
                  color: G.dark,
                },
                {
                  icon: "🤝",
                  label: "Volunteers Nearby",
                  val: 10,
                  color: G.main,
                },
                {
                  icon: "⚡",
                  label: "Avg Response",
                  val: avgResponse,
                  color: "#d97706",
                },
              ].map(({ icon, label, val, color }) => (
                <div
                  key={label}
                  style={{
                    background: "white",
                    borderRadius: 18,
                    padding: "20px 16px",
                    textAlign: "center",
                    border: `1px solid ${G.creamDark}`,
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color,
                      lineHeight: 1,
                    }}
                  >
                    {val}
                  </p>
                  <p style={{ fontSize: 11, color: G.muted, marginTop: 5 }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* ── NGO ADMIN VIEW ── */
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
                marginBottom: 28,
              }}
            >
              {[
                {
                  icon: "🚨",
                  label: "Active Alerts",
                  val: activeCount,
                  color: "#dc2626",
                  bg: "#fee2e2",
                },
                {
                  icon: "🤝",
                  label: "Volunteers",
                  val: volunteersCount,
                  color: G.main,
                  bg: "#dcfce7",
                },
                {
                  icon: "✅",
                  label: "Resolved Today",
                  val: resolvedTodayCount,
                  color: "#16a34a",
                  bg: "#dcfce7",
                },
                {
                  icon: "⏱",
                  label: "Avg Response",
                  val: avgResponse,
                  color: "#d97706",
                  bg: "#fef3c7",
                },
              ].map(({ icon, label, val, color, bg }) => (
                <div
                  key={label}
                  style={{
                    background: "white",
                    borderRadius: 18,
                    padding: "22px 16px",
                    textAlign: "center",
                    border: `1px solid ${G.creamDark}`,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      margin: "0 auto 12px",
                    }}
                  >
                    {icon}
                  </div>
                  <p
                    style={{
                      fontSize: 26,
                      fontWeight: 900,
                      color,
                      lineHeight: 1,
                    }}
                  >
                    {val}
                  </p>
                  <p style={{ fontSize: 11, color: G.muted, marginTop: 5 }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "white",
                borderRadius: 24,
                border: `1px solid ${G.creamDark}`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "20px 28px",
                  borderBottom: `1px solid ${G.creamDark}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2 style={{ fontSize: 18, fontWeight: 800, color: G.dark }}>
                  🚨 Incoming Requests
                </h2>
                <span
                  style={{
                    fontSize: 12,
                    background: "#fee2e2",
                    color: "#dc2626",
                    padding: "3px 12px",
                    borderRadius: 20,
                    fontWeight: 700,
                  }}
                >
                  {activeRequests.length} Active
                </span>
              </div>

              {requests.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "48px 24px",
                    color: G.muted,
                  }}
                >
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: G.dark }}>
                    No requests yet
                  </p>
                </div>
              ) : (
                requests.map((req, i, arr) => (
                  <div
                    key={req._id || i}
                    style={{
                      padding: "18px 28px",
                      borderBottom:
                        i < arr.length - 1 ? `1px solid ${G.creamDark}` : "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      transition: "background 0.15s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = G.cream)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: G.cream,
                        border: `2px solid ${G.creamDark}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 15,
                        color: G.dark,
                        flexShrink: 0,
                      }}
                    >
                      {req.user?.name?.[0] || "U"}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <p style={{ fontWeight: 700, color: G.dark }}>
                          {req.user?.name || "Unknown"}
                        </p>
                        <span style={{ fontSize: 11, color: G.muted }}>
                          📍 {req.location?.lat?.toFixed(4)}, {req.location?.lng?.toFixed(4)}
                        </span>
                      </div>

                      {/* ✅ FIX: show req.text not req.problem */}
                      <p style={{ fontSize: 13, color: G.dark, margin: "4px 0" }}>
                        {req.text || req.problem || "No description"}
                      </p>

                      <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: 11,
                            padding: "4px 10px",
                            borderRadius: 20,
                            background: "#e0f2fe",
                            color: "#0369a1",
                            fontWeight: 600,
                          }}
                        >
                          📂 {req.category || "General"}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            padding: "4px 10px",
                            borderRadius: 20,
                            background:
                              req.priority === "HIGH"
                                ? "#fee2e2"
                                : req.priority === "MEDIUM"
                                  ? "#fef3c7"
                                  : "#dcfce7",
                            color:
                              req.priority === "HIGH"
                                ? "#dc2626"
                                : req.priority === "MEDIUM"
                                  ? "#d97706"
                                  : "#16a34a",
                            fontWeight: 700,
                          }}
                        >
                          ⚡ {req.priority || "LOW"}
                        </span>
                      </div>

                      <p style={{ fontSize: 11, color: G.muted, marginTop: 4 }}>
                        🕒 {new Date(req.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <span
                      style={{
                        fontSize: 11,
                        padding: "4px 12px",
                        borderRadius: 20,
                        background:
                          req.status === "pending" ? "#fee2e2" : "#dcfce7",
                        color: req.status === "pending" ? "#dc2626" : "#16a34a",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {req.status.toUpperCase()}
                    </span>

                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      {req.status !== "assigned" && (
                        <button
                          onClick={() => handleAssign(req)}
                          style={{
                            background: G.dark,
                            color: "white",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: 50,
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        >
                          Assign →
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(req._id)}
                        style={{
                          background: "#fee2e2",
                          color: "#dc2626",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: 50,
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
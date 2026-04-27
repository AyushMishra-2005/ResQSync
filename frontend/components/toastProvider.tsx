"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#1a4d2e",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "600",
          padding: "12px 16px",
        },
      }}
    />
  );
}
"use client";

import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#FDFAF6",
          color: "#5C4638",
          border: "1px solid #D9C5B0",
          fontSize: "13px",
        },
        error: {
          style: {
            background: "#FDF2F0",
            color: "#9B3A2F",
            border: "1px solid #E8B4A8",
          },
        },
        success: {
          style: {
            background: "#F8F1E9",
            color: "#5C4638",
            border: "1px solid #D9C5B0",
          },
        },
      }}
    />
  );
}

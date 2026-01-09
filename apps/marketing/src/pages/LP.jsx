import { useEffect } from "react";
import Header from "../components/Header";

export default function LP() {
  // Load Unicorn Studio script
  useEffect(() => {
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
      script.onload = () => {
        if (!window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };
      document.head.appendChild(script);
    } else if (!window.UnicornStudio.isInitialized) {
      window.UnicornStudio.init();
      window.UnicornStudio.isInitialized = true;
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* Top Navigation */}
      <Header />

      {/* Unicorn Studio Aura Background */}
      <div
        className="aura-background-component"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <div
          data-us-project="ILgOO23w4wEyPQOKyLO4"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <img
          src="/logo/yp-logo.png"
          alt="YouthPerformance"
          style={{
            width: "180px",
            marginBottom: "3rem",
            filter: "drop-shadow(0 0 20px #00f6e0)",
          }}
        />

        <button
          className="lp-cta-button"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "2.5rem",
            letterSpacing: "0.1em",
            padding: "1.25rem 3rem",
            background: "transparent",
            color: "#00f6e0",
            border: "3px solid #00f6e0",
            cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: "0 0 20px #00f6e0, 0 0 40px rgba(0, 246, 224, 0.5)",
          }}
        >
          GET BULLETPROOF ANKLES
        </button>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px #00f6e0, 0 0 40px rgba(0, 246, 224, 0.5);
          }
          50% {
            box-shadow: 0 0 40px #00f6e0, 0 0 80px rgba(0, 246, 224, 0.8), 0 0 120px rgba(0, 246, 224, 0.4);
          }
        }
        .lp-cta-button {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .lp-cta-button:hover {
          background: #00f6e0 !important;
          color: #000 !important;
          box-shadow: 0 0 40px #00f6e0, 0 0 80px #00f6e0 !important;
        }
      `}</style>
    </div>
  );
}

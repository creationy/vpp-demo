"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { motion } from "framer-motion";
import type { Facility } from "@/types/database.types";
import { useEffect, useState } from "react";

interface NationalMapProps {
  facilities: Facility[];
}

const DARK_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#0F172A" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0F172A" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94A3B8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1E293B" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
];

const LIGHT_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#F8FAFC" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#64748B" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#E2E8F0" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#BAE6FD" }] },
];

const KOREA_CENTER = { lat: 36.5, lng: 127.8 };

export default function NationalMap({ facilities }: NationalMapProps) {
  const [isDay, setIsDay] = useState(true);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const checkTheme = () => {
      setIsDay(document.documentElement.getAttribute("data-theme") === "day");
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  // API 키가 없으면 데모용 메시지 표시
  if (!apiKey) {
    return (
      <div style={{
        width: "100%", height: "100%", background: "var(--color-bg-elevated)",
        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
        gap: 16, color: "var(--color-text-muted)", textAlign: "center", padding: 20
      }}>
        <div style={{ fontSize: 48 }}>🗺️</div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>지도 서비스를 불러올 수 없습니다.</p>
          <p style={{ fontSize: 11 }}>API 키가 설정되지 않았습니다. 실사용 시 환경 변수 설정이 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
        <Map
          defaultCenter={KOREA_CENTER}
          defaultZoom={7.2}
          mapId={isDay ? "vpp-light-map" : "vpp-dark-map"}
          gestureHandling="greedy"
          disableDefaultUI
          styles={isDay ? LIGHT_MAP_STYLES : DARK_MAP_STYLES}
        >
          {facilities.map((facility, idx) => (
            <AdvancedMarker
              key={facility.id}
              position={{ lat: facility.latitude, lng: facility.longitude }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.03, type: "spring" }}
                style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: isDay ? "var(--color-primary)" : "var(--color-primary-glow)",
                  border: `2px solid #FFFFFF`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                ☀️
              </motion.div>
            </AdvancedMarker>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { FacilityFormData } from "@/components/home/FacilityForm";
import SolarInstallAnimation from "@/components/home/SolarInstallAnimation";
import { MapPin, Satellite, AlertTriangle, Loader2 } from "lucide-react";

const MapPicker = dynamic(() => import("@/components/home/MapPicker"), { ssr: false });
const FacilityForm = dynamic(() => import("@/components/home/FacilityForm"), { ssr: false });

interface LocationState {
  lat: number;
  lng: number;
  address: string;
}

type GpsStatus = "idle" | "requesting" | "granted" | "denied";

export default function HomePageClient() {
  const router = useRouter();
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>("idle");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationState | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showInstallAnimation, setShowInstallAnimation] = useState(false);

  // GPS 권한 요청
  useEffect(() => {
    setGpsStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsStatus("granted");
      },
      () => {
        setGpsStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setSelectedLocation({ lat, lng, address });
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: FacilityFormData) => {
    const response = await fetch("/api/facilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        latitude: selectedLocation!.lat,
        longitude: selectedLocation!.lng,
        address: selectedLocation!.address,
      }),
    });

    if (!response.ok) throw new Error("등록 실패");

    // 폼을 닫고 설치 애니메이션 시작
    setShowForm(false);
    setShowInstallAnimation(true);
  };

  const handleInstallComplete = useCallback(() => {
    // 애니메이션 완료 후 대시보드로 이동
    setTimeout(() => router.push("/dashboard"), 800);
  }, [router]);

  return (
    <div style={{ height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      {/* 설치 애니메이션 오버레이 */}
      <SolarInstallAnimation
        show={showInstallAnimation}
        onComplete={handleInstallComplete}
      />

      {/* 헤더 */}
      <div className="page-header" style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
        <div>
          <div className="badge badge-primary" style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin size={11} />
            VPP 플랫폼
          </div>
          <h1 className="page-title">
            <span className="gradient-text">내 설비</span> 등록
          </h1>
        </div>
        {gpsStatus === "granted" && (
          <div style={{ fontSize: 11, color: "var(--color-primary)", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "var(--color-primary)", display: "inline-block",
              boxShadow: "0 0 6px var(--color-primary-glow)",
              animation: "pulse-glow 2s ease-in-out infinite",
            }} />
            GPS 연결됨
          </div>
        )}
      </div>

      {/* GPS 요청 중 오버레이 */}
      <AnimatePresence>
        {gpsStatus === "requesting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute", inset: 0,
              background: "var(--color-bg-base)", zIndex: 50,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 20,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(0,208,132,0.15) 0%, rgba(10,132,255,0.15) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(0,208,132,0.2)",
              }}
            >
              <Satellite size={36} color="var(--color-primary)" strokeWidth={1.5} />
            </motion.div>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 15, textAlign: "center" }}>
              GPS 위치 확인 중...<br />
              <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                권한 요청 팝업이 표시되면 허용을 선택해주세요
              </span>
            </p>
            <Loader2 size={20} color="var(--color-text-muted)" className="animate-spin" style={{ opacity: 0.5 }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 지도 */}
      <div style={{ flex: 1, marginTop: 80 }}>
        {(gpsStatus === "granted" || gpsStatus === "denied") && (
          <MapPicker
            onLocationSelect={handleLocationSelect}
            initialCenter={userLocation ?? undefined}
          />
        )}
      </div>

      {/* GPS 거부 알림 */}
      {gpsStatus === "denied" && !showForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "absolute", top: 76, left: 16, right: 16,
            background: "rgba(255,159,10,0.1)",
            border: "1px solid rgba(255,159,10,0.3)",
            borderRadius: 10, padding: "10px 14px",
            fontSize: 12, color: "var(--color-accent)",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          GPS 권한이 거부되었습니다. 서울 중심에서 시작합니다.
        </motion.div>
      )}

      {/* 설비 등록 폼 (슬라이드업) */}
      <AnimatePresence>
        {showForm && selectedLocation && (
          <FacilityForm
            latitude={selectedLocation.lat}
            longitude={selectedLocation.lng}
            address={selectedLocation.address}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

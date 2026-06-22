"use client";

import { useState, useCallback, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { motion } from "framer-motion";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialCenter?: { lat: number; lng: number };
}

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

// 다크 맵 스타일
const DARK_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#0d0d1a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0d0d1a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#555577" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a30" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#12122a" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1e1e3a" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#050512" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d6b" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
];

function MapClickHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useCallback(() => {
    if (!map) return;
    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        onSelect(e.latLng.lat(), e.latLng.lng());
      }
    });
  }, [map, onSelect]);

  return null;
}

export default function MapPicker({ onLocationSelect, initialCenter }: MapPickerProps) {
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const center = initialCenter ?? DEFAULT_CENTER;

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      setMarkerPos({ lat, lng });
      setIsGeocoding(true);

      try {
        if (!geocoderRef.current) {
          geocoderRef.current = new google.maps.Geocoder();
        }
        const result = await geocoderRef.current.geocode({ location: { lat, lng } });
        const address = result.results[0]?.formatted_address ?? `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        onLocationSelect(lat, lng, address);
      } catch {
        onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      } finally {
        setIsGeocoding(false);
      }
    },
    [onLocationSelect]
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <Map
          defaultCenter={center}
          defaultZoom={13}
          mapId="vpp-dark-map"
          gestureHandling="greedy"
          disableDefaultUI
          style={{ width: "100%", height: "100%" }}
          styles={DARK_MAP_STYLES}
          onClick={(e) => {
            if (e.detail?.latLng) {
              handleMapClick(e.detail.latLng.lat, e.detail.latLng.lng);
            }
          }}
        >
          {markerPos && (
            <AdvancedMarker position={markerPos}>
              <motion.div
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Pin
                  background="var(--color-primary)"
                  borderColor="var(--color-primary)"
                  glyphColor="#000"
                />
              </motion.div>
            </AdvancedMarker>
          )}
        </Map>
      </APIProvider>

      {/* 지도 안내 오버레이 */}
      {!markerPos && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(18,18,30,0.9)",
            border: "1px solid var(--color-glass-border)",
            borderRadius: 12,
            padding: "10px 20px",
            color: "var(--color-text-secondary)",
            fontSize: 13,
            backdropFilter: "blur(12px)",
            whiteSpace: "nowrap",
          }}
        >
          📍 지도를 탭하여 설비 위치를 선택하세요
        </motion.div>
      )}

      {/* 역지오코딩 로딩 */}
      {isGeocoding && (
        <div style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,208,132,0.15)",
          border: "1px solid var(--color-primary)",
          borderRadius: 8,
          padding: "6px 14px",
          color: "var(--color-primary)",
          fontSize: 12,
          backdropFilter: "blur(8px)",
        }}>
          주소 검색 중...
        </div>
      )}
    </div>
  );
}

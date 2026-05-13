"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, X } from "lucide-react";
import { geoMercator, geoPath } from "d3-geo";
import type { Facility } from "@/types/database.types";
import koreaGeoData from "./KOR.geo.json";

interface KoreaMapProps {
  facilities: Facility[];
}

/** 발전소별 실시간 데이터 시뮬레이션 */
function useSimulatedData(facilities: Facility[]) {
  const [data, setData] = useState<Map<string, { generation: number; errorRate: number }>>(new Map());

  useEffect(() => {
    const init = new Map<string, { generation: number; errorRate: number }>();
    facilities.forEach(f => {
      init.set(f.id, {
        generation: +(f.capacity_kw * (0.3 + Math.random() * 0.5)).toFixed(1),
        errorRate: +(1 + Math.random() * 8).toFixed(1),
      });
    });
    setData(init);

    const interval = setInterval(() => {
      setData(prev => {
        const next = new Map(prev);
        facilities.forEach(f => {
          const old = next.get(f.id);
          if (old) {
            next.set(f.id, {
              generation: +(old.generation + (Math.random() * 2 - 1)).toFixed(1),
              errorRate: +(Math.max(0.5, old.errorRate + (Math.random() * 0.6 - 0.3))).toFixed(1),
            });
          }
        });
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [facilities]);

  return data;
}

export default function KoreaMap({ facilities }: KoreaMapProps) {
  const simData = useSimulatedData(facilities);
  const [selected, setSelected] = useState<string | null>(null);

  // SVG 고정 좌표계
  const width = 400;
  const height = 520;

  // D3 지리 투영 설정 (GeoJSON을 뷰포트 크기에 맞게 꽉 채움)
  const { pathGenerator, projection } = useMemo(() => {
    const proj = geoMercator().fitSize([width, height], koreaGeoData as any);
    return {
      pathGenerator: geoPath().projection(proj),
      projection: proj
    };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* 맵 SVG 컨테이너 */}
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0, zIndex: 1 }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-bg-card)" />
            <stop offset="100%" stopColor="var(--color-bg-surface)" />
          </linearGradient>
          <filter id="landShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.4)" />
          </filter>
          <filter id="landGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="rgba(148, 163, 184, 0.1)" />
          </filter>
        </defs>

        {/* 위도/경도 그리드 제거 - 지도 중심의 깔끔한 룩을 위해 생략 */}

        {/* 한반도(대한민국) 지형 렌더링 */}
        <g filter="url(#landShadow)">
          <g filter="url(#landGlow)">
            {(koreaGeoData as any).features.map((feature: any, i: number) => {
              const pathString = pathGenerator(feature);
              if (!pathString) return null;
              return (
                <path
                  key={`prov-${i}`}
                  d={pathString}
                  fill="url(#landGrad)"
                  stroke="var(--color-glass-border)"
                  strokeWidth="0.6"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{ transition: "fill 0.3s ease" }}
                />
              );
            })}
          </g>
        </g>
      </svg>

      {/* 발전소 마커 레이어 (HTML 오버레이) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }}>
        {/* SVG 내부의 viewBox 배율에 맞추기 위해 좌표를 퍼센트로 매핑하거나 절대좌표를 리사이징해야 함.
            여기서는 가장 안정적인 방법으로, viewBox 좌표계에 HTML 요소들을 맞추기 위한 Wrapper를 둡니다. */}
        <div style={{ 
          position: "absolute", width: "100%", height: "100%", 
          display: "flex", alignItems: "center", justifyContent: "center" 
        }}>
          <div style={{
            position: "relative",
            width: "100%", height: "100%",
            maxWidth: width, maxHeight: height,
            aspectRatio: `${width}/${height}`,
            pointerEvents: "none"
          }}>
            {facilities.map((f, idx) => {
              // 실제 위경도를 D3 투영 함수로 변환
              const projected = projection([f.longitude, f.latitude]);
              if (!projected) return null;
              
              const [px, py] = projected;
              
              // 부모 container 대비 상대 비율(%)로 변환하여 리사이징(반응형)에 대응
              const leftPercent = (px / width) * 100;
              const topPercent = (py / height) * 100;

              const d = simData.get(f.id);
              const gen = d?.generation ?? 0;
              const err = d?.errorRate ?? 0;
              const isSelected = selected === f.id;
              const markerColor = err < 3 ? "var(--color-primary)" : err < 7 ? "var(--color-warning)" : "var(--color-danger)";

              return (
                <div 
                  key={f.id} 
                  style={{ 
                    position: "absolute", left: `${leftPercent}%`, top: `${topPercent}%`, 
                    transform: "translate(-50%, -50%)", zIndex: isSelected ? 30 : 20,
                    pointerEvents: "auto"
                  }}
                >
                  {/* 펄스 링 */}
                  <motion.div
                    animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: idx * 0.3 }}
                    style={{
                      position: "absolute", inset: -4, borderRadius: "50%",
                      border: `1.5px solid ${markerColor}`,
                    }}
                  />

                  {/* 마커 본체 */}
                  <motion.div
                    whileTap={{ scale: 1.3 }}
                    onClick={() => setSelected(isSelected ? null : f.id)}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 3, delay: idx * 0.2 }}
                    style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: markerColor,
                      border: "2px solid rgba(255,255,255,0.9)",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 0 12px ${markerColor}`,
                      position: "relative", zIndex: 2,
                    }}
                  >
                    <Sun size={10} color="white" strokeWidth={3} />
                  </motion.div>

                  {/* 실시간 수치 (작은 라벨) */}
                  <div style={{
                    position: "absolute",
                    top: -20, left: "50%", transform: "translateX(-50%)",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6, padding: "2px 6px",
                    fontSize: 9, fontWeight: 700, fontFamily: "var(--font-mono)",
                    color: markerColor,
                    whiteSpace: "nowrap",
                    backdropFilter: "blur(4px)",
                  }}>
                    {gen.toFixed(0)}kW
                  </div>

                  {/* 선택 시 상세 정보 팝업 */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{
                          position: "absolute",
                          top: 26, left: "50%", transform: "translateX(-50%)",
                          background: "var(--color-bg-surface)",
                          border: "1px solid var(--color-glass-border)",
                          borderRadius: 12, padding: "10px 12px",
                          width: 160, zIndex: 40,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "var(--color-text-primary)" }}>{f.owner_name}</span>
                          <X size={12} color="var(--color-text-muted)" style={{ cursor: "pointer" }} onClick={() => setSelected(null)} />
                        </div>
                        <div style={{ fontSize: 10, color: "var(--color-text-muted)", marginBottom: 8 }}>{f.address}</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1, background: "var(--color-bg-elevated)", borderRadius: 8, padding: "6px", textAlign: "center" }}>
                            <div style={{ fontSize: 8, color: "var(--color-text-muted)" }}>발전량</div>
                            <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--color-secondary)" }}>
                              {gen.toFixed(1)}<span style={{ fontSize: 8 }}>kW</span>
                            </div>
                          </div>
                          <div style={{ flex: 1, background: "var(--color-bg-elevated)", borderRadius: 8, padding: "6px", textAlign: "center" }}>
                            <div style={{ fontSize: 8, color: "var(--color-text-muted)" }}>오차율</div>
                            <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "var(--font-mono)", color: markerColor }}>
                              {err.toFixed(1)}<span style={{ fontSize: 8 }}>%</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

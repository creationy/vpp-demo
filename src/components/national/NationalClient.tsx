"use client";

import { motion } from "framer-motion";
import GridFairy from "@/components/national/GridFairy";
import KoreaMap from "@/components/national/KoreaMap";
import { useFacilities } from "@/hooks/useFacilities";
import { useGridStatus } from "@/hooks/useGridStatus";
import { Radio, Loader2, Map as MapIcon } from "lucide-react";

export default function NationalClient() {
  const { facilities, isLoading } = useFacilities();
  const gridStatus = useGridStatus();

  return (
    <div style={{ 
      position: "absolute", inset: 0, zIndex: 1, // 전체 화면을 꽉 채우고 GNB 밑으로도 지도가 깔리도록 설정
      display: "flex", 
      flexDirection: "column", 
      overflow: "hidden",
      width: "100%",
      background: "linear-gradient(to bottom, var(--color-bg-base), var(--color-bg-elevated))", // 맵 전체를 바다(Sea) 배경으로 확장
    }}>
      {/* 상단 헤더 (플로팅) */}
      <div style={{ 
        position: "absolute", top: 16, left: 16, right: 16, zIndex: 10,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start" 
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <h1 style={{ 
            fontSize: 22, fontWeight: 800, margin: 0, 
            textShadow: "0 2px 10px rgba(0,0,0,0.5)" 
          }}>
            <span className="gradient-text">전국 VPP 현황</span>
          </h1>
          <div style={{
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12, padding: "8px 12px",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>총 발전량</span>
              <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--color-secondary)" }}>
                {gridStatus.vppProduction.toFixed(1)} <span style={{ fontSize: 10 }}>MW</span>
              </span>
            </div>
            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>평균 오차</span>
              <span style={{ 
                fontSize: 14, fontWeight: 800, fontFamily: "var(--font-mono)", 
                color: gridStatus.errorRate > 7 ? "var(--color-danger)" : "var(--color-primary)" 
              }}>
                {gridStatus.errorRate.toFixed(1)}<span style={{ fontSize: 10 }}>%</span>
              </span>
            </div>
          </div>
        </div>
        <div style={{ 
          fontSize: 10, padding: "6px 12px", 
          background: "rgba(15, 23, 42, 0.7)", borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", gap: 6,
          color: gridStatus.isConnected ? "var(--color-primary)" : "var(--color-text-muted)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}>
          <Radio size={12} className={gridStatus.isConnected ? "pulse-glow" : ""} />
          <span style={{ fontWeight: 800, letterSpacing: 0.5 }}>{gridStatus.isConnected ? "LIVE" : "SYNC"}</span>
        </div>
      </div>

      {/* 한반도 지도 영역 (풀스크린) */}
      <div style={{ 
        flex: 1, width: "100%", position: "absolute", inset: 0,
      }}>
        {isLoading ? (
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 12, color: "var(--color-text-muted)", fontSize: 13,
          }}>
            <Loader2 size={24} color="var(--color-primary)" className="animate-spin" />
            전국 설비 데이터 로딩...
          </div>
        ) : (
          <>
            <KoreaMap facilities={facilities} />
            
            {/* 하단 범례 및 정보 (플로팅) - GNB 높이(72px) 위쪽으로 넉넉히(90px) 띄워 지도 안으로 진입시킴 */}
            <div style={{
              position: "absolute", 
              bottom: "calc(72px + 90px + env(safe-area-inset-bottom))", 
              left: 16, right: 16,
              display: "flex", justifyContent: "space-between", alignItems: "flex-end",
              zIndex: 5, pointerEvents: "none"
            }}>
              <div style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "10px 14px",
                backdropFilter: "blur(8px)",
                fontSize: 10, color: "var(--color-text-muted)",
                display: "flex", flexDirection: "column", gap: 6,
                boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                pointerEvents: "auto"
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 2 }}>예측 오차율 상태</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-primary)", boxShadow: "0 0 8px var(--color-primary)" }} />
                  정상 (3% 미만)
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-warning)", boxShadow: "0 0 8px var(--color-warning)" }} />
                  주의 (3~7%)
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-danger)", boxShadow: "0 0 8px var(--color-danger)" }} />
                  경고 (7% 초과)
                </div>
              </div>

              <div style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "10px 14px",
                backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", gap: 6,
                boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                pointerEvents: "auto"
              }}>
                <MapIcon size={14} color="var(--color-secondary)" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{facilities.length}개 발전소</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

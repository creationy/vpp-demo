"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PowerChart from "@/components/dashboard/PowerChart";
import IncentiveCard from "@/components/dashboard/IncentiveCard";
import CelebrationOverlay from "@/components/dashboard/CelebrationOverlay";
import type { PowerRecord } from "@/types/database.types";
import {
  Activity, TrendingUp, TrendingDown, BarChart3,
  Wifi, BrainCircuit, Loader2, Zap, Clock, Send,
} from "lucide-react";

interface DashboardClientProps {
  todayRecord: PowerRecord | null;
  monthlyIncentive: number;
  todayIncentive: number;
  mape: number;
}

/** 내일 시간대별 예측 데이터 생성 (06~20시) */
function generateForecast() {
  const hours = [];
  for (let h = 6; h <= 20; h++) {
    // 태양광 곡선: 정오에 피크
    const peakFactor = 1 - Math.abs(h - 13) / 8;
    const base = Math.max(0, peakFactor * (80 + Math.random() * 40));
    hours.push({
      hour: h,
      label: `${String(h).padStart(2, "0")}:00`,
      predicted: +base.toFixed(1),
    });
  }
  return hours;
}

export default function DashboardClient({
  todayRecord, monthlyIncentive, todayIncentive, mape,
}: DashboardClientProps) {
  const today = new Date();
  const todayStr = `${today.getMonth() + 1}월 ${today.getDate()}일`;
  const tomorrowStr = `${today.getMonth() + 1}월 ${today.getDate() + 1}일`;

  const totalActual = (todayRecord?.actual_kwh ?? []).reduce((s, v) => s + v, 0);
  const totalPredicted = (todayRecord?.predicted_kwh ?? []).reduce((s, v) => s + v, 0);
  const diffPct = totalPredicted > 0
    ? (((totalActual - totalPredicted) / totalPredicted) * 100).toFixed(1)
    : "0.0";
  const isPositive = Number(diffPct) >= 0;

  // 예측 실행 상태
  const [forecastState, setForecastState] = useState<"idle" | "loading" | "done">("idle");
  const [forecast, setForecast] = useState<{ hour: number; label: string; predicted: number }[]>([]);
  
  // 입찰 상태
  const [bidState, setBidState] = useState<"idle" | "bidding" | "done">("idle");
  const [showCelebration, setShowCelebration] = useState(false);

  const runForecast = () => {
    setForecastState("loading");
    setBidState("idle");
    setTimeout(() => {
      setForecast(generateForecast());
      setForecastState("done");
    }, 2800); // AI 모델 추론 시뮬레이션
  };

  const handleBid = () => {
    setBidState("bidding");
    setTimeout(() => {
      setBidState("done");
      setShowCelebration(true);
    }, 1500);
  };

  const closeCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  const totalForecast = forecast.reduce((s, f) => s + f.predicted, 0);

  return (
    <>
      <CelebrationOverlay show={showCelebration} onDone={closeCelebration} />

      <div className="section-pad" style={{ paddingBottom: 24 }}>
        {/* 헤더 */}
        <div className="page-header" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: 6 }}>
              <Activity size={11} />
              실시간 대시보드
            </div>
            <h1 className="page-title">
              <span className="gradient-text">전력 실적</span>
            </h1>
          </div>
          <span style={{ fontSize: 13, color: "var(--color-text-muted)", fontWeight: 500 }}>{todayStr}</span>
        </div>

        {/* 요약 카드 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            { label: "현재 발전 실적", value: totalActual.toFixed(1), unit: "kWh", color: "var(--color-secondary)", IconComp: BarChart3 },
            { label: "예측 정확도", value: `${isPositive ? "+" : ""}${diffPct}`, unit: "%", color: isPositive ? "var(--color-primary)" : "var(--color-danger)", IconComp: isPositive ? TrendingUp : TrendingDown },
          ].map((item) => (
            <motion.div key={item.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: "16px 14px" }}>
              <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                <item.IconComp size={12} />
                {item.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-mono)", color: item.color, lineHeight: 1 }}>
                {item.value}<span style={{ fontSize: 12, fontWeight: 500, marginLeft: 2 }}>{item.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 발전량 차트 */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: "16px 12px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "0 4px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <BarChart3 size={16} color="var(--color-secondary)" />
              실시간 발전 추이
            </h2>
            <div style={{ display: "flex", gap: 8, fontSize: 10, color: "var(--color-text-muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ width: 8, height: 2, background: "var(--color-secondary)", borderRadius: 1 }} /> 실제
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ width: 8, height: 2, background: "var(--color-accent)", borderRadius: 1 }} /> 예측
              </span>
            </div>
          </div>
          <div style={{ height: 180 }}>
            <PowerChart record={todayRecord} />
          </div>
        </motion.div>

        {/* ────── 예측 실행 섹션 ────── */}
        <motion.div
          className="glass-card"
          style={{ 
            padding: 16, marginBottom: 16,
            border: forecastState === "done" ? "1px solid var(--color-primary)" : undefined,
          }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
              <BrainCircuit size={16} color="var(--color-accent)" />
              내일 발전 예측
            </h2>
            {forecastState === "done" && (
              <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>{tomorrowStr} 기준</span>
            )}
          </div>

          {/* 예측 실행 버튼 */}
          {forecastState === "idle" && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={runForecast}
              style={{
                width: "100%", padding: "14px", borderRadius: 12,
                background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-secondary) 100%)",
                color: "white", fontSize: 14, fontWeight: 700,
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 4px 16px rgba(88,86,214,0.3)",
              }}
            >
              <BrainCircuit size={18} />
              AI 예측 실행하기
            </motion.button>
          )}

          {/* 로딩 */}
          {forecastState === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", padding: "24px 0" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                style={{ display: "inline-block", marginBottom: 12 }}
              >
                <BrainCircuit size={32} color="var(--color-accent)" />
              </motion.div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>
                AI 모델 예측 중...
              </div>
              <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                LightGBM + LSTM 앙상블 분석 진행
              </div>
              {/* 프로그레스 바 */}
              <div style={{ marginTop: 16, height: 4, background: "var(--color-bg-elevated)", borderRadius: 2, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  style={{ height: "100%", background: "linear-gradient(90deg, var(--color-accent), var(--color-primary))", borderRadius: 2 }}
                />
              </div>
            </motion.div>
          )}

          {/* 예측 결과 테이블 */}
          <AnimatePresence>
            {forecastState === "done" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.4 }}
              >
                {/* 총 예측 발전량 */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 12px", marginBottom: 12,
                  background: "var(--color-primary-glow)", borderRadius: 10,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)" }}>
                    <Zap size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                    총 예측 발전량
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--color-primary)" }}>
                    {totalForecast.toFixed(1)} kWh
                  </span>
                </div>

                {/* 시간대별 테이블 */}
                <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "var(--color-glass-border)", borderRadius: 10, overflow: "hidden" }}>
                    {/* 헤더 */}
                    {["시간", "예측(kWh)", "일조량"].map(h => (
                      <div key={h} style={{ padding: "8px 10px", fontSize: 10, fontWeight: 700, background: "var(--color-bg-elevated)", color: "var(--color-text-muted)", textAlign: "center" }}>{h}</div>
                    ))}
                    {/* 데이터 행 */}
                    {forecast.map((f, i) => {
                      const sunLevel = f.predicted > 80 ? "☀️" : f.predicted > 40 ? "🌤️" : f.predicted > 10 ? "⛅" : "🌙";
                      return [
                        <div key={`t${i}`} style={{ padding: "8px 10px", fontSize: 11, fontWeight: 600, background: "var(--color-bg-surface)", color: "var(--color-text-primary)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                          <Clock size={10} color="var(--color-text-muted)" />
                          {f.label}
                        </div>,
                        <div key={`v${i}`} style={{ padding: "8px 10px", fontSize: 12, fontWeight: 800, fontFamily: "var(--font-mono)", background: "var(--color-bg-surface)", color: "var(--color-secondary)", textAlign: "center" }}>
                          {f.predicted.toFixed(1)}
                        </div>,
                        <div key={`s${i}`} style={{ padding: "8px 10px", fontSize: 14, background: "var(--color-bg-surface)", textAlign: "center" }}>
                          {sunLevel}
                        </div>,
                      ];
                    })}
                  </div>
                </div>

                {/* 입찰하기 버튼 */}
                {bidState === "idle" && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleBid}
                    style={{
                      width: "100%", padding: "16px", borderRadius: 12,
                      background: "linear-gradient(135deg, var(--color-primary) 0%, #059669 100%)",
                      color: "white", fontSize: 15, fontWeight: 800,
                      border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
                    }}
                  >
                    <Send size={18} />
                    VPP 참여하기
                  </motion.button>
                )}

                {bidState === "bidding" && (
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <Loader2 size={22} color="var(--color-primary)" className="animate-spin" style={{ margin: "0 auto 8px" }} />
                    <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>입찰 전송 중...</div>
                  </div>
                )}

                {bidState === "done" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      textAlign: "center", padding: "12px",
                      background: "var(--color-primary-glow)", borderRadius: 12,
                      color: "var(--color-primary)", fontSize: 13, fontWeight: 700,
                    }}
                  >
                    ✅ 참여 완료 — {tomorrowStr} {totalForecast.toFixed(1)} kWh
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 인센티브 섹션 */}
        <div style={{ marginBottom: 16 }}>
          <IncentiveCard totalIncentive={monthlyIncentive} todayIncentive={todayIncentive} mape={mape} isMonthly={true} />
        </div>

        {/* 상태 알림 바 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: "16px",
            background: "linear-gradient(135deg, var(--color-primary-glow) 0%, rgba(10,132,255,0.05) 100%)",
            border: "1px solid var(--color-primary-glow)",
            borderRadius: "var(--radius-card)",
            display: "flex", alignItems: "center", gap: 12,
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--color-bg-surface)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}>
            <Wifi size={16} color="var(--color-primary)" className="pulse-glow" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)" }}>전력망 참여 안정</div>
            <p style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2, margin: 0 }}>
              현재 기여도 기준 예상 추가 인센티브 +12%
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import type { FairyMood } from "@/types/database.types";

interface GridStatus {
  mood: FairyMood;
  errorRate: number;
  vppProduction: number; // 실시간 VPP 생산량 (MW)
  isConnected: boolean;
}

export function useGridStatus() {
  const [status, setStatus] = useState<GridStatus>({
    mood: "neutral",
    errorRate: 5.2,
    vppProduction: 450.5,
    isConnected: false,
  });

  useEffect(() => {
    // 3가지 시나리오 (안정, 주의, 위기)
    const scenarios: { mood: FairyMood; errorBase: number; prodBase: number }[] = [
      { mood: "happy", errorBase: 1.8, prodBase: 520.4 },     // 생산 안정적
      { mood: "worried", errorBase: 8.2, prodBase: 380.1 },   // 생산 변동성 높음
      { mood: "critical", errorBase: 17.5, prodBase: 120.5 }, // 생산 급감 (위기)
    ];

    const pick = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    const timer = setTimeout(() => {
      setStatus(s => ({ 
        ...s, 
        isConnected: true, 
        mood: pick.mood,
        errorRate: pick.errorBase,
        vppProduction: pick.prodBase
      }));
    }, 800);

    const interval = setInterval(() => {
      setStatus(s => ({
        ...s,
        // 생산량은 소수점 단위로 미세하게 계속 변함 (기상 상황 반영 시뮬레이션)
        vppProduction: s.vppProduction + (Math.random() * 2.0 - 1.0),
        errorRate: s.errorRate + (Math.random() * 0.2 - 0.1),
      }));
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return status;
}

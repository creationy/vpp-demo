"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Coins, CalendarDays, Target } from "lucide-react";

interface IncentiveCardProps {
  totalIncentive: number;
  todayIncentive: number;
  mape: number;
  isMonthly?: boolean;
}

export default function IncentiveCard({ totalIncentive, todayIncentive, mape, isMonthly }: IncentiveCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString("ko-KR"));

  useEffect(() => {
    const controls = animate(count, totalIncentive, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [totalIncentive, count]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        background: "linear-gradient(135deg, rgba(0,208,132,0.12) 0%, rgba(10,132,255,0.08) 100%)",
        border: "1px solid rgba(0,208,132,0.2)",
        borderRadius: "var(--radius-card)",
        padding: "20px",
      }}
    >
      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}>
        <Coins size={13} color="var(--color-accent)" />
        {isMonthly ? "당월 누적 인센티브" : "누적 인센티브"}
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 16 }}>
        <motion.span
          style={{
            fontSize: 40,
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            color: "var(--color-primary)",
            lineHeight: 1,
          }}
        >
          {rounded}
        </motion.span>
        <span style={{ color: "var(--color-primary)", fontSize: 16, marginBottom: 4 }}>원</span>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div
          style={{
            flex: 1,
            background: "rgba(10,132,255,0.1)",
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 2, display: "flex", alignItems: "center", gap: 3 }}><CalendarDays size={10} />오늘</div>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            color: "var(--color-secondary)",
          }}>
            +{todayIncentive.toLocaleString("ko-KR")}원
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: mape < 5 ? "rgba(0,208,132,0.1)" : "rgba(255,159,10,0.1)",
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 2, display: "flex", alignItems: "center", gap: 3 }}><Target size={10} />예측 정확도</div>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            color: mape < 5 ? "var(--color-primary)" : "var(--color-accent)",
          }}>
            {(100 - mape).toFixed(1)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}

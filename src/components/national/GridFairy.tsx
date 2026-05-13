"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Activity,
  Zap,
} from "lucide-react";
import type { FairyMood } from "@/types/database.types";

interface GridFairyProps {
  mood: FairyMood;
  errorRate: number;
  activeFacilities: number; // 실제로는 vppProduction
}

const MOOD_CONFIG = {
  happy: {
    color: "var(--color-primary)",
    glowColor: "rgba(52, 211, 153, 0.4)",
    bgGradient: "radial-gradient(circle at 30% 30%, rgba(52, 211, 153, 0.2) 0%, rgba(52, 211, 153, 0.05) 100%)",
    label: "안정",
    Icon: ShieldCheck,
    message: "전국 전력망이 매우 안정적입니다. 예측 오차가 낮아 인센티브가 극대화되고 있어요!",
  },
  neutral: {
    color: "var(--color-secondary)",
    glowColor: "rgba(10, 132, 255, 0.4)",
    bgGradient: "radial-gradient(circle at 30% 30%, rgba(10, 132, 255, 0.2) 0%, rgba(10, 132, 255, 0.05) 100%)",
    label: "보통",
    Icon: Activity,
    message: "현재 전력망은 표준 상태입니다. 실시간 수급 조절에 참여하여 수익을 높여보세요.",
  },
  worried: {
    color: "var(--color-warning)",
    glowColor: "rgba(255, 159, 10, 0.4)",
    bgGradient: "radial-gradient(circle at 30% 30%, rgba(255, 159, 10, 0.2) 0%, rgba(255, 159, 10, 0.05) 100%)",
    label: "주의",
    Icon: ShieldQuestion,
    message: "일부 지역의 기상 변동으로 예측 오차가 상승 중입니다. 모델 재학습을 고려해 보세요.",
  },
  critical: {
    color: "var(--color-danger)",
    glowColor: "rgba(255, 69, 58, 0.4)",
    bgGradient: "radial-gradient(circle at 30% 30%, rgba(255, 69, 58, 0.2) 0%, rgba(255, 69, 58, 0.05) 100%)",
    label: "경보",
    Icon: ShieldAlert,
    message: "비상 상태! 급격한 수급 불균형이 감지되었습니다. 즉각적인 부하 조정이 필요합니다.",
  },
};

export default function GridFairy({ mood, errorRate, activeFacilities }: GridFairyProps) {
  const config = MOOD_CONFIG[mood] || MOOD_CONFIG.neutral;
  const StatusIcon = config.Icon;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
      padding: "16px 0",
    }}>
      {/* 콤팩트한 메인 캐릭터 섹션 */}
      <div style={{ position: "relative", width: 140, height: 140 }}>
        {/* 펄스 링 애니메이션 */}
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              delay: i * 1.2,
              ease: "easeOut"
            }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `1.5px solid ${config.color}`,
              filter: `blur(${i * 2}px)`,
            }}
          />
        ))}

        {/* 메인 오브 (글래스모피즘) */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: config.bgGradient,
            border: `1.5px solid ${config.color}40`,
            backdropFilter: "blur(16px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 10px 40px ${config.glowColor}`,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mood}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
            >
              <StatusIcon size={44} color={config.color} strokeWidth={1.5} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 상태 배지 및 지표 */}
      <div style={{ textAlign: "center", width: "100%" }}>
        <motion.div
          layout
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 16px",
            background: `${config.color}15`,
            border: `1px solid ${config.color}40`,
            borderRadius: 20,
            color: config.color,
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          <Zap size={13} fill={config.color} />
          그리드 {config.label}
        </motion.div>

        {/* 콤팩트 통계 뷰 */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: 20, 
          background: "var(--color-bg-card)",
          padding: "12px 24px",
          borderRadius: 16,
          border: "1px solid var(--color-glass-border)",
        }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--color-text-muted)", marginBottom: 2 }}>오차율</div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--font-mono)", color: config.color }}>
              {errorRate.toFixed(1)}%
            </div>
          </div>
          <div style={{ width: 1, background: "var(--color-glass-border)", margin: "4px 0" }} />
          <div>
            <div style={{ fontSize: 10, color: "var(--color-text-muted)", marginBottom: 2 }}>실시간 생산</div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}>
              {activeFacilities.toFixed(1)}<span style={{ fontSize: 11, fontWeight: 500, marginLeft: 2 }}>MW</span>
            </div>
          </div>
        </div>
      </div>

      {/* 말풍선 가이드 */}
      <motion.p
        key={mood}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontSize: 12,
          color: "var(--color-text-secondary)",
          textAlign: "center",
          lineHeight: 1.6,
          margin: "4px 0 0",
          padding: "0 20px",
          wordBreak: "keep-all",
        }}
      >
        {config.message}
      </motion.p>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { PartyPopper, Sparkles } from "lucide-react";

interface CelebrationOverlayProps {
  show: boolean;
  onDone: () => void;
}

/** 화면 아래에서 위로 올라가는 빛 입자 하나 */
function Particle({ delay, x }: { delay: number; x: number }) {
  const colors = ["#34D399", "#60A5FA", "#FBBF24", "#F472B6", "#A78BFA", "#FB923C"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = 4 + Math.random() * 8;
  const duration = 2 + Math.random() * 1.5;

  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
      animate={{ 
        y: -(400 + Math.random() * 400), 
        x: (Math.random() - 0.5) * 120,
        opacity: [1, 1, 0.8, 0],
        scale: [1, 1.5, 0.5],
        rotate: Math.random() * 360,
      }}
      transition={{ duration, delay, ease: "easeOut" }}
      style={{
        position: "absolute",
        bottom: 0,
        left: `${x}%`,
        width: size,
        height: size,
        borderRadius: size > 8 ? 3 : "50%",
        background: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        pointerEvents: "none",
      }}
    />
  );
}

export default function CelebrationOverlay({ show, onDone }: CelebrationOverlayProps) {
  const [particles, setParticles] = useState<{ id: number; delay: number; x: number }[]>([]);

  useEffect(() => {
    if (show) {
      // 60개의 파티클 생성
      const p = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        delay: Math.random() * 1.2,
        x: 10 + Math.random() * 80,
      }));
      setParticles(p);

      const timer = setTimeout(() => onDone(), 4500);
      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            pointerEvents: "auto",
          }}
          onClick={onDone}
        >
          {/* 파티클 레이어 */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {particles.map(p => (
              <Particle key={p.id} delay={p.delay} x={p.x} />
            ))}
          </div>

          {/* 중앙 메시지 */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.8, delay: 0.2 }}
            style={{
              textAlign: "center",
              position: "relative",
              zIndex: 10,
            }}
          >
            {/* 아이콘 */}
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: 2 }}
              style={{ marginBottom: 16 }}
            >
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(52,211,153,0.3) 0%, rgba(96,165,250,0.3) 100%)",
                border: "2px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto",
                boxShadow: "0 0 40px rgba(52,211,153,0.4)",
              }}>
                <PartyPopper size={36} color="#34D399" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#FFFFFF",
                marginBottom: 8,
                textShadow: "0 2px 20px rgba(52,211,153,0.5)",
              }}
            >
              🎉 풀뿌리VPP 참여 성공!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.6,
              }}
            >
              내일의 발전 예측이 전력시장에 입찰되었습니다.<br />
              <span style={{ color: "#34D399", fontWeight: 700 }}>인센티브 정산은 익일 자동 반영</span>됩니다.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "rgba(255,255,255,0.5)", fontSize: 11 }}
            >
              <Sparkles size={12} /> 화면을 터치하면 닫힙니다
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SolarInstallAnimationProps {
  show: boolean;
  onComplete: () => void;
}

// 베이스 색상 (Premium Slate Blue)
const HUE = 210;

/**
 * 모노크롬 쿼터뷰 3D 시네마틱 애니메이션
 */
export default function SolarInstallAnimation({ show, onComplete }: SolarInstallAnimationProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!show) { setPhase(0); return; }
    const t = [
      setTimeout(() => setPhase(1), 500),   // 기초
      setTimeout(() => setPhase(2), 1200),  // 지지대
      setTimeout(() => setPhase(3), 1900),  // 패널
      setTimeout(() => setPhase(4), 3600),  // 광원 & 다이내믹 그림자
      setTimeout(() => { setPhase(5); onComplete(); }, 6200),
    ];
    return () => t.forEach(clearTimeout);
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            overflow: "hidden",
            background: `radial-gradient(circle at 50% 50%, hsl(${HUE}, 30%, 12%) 0%, hsl(${HUE}, 40%, 4%) 100%)`,
          }}
        >
          {/* ── 쿼터뷰 3D 월드 (Isometric Projection) ── */}
          <motion.div
            initial={{ scale: 0.8, y: 100, rotateX: 60, rotateZ: -45 }}
            animate={{ scale: 1, y: 0, rotateX: 60, rotateZ: -45 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "relative",
              width: 300, height: 300,
              transformStyle: "preserve-3d",
            }}
          >
            {/* ── 지면 (Ground) ── */}
            <motion.div
              initial={{ opacity: 0, z: -50 }}
              animate={{ opacity: 1, z: 0 }}
              transition={{ duration: 1 }}
              style={{
                position: "absolute", inset: -80,
                background: `linear-gradient(135deg, hsl(${HUE}, 20%, 16%) 0%, hsl(${HUE}, 25%, 10%) 100%)`,
                border: `1px solid hsl(${HUE}, 20%, 25%)`,
                borderRadius: 16,
                boxShadow: `
                  inset 0 0 100px hsl(${HUE}, 50%, 5%),
                  0 20px 60px hsla(${HUE}, 100%, 2%, 0.8)
                `,
                transformStyle: "preserve-3d",
              }}
            >
              <svg width="100%" height="100%" style={{ opacity: 0.3 }}>
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <rect width="30" height="30" fill="none" stroke={`hsl(${HUE}, 40%, 30%)`} strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </motion.div>

            {/* ── Phase 1: 콘크리트 기초 ── */}
            {phase >= 1 && (
              <motion.div
                initial={{ z: -20, opacity: 0 }}
                animate={{ z: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  left: 20, right: 20, top: 120, height: 60,
                  transformStyle: "preserve-3d",
                }}
              >
                <div style={{
                  position: "absolute", inset: 0,
                  background: `hsl(${HUE}, 10%, 35%)`,
                  border: `1px solid hsl(${HUE}, 10%, 45%)`,
                  transform: "translateZ(10px)",
                }} />
                <div style={{
                  position: "absolute", left: 0, right: 0, bottom: 0, height: 10,
                  background: `hsl(${HUE}, 15%, 20%)`,
                  transformOrigin: "bottom", transform: "rotateX(-90deg)",
                }} />
                <div style={{
                  position: "absolute", top: 0, right: 0, bottom: 0, width: 10,
                  background: `hsl(${HUE}, 15%, 28%)`,
                  transformOrigin: "right", transform: "rotateY(90deg)",
                }} />
              </motion.div>
            )}

            {/* ── Phase 2: 지지대 ── */}
            {phase >= 2 && [1, 2, 3, 4].map((i) => (
              <motion.div
                key={`strut-${i}`}
                initial={{ z: 10, scaleZ: 0, opacity: 0 }}
                animate={{ scaleZ: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "backOut" }}
                style={{
                  position: "absolute",
                  left: i * 50 + 10, top: 145,
                  width: 6, height: 6,
                  transformStyle: "preserve-3d",
                }}
              >
                <div style={{
                  position: "absolute", left: 0, right: 0, top: 6, height: 80,
                  background: `hsl(${HUE}, 20%, 45%)`,
                  transformOrigin: "top", transform: "rotateX(-90deg)",
                }} />
                <div style={{
                  position: "absolute", top: 0, right: 0, bottom: 0, width: 80,
                  background: `hsl(${HUE}, 20%, 55%)`,
                  transformOrigin: "right", transform: "rotateY(90deg)",
                }} />
              </motion.div>
            ))}

            {/* ── Phase 3 & 4: 태양광 패널 및 다이내믹 그림자 ── */}
            {phase >= 3 && [0, 1, 2].map((row) =>
              [0, 1, 2, 3].map((col) => {
                const idx = row * 4 + col;
                const panelDelay = idx * 0.08;
                const x = col * 60 + 20;
                const y = row * 50 + 80;
                
                // 화면상 X 좌표 (아이소메트릭 보정: Screen X는 로컬 X - 로컬 Y 에 비례)
                // 우측 끝이 가장 크고(180), 좌측 끝이 가장 작음(-100)
                const screenX = col * 60 - row * 50;
                // 우측(screenX가 큰 값)부터 빛이 닿도록 딜레이 설정
                const sweepDelay = (180 - screenX) * 0.005;

                return (
                  <motion.div
                    key={`p-${row}-${col}`}
                    initial={{ opacity: 0, z: 150, x: x - 20, y: y + 20 }}
                    animate={{ opacity: 1, z: 90, x, y }}
                    transition={{ duration: 0.6, delay: panelDelay, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: "absolute",
                      width: 55, height: 45,
                      transformStyle: "preserve-3d",
                      transform: "rotateX(-15deg) rotateY(-10deg)",
                    }}
                  >
                    {/* 패널 윗면 */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: `linear-gradient(135deg, hsl(${HUE}, 60%, 25%) 0%, hsl(${HUE}, 70%, 15%) 100%)`,
                      border: `1px solid hsl(${HUE}, 50%, 40%)`,
                      borderRadius: 2,
                      transform: "translateZ(4px)",
                      overflow: "hidden",
                    }}>
                      <div style={{
                        position: "absolute", inset: 2,
                        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 1,
                      }}>
                        {Array.from({ length: 6 }).map((_, ci) => (
                          <div key={ci} style={{
                            background: `hsl(${HUE}, 60%, ${20 + (ci % 2) * 2}%)`,
                            border: `0.5px solid hsl(${HUE}, 50%, 30%)`,
                          }} />
                        ))}
                      </div>

                      {/* 광원 스위프 (화면 기준 수직선이 우->좌로 이동) */}
                      {phase >= 4 && (
                        <motion.div
                          initial={{ left: "200%", opacity: 0 }}
                          animate={{ left: "-200%", opacity: [0, 1, 1, 0] }}
                          transition={{ duration: 2.2, ease: "linear", delay: sweepDelay }}
                          style={{
                            position: "absolute", top: "-100%", width: "100%", height: "300%",
                            background: `linear-gradient(
                              90deg,
                              transparent 0%,
                              hsla(${HUE}, 80%, 80%, 0.0) 35%,
                              hsla(${HUE}, 100%, 95%, 0.8) 50%,
                              hsla(${HUE}, 80%, 80%, 0.0) 65%,
                              transparent 100%
                            )`,
                            // 45도 회전 시 아이소메트릭 공간에서 화면상 완벽한 수직선이 됨
                            transform: "rotate(45deg)",
                            pointerEvents: "none",
                            zIndex: 10,
                          }}
                        />
                      )}
                    </div>

                    {/* 두께 표현 */}
                    <div style={{
                      position: "absolute", left: 0, right: 0, bottom: 0, height: 4,
                      background: `hsl(${HUE}, 30%, 12%)`,
                      transformOrigin: "bottom", transform: "rotateX(-90deg)",
                    }} />
                    <div style={{
                      position: "absolute", top: 0, right: 0, bottom: 0, width: 4,
                      background: `hsl(${HUE}, 40%, 20%)`,
                      transformOrigin: "right", transform: "rotateY(90deg)",
                    }} />

                    {/* ── 바닥 다이내믹 3D 그림자 ── */}
                    {phase >= 4 ? (
                      <motion.div
                        initial={{ x: -40, y: 40, opacity: 0, scaleX: 1.5 }}
                        animate={{ 
                          // 빛이 우->좌로 가므로 그림자는 좌->우로 길어짐
                          x: [-40, 0, 40],       
                          y: [40, 0, -40],       
                          opacity: [0, 0.7, 0],
                          scaleX: [1.8, 1, 1.8]  
                        }}
                        transition={{ duration: 2.6, ease: "easeInOut", delay: sweepDelay * 0.5 }}
                        style={{
                          position: "absolute", inset: -5,
                          background: `hsl(${HUE}, 80%, 1%)`,
                          transform: "translateZ(-90px) skewX(25deg)",
                          filter: "blur(10px)",
                          zIndex: -1,
                        }}
                      />
                    ) : (
                      <div style={{
                        position: "absolute", inset: -5,
                        background: `hsl(${HUE}, 80%, 1%)`,
                        transform: "translateZ(-90px)",
                        opacity: 0.3,
                        filter: "blur(8px)",
                        zIndex: -1,
                      }} />
                    )}
                  </motion.div>
                );
              })
            )}

            {/* ── Phase 4: 모노크롬 광원 (화면 우측 끝 -> 화면 좌측 끝 수평 이동) ── */}
            {phase >= 4 && (
              <motion.div
                // 아이소메트릭 상에서 화면 수평 이동 궤적: x+y 값이 일정해야 함
                initial={{ x: 250, y: -150, z: 180, opacity: 0 }} // 우측
                animate={{
                  x: [250, 50, -150],  // x 감소 (좌로)
                  y: [-150, 50, 250],  // y 증가 (하로) => 결과적으로 화면상 완벽한 수평 좌측이동
                  z: [180, 220, 180],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 2.6, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  width: 80, height: 80,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, hsl(${HUE}, 100%, 98%) 0%, hsla(${HUE}, 80%, 70%, 0.6) 30%, transparent 70%)`,
                  boxShadow: `0 0 120px 50px hsla(${HUE}, 100%, 70%, 0.4)`,
                  transformStyle: "preserve-3d",
                  transform: "rotateX(-60deg) rotateZ(45deg)", 
                  pointerEvents: "none",
                  zIndex: 200,
                }}
              />
            )}
          </motion.div>

          {/* ── 진행 텍스트 (HUD) ── */}
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute", bottom: 60,
              zIndex: 10, textAlign: "center", width: "100%",
            }}
          >
            <div style={{
              fontSize: 16, fontWeight: 800,
              color: phase >= 4 ? `hsl(${HUE}, 100%, 85%)` : `hsl(${HUE}, 20%, 80%)`,
              letterSpacing: "-0.02em", textShadow: `0 2px 10px hsla(${HUE}, 100%, 50%, 0.3)`,
            }}>
              {phase === 0 && "SYSTEM: LOCATING FIELD..."}
              {phase === 1 && "CONSTRUCTING FOUNDATION"}
              {phase === 2 && "ERECTING STRUCTURES"}
              {phase === 3 && "MOUNTING SOLAR MODULES"}
              {phase === 4 && "INITIATING LIGHT SIMULATION"}
              {phase === 5 && "INSTALLATION COMPLETE"}
            </div>

            {phase <= 4 && (
              <div style={{
                margin: "16px auto 0", width: 220, height: 4,
                background: `hsla(${HUE}, 30%, 30%, 0.3)`, borderRadius: 2, overflow: "hidden",
                border: `1px solid hsla(${HUE}, 40%, 40%, 0.2)`,
              }}>
                <motion.div
                  animate={{ width: `${(phase / 5) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: `linear-gradient(90deg, hsl(${HUE}, 60%, 40%) 0%, hsl(${HUE}, 100%, 70%) 100%)`,
                    boxShadow: `0 0 10px hsla(${HUE}, 100%, 60%, 0.6)`,
                  }}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

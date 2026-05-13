"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  BarChart3,
  BrainCircuit,
  Globe,
  Info,
} from "lucide-react";

const tabs = [
  { id: "home", label: "홈", path: "/home", Icon: Home },
  { id: "dashboard", label: "대시보드", path: "/dashboard", Icon: BarChart3 },
  { id: "national", label: "전국현황", path: "/national", Icon: Globe },
  { id: "forecast", label: "예측제어", path: "/forecast", Icon: BrainCircuit },
  { id: "about", label: "정보", path: "/about", Icon: Info },
];

/**
 * 정밀 정합 모바일 GNB
 * - flex: 1을 이용한 균등 배분
 * - 활성 인디케이터 중앙 정렬 최적화
 */
export default function GNB() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 500,
      height: "calc(68px + env(safe-area-inset-bottom))",
      background: "var(--color-bg-card)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderTop: "1px solid var(--color-glass-border)",
      display: "flex",
      alignItems: "stretch", // 높이를 가득 채움
      padding: "0 4px calc(env(safe-area-inset-bottom) / 1.5)",
      zIndex: 1000,
    }}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <Link key={tab.id} href={tab.path} style={{ 
            textDecoration: "none", 
            flex: 1, 
            display: "flex", 
            justifyContent: "center",
            alignItems: "center"
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              position: "relative",
              width: "100%",
              height: "100%",
            }}>
              {/* 활성 배경 (정중앙 고정) */}
              {isActive && (
                <motion.div
                  layoutId="gnb-active-bg"
                  style={{
                    position: "absolute",
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: "var(--color-primary-glow)",
                    zIndex: 1,
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <motion.div
                animate={{
                  scale: isActive ? 1.05 : 1,
                  y: isActive ? -1 : 0,
                }}
                style={{
                  position: "relative",
                  zIndex: 2,
                  color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                }}
              >
                <tab.Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              
              <span style={{
                fontSize: 10,
                fontWeight: isActive ? 800 : 500,
                color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                zIndex: 2,
                marginTop: 2,
              }}>
                {tab.label}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

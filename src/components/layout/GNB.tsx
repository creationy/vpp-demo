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
  Zap,
} from "lucide-react";

const tabs = [
  { id: "home", label: "홈", path: "/home", Icon: Home },
  { id: "dashboard", label: "대시보드", path: "/dashboard", Icon: BarChart3 },
  { id: "national", label: "전국현황", path: "/national", Icon: Globe },
  { id: "forecast", label: "예측제어", path: "/forecast", Icon: BrainCircuit },
  { id: "about", label: "정보", path: "/about", Icon: Info },
];

/**
 * 반응형 글로벌 네비게이션
 * - 모바일(<1024px): 하단 고정 탭바 (flex:1 균등 배분)
 * - 데스크탑(≥1024px): 좌측 세로 사이드바 (브랜드 + 메뉴)
 *   레이아웃 전환은 globals.css 의 미디어쿼리(.gnb 계열 클래스)로 처리하여
 *   SSR 하이드레이션 깜빡임 없이 동작한다.
 */
export default function GNB() {
  const pathname = usePathname();

  return (
    <nav className="gnb">
      {/* 데스크탑 전용 브랜드 헤더 (모바일에서는 CSS로 숨김) */}
      <div className="gnb-brand">
        <div className="gnb-brand-logo">
          <Zap size={20} color="#fff" strokeWidth={2.4} />
        </div>
        <div className="gnb-brand-text">
          <span className="gnb-brand-title gradient-text">VPP 태양광</span>
          <span className="gnb-brand-sub">스마트 가상발전소</span>
        </div>
      </div>

      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <Link
            key={tab.id}
            href={tab.path}
            className={`gnb-tab${isActive ? " is-active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <div className="gnb-tab-inner">
              {/* 활성 배경 (탭 간 슬라이드 애니메이션) */}
              {isActive && (
                <motion.div
                  layoutId="gnb-active-bg"
                  className="gnb-active-bg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <motion.div
                className="gnb-icon"
                animate={{ scale: isActive ? 1.05 : 1 }}
              >
                <tab.Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>

              <span className="gnb-label">{tab.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

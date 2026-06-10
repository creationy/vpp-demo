"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle, RefreshCw } from "lucide-react";
import StockCard from "@/components/stocks/StockCard";
import { recommendStocks, INVEST_STYLES } from "@/lib/stocks/recommend";
import type { InvestStyle, Stock } from "@/types/stock.types";

interface StocksClientProps {
  universe: Stock[];
}

export default function StocksClient({ universe }: StocksClientProps) {
  const [style, setStyle] = useState<InvestStyle>("balanced");
  const [analyzing, setAnalyzing] = useState(false);

  const recommendations = useMemo(
    () => recommendStocks(style, 5, universe),
    [style, universe],
  );

  const activeStyle = INVEST_STYLES.find((s) => s.id === style)!;

  const changeStyle = (next: InvestStyle) => {
    if (next === style) return;
    // AI 분석 시뮬레이션 — 짧은 로딩 후 결과 전환
    setAnalyzing(true);
    setStyle(next);
    setTimeout(() => setAnalyzing(false), 700);
  };

  return (
    <div className="section-pad" style={{ paddingBottom: 24 }}>
      {/* 헤더 */}
      <div className="page-header" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 700,
              color: "var(--color-primary)",
              background: "var(--color-primary-glow)",
              padding: "4px 10px",
              borderRadius: "var(--radius-pill)",
              marginBottom: 6,
            }}
          >
            <Sparkles size={11} />
            AI 종목 추천
          </div>
          <h1 className="page-title">
            <span className="gradient-text">투자 종목 추천</span>
          </h1>
        </div>
      </div>

      {/* 투자 성향 선택 */}
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4,
          marginBottom: 8,
          scrollbarWidth: "none",
        }}
      >
        {INVEST_STYLES.map((s) => {
          const isActive = s.id === style;
          return (
            <button
              key={s.id}
              onClick={() => changeStyle(s.id)}
              style={{
                flexShrink: 0,
                padding: "9px 16px",
                borderRadius: "var(--radius-pill)",
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                border: "1px solid",
                borderColor: isActive ? "var(--color-primary)" : "var(--color-glass-border)",
                background: isActive ? "var(--color-primary-glow)" : "var(--color-bg-elevated)",
                color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 16 }}>
        {activeStyle.description}
      </p>

      {/* 추천 리스트 */}
      <AnimatePresence mode="wait">
        {analyzing ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card"
            style={{
              padding: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <RefreshCw size={22} className="animate-spin" style={{ color: "var(--color-primary)" }} />
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 600 }}>
              {activeStyle.label} 포트폴리오 분석 중...
            </span>
          </motion.div>
        ) : (
          <motion.div key={style} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {recommendations.map((stock, i) => (
              <StockCard key={stock.ticker} stock={stock} rank={i + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 면책 고지 */}
      <div
        className="glass-card"
        style={{
          padding: 14,
          marginTop: 4,
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          borderColor: "rgba(255, 159, 10, 0.35)",
        }}
      >
        <AlertTriangle size={16} style={{ color: "var(--color-warning)", flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 11, color: "var(--color-text-muted)", lineHeight: 1.55 }}>
          본 화면은 <strong style={{ color: "var(--color-text-secondary)" }}>데모용 가상 데이터</strong>로
          생성된 추천이며, 특정 종목의 매수·매도를 권유하지 않습니다. 실제 투자 판단과 그에 따른 책임은
          투자자 본인에게 있습니다.
        </p>
      </div>
    </div>
  );
}

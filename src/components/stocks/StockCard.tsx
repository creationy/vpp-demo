"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Area, AreaChart, YAxis } from "recharts";
import { ChevronDown, ShieldCheck, ShieldAlert, Flame } from "lucide-react";
import type { ScoredStock, RiskLevel } from "@/types/stock.types";

const RISK_META: Record<RiskLevel, { label: string; color: string; Icon: typeof ShieldCheck }> = {
  low: { label: "낮은 위험", color: "var(--color-primary)", Icon: ShieldCheck },
  medium: { label: "중간 위험", color: "var(--color-warning)", Icon: ShieldAlert },
  high: { label: "높은 위험", color: "var(--color-danger)", Icon: Flame },
};

const fmtPrice = (v: number) => v.toLocaleString("ko-KR");

interface StockCardProps {
  stock: ScoredStock;
  rank: number;
}

export default function StockCard({ stock, rank }: StockCardProps) {
  const [expanded, setExpanded] = useState(false);

  // 국내 관례: 상승 빨강 / 하락 파랑
  const isUp = stock.changePct >= 0;
  const changeColor = isUp ? "var(--color-danger)" : "var(--color-secondary)";
  const risk = RISK_META[stock.riskLevel];

  const chartData = stock.priceHistory.map((p, i) => ({ i, price: p }));
  const trendUp = stock.priceHistory[stock.priceHistory.length - 1] >= stock.priceHistory[0];
  const trendColor = trendUp ? "#FF453A" : "#0A84FF";

  const metrics = [
    { label: "PER", value: stock.per > 0 ? `${stock.per.toFixed(1)}배` : "적자" },
    { label: "PBR", value: `${stock.pbr.toFixed(1)}배` },
    { label: "ROE", value: `${stock.roe.toFixed(1)}%` },
    { label: "배당률", value: `${stock.dividendYield.toFixed(1)}%` },
    { label: "EPS성장", value: `${stock.epsGrowth >= 0 ? "+" : ""}${stock.epsGrowth.toFixed(0)}%` },
    { label: "변동성", value: `${stock.volatility}%` },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.06 }}
      className="glass-card"
      style={{ padding: 16, marginBottom: 12, cursor: "pointer" }}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* 상단: 순위 + 종목명 + 점수 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 800,
            fontFamily: "var(--font-mono)",
            background: rank === 1 ? "var(--color-primary)" : "var(--color-bg-elevated)",
            color: rank === 1 ? "#fff" : "var(--color-text-secondary)",
            boxShadow: rank === 1 ? "0 2px 10px var(--color-primary-glow)" : "none",
          }}
        >
          {rank}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{stock.name}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 6px",
                borderRadius: 6,
                background: "var(--color-bg-elevated)",
                color: "var(--color-text-muted)",
              }}
            >
              {stock.sector}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
            {stock.market} · {stock.ticker}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>추천점수</div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              fontFamily: "var(--font-mono)",
              color: "var(--color-primary)",
              lineHeight: 1.1,
            }}
          >
            {stock.score}
          </div>
        </div>
      </div>

      {/* 가격 + 스파크라인 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--font-mono)" }}>
            {fmtPrice(stock.price)}
            <span style={{ fontSize: 11, fontWeight: 500, marginLeft: 2 }}>원</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "var(--font-mono)", color: changeColor }}>
            {isUp ? "▲" : "▼"} {Math.abs(stock.changePct).toFixed(1)}%
            <span style={{ color: "var(--color-text-muted)", fontWeight: 500, marginLeft: 6 }}>
              3개월 {stock.momentum3m >= 0 ? "+" : ""}
              {stock.momentum3m.toFixed(1)}%
            </span>
          </div>
        </div>

        <AreaChart
          width={110}
          height={40}
          data={chartData}
          margin={{ top: 2, right: 0, bottom: 2, left: 0 }}
        >
          <defs>
            <linearGradient id={`spark-${stock.ticker}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={trendColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={trendColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={trendColor}
            strokeWidth={1.5}
            fill={`url(#spark-${stock.ticker})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </div>

      {/* 추천 근거 */}
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 5 }}>
        {stock.reasons.map((reason) => (
          <div key={reason} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
            <span style={{ color: "var(--color-primary)", fontSize: 11, lineHeight: "17px" }}>●</span>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.45 }}>
              {reason}
            </span>
          </div>
        ))}
      </div>

      {/* 하단: 위험도 + 펼치기 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: risk.color }}>
          <risk.Icon size={13} />
          {risk.label}
        </span>
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} style={{ color: "var(--color-text-muted)", display: "flex" }}>
          <ChevronDown size={16} />
        </motion.span>
      </div>

      {/* 상세 지표 */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid var(--color-glass-border)",
              }}
            >
              {metrics.map((m) => (
                <div
                  key={m.label}
                  style={{
                    background: "var(--color-bg-elevated)",
                    borderRadius: 10,
                    padding: "8px 10px",
                  }}
                >
                  <div style={{ fontSize: 10, color: "var(--color-text-muted)", marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono)" }}>{m.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

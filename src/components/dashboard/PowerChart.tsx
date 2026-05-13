"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { PowerRecord } from "@/types/database.types";

interface PowerChartProps {
  record: PowerRecord | null;
}

const HOURS = Array.from({ length: 24 }, (_, i) => `${i}시`);

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-glass-border)",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
      }}
    >
      <p style={{ color: "var(--color-text-secondary)", marginBottom: 6 }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <span style={{ color: "var(--color-text-secondary)" }}>{p.name}:</span>
          <span style={{ color: p.color, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
            {p.value.toFixed(1)} kWh
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PowerChart({ record }: PowerChartProps) {
  const now = new Date().getHours();

  const data = HOURS.map((hour, i) => ({
    hour,
    실적: record?.actual_kwh?.[i] ?? 0,
    예측: record?.predicted_kwh?.[i] ?? 0,
  }));

  if (!record) {
    return (
      <div
        style={{
          height: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-muted)",
          fontSize: 14,
        }}
      >
        오늘 발전 데이터가 없습니다
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="hour"
          tick={{ fill: "var(--color-text-muted)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={3}
        />
        <YAxis
          tick={{ fill: "var(--color-text-muted)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          unit=" kWh"
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          x={`${now}시`}
          stroke="rgba(255,255,255,0.2)"
          strokeDasharray="4 4"
          label={{ value: "현재", fill: "var(--color-text-muted)", fontSize: 10, position: "top" }}
        />
        <Area
          type="monotone"
          dataKey="실적"
          stroke="#0A84FF"
          strokeWidth={2}
          fill="url(#actualGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#0A84FF", stroke: "var(--color-bg-base)", strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="예측"
          stroke="#FF9F0A"
          strokeWidth={2}
          strokeDasharray="5 3"
          dot={false}
          activeDot={{ r: 4, fill: "#FF9F0A", stroke: "var(--color-bg-base)", strokeWidth: 2 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

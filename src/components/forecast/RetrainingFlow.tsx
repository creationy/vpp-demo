"use client";

import { motion } from "framer-motion";
import type { RetrainingHistory } from "@/types/database.types";
import {
  CheckCircle2,
  Loader2,
  XCircle,
  Bell,
  ArrowRight,
  TrendingDown,
  Inbox,
} from "lucide-react";

interface RetrainingFlowProps {
  history: RetrainingHistory[];
}

const STATUS_CONFIG = {
  completed: { color: "var(--color-primary)", label: "완료", Icon: CheckCircle2 },
  running: { color: "var(--color-accent)", label: "학습 중", Icon: Loader2 },
  failed: { color: "var(--color-danger)", label: "실패", Icon: XCircle },
};

const MODEL_LABEL: Record<string, string> = {
  lightgbm: "LightGBM",
  lstm: "LSTM",
  xgboost: "XGBoost",
};

export default function RetrainingFlow({ history }: RetrainingFlowProps) {
  if (!history.length) {
    return (
      <div style={{
        color: "var(--color-text-muted)",
        fontSize: 14,
        padding: "40px 0",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}>
        <Inbox size={32} color="var(--color-text-muted)" strokeWidth={1.2} style={{ opacity: 0.5 }} />
        재학습 이력이 없습니다.
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {/* 타임라인 라인 */}
      <div style={{
        position: "absolute",
        left: 19,
        top: 20,
        bottom: 20,
        width: 2,
        background: "linear-gradient(180deg, var(--color-primary) 0%, transparent 100%)",
        opacity: 0.3,
      }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {history.map((item, idx) => {
          const statusConf = STATUS_CONFIG[item.status];
          const StatusIcon = statusConf.Icon;
          const mapeImprove =
            item.before_mape && item.after_mape
              ? (item.before_mape - item.after_mape).toFixed(1)
              : null;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              style={{ display: "flex", gap: 14 }}
            >
              {/* 타임라인 점 */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: `${statusConf.color}15`,
                border: `2px solid ${statusConf.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                zIndex: 1,
              }}>
                <StatusIcon size={16} color={statusConf.color} strokeWidth={2} />
              </div>

              {/* 카드 */}
              <div
                className="glass-card"
                style={{ flex: 1, padding: "12px 14px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <span style={{
                      fontSize: 13, fontWeight: 700,
                      color: statusConf.color,
                    }}>
                      {MODEL_LABEL[item.model_type] ?? item.model_type}
                    </span>
                    <span style={{
                      marginLeft: 8, fontSize: 10, padding: "2px 6px",
                      background: `${statusConf.color}15`, borderRadius: 4,
                      color: statusConf.color,
                    }}>
                      {statusConf.label}
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>
                    {new Date(item.started_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>

                {item.trigger_reason && (
                  <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                    <Bell size={11} color="var(--color-accent)" />
                    {item.trigger_reason}
                  </p>
                )}

                {mapeImprove && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{
                      flex: 1, background: "var(--color-bg-elevated)", borderRadius: 6,
                      padding: "6px 10px", fontSize: 11, textAlign: "center",
                    }}>
                      <div style={{ color: "var(--color-text-muted)", marginBottom: 2 }}>이전 MAPE</div>
                      <div style={{ color: "var(--color-danger)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                        {item.before_mape?.toFixed(1)}%
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", color: "var(--color-text-muted)" }}>
                      <ArrowRight size={14} />
                    </div>
                    <div style={{
                      flex: 1, background: "var(--color-bg-elevated)", borderRadius: 6,
                      padding: "6px 10px", fontSize: 11, textAlign: "center",
                    }}>
                      <div style={{ color: "var(--color-text-muted)", marginBottom: 2 }}>이후 MAPE</div>
                      <div style={{ color: "var(--color-primary)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                        {item.after_mape?.toFixed(1)}%
                      </div>
                    </div>
                    <div style={{
                      flex: 1, background: "rgba(0,208,132,0.1)", borderRadius: 6,
                      padding: "6px 10px", fontSize: 11, textAlign: "center",
                      border: "1px solid rgba(0,208,132,0.2)",
                    }}>
                      <div style={{ color: "var(--color-text-muted)", marginBottom: 2 }}>개선</div>
                      <div style={{ color: "var(--color-primary)", fontFamily: "var(--font-mono)", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                        <TrendingDown size={11} />
                        {mapeImprove}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

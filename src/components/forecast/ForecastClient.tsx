"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import ModelToggle from "@/components/forecast/ModelToggle";
import RetrainingFlow from "@/components/forecast/RetrainingFlow";
import type { ModelType, MaintenanceLog, RetrainingHistory } from "@/types/database.types";
import {
  BrainCircuit,
  Wrench,
  BarChart3,
  Zap,
  CalendarDays,
  FileText,
  Save,
  CheckCircle2,
  Loader2,
  Layers,
} from "lucide-react";

const MAINTENANCE_TYPES = ["세척", "점검", "수리", "교체", "기타"] as const;

interface ForecastClientProps {
  facilityId: string;
  currentModel: ModelType | ModelType[];
  retrainingHistory: RetrainingHistory[];
  maintenanceLogs: (MaintenanceLog & { panel_count?: number })[];
}

export default function ForecastClient({
  facilityId,
  currentModel,
  retrainingHistory,
  maintenanceLogs,
}: ForecastClientProps) {
  const [activeTab, setActiveTab] = useState<"maintenance" | "model" | "history">("model");
  const [mForm, setMForm] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "점검",
    notes: "",
    panelCount: 100,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleMaintenanceSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const supabase = createClient();
    
    // 실제 DB에는 panel_count 컬럼이 없을 수 있으므로 notes에 병합하거나 
    // 데모용으로만 처리 (현재는 notes 앞에 추가)
    const notesWithPanels = `[패널: ${mForm.panelCount}매] ${mForm.notes}`;
    
    await supabase.from("maintenance_logs").insert({
      facility_id: facilityId,
      maintenance_date: mForm.date,
      maintenance_type: mForm.type,
      notes: notesWithPanels || null,
    });
    
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const TABS = [
    { id: "model" as const, label: "모델 조합", Icon: BrainCircuit },
    { id: "maintenance" as const, label: "유지보수", Icon: Wrench },
    { id: "history" as const, label: "실적 이력", Icon: BarChart3 },
  ];

  return (
    <div className="section-pad" style={{ paddingTop: 16, paddingBottom: 24 }}>
      <div className="page-header" style={{ padding: "16px 0 12px", position: "static" }}>
        <div>
          <div className="badge badge-accent" style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <BrainCircuit size={11} />
            MLOps & 예측 관리
          </div>
          <h1 className="page-title"><span className="gradient-text">예측 제어</span></h1>
        </div>
      </div>

      {/* 탭 전환 */}
      <div style={{
        display: "flex",
        background: "var(--color-bg-card)",
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
        gap: 2,
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "9px 4px",
              border: "none",
              borderRadius: 9,
              background: activeTab === tab.id ? "var(--color-bg-elevated)" : "transparent",
              color: activeTab === tab.id ? "var(--color-text-primary)" : "var(--color-text-muted)",
              fontSize: 12,
              fontFamily: "inherit",
              fontWeight: activeTab === tab.id ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <tab.Icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* 모델 조합 */}
        {activeTab === "model" && (
          <motion.div key="model" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="glass-card" style={{ padding: 16, marginBottom: 16 }}>
              <ModelToggle 
                currentModel={currentModel} 
                onSelectionChange={(next) => {
                  console.log("Selected models:", next);
                  // 데모를 위해 로컬 상태는 별도로 관리하지 않고 로그만 출력
                }} 
              />
            </div>

            <div
              className="glass-card"
              style={{ padding: 16, background: "var(--color-bg-elevated)", border: "1px solid var(--color-glass-border)" }}
            >
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--color-accent)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <Zap size={14} color="var(--color-accent)" />
                AI 모델 고도화 가이드
              </h3>
              {[
                { name: "초고속 분석", desc: "LightGBM 기반 실시간 대용량 데이터 처리" },
                { name: "앙상블 조합", desc: "LSTM + LightGBM (장기 패턴 + 고속 보정)" },
                { name: "오차 최소화", desc: "XGBoost + LightGBM (최신 부스팅 듀얼 결합)" },
              ].map((m) => (
                <div key={m.name} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--color-text-primary)", fontSize: 11, minWidth: 80, fontWeight: 700 }}>{m.name}</span>
                  <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{m.desc}</span>
                </div>
              ))}

            </div>
          </motion.div>
        )}

        {/* 유지보수 */}
        {activeTab === "maintenance" && (
          <motion.div key="maint" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="glass-card" style={{ padding: 16, marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <Wrench size={16} color="var(--color-secondary)" />
                유지보수 등록
              </h2>
              <form onSubmit={handleMaintenanceSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                      <CalendarDays size={12} />
                      점검 날짜
                    </label>
                    <input type="date" value={mForm.date}
                      onChange={(e) => setMForm((f) => ({ ...f, date: e.target.value }))}
                      style={{ width: "100%", padding: "10px 12px", background: "var(--color-bg-card)", border: "1px solid var(--color-glass-border)", borderRadius: 8, color: "var(--color-text-primary)", fontSize: 13, fontFamily: "inherit", colorScheme: "dark" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                      <Layers size={12} />
                      패널 수량 (매)
                    </label>
                    <input type="number" value={mForm.panelCount}
                      onChange={(e) => setMForm((f) => ({ ...f, panelCount: Number(e.target.value) }))}
                      style={{ width: "100%", padding: "10px 12px", background: "var(--color-bg-card)", border: "1px solid var(--color-glass-border)", borderRadius: 8, color: "var(--color-text-primary)", fontSize: 13, fontFamily: "inherit" }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "var(--color-text-muted)", display: "block", marginBottom: 8 }}>작업 유형</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {MAINTENANCE_TYPES.map((t) => (
                      <button key={t} type="button" onClick={() => setMForm((f) => ({ ...f, type: t }))}
                        style={{ padding: "7px 12px", borderRadius: 10, border: `1.5px solid ${mForm.type === t ? "var(--color-secondary)" : "var(--color-glass-border)"}`, background: mForm.type === t ? "var(--color-secondary-glow)" : "transparent", color: mForm.type === t ? "var(--color-secondary)" : "var(--color-text-secondary)", fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                    <FileText size={12} />
                    상세 메모
                  </label>
                  <textarea value={mForm.notes} onChange={(e) => setMForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="작업 내용을 간단히 기록하세요"
                    rows={2}
                    style={{ width: "100%", padding: "10px 12px", background: "var(--color-bg-card)", border: "1px solid var(--color-glass-border)", borderRadius: 8, color: "var(--color-text-primary)", fontSize: 13, fontFamily: "inherit", resize: "none" }} />
                </div>
                <button type="submit" className="btn-primary" disabled={isSaving} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {saved ? (
                    <><CheckCircle2 size={16} /> 등록 완료</>
                  ) : isSaving ? (
                    <><Loader2 size={16} className="animate-spin" /> 저장 중...</>
                  ) : (
                    <><Save size={16} /> 유지보수 기록 저장</>
                  )}
                </button>
              </form>
            </div>

            {/* 최근 이력 */}
            {maintenanceLogs.length > 0 && (
              <div>
                <h3 style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 10 }}>최근 유지보수 이력</h3>
                {maintenanceLogs.map((log, i) => (
                  <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="glass-card" style={{ padding: "12px 14px", marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                        <Wrench size={13} color="var(--color-secondary)" />
                        {log.maintenance_type}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                        {log.maintenance_date}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                      <span style={{ fontSize: 10, padding: "2px 6px", background: "var(--color-bg-elevated)", borderRadius: 4, color: "var(--color-text-secondary)" }}>
                        패널 {log.panel_count || 100}매
                      </span>
                      {log.notes && <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>{log.notes.replace(/\[패널: .*?매\] /, "")}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* 실적 이력 */}
        {activeTab === "history" && (
          <motion.div key="hist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <BarChart3 size={16} color="var(--color-secondary)" />
              모델 조합별 실적 (MAPE)
            </h2>
            <RetrainingFlow history={retrainingHistory} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

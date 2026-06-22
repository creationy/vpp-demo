"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  MapPin,
  Zap,
  Sun,
  Moon,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FacilityFormProps {
  latitude: number;
  longitude: number;
  address: string;
  onSubmit: (data: FacilityFormData) => Promise<void>;
  onCancel: () => void;
}

export interface FacilityFormData {
  owner_name: string;
  capacity_kw: number;
  panel_type: "monocrystalline" | "polycrystalline" | "thin-film";
  installed_at: string;
}

const PANEL_OPTIONS: { value: FacilityFormData["panel_type"]; label: string; Icon: LucideIcon; color: string }[] = [
  { value: "monocrystalline", label: "단결정", Icon: Zap, color: "#FF9F0A" },
  { value: "polycrystalline", label: "다결정", Icon: Sun, color: "#0A84FF" },
  { value: "thin-film", label: "박막형", Icon: Moon, color: "#BF5AF2" },
];

export default function FacilityForm({
  latitude,
  longitude,
  address,
  onSubmit,
  onCancel,
}: FacilityFormProps) {
  const [form, setForm] = useState<FacilityFormData>({
    owner_name: "",
    capacity_kw: 100,
    panel_type: "monocrystalline",
    installed_at: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.owner_name.trim()) {
      setError("사업자명을 입력해주세요.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch {
      setError("등록 중 오류가 발생했습니다.");
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--color-bg-surface)",
        borderRadius: "24px 24px 0 0",
        border: "1px solid var(--color-glass-border)",
        borderBottom: "none",
        padding: "0 0 env(safe-area-inset-bottom, 20px)",
        maxHeight: "90vh",
        overflowY: "auto",
        zIndex: 1001,
        boxShadow: "0 -10px 40px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0" }}>
        <div style={{ width: 32, height: 4, borderRadius: 2, background: "var(--color-text-muted)", opacity: 0.3 }} />
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <header style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <Settings size={18} color="var(--color-secondary)" />
            VPP 발전소 등록
          </h2>
          <div style={{
            padding: "10px 12px",
            background: "var(--color-bg-elevated)",
            borderRadius: 12,
            fontSize: 12,
            color: "var(--color-text-secondary)",
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
          }}>
            <MapPin size={14} style={{ marginTop: 2, color: "var(--color-primary)" }} />
            <div>
              <div style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{address}</div>
              <div style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 2 }}>
                위도: {latitude.toFixed(5)} / 경도: {longitude.toFixed(5)}
              </div>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 6, display: "block" }}>
              사업자명 <span style={{ color: "var(--color-danger)" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="사업장 또는 사업자 성함"
              value={form.owner_name}
              onChange={(e) => setForm((f) => ({ ...f, owner_name: e.target.value }))}
              style={{
                width: "100%", padding: "14px", background: "var(--color-bg-card)",
                border: "1px solid var(--color-glass-border)", borderRadius: 12,
                color: "var(--color-text-primary)", fontSize: 15, fontFamily: "inherit", outline: "none",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 6, display: "block" }}>
                설비 용량 (kW)
              </label>
              <input
                type="number"
                value={form.capacity_kw}
                onChange={(e) => setForm((f) => ({ ...f, capacity_kw: Number(e.target.value) }))}
                style={{
                  width: "100%", padding: "14px", background: "var(--color-bg-card)",
                  border: "1px solid var(--color-glass-border)", borderRadius: 12,
                  color: "var(--color-text-primary)", fontSize: 15, fontFamily: "var(--font-mono)", outline: "none",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 6, display: "block" }}>
                설치일
              </label>
              <input
                type="date"
                value={form.installed_at}
                onChange={(e) => setForm((f) => ({ ...f, installed_at: e.target.value }))}
                style={{
                  width: "100%", padding: "14px", background: "var(--color-bg-card)",
                  border: "1px solid var(--color-glass-border)", borderRadius: 12,
                  color: "var(--color-text-primary)", fontSize: 13, fontFamily: "inherit", outline: "none",
                  colorScheme: "dark"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 8, display: "block" }}>
              패널 모델
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {PANEL_OPTIONS.map((opt) => {
                const isActive = form.panel_type === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, panel_type: opt.value }))}
                    style={{
                      flex: 1, padding: "10px 4px", background: isActive ? `${opt.color}15` : "var(--color-bg-card)",
                      border: `1.5px solid ${isActive ? opt.color : "var(--color-glass-border)"}`,
                      borderRadius: 12, cursor: "pointer", color: isActive ? opt.color : "var(--color-text-secondary)",
                      fontSize: 11, fontWeight: isActive ? 700 : 500, transition: "all 0.2s",
                    }}
                  >
                    <div style={{
                      width: 24, height: 24, margin: "0 auto 4px", borderRadius: "50%",
                      background: `${opt.color}10`, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <opt.Icon size={12} color={isActive ? opt.color : "var(--color-text-muted)"} />
                    </div>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ color: "var(--color-danger)", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                <AlertTriangle size={14} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onCancel} className="btn-secondary" style={{ flex: 1, padding: "14px" }}>
              취소
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 2, padding: "14px" }} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "등록 완료"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

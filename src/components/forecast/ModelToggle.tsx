"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ModelType } from "@/types/database.types";
import {
  Brain,
  TreePine,
  Zap,
  BrainCircuit,
  CheckCircle2,
  Info,
} from "lucide-react";

const MODELS = [
  {
    id: "lstm" as ModelType,
    name: "LSTM",
    desc: "시계열 딥러닝",
    Icon: Brain,
    color: "#0A84FF",
    feature: "기상 패턴 및 과거 발전 데이터의 계절성을 정밀하게 학습하는 순환 신경망 모델입니다.",
  },
  {
    id: "xgboost" as ModelType,
    name: "XGBoost",
    desc: "정밀 부스팅",
    Icon: TreePine,
    color: "#30D158",
    feature: "수치 데이터 기반으로 발전 오차를 계단식으로 보정하는 강력한 의사결정 트리 모델입니다.",
  },
  {
    id: "lightgbm" as ModelType,
    name: "LightGBM",
    desc: "고속 분석 AI",
    Icon: Zap,
    color: "#FFD60A",
    feature: "메모리 사용량을 최소화하면서 대규모 데이터를 초고속으로 처리하는 최신 부스팅 알고리즘입니다.",
  },
] as const;

interface ModelToggleProps {
  currentModel: ModelType | ModelType[];
  onSelectionChange?: (selected: ModelType[]) => void;
}

export default function ModelToggle({ currentModel, onSelectionChange }: ModelToggleProps) {
  const initialSelected = Array.isArray(currentModel) ? currentModel : [currentModel];
  const [selected, setSelected] = useState<ModelType[]>(initialSelected);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelect = (modelId: ModelType) => {
    let next: ModelType[];
    
    if (selected.includes(modelId)) {
      if (selected.length === 1) return;
      next = selected.filter(id => id !== modelId);
    } else {
      if (selected.length >= 2) {
        next = [selected[1], modelId];
      } else {
        next = [...selected, modelId];
      }
    }

    setSelected(next);
    onSelectionChange?.(next);
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const getCombinationText = () => {
    if (selected.length === 1) {
      return MODELS.find(m => m.id === selected[0])?.feature;
    }
    const hasLstm = selected.includes("lstm");
    const hasXgb = selected.includes("xgboost");
    const hasLgbm = selected.includes("lightgbm");

    if (hasLstm && hasLgbm) {
      return "LSTM의 장기 시퀀스 분석과 LightGBM의 고속 연산 능력이 결합되어, 대규모 발전소군을 실시간으로 제어하는 데 최적입니다.";
    }
    if (hasXgb && hasLgbm) {
      return "XGBoost와 LightGBM의 듀얼 부스팅 앙상블로, 수치적 정밀도를 극대화하여 예측 오차를 극한으로 낮춥니다.";
    }
    if (hasLstm && hasXgb) {
      return "시계열 패턴과 특징 기반 오차 보정의 균형 잡힌 결합으로, 모든 기상 조건에서 안정적인 성능을 보장합니다.";
    }
    return "선택된 모델들의 예측값을 가중 결합하여 단일 모델 대비 향상된 신뢰성을 제공합니다.";
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <BrainCircuit size={15} color="var(--color-secondary)" />
          예측 모델 조합
        </h2>
        <AnimatePresence>
          {isSaving && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: 11, color: "var(--color-primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}
            >
              <CheckCircle2 size={12} />
              조합 적용
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {MODELS.map((model) => {
          const isActive = selected.includes(model.id);
          const ModelIcon = model.Icon;
          return (
            <motion.button
              key={model.id}
              onClick={() => handleSelect(model.id)}
              whileTap={{ scale: 0.96 }}
              style={{
                flex: 1,
                padding: "12px 6px",
                background: isActive ? `${model.color}15` : "var(--color-bg-card)",
                border: `1.5px solid ${isActive ? model.color : "var(--color-glass-border)"}`,
                borderRadius: 12,
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              <div style={{
                width: 28, height: 28, margin: "0 auto 6px",
                borderRadius: "50%", background: `${model.color}10`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ModelIcon
                  size={14}
                  color={isActive ? model.color : "var(--color-text-muted)"}
                  strokeWidth={2.5}
                />
              </div>
              <div style={{
                fontSize: 11, fontWeight: 800,
                color: isActive ? model.color : "var(--color-text-primary)",
                marginBottom: 2,
              }}>
                {model.name}
              </div>
              <div style={{ fontSize: 9, color: "var(--color-text-muted)" }}>{model.desc}</div>
            </motion.button>
          );
        })}
      </div>

      {/* 조합 설명창 */}
      <motion.div
        key={selected.join("-")}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "var(--color-bg-elevated)",
          borderRadius: 12,
          padding: "12px",
          border: "1px solid var(--color-glass-border)",
          display: "flex",
          gap: 10,
        }}
      >
        <Info size={14} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5, margin: 0 }}>
          {getCombinationText()}
        </p>
      </motion.div>
    </div>
  );
}

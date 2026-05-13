"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  Radio,
  Settings,
  Brain,
  TreePine,
  Sparkles,
  RefreshCw,
  Coins,
  Target,
  Leaf,
  Sun,
  Monitor,
  Factory,
  BadgeDollarSign,
  ArrowRight,
  AlertTriangle,
  Calendar,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

interface SectionProps {
  children: React.ReactNode;
  delay?: number;
}

function AnimatedSection({ children, delay = 0 }: SectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const PIPELINE_STEPS = [
  {
    Icon: Radio,
    title: "데이터 수집",
    desc: "기상청 API · 에너지기술연구원 API · 전력거래소 API 실시간 연동",
    color: "#0A84FF",
  },
  {
    Icon: Settings,
    title: "전처리",
    desc: "이상치 제거 · 결측치 보간 · 피처 엔지니어링 (24h 슬라이딩 윈도우)",
    color: "#30D158",
  },
  {
    Icon: Brain,
    title: "LSTM 학습",
    desc: "시계열 딥러닝 — 계절성·추세 패턴 학습 (GPU A100 클러스터)",
    color: "#BF5AF2",
  },
  {
    Icon: TreePine,
    title: "XGBoost 보정",
    desc: "구조적 특징 기반 앙상블 부스팅 — 단기 오차 보정",
    color: "#FF9F0A",
  },
  {
    Icon: Sparkles,
    title: "LightGBM 앙상블",
    desc: "LSTM 50% + XGBoost 25% + LightGBM 25% 가중 결합 → MAPE < 5%",
    color: "#00D084",
  },
  {
    Icon: RefreshCw,
    title: "자동 재학습",
    desc: "MAPE > 10% 또는 유지보수 이벤트 감지 시 MLflow로 자동 파이프라인 트리거",
    color: "#FF453A",
  },
];

const VPP_BENEFITS = [
  {
    Icon: Coins,
    title: "인센티브 수익",
    value: "월 평균 18만원",
    desc: "100kW 기준 VPP 참여 시 추가 수익",
    gradient: "linear-gradient(135deg, #00D084 0%, #0A84FF 100%)",
  },
  {
    Icon: Target,
    title: "예측 정확도",
    value: "MAPE 4.7%",
    desc: "LightGBM 앙상블 모델 기준 평균 오차율",
    gradient: "linear-gradient(135deg, #BF5AF2 0%, #0A84FF 100%)",
  },
  {
    Icon: Leaf,
    title: "탄소 절감",
    value: "연 42톤 CO₂",
    desc: "전력망 최적화를 통한 탄소 감축 효과",
    gradient: "linear-gradient(135deg, #30D158 0%, #00D084 100%)",
  },
];

const VPP_FLOW = [
  { Icon: Sun, label: "소규모\n태양광" },
  { Icon: Monitor, label: "AI 제어\n플랫폼" },
  { Icon: Factory, label: "전력\n도매시장" },
  { Icon: BadgeDollarSign, label: "인센티브\n정산" },
];

export default function AboutPage() {
  return (
    <div className="section-pad" style={{ paddingTop: 16, paddingBottom: 40 }}>
      {/* 헤더 */}
      <AnimatedSection>
        <div className="page-header" style={{ padding: "16px 0 20px", position: "static" }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: 4 }}>비전 & 기술</div>
            <h1 className="page-title"><span className="gradient-text">About VPP</span></h1>
          </div>
        </div>
      </AnimatedSection>

      {/* Hero 섹션 */}
      <AnimatedSection>
        <div style={{
          background: "linear-gradient(135deg, rgba(0,208,132,0.08) 0%, rgba(10,132,255,0.08) 100%)",
          border: "1px solid rgba(0,208,132,0.15)",
          borderRadius: 20,
          padding: "28px 20px",
          marginBottom: 24,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative glow */}
          <div style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            background: "radial-gradient(circle, rgba(0,208,132,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }} />
          <div style={{
            width: 64,
            height: 64,
            margin: "0 auto 16px",
            background: "linear-gradient(135deg, rgba(0,208,132,0.15) 0%, rgba(10,132,255,0.15) 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(0,208,132,0.2)",
          }}>
            <Zap size={28} color="#00D084" strokeWidth={2} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, letterSpacing: "-0.04em" }}>
            <span className="gradient-text">가상발전소(VPP)</span>란?
          </h2>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
            분산된 소규모 태양광·ESS를 하나의 가상 발전소로 묶어<br />
            전력 수요·공급을 AI로 제어하는 <strong style={{ color: "var(--color-primary)" }}>차세대 에너지 플랫폼</strong>
          </p>
        </div>
      </AnimatedSection>

      {/* VPP 개념 다이어그램 */}
      <AnimatedSection delay={0.1}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={18} color="var(--color-primary)" />
          VPP 작동 원리
        </h2>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          marginBottom: 24,
          overflowX: "auto",
          paddingBottom: 8,
        }}>
          {VPP_FLOW.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  flexShrink: 0,
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-glass-border)",
                  borderRadius: 14,
                  padding: "14px 12px",
                  textAlign: "center",
                  minWidth: 72,
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  margin: "0 auto 6px",
                  background: "rgba(0,208,132,0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <item.Icon size={18} color="var(--color-primary)" strokeWidth={1.8} />
                </div>
                <div style={{
                  fontSize: 10,
                  color: "var(--color-text-muted)",
                  whiteSpace: "pre-line",
                  lineHeight: 1.3,
                }}>
                  {item.label}
                </div>
              </motion.div>
              {i < VPP_FLOW.length - 1 && (
                <ArrowRight
                  size={14}
                  color="var(--color-text-muted)"
                  style={{ flexShrink: 0, margin: "0 4px", opacity: 0.5 }}
                />
              )}
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* 참여 효과 */}
      <AnimatedSection delay={0.15}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <TrendingUp size={18} color="var(--color-secondary)" />
          VPP 참여 효과
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {VPP_BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "var(--color-bg-card)",
                border: "1px solid var(--color-glass-border)",
                borderRadius: 14,
                padding: "14px 16px",
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: b.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                opacity: 0.9,
              }}>
                <b.Icon size={22} color="#fff" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{b.title}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--color-primary)" }}>{b.value}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>{b.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* AI 파이프라인 */}
      <AnimatedSection delay={0.2}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <Brain size={18} color="var(--color-accent)" />
          하이브리드 AI 데이터 파이프라인
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 24, position: "relative" }}>
          <div style={{
            position: "absolute", left: 19, top: 20, bottom: 20, width: 2,
            background: "linear-gradient(180deg, #0A84FF, #30D158, #BF5AF2, #FF9F0A, #00D084, #FF453A)",
            opacity: 0.4,
          }} />
          {PIPELINE_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{ display: "flex", gap: 14, paddingBottom: 16 }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: `${step.color}15`, border: `2px solid ${step.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, zIndex: 1,
              }}>
                <step.Icon size={18} color={step.color} strokeWidth={2} />
              </div>
              <div className="glass-card" style={{ flex: 1, padding: "10px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: step.color, marginBottom: 3 }}>{step.title}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* MLOps 자동화 */}
      <AnimatedSection delay={0.25}>
        <div style={{
          background: "rgba(255,69,58,0.06)",
          border: "1px solid rgba(255,69,58,0.15)",
          borderRadius: 16,
          padding: "18px 16px",
          marginBottom: 24,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-danger)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <RefreshCw size={16} color="var(--color-danger)" />
            MLOps 자동 재학습 트리거 조건
          </h3>
          {[
            { icon: AlertTriangle, condition: "MAPE > 10%", action: "7일 이내 신규 데이터로 즉시 재학습" },
            { icon: Settings, condition: "유지보수 이벤트", action: "패널 세척·수리 후 예측 베이스라인 재설정" },
            { icon: Calendar, condition: "계절 변환점", action: "분기별 계절성 재학습 (봄/여름/가을/겨울)" },
            { icon: TrendingUp, condition: "이상치 급증", action: "연속 3회 예측 이탈 감지 시 긴급 재학습" },
          ].map((item) => (
            <div key={item.condition} style={{
              display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10,
            }}>
              <span style={{
                padding: "3px 10px", background: "rgba(255,69,58,0.12)", borderRadius: 6,
                fontSize: 11, color: "var(--color-danger)", fontFamily: "var(--font-mono)",
                flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", gap: 4,
                fontWeight: 600,
              }}>
                <item.icon size={11} />
                {item.condition}
              </span>
              <span style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                {item.action}
              </span>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection delay={0.3}>
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 16 }}>
            지금 바로 내 태양광 설비를 등록하고<br />
            <strong style={{ color: "var(--color-primary)" }}>VPP 인센티브</strong>를 받아보세요!
          </p>
          <Link
            href="/home"
            className="btn-primary"
            style={{ display: "inline-flex", width: "auto", padding: "16px 40px", gap: 10 }}
          >
            <Zap size={18} />
            지금 참여하기
            <ChevronRight size={16} style={{ marginLeft: -4 }} />
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}

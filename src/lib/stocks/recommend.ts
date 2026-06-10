import type {
  InvestStyle,
  RiskLevel,
  ScoredStock,
  Stock,
  StyleInfo,
} from "@/types/stock.types";
import { STOCK_UNIVERSE } from "@/lib/stocks/data";

/**
 * 종목 추천 엔진 (데모)
 * - 팩터(가치/성장/배당/모멘텀/안정성)를 0~1로 정규화한 뒤
 *   투자 성향별 가중치로 합산해 0~100 점수를 만듭니다.
 * - 서버/클라이언트 어디서든 동일하게 동작하는 순수 함수입니다.
 */

export const INVEST_STYLES: StyleInfo[] = [
  { id: "balanced", label: "균형형", description: "가치·성장·배당을 고르게 반영한 추천" },
  { id: "growth", label: "성장형", description: "이익 성장과 ROE가 높은 종목 위주" },
  { id: "value", label: "가치형", description: "PER·PBR이 낮은 저평가 종목 위주" },
  { id: "dividend", label: "배당형", description: "배당수익률이 높고 변동성이 낮은 종목" },
  { id: "momentum", label: "모멘텀형", description: "최근 주가 흐름이 강한 종목 위주" },
];

interface Factors {
  value: number;
  growth: number;
  dividend: number;
  momentum: number;
  stability: number;
}

const STYLE_WEIGHTS: Record<InvestStyle, Factors> = {
  balanced: { value: 0.25, growth: 0.25, dividend: 0.2, momentum: 0.15, stability: 0.15 },
  growth: { value: 0.05, growth: 0.55, dividend: 0.0, momentum: 0.3, stability: 0.1 },
  value: { value: 0.55, growth: 0.15, dividend: 0.15, momentum: 0.05, stability: 0.1 },
  dividend: { value: 0.15, growth: 0.05, dividend: 0.5, momentum: 0.0, stability: 0.3 },
  momentum: { value: 0.0, growth: 0.2, dividend: 0.0, momentum: 0.65, stability: 0.15 },
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 개별 종목의 팩터 점수 (0~1) */
function computeFactors(s: Stock): Factors {
  // 가치: PER 4→1점, 60→0점 / PBR 0.4→1점, 8→0점 (적자 기업 PER 0은 최저점 처리)
  const perScore = s.per <= 0 ? 0 : clamp01(1 - (s.per - 4) / 56);
  const pbrScore = clamp01(1 - (s.pbr - 0.4) / 7.6);
  const value = perScore * 0.6 + pbrScore * 0.4;

  // 성장: EPS 성장률 -40%→0점, +100%→1점 / ROE -10%→0점, 30%→1점
  const epsScore = clamp01((s.epsGrowth + 40) / 140);
  const roeScore = clamp01((s.roe + 10) / 40);
  const growth = epsScore * 0.55 + roeScore * 0.45;

  // 배당: 0%→0점, 6%→1점
  const dividend = clamp01(s.dividendYield / 6);

  // 모멘텀: 3개월 수익률 -20%→0점, +35%→1점 + 당일 등락 보조 반영
  const momentum = clamp01((s.momentum3m + 20) / 55) * 0.85 + clamp01((s.changePct + 3) / 7) * 0.15;

  // 안정성: 변동성 12%→1점, 75%→0점
  const stability = clamp01(1 - (s.volatility - 12) / 63);

  return { value, growth, dividend, momentum, stability };
}

function riskLevelOf(s: Stock): RiskLevel {
  if (s.volatility < 24) return "low";
  if (s.volatility < 42) return "medium";
  return "high";
}

/** 팩터 기여도 기반으로 한국어 추천 근거 생성 */
function buildReasons(s: Stock, f: Factors, style: InvestStyle): string[] {
  const candidates: { score: number; text: string }[] = [];

  if (f.value > 0.55 && s.per > 0)
    candidates.push({ score: f.value, text: `PER ${s.per.toFixed(1)}배·PBR ${s.pbr.toFixed(1)}배로 저평가 매력` });
  if (s.epsGrowth >= 15)
    candidates.push({ score: f.growth, text: `EPS 성장률 +${s.epsGrowth.toFixed(0)}%로 이익 개선 뚜렷` });
  if (s.roe >= 15)
    candidates.push({ score: f.growth, text: `ROE ${s.roe.toFixed(1)}%의 높은 자본 효율` });
  if (s.dividendYield >= 3)
    candidates.push({ score: f.dividend, text: `배당수익률 ${s.dividendYield.toFixed(1)}%의 안정적 현금흐름` });
  if (s.momentum3m >= 10)
    candidates.push({ score: f.momentum, text: `최근 3개월 +${s.momentum3m.toFixed(1)}% 상승 추세 지속` });
  if (f.stability > 0.7)
    candidates.push({ score: f.stability, text: `변동성 ${s.volatility}%로 방어적 성격 우수` });
  if (s.marketCap >= 50)
    candidates.push({ score: 0.4, text: `시가총액 ${s.marketCap.toFixed(0)}조원의 대형 우량주` });

  // 성향과 직접 관련된 근거를 우선 배치
  const styleBoost: Record<InvestStyle, (t: string) => boolean> = {
    balanced: () => false,
    growth: (t) => t.includes("EPS") || t.includes("ROE"),
    value: (t) => t.includes("저평가"),
    dividend: (t) => t.includes("배당"),
    momentum: (t) => t.includes("상승 추세"),
  };

  return candidates
    .sort((a, b) => (Number(styleBoost[style](b.text)) - Number(styleBoost[style](a.text))) || b.score - a.score)
    .slice(0, 3)
    .map((c) => c.text);
}

/** 투자 성향별 추천 종목 산출 (점수 내림차순 상위 count개) */
export function recommendStocks(
  style: InvestStyle,
  count = 5,
  universe: Stock[] = STOCK_UNIVERSE,
): ScoredStock[] {
  const weights = STYLE_WEIGHTS[style];

  return universe
    .map((s) => {
      const f = computeFactors(s);
      const raw =
        f.value * weights.value +
        f.growth * weights.growth +
        f.dividend * weights.dividend +
        f.momentum * weights.momentum +
        f.stability * weights.stability;
      return {
        ...s,
        score: Math.round(raw * 100),
        riskLevel: riskLevelOf(s),
        reasons: buildReasons(s, f, style),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

export function isInvestStyle(v: string): v is InvestStyle {
  return INVEST_STYLES.some((s) => s.id === v);
}

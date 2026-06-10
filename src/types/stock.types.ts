/** 주식 종목 추천 서비스 타입 정의 */

export type Market = "KOSPI" | "KOSDAQ";

/** 투자 성향 */
export type InvestStyle = "balanced" | "growth" | "value" | "dividend" | "momentum";

export type RiskLevel = "low" | "medium" | "high";

export interface Stock {
  ticker: string;
  name: string;
  market: Market;
  sector: string;
  /** 현재가 (원) */
  price: number;
  /** 전일 대비 등락률 (%) */
  changePct: number;
  /** 주가수익비율 */
  per: number;
  /** 주가순자산비율 */
  pbr: number;
  /** 자기자본이익률 (%) */
  roe: number;
  /** 배당수익률 (%) */
  dividendYield: number;
  /** EPS 성장률 (%, 전년 대비) */
  epsGrowth: number;
  /** 최근 3개월 수익률 (%) */
  momentum3m: number;
  /** 연환산 변동성 (%) */
  volatility: number;
  /** 시가총액 (조원) */
  marketCap: number;
  /** 최근 30거래일 종가 */
  priceHistory: number[];
}

/** 추천 점수가 부여된 종목 */
export interface ScoredStock extends Stock {
  /** 추천 점수 (0~100) */
  score: number;
  riskLevel: RiskLevel;
  /** 추천 근거 (한국어 문장) */
  reasons: string[];
}

export interface StyleInfo {
  id: InvestStyle;
  label: string;
  description: string;
}

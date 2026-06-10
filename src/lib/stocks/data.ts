import type { Stock } from "@/types/stock.types";

/**
 * 데모용 국내 주식 유니버스
 * - 실제 시세가 아닌 시연용 가상 데이터입니다.
 * - priceHistory는 티커 기반 시드로 결정적으로 생성해 서버/클라이언트 렌더가 일치합니다.
 */

/** mulberry32 — 시드 기반 의사난수 생성기 */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromTicker(ticker: string): number {
  let h = 2166136261;
  for (let i = 0; i < ticker.length; i++) {
    h ^= ticker.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 현재가/모멘텀/변동성에 맞춰 최근 30거래일 종가를 역산 생성 */
function generateHistory(
  ticker: string,
  price: number,
  momentum3m: number,
  volatility: number,
): number[] {
  const rand = mulberry32(seedFromTicker(ticker));
  const days = 30;
  // 30일 동안 3개월 모멘텀의 약 1/3 만큼 추세가 반영됐다고 가정
  const dailyDrift = (momentum3m / 3 / 100) / days;
  const dailyVol = volatility / 100 / Math.sqrt(252);

  // 현재가에서 거꾸로 생성한 뒤 뒤집어 마지막 값이 현재가가 되도록 함
  const reversed: number[] = [price];
  let p = price;
  for (let i = 1; i < days; i++) {
    const shock = (rand() * 2 - 1) * dailyVol;
    p = p / (1 + dailyDrift + shock);
    reversed.push(p);
  }
  return reversed.reverse().map((v) => Math.round(v));
}

type StockSeed = Omit<Stock, "priceHistory">;

const SEEDS: StockSeed[] = [
  { ticker: "005930", name: "삼성전자", market: "KOSPI", sector: "반도체", price: 86400, changePct: 1.2, per: 13.8, pbr: 1.4, roe: 11.2, dividendYield: 2.1, epsGrowth: 38.5, momentum3m: 14.2, volatility: 26, marketCap: 515.8 },
  { ticker: "000660", name: "SK하이닉스", market: "KOSPI", sector: "반도체", price: 248500, changePct: 2.8, per: 9.4, pbr: 2.1, roe: 24.6, dividendYield: 0.6, epsGrowth: 92.3, momentum3m: 28.4, volatility: 38, marketCap: 180.9 },
  { ticker: "373220", name: "LG에너지솔루션", market: "KOSPI", sector: "2차전지", price: 412000, changePct: -1.4, per: 48.2, pbr: 3.6, roe: 7.8, dividendYield: 0.0, epsGrowth: -12.4, momentum3m: -6.8, volatility: 42, marketCap: 96.4 },
  { ticker: "207940", name: "삼성바이오로직스", market: "KOSPI", sector: "바이오", price: 1042000, changePct: 0.6, per: 62.5, pbr: 7.2, roe: 12.4, dividendYield: 0.0, epsGrowth: 18.7, momentum3m: 9.6, volatility: 28, marketCap: 74.2 },
  { ticker: "005380", name: "현대차", market: "KOSPI", sector: "자동차", price: 264500, changePct: 0.9, per: 5.2, pbr: 0.7, roe: 13.8, dividendYield: 4.6, epsGrowth: 8.2, momentum3m: 11.4, volatility: 24, marketCap: 55.4 },
  { ticker: "000270", name: "기아", market: "KOSPI", sector: "자동차", price: 128400, changePct: 0.4, per: 4.4, pbr: 0.8, roe: 18.2, dividendYield: 4.9, epsGrowth: 6.8, momentum3m: 8.9, volatility: 25, marketCap: 51.2 },
  { ticker: "035420", name: "NAVER", market: "KOSPI", sector: "인터넷", price: 224000, changePct: 1.8, per: 21.4, pbr: 1.3, roe: 6.9, dividendYield: 0.5, epsGrowth: 24.6, momentum3m: 16.8, volatility: 32, marketCap: 36.5 },
  { ticker: "035720", name: "카카오", market: "KOSPI", sector: "인터넷", price: 48150, changePct: -0.8, per: 38.6, pbr: 1.1, roe: 2.8, dividendYield: 0.2, epsGrowth: 42.1, momentum3m: 4.2, volatility: 36, marketCap: 21.4 },
  { ticker: "051910", name: "LG화학", market: "KOSPI", sector: "화학", price: 342500, changePct: -1.1, per: 28.4, pbr: 0.9, roe: 3.4, dividendYield: 1.0, epsGrowth: -8.6, momentum3m: -4.2, volatility: 34, marketCap: 24.2 },
  { ticker: "006400", name: "삼성SDI", market: "KOSPI", sector: "2차전지", price: 318000, changePct: -2.1, per: 22.6, pbr: 1.1, roe: 5.2, dividendYield: 0.3, epsGrowth: -18.4, momentum3m: -11.2, volatility: 40, marketCap: 21.9 },
  { ticker: "105560", name: "KB금융", market: "KOSPI", sector: "금융", price: 98200, changePct: 0.7, per: 6.8, pbr: 0.6, roe: 9.4, dividendYield: 4.2, epsGrowth: 12.4, momentum3m: 13.8, volatility: 20, marketCap: 39.6 },
  { ticker: "055550", name: "신한지주", market: "KOSPI", sector: "금융", price: 62400, changePct: 0.5, per: 6.2, pbr: 0.5, roe: 8.8, dividendYield: 4.0, epsGrowth: 9.6, momentum3m: 10.2, volatility: 19, marketCap: 31.8 },
  { ticker: "086790", name: "하나금융지주", market: "KOSPI", sector: "금융", price: 72800, changePct: 0.3, per: 5.4, pbr: 0.5, roe: 9.1, dividendYield: 4.8, epsGrowth: 7.4, momentum3m: 9.4, volatility: 21, marketCap: 21.0 },
  { ticker: "005490", name: "POSCO홀딩스", market: "KOSPI", sector: "철강", price: 312500, changePct: -0.6, per: 14.2, pbr: 0.5, roe: 3.8, dividendYield: 3.2, epsGrowth: -22.1, momentum3m: -8.4, volatility: 33, marketCap: 25.3 },
  { ticker: "012330", name: "현대모비스", market: "KOSPI", sector: "자동차부품", price: 268000, changePct: 0.2, per: 6.1, pbr: 0.6, roe: 9.8, dividendYield: 2.2, epsGrowth: 14.2, momentum3m: 6.4, volatility: 22, marketCap: 24.8 },
  { ticker: "066570", name: "LG전자", market: "KOSPI", sector: "전자", price: 108600, changePct: 1.1, per: 9.8, pbr: 0.9, roe: 8.4, dividendYield: 1.1, epsGrowth: 16.8, momentum3m: 12.1, volatility: 27, marketCap: 17.8 },
  { ticker: "017670", name: "SK텔레콤", market: "KOSPI", sector: "통신", price: 56800, changePct: 0.1, per: 9.2, pbr: 0.9, roe: 9.6, dividendYield: 6.2, epsGrowth: 4.2, momentum3m: 5.8, volatility: 14, marketCap: 12.4 },
  { ticker: "030200", name: "KT", market: "KOSPI", sector: "통신", price: 48900, changePct: 0.4, per: 8.1, pbr: 0.6, roe: 7.2, dividendYield: 5.1, epsGrowth: 6.1, momentum3m: 7.6, volatility: 15, marketCap: 12.2 },
  { ticker: "033780", name: "KT&G", market: "KOSPI", sector: "필수소비재", price: 118500, changePct: 0.2, per: 11.4, pbr: 1.2, roe: 10.8, dividendYield: 4.4, epsGrowth: 5.4, momentum3m: 4.8, volatility: 13, marketCap: 13.1 },
  { ticker: "068270", name: "셀트리온", market: "KOSPI", sector: "바이오", price: 198400, changePct: 1.6, per: 34.2, pbr: 2.4, roe: 7.4, dividendYield: 0.3, epsGrowth: 28.4, momentum3m: 18.2, volatility: 35, marketCap: 43.1 },
  { ticker: "042700", name: "한미반도체", market: "KOSPI", sector: "반도체장비", price: 142800, changePct: 3.4, per: 28.6, pbr: 8.4, roe: 32.4, dividendYield: 0.4, epsGrowth: 118.2, momentum3m: 34.6, volatility: 52, marketCap: 13.9 },
  { ticker: "247540", name: "에코프로비엠", market: "KOSDAQ", sector: "2차전지소재", price: 168400, changePct: -2.8, per: 84.2, pbr: 6.8, roe: 8.2, dividendYield: 0.0, epsGrowth: -34.2, momentum3m: -14.6, volatility: 58, marketCap: 16.5 },
  { ticker: "086520", name: "에코프로", market: "KOSDAQ", sector: "2차전지소재", price: 92400, changePct: -3.2, per: 92.4, pbr: 5.4, roe: 6.1, dividendYield: 0.0, epsGrowth: -41.8, momentum3m: -18.2, volatility: 62, marketCap: 12.3 },
  { ticker: "028300", name: "HLB", market: "KOSDAQ", sector: "바이오", price: 84200, changePct: 4.2, per: 0, pbr: 9.2, roe: -12.4, dividendYield: 0.0, epsGrowth: 0, momentum3m: 22.4, volatility: 74, marketCap: 11.0 },
  { ticker: "035900", name: "JYP엔터테인먼트", market: "KOSDAQ", sector: "엔터테인먼트", price: 68400, changePct: 1.4, per: 16.8, pbr: 3.2, roe: 21.4, dividendYield: 0.8, epsGrowth: 12.6, momentum3m: 8.4, volatility: 38, marketCap: 2.4 },
  { ticker: "263750", name: "펄어비스", market: "KOSDAQ", sector: "게임", price: 42800, changePct: 2.2, per: 44.6, pbr: 2.1, roe: 4.8, dividendYield: 0.0, epsGrowth: 64.2, momentum3m: 19.8, volatility: 46, marketCap: 2.7 },
];

/** 전체 데모 종목 (가격 이력 포함) */
export const STOCK_UNIVERSE: Stock[] = SEEDS.map((s) => ({
  ...s,
  priceHistory: generateHistory(s.ticker, s.price, s.momentum3m, s.volatility),
}));

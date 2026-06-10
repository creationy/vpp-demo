import StocksClient from "@/components/stocks/StocksClient";
import { STOCK_UNIVERSE } from "@/lib/stocks/data";

export const metadata = {
  title: "AI 종목 추천 — VPP 태양광",
  description: "투자 성향에 맞춘 AI 기반 주식 종목 추천 (데모 데이터, 투자 권유 아님)",
};

export default function StocksPage() {
  return <StocksClient universe={STOCK_UNIVERSE} />;
}

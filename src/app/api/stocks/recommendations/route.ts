import { NextResponse } from "next/server";
import { recommendStocks, isInvestStyle, INVEST_STYLES } from "@/lib/stocks/recommend";

/**
 * 종목 추천 API
 * GET /api/stocks/recommendations?style=growth&count=5
 * - style: balanced | growth | value | dividend | momentum (기본 balanced)
 * - count: 1~10 (기본 5)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const styleParam = searchParams.get("style") ?? "balanced";
  if (!isInvestStyle(styleParam)) {
    return NextResponse.json(
      {
        success: false,
        message: `지원하지 않는 투자 성향입니다: ${styleParam}`,
        supportedStyles: INVEST_STYLES.map((s) => s.id),
      },
      { status: 400 },
    );
  }

  const countParam = Number(searchParams.get("count") ?? 5);
  const count = Number.isFinite(countParam) ? Math.min(10, Math.max(1, Math.floor(countParam))) : 5;

  // 응답 경량화를 위해 가격 이력은 제외
  const recommendations = recommendStocks(styleParam, count).map((s) => {
    const { priceHistory, ...rest } = s;
    void priceHistory;
    return rest;
  });

  return NextResponse.json({
    success: true,
    isDemo: true,
    disclaimer: "데모용 가상 데이터 기반 추천이며 투자 권유가 아닙니다.",
    style: styleParam,
    generatedAt: new Date().toISOString(),
    recommendations,
  });
}

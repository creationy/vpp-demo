import DashboardClient from "@/frontend/components/dashboard/DashboardClient";
import { getDashboardData } from "@/backend/queries/dashboard";

export const metadata = {
  title: "대시보드 — VPP 태양광",
  description: "실시간 발전량 실적과 AI 예측 비교, 누적 인센티브를 확인하세요.",
};

export default async function DashboardPage() {
  const { todayRecord, monthlyIncentive, todayIncentive, mape } =
    await getDashboardData();

  return (
    <DashboardClient
      todayRecord={todayRecord}
      monthlyIncentive={monthlyIncentive}
      todayIncentive={todayIncentive}
      mape={mape}
    />
  );
}

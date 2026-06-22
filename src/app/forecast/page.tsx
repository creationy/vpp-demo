import ForecastClient from "@/frontend/components/forecast/ForecastClient";
import { getForecastData } from "@/backend/queries/forecast";

export const metadata = {
  title: "예측 관리 — VPP 태양광",
  description: "유지보수 정보 입력, AI 예측 모델 선택, MLOps 재학습 이력을 관리하세요.",
};

export default async function ForecastPage() {
  const { facilityId, currentModel, retrainingHistory, maintenanceLogs } =
    await getForecastData();

  return (
    <ForecastClient
      facilityId={facilityId}
      currentModel={currentModel}
      retrainingHistory={retrainingHistory}
      maintenanceLogs={maintenanceLogs}
    />
  );
}

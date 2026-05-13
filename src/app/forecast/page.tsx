import ForecastClient from "@/components/forecast/ForecastClient";
import type { RetrainingHistory, MaintenanceLog, ModelType } from "@/types/database.types";

export const metadata = {
  title: "예측 관리 — VPP 태양광",
  description: "유지보수 정보 입력, AI 예측 모델 선택, MLOps 재학습 이력을 관리하세요.",
};

// 데모용 기본 설비 ID (실제에선 세션/쿼리파라미터에서 획득)
const DEMO_FACILITY_ID = "11111111-1111-1111-1111-111111111111";

// 데모 재학습 이력
const DEMO_RETRAINING: RetrainingHistory[] = [
  {
    id: "r1",
    facility_id: DEMO_FACILITY_ID,
    model_type: "lightgbm",
    trigger_reason: "MAPE 12.3% → 임계값 10% 초과로 자동 트리거",
    status: "completed",
    before_mape: 12.3,
    after_mape: 4.7,
    started_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 2 * 86400000 + 3600000).toISOString(),
  },
  {
    id: "r2",
    facility_id: DEMO_FACILITY_ID,
    model_type: "lstm",
    trigger_reason: "계절 변환점 — 봄→여름 전환 재학습",
    status: "completed",
    before_mape: 8.1,
    after_mape: 5.2,
    started_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 14 * 86400000 + 7200000).toISOString(),
  },
];

const DEMO_MAINTENANCE: MaintenanceLog[] = [
  {
    id: "m1",
    facility_id: DEMO_FACILITY_ID,
    maintenance_date: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
    maintenance_type: "세척",
    notes: "패널 전면 고압 세척 완료",
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

export default async function ForecastPage() {
  let currentModel: ModelType = "lightgbm";
  let retraining: RetrainingHistory[] = DEMO_RETRAINING;
  let maintenance: MaintenanceLog[] = DEMO_MAINTENANCE;

  // Supabase가 설정되어 있으면 실제 데이터 사용
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();

      const [{ data: modelSelection }, { data: dbRetraining }, { data: dbMaintenance }] =
        await Promise.all([
          supabase
            .from("model_selections")
            .select("*")
            .eq("facility_id", DEMO_FACILITY_ID)
            .maybeSingle(),
          supabase
            .from("retraining_history")
            .select("*")
            .eq("facility_id", DEMO_FACILITY_ID)
            .order("started_at", { ascending: false })
            .limit(10),
          supabase
            .from("maintenance_logs")
            .select("*")
            .eq("facility_id", DEMO_FACILITY_ID)
            .order("maintenance_date", { ascending: false })
            .limit(5),
        ]);

      if (modelSelection?.model_type) currentModel = modelSelection.model_type as ModelType;
      if (dbRetraining) retraining = dbRetraining as RetrainingHistory[];
      if (dbMaintenance) maintenance = dbMaintenance as MaintenanceLog[];
    } catch {
      // Supabase 연결 실패 시 더미 데이터 사용
    }
  }

  return (
    <ForecastClient
      facilityId={DEMO_FACILITY_ID}
      currentModel={currentModel}
      retrainingHistory={retraining}
      maintenanceLogs={maintenance}
    />
  );
}

import type { PowerRecord } from "@/database/types";

// 데모 더미 데이터 (Supabase 미설정 시 폴백)
const DEMO_RECORD: PowerRecord = {
  id: "demo-1",
  facility_id: "demo-facility",
  record_date: new Date().toISOString().split("T")[0],
  actual_kwh: [0, 0, 0, 0, 0, 2.1, 8.5, 18.3, 32.1, 45.6, 58.2, 65.4, 68.1, 62.3, 52.8, 38.7, 22.4, 10.2, 3.1, 0, 0, 0, 0, 0],
  predicted_kwh: [0, 0, 0, 0, 0, 2.5, 9.1, 19.8, 34.2, 48.1, 60.5, 67.2, 70.0, 64.1, 54.3, 40.2, 24.1, 11.5, 3.8, 0, 0, 0, 0, 0],
  incentive_krw: 12450,
  created_at: new Date().toISOString(),
};

export interface DashboardData {
  todayRecord: PowerRecord;
  monthlyIncentive: number;
  todayIncentive: number;
  mape: number;
}

/**
 * 대시보드 데이터 조회 (백엔드)
 * - Supabase가 설정되어 있으면 실제 데이터, 아니면 더미 데이터 반환
 */
export async function getDashboardData(): Promise<DashboardData> {
  let todayRecord: PowerRecord = DEMO_RECORD;
  let monthlyIncentive = 45600; // 당월 누적 기본값 (데모)
  let latestMape = 5.2;

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import("@/backend/supabase/server");
      const supabase = await createClient();
      const today = new Date().toISOString().split("T")[0];

      const { data: dbRecord } = await supabase
        .from("power_records")
        .select("*")
        .eq("record_date", today)
        .limit(1)
        .maybeSingle();

      if (dbRecord) todayRecord = dbRecord;

      // 당월 누적 인센티브 조회
      const { data: monthlyRecords } = await supabase
        .from("power_records")
        .select("incentive_krw")
        .gte("record_date", firstDayOfMonth);

      if (monthlyRecords) {
        monthlyIncentive = monthlyRecords.reduce((sum, r) => sum + (r.incentive_krw ?? 0), 0);
      }

      const { data: latestRetraining } = await supabase
        .from("retraining_history")
        .select("after_mape")
        .eq("status", "completed")
        .not("after_mape", "is", null)
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestRetraining?.after_mape) latestMape = latestRetraining.after_mape;
    } catch {
      // Supabase 연결 실패 시 더미 데이터 사용
    }
  }

  return {
    todayRecord,
    monthlyIncentive,
    todayIncentive: todayRecord?.incentive_krw ?? 0,
    mape: latestMape,
  };
}

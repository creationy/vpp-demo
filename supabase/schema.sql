-- =============================================================================
-- VPP Demo — Supabase DB 스키마
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 실행하세요.
-- =============================================================================

-- ── 기존 테이블 초기화 (재실행 시 안전) ──────────────────────────────────────
DROP TABLE IF EXISTS retraining_history CASCADE;
DROP TABLE IF EXISTS model_selections CASCADE;
DROP TABLE IF EXISTS maintenance_logs CASCADE;
DROP TABLE IF EXISTS power_records CASCADE;
DROP TABLE IF EXISTS grid_status CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;

-- ── 1. facilities: 태양광 설비 기본 정보 ─────────────────────────────────────
CREATE TABLE facilities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name    TEXT NOT NULL,
  latitude      FLOAT8 NOT NULL,
  longitude     FLOAT8 NOT NULL,
  address       TEXT,
  capacity_kw   FLOAT8 NOT NULL CHECK (capacity_kw > 0),
  panel_type    TEXT NOT NULL DEFAULT 'monocrystalline'
                  CHECK (panel_type IN ('monocrystalline', 'polycrystalline', 'thin-film')),
  installed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE facilities IS '태양광 발전 설비 기본 정보';
COMMENT ON COLUMN facilities.capacity_kw IS '설비 용량 (kW)';
COMMENT ON COLUMN facilities.panel_type IS '패널 종류: monocrystalline(단결정), polycrystalline(다결정), thin-film(박막)';

-- ── 2. power_records: 시간별 발전 실적 & 예측값 ──────────────────────────────
-- actual_kwh / predicted_kwh 는 0~23시 배열 (24개 원소)
CREATE TABLE power_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id   UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  record_date   DATE NOT NULL,
  actual_kwh    FLOAT8[] NOT NULL DEFAULT '{}',
  predicted_kwh FLOAT8[] NOT NULL DEFAULT '{}',
  incentive_krw FLOAT8 NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (facility_id, record_date)
);

CREATE INDEX idx_power_records_facility_date
  ON power_records (facility_id, record_date DESC);

COMMENT ON TABLE power_records IS '시간별 발전 실적 및 AI 예측값 (24시간 배열)';
COMMENT ON COLUMN power_records.incentive_krw IS '당일 VPP 참여 인센티브 (원)';

-- ── 3. grid_status: 전국 전력망 상태 (Realtime 구독 대상) ────────────────────
CREATE TABLE grid_status (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_error_rate  FLOAT8 NOT NULL CHECK (total_error_rate >= 0),
  fairy_mood        TEXT NOT NULL
                      CHECK (fairy_mood IN ('happy', 'neutral', 'worried', 'critical')),
  active_facilities INT4 NOT NULL DEFAULT 0,
  recorded_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_grid_status_recorded_at
  ON grid_status (recorded_at DESC);

COMMENT ON TABLE grid_status IS '전국 전력망 상태 — Supabase Realtime 구독 대상';
COMMENT ON COLUMN grid_status.total_error_rate IS '전체 예측 오차율 (%)';
COMMENT ON COLUMN grid_status.fairy_mood IS '전력망 요정 감정: happy(<3%), neutral(3-7%), worried(7-12%), critical(>12%)';

-- ── 4. maintenance_logs: 유지보수 이력 ───────────────────────────────────────
CREATE TABLE maintenance_logs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id      UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  maintenance_date DATE NOT NULL,
  maintenance_type TEXT NOT NULL
                     CHECK (maintenance_type IN ('세척', '점검', '수리', '교체', '기타')),
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_maintenance_logs_facility
  ON maintenance_logs (facility_id, maintenance_date DESC);

-- ── 5. model_selections: 예측 모델 선택 상태 ─────────────────────────────────
CREATE TABLE model_selections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  model_type  TEXT NOT NULL
                CHECK (model_type IN ('lstm', 'xgboost', 'hybrid')),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (facility_id)
);

-- ── 6. retraining_history: MLOps 재학습 이력 ─────────────────────────────────
CREATE TABLE retraining_history (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id    UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  model_type     TEXT NOT NULL,
  trigger_reason TEXT,
  before_mape    FLOAT8,
  after_mape     FLOAT8,
  status         TEXT NOT NULL DEFAULT 'completed'
                   CHECK (status IN ('running', 'completed', 'failed')),
  started_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at   TIMESTAMPTZ
);

CREATE INDEX idx_retraining_history_facility
  ON retraining_history (facility_id, started_at DESC);

COMMENT ON TABLE retraining_history IS 'MLOps 자동 재학습 이력';
COMMENT ON COLUMN retraining_history.before_mape IS '재학습 전 MAPE (%)';
COMMENT ON COLUMN retraining_history.after_mape IS '재학습 후 MAPE (%)';

-- ── Realtime 활성화 ───────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE grid_status;
ALTER PUBLICATION supabase_realtime ADD TABLE facilities;

-- ── RLS (Row Level Security) — 데모용: 전체 읽기 허용 ────────────────────────
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE power_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE grid_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE retraining_history ENABLE ROW LEVEL SECURITY;

-- 데모: 익명 사용자도 읽기/쓰기 허용 (실제 서비스에서는 인증 기반으로 변경)
CREATE POLICY "public_read_facilities" ON facilities FOR SELECT USING (true);
CREATE POLICY "public_insert_facilities" ON facilities FOR INSERT WITH CHECK (true);

CREATE POLICY "public_read_power_records" ON power_records FOR SELECT USING (true);
CREATE POLICY "public_read_grid_status" ON grid_status FOR SELECT USING (true);
CREATE POLICY "public_read_maintenance" ON maintenance_logs FOR SELECT USING (true);
CREATE POLICY "public_insert_maintenance" ON maintenance_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_model_selections" ON model_selections FOR SELECT USING (true);
CREATE POLICY "public_update_model_selections" ON model_selections FOR UPDATE USING (true);
CREATE POLICY "public_insert_model_selections" ON model_selections FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_retraining" ON retraining_history FOR SELECT USING (true);

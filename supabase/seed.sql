-- =============================================================================
-- VPP Demo — Seed 데이터 (더미 데이터)
-- schema.sql 실행 후에 실행하세요.
-- =============================================================================

-- ── 1. 전국 더미 설비 데이터 (12개 지역) ─────────────────────────────────────
INSERT INTO facilities (id, owner_name, latitude, longitude, address, capacity_kw, panel_type, installed_at) VALUES
  ('11111111-1111-1111-1111-111111111111', '김태양', 37.5665, 126.9780, '서울특별시 중구 태평로1가', 100.0, 'monocrystalline', '2022-03-15'),
  ('22222222-2222-2222-2222-222222222222', '이발전', 35.1796, 129.0756, '부산광역시 해운대구 우동', 250.0, 'polycrystalline', '2021-07-22'),
  ('33333333-3333-3333-3333-333333333333', '박에너지', 37.4563, 126.7052, '인천광역시 남동구 논현동', 180.0, 'monocrystalline', '2023-01-10'),
  ('44444444-4444-4444-4444-444444444444', '최그린', 35.8714, 128.6014, '대구광역시 달서구 용산동', 320.0, 'thin-film', '2020-11-05'),
  ('55555555-5555-5555-5555-555555555555', '정솔라', 36.3504, 127.3845, '대전광역시 유성구 구성동', 95.0, 'monocrystalline', '2023-06-20'),
  ('66666666-6666-6666-6666-666666666666', '윤파워', 35.5384, 129.3114, '울산광역시 남구 삼산동', 440.0, 'polycrystalline', '2019-09-14'),
  ('77777777-7777-7777-7777-777777777777', '강빛나', 35.1595, 126.8526, '광주광역시 서구 치평동', 160.0, 'monocrystalline', '2022-08-30'),
  ('88888888-8888-8888-8888-888888888888', '임청정', 36.0190, 129.3435, '경상북도 포항시 남구 오천읍', 500.0, 'polycrystalline', '2021-04-18'),
  ('99999999-9999-9999-9999-999999999999', '한재생', 36.7730, 127.4311, '충청북도 청주시 청원구 내수읍', 210.0, 'thin-film', '2022-12-01'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '오자연', 35.1028, 129.0247, '부산광역시 영도구 동삼동', 130.0, 'monocrystalline', '2023-03-25'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '서희망', 37.8813, 127.7300, '강원도 춘천시 서면 덕두원리', 75.0, 'polycrystalline', '2023-09-12'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '노무한', 34.8161, 126.4629, '전라남도 목포시 상동', 380.0, 'monocrystalline', '2020-06-07');

-- ── 2. 오늘 날짜 기준 발전 실적 데이터 (대표 설비 1개) ───────────────────────
INSERT INTO power_records (facility_id, record_date, actual_kwh, predicted_kwh, incentive_krw)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  CURRENT_DATE,
  -- 실제 발전량 (0시~23시, kWh)
  ARRAY[0, 0, 0, 0, 0, 0.5, 2.1, 8.3, 15.7, 22.4, 28.1, 31.6,
        30.9, 28.7, 24.3, 18.6, 11.2, 5.4, 1.8, 0.3, 0, 0, 0, 0],
  -- AI 예측량 (0시~23시, kWh)
  ARRAY[0, 0, 0, 0, 0, 0.4, 2.3, 8.0, 16.1, 23.0, 27.5, 32.0,
        31.5, 27.9, 23.8, 17.9, 11.8, 5.1, 1.5, 0.5, 0, 0, 0, 0],
  125400
);

-- 어제 날짜 데이터 (그래프 트렌드용)
INSERT INTO power_records (facility_id, record_date, actual_kwh, predicted_kwh, incentive_krw)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  CURRENT_DATE - INTERVAL '1 day',
  ARRAY[0, 0, 0, 0, 0, 0.3, 1.8, 7.5, 14.2, 20.1, 25.6, 29.3,
        28.7, 26.4, 21.8, 16.2, 9.8, 4.2, 1.2, 0.1, 0, 0, 0, 0],
  ARRAY[0, 0, 0, 0, 0, 0.4, 2.0, 7.8, 14.9, 21.0, 26.0, 30.0,
        29.5, 27.0, 22.5, 16.8, 10.2, 4.5, 1.4, 0.3, 0, 0, 0, 0],
  98700
);

-- ── 3. 전력망 상태 초기 데이터 ────────────────────────────────────────────────
INSERT INTO grid_status (total_error_rate, fairy_mood, active_facilities)
VALUES (2.3, 'happy', 12);

-- ── 4. 유지보수 이력 더미 데이터 ─────────────────────────────────────────────
INSERT INTO maintenance_logs (facility_id, maintenance_date, maintenance_type, notes)
VALUES
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '30 days', '세척', '패널 먼지 및 이물질 세척 완료. 발전 효율 4.2% 향상 확인'),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '90 days', '점검', '인버터 정기 점검. 이상 없음'),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '180 days', '수리', '접속반 단자 부식으로 교체 작업 실시');

-- ── 5. 예측 모델 선택 상태 ────────────────────────────────────────────────────
INSERT INTO model_selections (facility_id, model_type, is_active)
VALUES ('11111111-1111-1111-1111-111111111111', 'hybrid', true);

-- ── 6. MLOps 재학습 이력 더미 데이터 ─────────────────────────────────────────
INSERT INTO retraining_history (facility_id, model_type, trigger_reason, before_mape, after_mape, status, started_at, completed_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'hybrid',
   'MAPE 임계값 초과 (12.3% > 10%)',
   12.3, 4.7, 'completed',
   now() - INTERVAL '7 days',
   now() - INTERVAL '7 days' + INTERVAL '45 minutes'),
  ('11111111-1111-1111-1111-111111111111', 'lstm',
   '유지보수 이벤트 감지 (패널 세척)',
   8.1, 5.2, 'completed',
   now() - INTERVAL '30 days',
   now() - INTERVAL '30 days' + INTERVAL '38 minutes'),
  ('11111111-1111-1111-1111-111111111111', 'xgboost',
   '계절 변환점 감지 (봄→여름)',
   9.6, 3.9, 'completed',
   now() - INTERVAL '60 days',
   now() - INTERVAL '60 days' + INTERVAL '22 minutes'),
  ('11111111-1111-1111-1111-111111111111', 'hybrid',
   '초기 모델 학습',
   NULL, 6.8, 'completed',
   now() - INTERVAL '180 days',
   now() - INTERVAL '180 days' + INTERVAL '1 hour 12 minutes');

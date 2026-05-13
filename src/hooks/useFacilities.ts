"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Facility } from "@/types/database.types";

// 데모용 전국 설비 데이터 (주요 거점)
const DEMO_FACILITIES: Facility[] = [
  { id: "d1", owner_name: "서울 반포 태양광", latitude: 37.5045, longitude: 127.0012, capacity_kw: 50.5, panel_type: "monocrystalline", created_at: new Date().toISOString(), address: "서울 서초구", installed_at: null },
  { id: "d2", owner_name: "인천 송도 에너지", latitude: 37.3851, longitude: 126.6425, capacity_kw: 120.0, panel_type: "monocrystalline", created_at: new Date().toISOString(), address: "인천 연수구", installed_at: null },
  { id: "d3", owner_name: "세종 스마트그리드", latitude: 36.4800, longitude: 127.2890, capacity_kw: 250.2, panel_type: "polycrystalline", created_at: new Date().toISOString(), address: "세종시", installed_at: null },
  { id: "d4", owner_name: "광주 빛고을 발전", latitude: 35.1595, longitude: 126.8526, capacity_kw: 85.0, panel_type: "thin-film", created_at: new Date().toISOString(), address: "광주 서구", installed_at: null },
  { id: "d5", owner_name: "부산 해운대 솔라", latitude: 35.1587, longitude: 129.1604, capacity_kw: 45.5, panel_type: "monocrystalline", created_at: new Date().toISOString(), address: "부산 해운대구", installed_at: null },
  { id: "d6", owner_name: "제주 구좌 풍력/태양광", latitude: 33.5186, longitude: 126.8485, capacity_kw: 300.0, panel_type: "monocrystalline", created_at: new Date().toISOString(), address: "제주 제주시", installed_at: null },
  { id: "d7", owner_name: "강릉 정동진 발전소", latitude: 37.6914, longitude: 129.0326, capacity_kw: 65.2, panel_type: "polycrystalline", created_at: new Date().toISOString(), address: "강원 강릉시", installed_at: null },
];

export function useFacilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const loadFacilities = async () => {
      try {
        const { data, error } = await supabase
          .from("facilities")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
          setFacilities(DEMO_FACILITIES);
        } else {
          setFacilities(data);
        }
      } catch (err) {
        setFacilities(DEMO_FACILITIES);
      } finally {
        setIsLoading(false);
      }
    };

    loadFacilities();

    // Realtime 구독 시도 (Mock 클라이언트에서는 무시됨)
    try {
      const channel = supabase
        .channel("facilities_realtime")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "facilities" },
          (payload: any) => {
            setFacilities((prev) => [payload.new as Facility, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Realtime 미지원 환경 무시
    }
  }, []);

  return { facilities, isLoading };
}

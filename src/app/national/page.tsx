import NationalClient from "@/components/national/NationalClient";

export const metadata = {
  title: "전국 현황 — VPP 태양광",
  description: "전국 VPP 참여 설비 현황과 실시간 전력망 상태를 확인하세요.",
};

export default function NationalPage() {
  return <NationalClient />;
}

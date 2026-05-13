import HomePageClient from "@/components/home/HomePageClient";

export const metadata = {
  title: "설비 등록 — VPP 태양광",
  description: "GPS 위치 기반으로 태양광 설비를 등록하고 VPP 플랫폼에 참여하세요.",
};

export default function HomePage() {
  return <HomePageClient />;
}

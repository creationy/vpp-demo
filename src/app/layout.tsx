import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import GNB from "@/components/layout/GNB";
import ThemeManager from "@/components/layout/ThemeManager";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VPP 태양광 — 스마트 가상발전소 참여 플랫폼",
  description:
    "소규모 태양광 발전사업자를 위한 VPP(가상발전소) 참여 플랫폼. AI 기반 발전량 예측과 실시간 전력망 모니터링으로 최적의 인센티브를 획득하세요.",
  keywords: ["VPP", "가상발전소", "태양광", "재생에너지", "ESG", "MLOps"],
  authors: [{ name: "VPP Demo Team" }],
  openGraph: {
    title: "VPP 태양광 — 스마트 가상발전소 참여 플랫폼",
    description: "AI 기반 태양광 VPP 참여 플랫폼",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0D0D0D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body

        className={`${notoSansKR.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeManager />
        <div className="app-shell">
          <main className="main-content">{children}</main>
          <GNB />
        </div>
      </body>
    </html>
  );
}

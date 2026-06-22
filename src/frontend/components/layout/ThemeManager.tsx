"use client";

import { useEffect, useState } from "react";

/**
 * 사용자 현지 시간에 맞춰 테마를 자동 전환하는 컴포넌트
 * - Hydration Error 방지를 위해 mounted 이후에만 실행
 */
export default function ThemeManager() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const updateTheme = () => {
      const hour = new Date().getHours();
      const isDay = hour >= 6 && hour < 18;
      
      if (isDay) {
        document.documentElement.setAttribute("data-theme", "day");
        document.documentElement.style.colorScheme = "light";
      } else {
        document.documentElement.removeAttribute("data-theme");
        document.documentElement.style.colorScheme = "dark";
      }
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  // 아무것도 렌더링하지 않음
  return null;
}

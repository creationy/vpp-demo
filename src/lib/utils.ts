import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * shadcn/ui 표준 className 병합 유틸
 * - clsx 로 조건부 클래스를 합치고, tailwind-merge 로 Tailwind 클래스 충돌을 정리한다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

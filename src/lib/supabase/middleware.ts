import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 미들웨어에서 Supabase 세션을 갱신하는 헬퍼
 * - 액세스 토큰 만료 시 리프레시 토큰으로 자동 갱신
 * - 인증이 필요한 경로 보호 (현재 데모는 인증 없음)
 * - 환경 변수 누락 시 Supabase 없이 통과 (로컬 개발 지원)
 */
export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 환경 변수가 없으면 Supabase 세션 갱신을 건너뛰고 통과
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // 세션 갱신 트리거 (중요: 이 호출을 제거하지 마세요)
  await supabase.auth.getUser();

  return supabaseResponse;
}

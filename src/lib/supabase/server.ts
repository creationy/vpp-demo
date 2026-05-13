import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

/**
 * 서버(RSC, Route Handler, Server Action) 전용 Supabase 클라이언트
 * - Next.js의 cookies() 를 통해 세션 쿠키를 읽고 씀
 * - 반드시 async 함수 안에서 호출할 것
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // RSC에서 호출된 경우 쿠키 쓰기 무시 (읽기 전용)
          }
        },
      },
    }
  );
}

/**
 * 서비스 롤 키를 사용하는 관리자 클라이언트 (RLS 우회)
 * ⚠️  절대 클라이언트 컴포넌트에서 import 금지
 */
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

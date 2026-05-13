import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

/**
 * 브라우저(Client Component) 전용 Supabase 클라이언트
 * - 환경 변수 부재 시에도 앱이 크래시되지 않도록 안전하게 처리
 */
let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 환경 변수가 없으면 가짜 클라이언트를 반환하거나, 에러 없이 null/empty 처리를 지원
  // @supabase/ssr의 createBrowserClient는 URL이 없으면 에러를 발생시키므로 분기 처리
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing. Client running in mock mode.");
    // 최소한의 구조를 가진 목 객체 반환 (필요 시 더 확장)
    return {
      auth: { getUser: async () => ({ data: { user: null }, error: null }) },
      from: () => ({
        select: () => ({
          eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), order: () => ({ limit: async () => ({ data: [], error: null }) }) }),
          order: () => ({ limit: async () => ({ data: [], error: null }) }),
        }),
        upsert: () => ({ eq: async () => ({ data: null, error: null }) }),
      }),
    } as any;
  }

  client = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  return client;
}

import { registerFacility } from "@/backend/facilities/register-facility";

/**
 * 설비 등록 API (라우팅 껍데기)
 * - 실제 처리는 backend 계층(registerFacility)에 위임한다.
 */
export async function POST(request: Request) {
  return registerFacility(request);
}

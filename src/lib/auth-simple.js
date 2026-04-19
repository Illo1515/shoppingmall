import { cookies } from "next/headers";

// 보안을 위해 단순하지만 추측하기 어려운 고유 토큰 사용
const ADMIN_TOKEN = "ijeommu-admin-survival-token-2026";
const SESSION_NAME = "admin_session";

export async function login(username) {
  // 제이슨 웹 토큰(JWT) 대신 단순하지만 확실한 세션 토큰 설정
  (await cookies()).set(SESSION_NAME, ADMIN_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 // 24시간
  });
}

export async function logout() {
  (await cookies()).set(SESSION_NAME, "", { maxAge: 0 });
}

export async function getSession() {
  const session = (await cookies()).get(SESSION_NAME)?.value;
  if (!session) return null;
  
  // 토큰 일치 확인
  if (session === ADMIN_TOKEN) {
    return { isAdmin: true, username: "admin" };
  }
  return null;
}

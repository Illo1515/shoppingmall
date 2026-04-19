import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-for-dev-1234567890-secure"
);

const SESSION_NAME = "admin_session";

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function decrypt(input) {
  try {
    const { payload } = await jwtVerify(input, secret, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (e) {
    return null;
  }
}

export async function login(username) {
  // 간단한 관리자 세션 생성
  const session = await encrypt({ username, isAdmin: true });
  
  (await cookies()).set(SESSION_NAME, session, {
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
  return await decrypt(session);
}

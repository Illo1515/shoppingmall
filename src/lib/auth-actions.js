"use server";

import { login, logout } from "@/lib/auth-simple";
import { redirect } from "next/navigation";

export async function adminLoginAction(username, password) {
  // 실제 서비스라면 여기서 DB 확인을 하겠지만, 
  // 요청하신 대로 하드코딩된 정보를 사용합니다.
  if (username === "fhwktm" && password === "fhwktm123") {
    await login(username);
    return { success: true };
  }
  return { error: "아이디 또는 비밀번호가 틀렸습니다." };
}

export async function adminLogoutAction() {
  await logout();
  redirect("/admin/login");
}

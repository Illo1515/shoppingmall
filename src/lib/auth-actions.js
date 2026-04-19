"use server";

import { login, logout } from "@/lib/auth-simple";
import { redirect } from "next/navigation";

export async function adminLoginAction(username, password) {
  try {
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (trimmedUser === "fhwktm" && trimmedPass === "fhwktm123") {
      await login(trimmedUser);
      return { success: true };
    }
    return { error: `로그인 실패: 아이디(${trimmedUser}) 또는 비밀번호가 틀렸습니다.` };
  } catch (error) {
    console.error("Login Action Error:", error);
    return { error: `시스템 오류: ${error.message}` };
  }
}

export async function adminLogoutAction() {
  await logout();
  redirect("/admin/login");
}

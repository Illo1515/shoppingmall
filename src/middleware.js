import { NextResponse } from "next/server";

const ADMIN_TOKEN = "ijeommu-admin-survival-token-2026";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 관리자 경로 보호 (/admin 제외 /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = request.cookies.get("admin_session")?.value;

    if (!session || session !== ADMIN_TOKEN) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

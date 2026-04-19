import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboardLayout({ children }) {
  const session = await auth();
  const isAdmin = session?.user?.isAdmin;

  // 로그인하지 않았거나 어드민이 아닐 경우 리다이렉트
  if (!isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 py-8">
      {/* 어드민 사이드바 메뉴 */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="toss-card sticky top-24 p-5">
          <h2 className="font-bold text-lg mb-6 text-[var(--color-toss-gray-900)] pl-2">어드민 패널</h2>
          <nav className="flex flex-col gap-2">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--color-toss-gray-100)] text-[var(--color-toss-gray-700)] font-medium transition-colors">
              <span>📦</span>
              상품 관리
            </Link>
            <Link href="/admin/products/new" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--color-toss-gray-100)] text-[var(--color-toss-gray-700)] font-medium transition-colors">
              <span>🖼️</span>
              상품 등록
            </Link>
            <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--color-toss-gray-100)] text-[var(--color-toss-gray-700)] font-medium transition-colors">
              <span>📋</span>
              주문 관리
            </Link>
          </nav>
        </div>
      </aside>

      {/* 어드민 메인 컨텐츠 영역 */}
      <main className="flex-1 w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}

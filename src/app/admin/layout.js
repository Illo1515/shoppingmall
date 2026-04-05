import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ListOrdered, Upload, ShieldX } from "lucide-react";

export default async function AdminLayout({ children }) {
  const session = await auth();

  // 보안 로직: 관리자 여부 확인 (MVP: 로그인한 누구나 임시 어드민 허용 - 실제 서비스 시 이메일 하드코딩 필요)
  // 예시: if (session?.user?.email !== "admin@ijeommu.com") return ...
  const isAdmin = session?.user; 

  if (!session) {
    redirect("/"); // 로그인 안되어 있으면 홈으로 튕겨냄
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShieldX className="w-20 h-20 text-[var(--color-toss-gray-400)] mb-6" />
        <h2 className="text-2xl font-bold text-[var(--color-toss-gray-900)] mb-2">접근 권한이 없습니다</h2>
        <p className="text-[var(--color-toss-gray-600)] mb-8">오직 관리자만 이 페이지에 접근할 수 있습니다.</p>
        <Link href="/" className="text-[var(--color-toss-blue)] font-medium hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 py-8">
      {/* 어드민 사이드바 메뉴 */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="toss-card sticky top-24 p-5">
          <h2 className="font-bold text-lg mb-6 text-[var(--color-toss-gray-900)] pl-2">어드민 패널</h2>
          <nav className="flex flex-col gap-2">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--color-toss-gray-100)] text-[var(--color-toss-gray-700)] font-medium transition-colors">
              <Package className="w-5 h-5" />
              상품 관리
            </Link>
            <Link href="/admin/products/new" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--color-toss-gray-100)] text-[var(--color-toss-gray-700)] font-medium transition-colors">
              <Upload className="w-5 h-5" />
              상품 등록
            </Link>
            <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--color-toss-gray-100)] text-[var(--color-toss-gray-700)] font-medium transition-colors">
              <ListOrdered className="w-5 h-5" />
              주문 내역 (준비중)
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

import { supabaseAdmin } from "@/lib/supabase";
import Image from "next/image";

export const runtime = 'edge';

export default async function AdminOrdersPage() {
  // 관리자 권한으로 모든 주문 가져오기 (고객 정보 및 상품 정보 조인)
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select(`
      *,
      users!inner(name, email),
      products!inner(name, image_url)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Order Fetch Error:", error);
  }

  return (
    <div className="toss-card">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-toss-gray-900)] mb-1">주문 내역</h1>
        <p className="text-[var(--color-toss-gray-600)] text-sm">고객 주문을 확인하고 관리합니다. 추후 이메일 알림 연동 및 결제 취소 기능을 추가할 수 있습니다.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-[var(--color-toss-gray-200)] text-[var(--color-toss-gray-500)] text-sm">
              <th className="pb-3 font-medium px-2">주문일시</th>
              <th className="pb-3 font-medium px-2">주문자(Email)</th>
              <th className="pb-3 font-medium px-2">주문 상품</th>
              <th className="pb-3 font-medium px-2">결제 금액</th>
              <th className="pb-3 font-medium px-2">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-toss-gray-100)]">
            {orders && orders.map((order) => (
              <tr key={order.id} className="hover:bg-[var(--color-toss-gray-100)]/50 transition-colors">
                <td className="py-4 px-2 text-sm text-[var(--color-toss-gray-600)]">
                  {new Date(order.created_at).toLocaleString("ko-KR", { 
                    year: "numeric", month: "2-digit", day: "2-digit", 
                    hour: "2-digit", minute: "2-digit" 
                  })}
                </td>
                <td className="py-4 px-2">
                  <p className="font-semibold text-[var(--color-toss-gray-900)]">{order.users?.name || "알 수 없음"}</p>
                  <p className="text-sm text-[var(--color-toss-gray-500)]">{order.users?.email}</p>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-[var(--color-toss-gray-100)] rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={order.products?.image_url || ""} alt="product" fill className="object-cover" />
                    </div>
                    <span className="font-medium text-[var(--color-toss-gray-800)] line-clamp-1 max-w-[200px]">
                      {order.products?.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2 font-bold text-[var(--color-toss-gray-900)]">
                  {order.amount.toLocaleString()}원
                </td>
                <td className="py-4 px-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                    ${order.status === 'COMPLETED' ? 'bg-blue-50 text-[var(--color-toss-blue)]' : 
                      order.status === 'PENDING' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                    {order.status === 'COMPLETED' ? '결제완료' : order.status}
                  </span>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-[var(--color-toss-gray-500)]">접수된 주문이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

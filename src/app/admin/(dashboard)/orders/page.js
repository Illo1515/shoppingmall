import { supabaseAdmin } from "@/lib/supabase";
import Image from "next/image";
import { ListOrdered, CheckCircle2, Truck, Clock, AlertCircle } from "lucide-react";
import OrderStatusButton from "@/components/OrderStatusButton";

export const runtime = 'edge';

export default async function AdminOrdersPage() {
  // 관리자 권한으로 모든 주문 가져오기
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case 'SHIPPING': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'PENDING': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'COMPLETED': return '결제완료';
      case 'SHIPPING': return '배송중';
      case 'PENDING': return '결제대기';
      case 'PREPARING': return '상품준비중';
      default: return status;
    }
  };

  return (
    <div className="toss-card p-8 rounded-[2rem] animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-[var(--color-toss-blue)] mb-1">
          <ListOrdered className="w-5 h-5 font-bold" />
          <span className="text-sm font-bold tracking-tight">Order Management</span>
        </div>
        <h1 className="text-3xl font-black text-[var(--color-toss-gray-900)] tracking-tight mb-2">주문 내역</h1>
        <p className="text-[var(--color-toss-gray-600)] font-medium">실시간 주문 현황을 확인하고 배송 상태를 관리하세요.</p>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[var(--color-toss-gray-100)] text-[var(--color-toss-gray-400)] text-sm">
              <th className="pb-4 font-bold px-4">주문일시</th>
              <th className="pb-4 font-bold px-4">주문자 정보</th>
              <th className="pb-4 font-bold px-4">주문 상품</th>
              <th className="pb-4 font-bold px-4">금액</th>
              <th className="pb-4 font-bold px-4 text-right">상태 관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-toss-gray-50)]">
            {orders && orders.map((order) => (
              <tr key={order.id} className="hover:bg-[var(--color-toss-gray-50)]/80 transition-all">
                <td className="py-6 px-4 text-sm font-medium text-[var(--color-toss-gray-500)]">
                  {new Date(order.created_at).toLocaleString("ko-KR", {
                    year: "numeric", month: "2-digit", day: "2-digit",
                    hour: "2-digit", minute: "2-digit"
                  })}
                </td>
                <td className="py-6 px-4">
                  <p className="font-bold text-[var(--color-toss-gray-900)] text-base">{order.users?.name || "알 수 없음"}</p>
                  <p className="text-sm text-[var(--color-toss-gray-400)] font-medium">{order.users?.email}</p>
                </td>
                <td className="py-6 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-[var(--color-toss-gray-100)] rounded-xl overflow-hidden shadow-sm">
                      <Image src={order.products?.image_url || ""} alt="product" fill className="object-cover" />
                    </div>
                    <span className="font-bold text-[var(--color-toss-gray-800)] line-clamp-1 max-w-[200px]">
                      {order.products?.name}
                    </span>
                  </div>
                </td>
                <td className="py-6 px-4 font-black text-[var(--color-toss-gray-900)] text-lg">
                  {order.amount.toLocaleString()}원
                </td>
                <td className="py-6 px-4 text-right">
                  <div className="flex flex-col items-end gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                      ${order.status === 'COMPLETED' ? 'bg-blue-50 text-[var(--color-toss-blue)]' :
                        order.status === 'SHIPPING' ? 'bg-purple-50 text-purple-600' : 
                        order.status === 'PENDING' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </div>
                    <OrderStatusButton orderId={order.id} currentStatus={order.status} />
                  </div>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={5} className="py-32 text-center text-[var(--color-toss-gray-400)] font-bold text-lg">접수된 주문이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

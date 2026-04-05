import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit2, Trash2 } from "lucide-react";

export const runtime = 'edge';

export default async function AdminDashboard() {
  // 관리자 키로 모든 상품 (최신순) 가져오기
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="toss-card">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-toss-gray-900)] mb-1">상품 관리</h1>
          <p className="text-[var(--color-toss-gray-600)] text-sm">현재 스토어에 등록된 모든 상품을 관리합니다.</p>
        </div>
        <Link href="/admin/products/new" className="bg-[var(--color-toss-blue)] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[var(--color-toss-blue-hover)] transition-colors">
          <Plus className="w-4 h-4" />
          새 상품 등록
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-toss-gray-200)] text-[var(--color-toss-gray-500)] text-sm">
              <th className="pb-3 font-medium px-2">상품 이미지</th>
              <th className="pb-3 font-medium px-2">상품명</th>
              <th className="pb-3 font-medium px-2">카테고리</th>
              <th className="pb-3 font-medium px-2">가격</th>
              <th className="pb-3 font-medium px-2 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-toss-gray-100)]">
            {products && products.map((product) => (
              <tr key={product.id} className="hover:bg-[var(--color-toss-gray-100)]/50 transition-colors">
                <td className="py-4 px-2">
                  <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                  </div>
                </td>
                <td className="py-4 px-2 font-medium text-[var(--color-toss-gray-800)]">{product.name}</td>
                <td className="py-4 px-2 text-[var(--color-toss-gray-500)] text-sm">{product.category}</td>
                <td className="py-4 px-2 font-semibold text-[var(--color-toss-gray-900)]">{product.price.toLocaleString()}원</td>
                <td className="py-4 px-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-[var(--color-toss-gray-500)] hover:text-black rounded-lg hover:bg-[var(--color-toss-gray-200)] transition-colors" title="수정">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-[var(--color-toss-gray-500)] hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" title="삭제">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-[var(--color-toss-gray-500)]">등록된 상품이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

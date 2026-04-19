import { supabaseFetch } from "@/lib/supabase-fetch";
import Link from "next/link";
import Image from "next/image";
import DeleteProductButton from "@/components/DeleteProductButton";

export const runtime = 'edge';

export default async function AdminDashboard() {
  // 관리자 키로 모든 상품 (최신순) 가져오기
  const { data: products, error } = await supabaseFetch("products", {
    query: "select=*&order=created_at.desc",
    isAdmin: true
  });

  if (error) {
    console.error("Fetch Products Error:", error);
  }

  return (
    <div className="toss-card p-8 rounded-[2rem] animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-[var(--color-toss-blue)] mb-1">
            <span>📦</span>
            <span className="text-sm font-bold tracking-tight">Product Management</span>
          </div>
          <h1 className="text-3xl font-black text-[var(--color-toss-gray-900)] tracking-tight">상품 관리</h1>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-[var(--color-toss-blue)] text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#2069E6] transition-all shadow-[0_10px_20px_rgba(49,130,246,0.15)] active:scale-[0.98]"
        >
          <span>+</span>
          새 상품 등록
        </Link>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[var(--color-toss-gray-100)] text-[var(--color-toss-gray-400)] text-sm">
              <th className="pb-4 font-bold px-4 uppercase tracking-wider">상품</th>
              <th className="pb-4 font-bold px-4 uppercase tracking-wider">카테고리</th>
              <th className="pb-4 font-bold px-4 uppercase tracking-wider">가격</th>
              <th className="pb-4 font-bold px-4 uppercase tracking-wider">등록일</th>
              <th className="pb-4 font-bold px-4 uppercase tracking-wider text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-toss-gray-50)]">
            {products && products.map((product) => (
              <tr key={product.id} className="group hover:bg-[var(--color-toss-gray-50)]/80 transition-all">
                <td className="py-5 px-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 bg-[var(--color-toss-gray-100)] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-[var(--color-toss-gray-900)] text-lg leading-tight mb-1">{product.name}</p>
                      <p className="text-sm text-[var(--color-toss-gray-500)] font-medium line-clamp-1 max-w-[200px]">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4 font-bold text-[var(--color-toss-gray-600)]">
                  <span className="bg-[var(--color-toss-gray-100)] px-3 py-1 rounded-full text-xs">
                    {product.category}
                  </span>
                </td>
                <td className="py-5 px-4 font-black text-[var(--color-toss-gray-900)] text-lg">
                  {product.price.toLocaleString()}원
                </td>
                <td className="py-5 px-4 text-sm font-medium text-[var(--color-toss-gray-400)]">
                  {new Date(product.created_at).toLocaleDateString()}
                </td>
                <td className="py-5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/admin/products/${product.id}/edit`}
                      className="p-3 text-[var(--color-toss-gray-400)] hover:text-[var(--color-toss-blue)] hover:bg-blue-50 rounded-xl transition-all text-xl" 
                      title="수정"
                    >
                      ✏️
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={5} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">📦</span>
                    <p className="text-[var(--color-toss-gray-400)] font-bold text-lg">등록된 상품이 없습니다.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import ProductCard from "@/components/ProductCard";
import { supabaseFetch } from "@/lib/supabase-fetch";

export const runtime = 'edge';

export default async function Home({ searchParams }) {
  // Next.js 15: searchParams must be awaited
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1;
  const limit = 6;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Supabase Fetch를 사용하여 데이터 가져오기 (범위 및 정렬 처리)
  const { data: products, error, count } = await supabaseFetch('products', {
    query: `select=*&order=created_at.desc&limit=${limit}&offset=${from}`,
    count: 'exact'
  });

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <div className="w-full flex flex-col pt-8 pb-12">
      <div className="mb-10 text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[var(--color-toss-gray-900)]">
          이번 주 발견한<br />
          <span className="text-[var(--color-toss-blue)]">단 하나의 아이템</span>
        </h1>
        <p className="text-lg text-[var(--color-toss-gray-600)] font-medium">
          매력적인 상품 18개를 만나보세요.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-2xl mb-8">
          데이터를 불러오는데 실패했습니다: {error.message}
        </div>
      )}

      {/* 상품 그리드 */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-[var(--color-toss-gray-500)] text-lg">
          {error ? "에러가 발생했습니다." : "아직 등록된 상품이 없습니다."}
        </div>
      )}

      {/* 간이 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-16">
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            const isActive = page === pageNum;
            return (
              <a
                key={pageNum}
                href={`/?page=${pageNum}`}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-semibold transition-colors
                  ${isActive
                    ? "bg-[var(--color-toss-gray-800)] text-white"
                    : "bg-[var(--color-toss-gray-100)] text-[var(--color-toss-gray-600)] hover:bg-[var(--color-toss-gray-200)]"
                  }
                `}
              >
                {pageNum}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

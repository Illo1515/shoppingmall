import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import ShoppingBag from "lucide-react/dist/esm/icons/shopping-bag";
import { notFound } from "next/navigation";
import { createOrder } from "@/lib/order-actions";
import AddToCartButton from "@/components/AddToCartButton";


export const runtime = 'edge';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function ProductDetailPage({ params }) {
  // await params in Next.js 15
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="w-full max-w-4xl mx-auto pt-6 pb-20">
      <Link href="/" className="inline-flex items-center text-[var(--color-toss-gray-600)] hover:text-[#000] mb-8 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        홈으로 돌아가기
      </Link>

      <div className="flex flex-col md:flex-row gap-10 md:gap-14">
        {/* 상품 이미지 */}
        <div className="w-full md:w-1/2">
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-[var(--color-toss-gray-100)]">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <span className="text-sm font-semibold text-[var(--color-toss-blue)] mb-2">
            {product.category || "인기상품"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-toss-gray-900)] mb-4">
            {product.name}
          </h1>
          <p className="text-[var(--color-toss-gray-600)] text-lg mb-8 leading-relaxed">
            {product.description}
          </p>
          
          <div className="h-[1px] w-full bg-[var(--color-toss-gray-200)] mb-8"></div>
          
          <div className="flex items-center justify-between mb-10">
            <span className="text-xl font-medium text-[var(--color-toss-gray-700)]">결제 금액</span>
            <span className="text-3xl font-black text-[var(--color-toss-gray-900)]">
              {product.price.toLocaleString()}원
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <AddToCartButton product={product} />
            
            <form action={createOrder} className="w-full">
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="price" value={product.price} />
              <button type="submit" className="w-full text-[var(--color-toss-gray-500)] hover:text-black py-4 text-sm font-medium border border-[var(--color-toss-gray-200)] rounded-2xl transition-colors">
                (관리자 테스트) 즉시 주문 기록하기
              </button>
            </form>
          </div>
          
          <p className="text-center text-[var(--color-toss-gray-500)] text-xs mt-4 leading-relaxed">
            * '장바구니'는 브라우저에 임시 저장됩니다.<br/>
            * '즉시 주문 기록'은 Admin 대시보드 데이터 확인을 위한 테스트용 버튼입니다.
          </p>

        </div>
      </div>
    </div>
  );
}

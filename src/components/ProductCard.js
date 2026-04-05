import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div className="toss-card p-0 overflow-hidden flex flex-col h-full bg-white">
        <div className="relative w-full pt-[100%] bg-[var(--color-toss-gray-100)] overflow-hidden">
          <Image
            src={product.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <span className="text-xs font-semibold text-[var(--color-toss-blue)] mb-1">
            {product.category || "인기상품"}
          </span>
          <h3 className="font-semibold text-lg text-[var(--color-toss-gray-900)] line-clamp-2 leading-snug mb-3">
            {product.name}
          </h3>
          <div className="mt-auto">
            <span className="font-bold text-xl text-[var(--color-toss-gray-900)]">
              {product.price.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--color-toss-gray-200)]">
      <div className="max-w-5xl mx-auto w-full px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          <span className="font-bold text-xl tracking-tight text-[var(--color-toss-gray-900)]">토스쇼핑</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-[var(--color-toss-gray-100)] text-[var(--color-toss-gray-700)] transition-colors">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-[var(--color-toss-blue)] text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

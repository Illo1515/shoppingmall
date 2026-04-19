"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      className={`toss-btn flex w-full items-center justify-center gap-2 py-5 text-lg transition-all
        ${isAdded ? "bg-green-500 hover:bg-green-600 scale-[0.98]" : "bg-[var(--color-toss-blue)]"}
      `}
    >
      {isAdded ? (
        <>
          <span>✅</span>
          장바구니 담기 완료
        </>
      ) : (
        <>
          <span>🛒</span>
          장바구니에 담기
        </>
      )}
    </button>
  );
}

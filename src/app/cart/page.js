"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import Plus from "lucide-react/dist/esm/icons/plus";
import Minus from "lucide-react/dist/esm/icons/minus";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import ShoppingBag from "lucide-react/dist/esm/icons/shopping-bag";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 bg-[var(--color-toss-gray-100)] rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-[var(--color-toss-gray-400)]" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-toss-gray-900)] mb-2">장바구니가 비어있어요</h2>
        <p className="text-[var(--color-toss-gray-600)] mb-8">원하는 상품을 담아보세요.</p>
        <Link href="/" className="bg-[var(--color-toss-blue)] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[var(--color-toss-blue-hover)] transition-all">
          상품 보러가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-toss-gray-900)]">장바구니</h1>
        <span className="text-[var(--color-toss-gray-500)] font-medium">총 {totalItems}개</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 장바구니 리스트 */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="toss-card flex gap-4 items-center p-4">
              <div className="relative w-24 h-24 bg-[var(--color-toss-gray-100)] rounded-xl overflow-hidden flex-shrink-0">
                <Image src={item.image_url} alt={item.name} fill className="object-cover" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[var(--color-toss-gray-900)] truncate mb-1">{item.name}</h3>
                <p className="text-sm text-[var(--color-toss-gray-500)] mb-3">{item.category}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-[var(--color-toss-gray-100)] rounded-lg px-1 py-1">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:bg-white rounded-md transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:bg-white rounded-md transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-bold text-[var(--color-toss-gray-900)]">
                    {(item.price * item.quantity).toLocaleString()}원
                  </span>
                </div>
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-[var(--color-toss-gray-400)] hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          <Link href="/" className="inline-flex items-center text-[var(--color-toss-gray-600)] hover:text-black font-medium mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            더 쇼핑하기
          </Link>
        </div>

        {/* 결제 요약 */}
        <div className="lg:col-span-1">
          <div className="toss-card sticky top-24 p-6 space-y-6">
            <h2 className="text-xl font-bold text-[var(--color-toss-gray-900)]">결제 정보</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-[var(--color-toss-gray-600)]">
                <span>총 상품 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-[var(--color-toss-gray-600)]">
                <span>배송비</span>
                <span>무료</span>
              </div>
              <div className="h-[1px] bg-[var(--color-toss-gray-100)] my-2"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-[var(--color-toss-gray-900)]">결제 예정 금액</span>
                <span className="text-2xl font-black text-[var(--color-toss-blue)]">{totalPrice.toLocaleString()}원</span>
              </div>
            </div>

            <button className="toss-btn w-full py-5 text-lg font-bold">
              주문하기
            </button>
            <p className="text-center text-[var(--color-toss-gray-400)] text-xs">
              실제 결제는 추후 연동될 예정입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

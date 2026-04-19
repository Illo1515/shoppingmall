"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/admin-actions";

export default function OrderStatusButton({ orderId, currentStatus }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const statuses = [
    { label: "결제대기", value: "PENDING" },
    { label: "상품준비중", value: "PREPARING" },
    { label: "배송중", value: "SHIPPING" },
    { label: "결제완료", value: "COMPLETED" },
  ];

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === currentStatus) return;
    setIsUpdating(true);
    setShowMenu(false);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      alert("상태 변경에 실패했습니다.");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        disabled={isUpdating}
        className="text-[10px] sm:text-xs bg-[var(--color-toss-gray-100)] hover:bg-[var(--color-toss-gray-200)] text-[var(--color-toss-gray-600)] px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all"
      >
        {isUpdating ? "..." : "상태 변경"}
        <span>▼</span>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-2xl border border-[var(--color-toss-gray-100)] py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusUpdate(status.value)}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors
                  ${status.value === currentStatus 
                    ? "text-[var(--color-toss-blue)] bg-blue-50" 
                    : "text-[var(--color-toss-gray-700)] hover:bg-[var(--color-toss-gray-50)]"}`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { deleteProduct } from "@/lib/admin-actions";

export default function DeleteProductButton({ productId }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("정말 이 상품을 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    try {
      await deleteProduct(productId);
    } catch (error) {
      alert("삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      title="삭제"
    >
      {isDeleting ? "..." : "🗑️"}
    </button>
  );
}

"use client";

import { useState } from "react";
import { deleteProduct } from "@/lib/admin-actions";
import { Trash2, Loader2, AlertCircle } from "lucide-react";

export default function DeleteProductButton({ id }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(id);
      setShowConfirm(false);
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex gap-2 items-center bg-red-50 p-2 rounded-xl animate-in fade-in zoom-in-95 duration-200">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span className="text-xs font-bold text-red-600">정말 삭제할까요?</span>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : "확인"}
        </button>
        <button 
          onClick={() => setShowConfirm(false)}
          className="text-xs bg-[var(--color-toss-gray-200)] text-[var(--color-toss-gray-600)] px-3 py-1.5 rounded-lg font-bold hover:bg-[var(--color-toss-gray-300)] transition-colors"
        >
          취소
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setShowConfirm(true)}
      className="p-3 text-[var(--color-toss-gray-400)] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" 
      title="삭제"
    >
      <Trash2 className="w-5 h-5 transition-transform group-hover:scale-110" />
    </button>
  );
}

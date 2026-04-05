"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { createProduct } from "@/app/admin/actions";

export default function NewProductPage() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    // 자동으로 업로드 시작
    setIsUploading(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "업로드 실패");

      setUploadedUrl(data.url); // 업로드 성공 후 발급받은 URL을 상태에 저장
    } catch (error) {
      console.error(error);
      setErrorMsg("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="toss-card max-w-2xl mx-auto">
      <Link href="/admin" className="inline-flex items-center text-[var(--color-toss-gray-500)] hover:text-black mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-1" />
        돌아가기
      </Link>
      
      <h1 className="text-2xl font-bold text-[var(--color-toss-gray-900)] mb-8">새 상품 등록</h1>

      <form action={createProduct} className="space-y-6">
        {/* 숨김 필드: 업로드된 이미지 URL을 Server Action으로 전달하기 위함 */}
        <input type="hidden" name="image_url" value={uploadedUrl} />

        {/* 1. 사진 업로드 영역 */}
        <div>
          <label className="block font-semibold text-[var(--color-toss-gray-800)] mb-2">상품 사진 (필수)</label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="relative w-32 h-32 bg-[var(--color-toss-gray-100)] rounded-2xl overflow-hidden border border-[var(--color-toss-gray-200)] flex items-center justify-center flex-shrink-0">
              {previewUrl ? (
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              ) : (
                <ImagePlus className="w-8 h-8 text-[var(--color-toss-gray-400)]" />
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-[var(--color-toss-blue)] animate-spin" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <label className="inline-flex items-center justify-center bg-[var(--color-toss-gray-100)] text-[var(--color-toss-gray-700)] font-medium px-4 py-3 rounded-xl hover:bg-[var(--color-toss-gray-200)] cursor-pointer transition-colors w-full sm:w-auto">
                <span>내 컴퓨터에서 사진 찾기</span>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
              <p className="text-sm text-[var(--color-toss-gray-500)] mt-3 leading-relaxed">
                정방형(1:1) 비율의 고화질 이미지를 권장합니다.<br/>
                사진을 선택하면 클라우드에 즉시 자동 업로드됩니다.
              </p>
              {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
            </div>
          </div>
        </div>

        {/* 2. 상세 정보 영역 */}
        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-[var(--color-toss-gray-800)] mb-2">상품명</label>
            <input name="name" type="text" required placeholder="예: 토스 프론트엔드 후드 자켓" className="toss-input" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[var(--color-toss-gray-800)] mb-2">판매 가격 (원)</label>
              <input name="price" type="number" required placeholder="0" min="0" className="toss-input" />
            </div>
            <div>
              <label className="block font-semibold text-[var(--color-toss-gray-800)] mb-2">카테고리</label>
              <select name="category" className="toss-input pb-3 pt-3 h-auto cursor-pointer border-none bg-[var(--color-toss-gray-100)] appearance-none">
                <option value="패션/의류">패션/의류</option>
                <option value="가전/디지털">가전/디지털</option>
                <option value="라이프스타일">라이프스타일</option>
                <option value="가구/인테리어">가구/인테리어</option>
                <option value="식품">식품</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[var(--color-toss-gray-800)] mb-2">상품 상세 설명</label>
            <textarea name="description" required placeholder="고객의 마음을 사로잡을 상품 설명을 적어주세요." rows="4" className="toss-input resize-none"></textarea>
          </div>
        </div>

        {/* 3. 제출 영역 */}
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={!uploadedUrl || isUploading}
            className="toss-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "사진 업로드 중..." : "상품 등록 완료하기"}
          </button>
        </div>
      </form>
    </div>
  );
}

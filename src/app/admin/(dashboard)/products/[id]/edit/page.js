"use client";

import { useState, useEffect } from "react";
import { updateProduct } from "../../actions";
import { Image as ImageIcon, Upload, X, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "전자기기",
    image_url: ""
  });

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        alert("상품을 불러오는데 실패했습니다.");
        router.push("/admin");
        return;
      }

      setFormData({
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price.toString(),
        category: data.category || "전자기기",
        image_url: data.image_url
      });
      setPreviewUrl(data.image_url);
      setIsLoading(false);
    }

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url;
    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", imageFile);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      return data.url;
    } catch (error) {
      console.error("Upload failed:", error);
      alert("이미지 업로드에 실패했습니다.");
      return "";
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalImageUrl = await uploadImage();
      if (!finalImageUrl) {
        setIsSubmitting(false);
        return;
      }

      const submissionData = new FormData();
      submissionData.append("id", formData.id);
      submissionData.append("name", formData.name);
      submissionData.append("description", formData.description);
      submissionData.append("price", formData.price);
      submissionData.append("category", formData.category);
      submissionData.append("image_url", finalImageUrl);

      await updateProduct(submissionData);
    } catch (error) {
      console.error("Update Error:", error);
      alert("상품 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-toss-blue)]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
      <Link href="/admin" className="inline-flex items-center text-[var(--color-toss-gray-600)] hover:text-[var(--color-toss-gray-900)] mb-6 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        뒤로가기
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl font-black text-[var(--color-toss-gray-900)] tracking-tight mb-2">상품 정보 수정</h1>
        <p className="text-[var(--color-toss-gray-600)] font-medium">기존 상품의 상세 정보를 최신으로 업데이트하세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* 이미지 업로드 영역 */}
        <div className="space-y-4">
          <label className="block text-lg font-bold text-[var(--color-toss-gray-900)]">상품 이미지</label>
          <div 
            className={`relative group h-80 rounded-[2rem] border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center p-4 
              ${previewUrl ? "border-transparent bg-white shadow-xl" : "border-[var(--color-toss-gray-200)] hover:border-[var(--color-toss-blue)] bg-[var(--color-toss-gray-50)]"}`}
          >
            {previewUrl ? (
              <>
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <button 
                    type="button"
                    onClick={() => { setImageFile(null); setPreviewUrl(""); }}
                    className="p-3 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/40 transition-colors text-white"
                   >
                    <X className="w-6 h-6" />
                   </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-lg mb-4 text-[var(--color-toss-blue)]">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="font-bold text-[var(--color-toss-gray-800)]">사진을 변경하려면 클릭하세요</p>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>
        </div>

        {/* 폼 입력 영역 */}
        <div className="toss-card p-10 space-y-8 rounded-[2rem]">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--color-toss-gray-600)] ml-1">상품명</label>
            <input 
              type="text" 
              placeholder="상품명"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-5 py-4 bg-[var(--color-toss-gray-100)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--color-toss-blue)] transition-all outline-none text-[var(--color-toss-gray-900)] font-medium text-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--color-toss-gray-600)] ml-1">상품 설명</label>
            <textarea 
              placeholder="상품 설명"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-5 py-4 bg-[var(--color-toss-gray-100)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--color-toss-blue)] transition-all outline-none text-[var(--color-toss-gray-900)] font-medium text-lg min-h-[150px] resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--color-toss-gray-600)] ml-1">판매 가격 (원)</label>
              <input 
                type="number" 
                placeholder="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-5 py-4 bg-[var(--color-toss-gray-100)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--color-toss-blue)] transition-all outline-none text-[var(--color-toss-gray-900)] font-medium text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--color-toss-gray-600)] ml-1">카테고리</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-5 py-4 bg-[var(--color-toss-gray-100)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--color-toss-blue)] transition-all outline-none text-[var(--color-toss-gray-900)] font-medium text-lg appearance-none cursor-pointer"
              >
                <option value="전자기기">전자기기</option>
                <option value="의류">의류</option>
                <option value="식품">식품</option>
                <option value="생활용품">생활용품</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link href="/admin" className="flex-1 py-5 bg-[var(--color-toss-gray-100)] hover:bg-[var(--color-toss-gray-200)] text-[var(--color-toss-gray-700)] rounded-[1.5rem] font-bold text-center transition-all">
            취소
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting || isUploading}
            className="flex-[2] py-5 bg-[var(--color-toss-blue)] hover:bg-[#2069E6] text-white rounded-[1.5rem] font-bold text-lg transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {(isSubmitting || isUploading) ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "상품 정보 수정 완료"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

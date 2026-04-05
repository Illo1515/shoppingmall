"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function createProduct(formData) {
  // 권한 재확인
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name");
  const description = formData.get("description");
  const price = parseInt(formData.get("price") || "0", 10);
  const category = formData.get("category");
  const image_url = formData.get("image_url");

  if (!name || !image_url) {
    throw new Error("이름과 이미지는 필수 항목입니다.");
  }

  const { error } = await supabaseAdmin.from("products").insert([
    {
      name,
      description,
      price,
      category,
      image_url,
    },
  ]);

  if (error) {
    console.error("DB Insert Error:", error);
    throw new Error("상품 등록 중 오류가 발생했습니다.");
  }

  // 데이터베이스 변경 시 캐시 무효화 (모든 유저가 새 상품을 볼 수 있도록)
  revalidatePath("/");
  revalidatePath("/admin");
  
  // 제출 완료 후 어드민 홈으로 이동
  redirect("/admin");
}

export async function deleteProduct(formData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const id = formData.get("id");
  if (!id) return;

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) throw new Error("삭제 실패");

  revalidatePath("/");
  revalidatePath("/admin");
}

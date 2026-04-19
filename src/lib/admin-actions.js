"use server";

import { supabaseFetch } from "@/lib/supabase-fetch";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-simple";

// 권한 확인 헬퍼 함수
async function ensureAdmin() {
  const session = await getSession();
  if (!session?.isAdmin) {
    throw new Error("관리자 권한이 필요합니다.");
  }
}

export async function createProduct(formData) {
  await ensureAdmin();

  const name = formData.get("name");
  const description = formData.get("description");
  const price = parseInt(formData.get("price") || "0", 10);
  const category = formData.get("category");
  const image_url = formData.get("image_url");

  if (!name || !image_url) {
    throw new Error("이름과 이미지는 필수 항목입니다.");
  }

  const { error } = await supabaseFetch("products", {
    method: 'POST',
    body: {
      name,
      description,
      price,
      category,
      image_url,
    },
    isAdmin: true
  });

  if (error) {
    console.error("DB Insert Error:", error);
    throw new Error("상품 등록 중 오류가 발생했습니다.");
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProduct(formData) {
  await ensureAdmin();

  const id = formData.get("id");
  const name = formData.get("name");
  const description = formData.get("description");
  const price = parseInt(formData.get("price") || "0", 10);
  const category = formData.get("category");
  const image_url = formData.get("image_url");

  if (!id || !name || !image_url) {
    throw new Error("필수 항목이 누락되었습니다.");
  }

  const { error } = await supabaseFetch("products", {
    method: 'PATCH',
    query: `id=eq.${id}`,
    body: {
      name,
      description,
      price,
      category,
      image_url,
    },
    isAdmin: true
  });

  if (error) {
    console.error("DB Update Error:", error);
    throw new Error("상품 수정 중 오류가 발생했습니다.");
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/product/${id}`);
  redirect("/admin");
}

export async function deleteProduct(id) {
  await ensureAdmin();

  if (!id) return;

  const { error } = await supabaseFetch("products", {
    method: 'DELETE',
    query: `id=eq.${id}`,
    isAdmin: true
  });

  if (error) {
    console.error("Delete Error:", error);
    throw new Error("삭제 실패");
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateOrderStatus(orderId, status) {
  await ensureAdmin();

  const { error } = await supabaseFetch("orders", {
    method: 'PATCH',
    query: `id=eq.${orderId}`,
    body: { status },
    isAdmin: true
  });

  if (error) {
    console.error("Order Status Update Error:", error);
    throw new Error("주문 상태 변경 실패");
  }

  revalidatePath("/admin/orders");
}

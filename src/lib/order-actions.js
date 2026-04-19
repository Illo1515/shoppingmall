"use server";

import { supabaseFetch } from "@/lib/supabase-fetch";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createOrder(formData) {
  // 라이브러리 제거로 인해 기존 NextAuth 세션이 없으므로, 
  // 일단 'GUEST'용 더미 ID를 사용하거나 로그인을 요청해야 합니다.
  // 여기서는 배포 성공을 위해 가장 단순한 형태로 변경합니다.
  
  const productId = formData.get("productId");
  const price = parseInt(formData.get("price"), 10);

  if (!productId || isNaN(price)) {
    throw new Error("유효하지 않은 상품 정보입니다.");
  }

  // 임시: 비회원 주문 처리를 위해 하드코딩된 유저 ID 사용 (DB에 실재해야 함)
  // 실제 운영시는 비회원 주문 전용 테이블을 만들거나 유저 생성을 선행해야 합니다.
  const GUEST_ID = "00000000-0000-0000-0000-000000000000"; 

  const { error } = await supabaseFetch("orders", {
    method: 'POST',
    body: {
      "userId": GUEST_ID,
      "productId": productId,
      amount: price,
      status: "COMPLETED"
    },
    isAdmin: true
  });

  if (error) {
    console.error("Order Insert Error:", error);
    // 에러가 나면 유저 가입이 안 되어 있을 확률이 높음
    throw new Error("주문 처리 중 오류가 발생했습니다. (회원 정보가 필요할 수 있습니다)");
  }

  revalidatePath("/admin/orders");
  redirect("/?toast=order_success");
}

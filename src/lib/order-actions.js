"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function createOrder(formData) {
  // 1. 유저 인증 확인
  const session = await auth();
  if (!session?.user?.id) {
    // Auth.js 어댑터를 통해 DB Users 테이블에 저장된 UUID
    throw new Error("로그인이 필요합니다.");
  }

  const productId = formData.get("productId");
  const price = parseInt(formData.get("price"), 10);

  if (!productId || isNaN(price)) {
    throw new Error("유효하지 않은 상품 정보입니다.");
  }

  // 2. 주문 데이터 생성
  const { error } = await supabaseAdmin.from("orders").insert([
    {
      "userId": session.user.id,
      "productId": productId,
      amount: price,
      status: "COMPLETED" // 토스 결제 연동 전까지는 바로 결제완료 처리
    },
  ]);

  if (error) {
    console.error("Order Insert Error:", error);
    throw new Error("주문 처리 중 오류가 발생했습니다.");
  }

  /* 
  =========================================
  [미래 설계] 이메일 알림 및 추가 결제망 (Toss/Stripe) 연동 포인트 
  =========================================
  1. 결제 모듈 호출 (Stripe, Toss, KakaoPay API)
  2. Nodemailer 또는 Resend API를 통해 관리자에게 주문 내역 이메일 발송
  e.g., await sendEmail({ to: "admin@my.shop", subject: "새 주문 알림", body: ... })
  */

  revalidatePath("/admin/orders");
  
  // 성공 시 주문 내역 확인 페이지나 알림 페이지로 이동 (현재는 메인으로)
  redirect("/?toast=order_success");
}

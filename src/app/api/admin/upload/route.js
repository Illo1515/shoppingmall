import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    // 1. 관리자 권한 확인
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. 폼 데이터(이미지 파일) 파싱
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. 파일 이름 고유화
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // 4. Supabase Storage에 업로드 (admin 키 사용)
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // 5. 업로드된 파일의 Public URL 생성
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('products')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl }, { status: 200 });

  } catch (error) {
    console.error("Upload Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = 'edge';

export async function POST(request) {
  // 어드민 권한 확인
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 고유한 파일명 생성
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // Supabase Storage 업로드 ('products' 버킷)
    const { data, error } = await supabaseAdmin.storage
      .from("products")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // 업로드된 파일의 공개 URL 가져오기
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("products")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

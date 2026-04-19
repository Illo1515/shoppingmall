import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-simple";

export const runtime = 'edge';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request) {
  // 어드민 권한 확인
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();

    // 고유한 파일명 생성
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // Supabase Storage 업로드 ('products' 버킷) - REST API 직접 호출
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/products/${filePath}`;
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': file.type,
      },
      body: bytes
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      console.error("Supabase Storage Error:", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // 업로드된 파일의 공개 URL 생성
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/products/${filePath}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

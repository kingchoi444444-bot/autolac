import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { supabaseAdmin, EDITOR_IMAGES_BUCKET } from "@/lib/supabase-admin";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "이미지 파일(png/jpeg/gif/webp)만 업로드할 수 있습니다." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "5MB 이하 파일만 업로드할 수 있습니다." }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "bin";
  const path = `${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(EDITOR_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) {
    return NextResponse.json({ error: "업로드에 실패했습니다." }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from(EDITOR_IMAGES_BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
}

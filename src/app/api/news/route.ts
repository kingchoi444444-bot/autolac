import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize";

function isAuthorized(req: Request): boolean {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return false;

  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || token.length !== apiKey.length) return false;

  return timingSafeEqual(Buffer.from(token), Buffer.from(apiKey));
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "인증에 실패했습니다." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "잘못된 JSON 본문입니다." }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  const brand = String(body.brand ?? "").trim();
  const model = String(body.model ?? "").trim();
  const summary = sanitizeHtml(String(body.summary ?? "").trim());
  const price = body.price ? String(body.price).trim() : null;
  const imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null;
  const releaseDate = body.releaseDate ? new Date(body.releaseDate) : null;

  if (!title || !brand || !model || !summary) {
    return NextResponse.json(
      { error: "title, brand, model, summary는 필수입니다." },
      { status: 400 },
    );
  }
  if (releaseDate && Number.isNaN(releaseDate.getTime())) {
    return NextResponse.json({ error: "releaseDate 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const news = await prisma.newCarInfo.create({
    data: { title, brand, model, summary, price, imageUrl, releaseDate },
  });

  revalidatePath("/news");

  return NextResponse.json(news, { status: 201 });
}

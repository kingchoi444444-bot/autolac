"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") {
    throw new Error("관리자만 이용할 수 있습니다.");
  }
}

function parseNewsForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const releaseDateRaw = String(formData.get("releaseDate") ?? "").trim();
  const releaseDate = releaseDateRaw ? new Date(releaseDateRaw) : null;

  if (!title || !brand || !model || !summary) {
    throw new Error("필수 항목을 모두 입력해주세요.");
  }

  return { title, brand, model, summary, price, imageUrl, releaseDate };
}

export async function createNews(formData: FormData) {
  await requireAdmin();
  const data = parseNewsForm(formData);

  const news = await prisma.newCarInfo.create({ data });

  revalidatePath("/news");
  redirect(`/news/${news.id}`);
}

export async function updateNews(newsId: string, formData: FormData) {
  await requireAdmin();
  const data = parseNewsForm(formData);

  await prisma.newCarInfo.update({ where: { id: newsId }, data });

  revalidatePath(`/news/${newsId}`);
  redirect(`/news/${newsId}`);
}

export async function deleteNews(newsId: string) {
  await requireAdmin();

  await prisma.newCarInfo.delete({ where: { id: newsId } });

  revalidatePath("/news");
  redirect("/news");
}

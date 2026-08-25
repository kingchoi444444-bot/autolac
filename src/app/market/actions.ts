"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

function parseListingForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = sanitizeHtml(String(formData.get("description") ?? "").trim());
  const category = String(formData.get("category") ?? "");
  const price = Number(formData.get("price"));
  const location = String(formData.get("location") ?? "").trim() || null;
  const carModel = String(formData.get("carModel") ?? "").trim() || null;
  const carYearRaw = formData.get("carYear");
  const carYear = carYearRaw ? Number(carYearRaw) : null;
  const mileageRaw = formData.get("mileage");
  const mileage = mileageRaw ? Number(mileageRaw) : null;
  const imagesRaw = String(formData.get("images") ?? "");
  const images = imagesRaw
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title || !description || !price || (category !== "USED_CAR" && category !== "PART")) {
    throw new Error("필수 항목을 모두 올바르게 입력해주세요.");
  }

  return { title, description, category, price, location, carModel, carYear, mileage, images };
}

export async function createListing(formData: FormData) {
  const userId = await requireUserId();
  const data = parseListingForm(formData);

  const listing = await prisma.listing.create({
    data: { ...data, category: data.category as "USED_CAR" | "PART", sellerId: userId },
  });

  revalidatePath("/market");
  redirect(`/market/${listing.id}`);
}

export async function updateListing(listingId: string, formData: FormData) {
  const userId = await requireUserId();

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.sellerId !== userId) {
    throw new Error("수정 권한이 없습니다.");
  }

  const data = parseListingForm(formData);

  await prisma.listing.update({
    where: { id: listingId },
    data: { ...data, category: data.category as "USED_CAR" | "PART" },
  });

  revalidatePath(`/market/${listingId}`);
  redirect(`/market/${listingId}`);
}

export async function deleteListing(listingId: string) {
  const userId = await requireUserId();

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.sellerId !== userId) {
    throw new Error("삭제 권한이 없습니다.");
  }

  await prisma.listing.delete({ where: { id: listingId } });

  revalidatePath("/market");
  redirect("/market");
}

export async function updateListingStatus(listingId: string, formData: FormData) {
  const userId = await requireUserId();

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.sellerId !== userId) {
    throw new Error("변경 권한이 없습니다.");
  }

  const status = String(formData.get("status") ?? "");
  if (!["ACTIVE", "RESERVED", "SOLD"].includes(status)) {
    throw new Error("잘못된 상태입니다.");
  }

  await prisma.listing.update({
    where: { id: listingId },
    data: { status: status as "ACTIVE" | "RESERVED" | "SOLD" },
  });

  revalidatePath(`/market/${listingId}`);
}

import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/lib/listing-labels";

const PAGE_SIZE = 12;

type PageProps = {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

export default async function MarketPage({ searchParams }: PageProps) {
  const { page: pageParam, q, category, minPrice, maxPrice } = await searchParams;

  const page = Math.max(1, Number(pageParam) || 1);
  const query = q?.trim() ?? "";

  const where = {
    ...(category === "USED_CAR" || category === "PART"
      ? { category: category as "USED_CAR" | "PART" }
      : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { carModel: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(minPrice || maxPrice
      ? {
          price: {
            ...(minPrice ? { gte: Number(minPrice) } : {}),
            ...(maxPrice ? { lte: Number(maxPrice) } : {}),
          },
        }
      : {}),
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.listing.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildPageHref = (p: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    params.set("page", String(p));
    return `/market?${params.toString()}`;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">중고차/부품 거래</h1>
        <Link
          href="/market/new"
          className="rounded bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          매물 등록
        </Link>
      </div>

      <form className="mb-6 flex flex-wrap gap-2 text-sm">
        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded border border-black/20 px-3 py-2 dark:border-white/20"
        >
          <option value="">전체 카테고리</option>
          <option value="USED_CAR">중고차</option>
          <option value="PART">부품</option>
        </select>
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="제목/차종 검색"
          className="flex-1 rounded border border-black/20 px-3 py-2 dark:border-white/20"
        />
        <input
          type="number"
          name="minPrice"
          defaultValue={minPrice}
          placeholder="최소 가격"
          className="w-32 rounded border border-black/20 px-3 py-2 dark:border-white/20"
        />
        <input
          type="number"
          name="maxPrice"
          defaultValue={maxPrice}
          placeholder="최대 가격"
          className="w-32 rounded border border-black/20 px-3 py-2 dark:border-white/20"
        />
        <button
          type="submit"
          className="rounded border border-black/20 px-3 py-2 dark:border-white/20"
        >
          검색
        </button>
      </form>

      {listings.length === 0 ? (
        <p className="py-10 text-center text-sm text-black/50 dark:text-white/50">
          매물이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/market/${listing.id}`}
              className="rounded-lg border border-black/10 p-4 transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
            >
              {listing.images[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="mb-3 h-40 w-full rounded object-cover"
                />
              )}
              <div className="mb-1 flex items-center gap-2 text-xs">
                <span className="rounded bg-black/5 px-2 py-0.5 dark:bg-white/10">
                  {CATEGORY_LABEL[listing.category]}
                </span>
                <span className="text-black/50 dark:text-white/50">
                  {STATUS_LABEL[listing.status]}
                </span>
              </div>
              <h2 className="mb-1 font-semibold">{listing.title}</h2>
              <p className="font-bold">{listing.price.toLocaleString("ko-KR")}원</p>
              {listing.carModel && (
                <p className="text-xs text-black/50 dark:text-white/50">
                  {listing.carModel}
                  {listing.carYear ? ` · ${listing.carYear}년식` : ""}
                </p>
              )}
              {listing.location && (
                <p className="text-xs text-black/50 dark:text-white/50">{listing.location}</p>
              )}
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildPageHref(p)}
              className={`rounded px-3 py-1 ${
                p === page
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "border border-black/20 dark:border-white/20"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/lib/listing-labels";
import { deleteListing, updateListingStatus } from "../actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [session, listing] = await Promise.all([
    auth(),
    prisma.listing.findUnique({
      where: { id },
      include: { seller: { select: { name: true, email: true } } },
    }),
  ]);
  if (!listing) notFound();

  const userId = session?.user?.id;
  const isSeller = userId === listing.sellerId;

  const boundUpdateStatus = updateListingStatus.bind(null, id);
  const boundDelete = deleteListing.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3 flex items-center gap-2 text-xs">
        <span className="rounded bg-black/5 px-2 py-0.5 dark:bg-white/10">
          {CATEGORY_LABEL[listing.category]}
        </span>
        <span className="text-black/50 dark:text-white/50">{STATUS_LABEL[listing.status]}</span>
      </div>

      <h1 className="mb-2 text-xl font-bold">{listing.title}</h1>
      <p className="mb-4 text-2xl font-bold">{listing.price.toLocaleString("ko-KR")}원</p>

      {listing.images.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {listing.images.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt={listing.title} className="h-32 w-full rounded object-cover" />
          ))}
        </div>
      )}

      <dl className="mb-6 grid grid-cols-2 gap-y-1 text-sm text-black/70 dark:text-white/70">
        {listing.carModel && (
          <>
            <dt className="font-medium">차종/모델</dt>
            <dd>{listing.carModel}</dd>
          </>
        )}
        {listing.carYear && (
          <>
            <dt className="font-medium">연식</dt>
            <dd>{listing.carYear}년</dd>
          </>
        )}
        {listing.mileage != null && (
          <>
            <dt className="font-medium">주행거리</dt>
            <dd>{listing.mileage.toLocaleString("ko-KR")}km</dd>
          </>
        )}
        {listing.location && (
          <>
            <dt className="font-medium">지역</dt>
            <dd>{listing.location}</dd>
          </>
        )}
      </dl>

      <div className="mb-6 whitespace-pre-wrap border-y border-black/10 py-6 dark:border-white/10">
        {listing.description}
      </div>

      <div className="mb-6 rounded border border-black/10 p-4 text-sm dark:border-white/10">
        <p className="font-medium">판매자: {listing.seller.name}</p>
        <p className="text-black/60 dark:text-white/60">{listing.seller.email}</p>
      </div>

      {isSeller && (
        <div className="flex flex-wrap items-center gap-3">
          <form action={boundUpdateStatus} className="flex items-center gap-2">
            <select
              name="status"
              defaultValue={listing.status}
              className="rounded border border-black/20 px-2 py-1.5 text-sm dark:border-white/20"
            >
              <option value="ACTIVE">판매중</option>
              <option value="RESERVED">예약중</option>
              <option value="SOLD">판매완료</option>
            </select>
            <button
              type="submit"
              className="rounded border border-black/20 px-3 py-1.5 text-sm dark:border-white/20"
            >
              상태 변경
            </button>
          </form>

          <Link
            href={`/market/${id}/edit`}
            className="rounded border border-black/20 px-3 py-1.5 text-sm dark:border-white/20"
          >
            수정
          </Link>

          <form action={boundDelete}>
            <button
              type="submit"
              className="rounded border border-black/20 px-3 py-1.5 text-sm dark:border-white/20"
            >
              삭제
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

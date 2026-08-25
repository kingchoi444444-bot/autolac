import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize";
import { deleteNews } from "../actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewsDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [session, news] = await Promise.all([
    auth(),
    prisma.newCarInfo.findUnique({ where: { id } }),
  ]);
  if (!news) notFound();

  const isAdmin = session?.user?.role === "ADMIN";
  const boundDelete = deleteNews.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-1 text-sm text-black/50 dark:text-white/50">
        {news.brand} · {news.model}
      </p>
      <h1 className="mb-4 text-xl font-bold">{news.title}</h1>

      {news.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={news.imageUrl}
          alt={news.title}
          className="mb-4 h-64 w-full rounded object-cover"
        />
      )}

      <dl className="mb-6 grid grid-cols-2 gap-y-1 text-sm text-black/70 dark:text-white/70">
        {news.price && (
          <>
            <dt className="font-medium">가격</dt>
            <dd>{news.price}</dd>
          </>
        )}
        {news.releaseDate && (
          <>
            <dt className="font-medium">출시일</dt>
            <dd>{news.releaseDate.toLocaleDateString("ko-KR")}</dd>
          </>
        )}
      </dl>

      <div
        className="prose prose-sm dark:prose-invert mb-6 max-w-none border-y border-black/10 py-6 dark:border-white/10"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(news.summary) }}
      />

      {isAdmin && (
        <div className="flex gap-3">
          <Link
            href={`/news/${id}/edit`}
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

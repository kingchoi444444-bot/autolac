import Link from "next/link";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function NewsPage() {
  const [session, newsList] = await Promise.all([
    auth(),
    prisma.newCarInfo.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">신차정보</h1>
        {isAdmin && (
          <Link
            href="/news/new"
            className="rounded bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
          >
            신차 등록
          </Link>
        )}
      </div>

      {newsList.length === 0 ? (
        <p className="py-10 text-center text-sm text-black/50 dark:text-white/50">
          등록된 신차 소식이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {newsList.map((news) => (
            <Link
              key={news.id}
              href={`/news/${news.id}`}
              className="rounded-lg border border-black/10 p-4 transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
            >
              {news.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="mb-3 h-40 w-full rounded object-cover"
                />
              )}
              <p className="mb-1 text-xs text-black/50 dark:text-white/50">
                {news.brand} · {news.model}
              </p>
              <h2 className="mb-1 font-semibold">{news.title}</h2>
              {news.price && <p className="text-sm font-medium">{news.price}</p>}
              {news.releaseDate && (
                <p className="text-xs text-black/50 dark:text-white/50">
                  출시: {news.releaseDate.toLocaleDateString("ko-KR")}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

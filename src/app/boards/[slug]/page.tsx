import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 10;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
};

export default async function BoardPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam, q } = await searchParams;

  const board = await prisma.board.findUnique({ where: { slug } });
  if (!board) notFound();

  const page = Math.max(1, Number(pageParam) || 1);
  const query = q?.trim() ?? "";

  const where = {
    boardId: board.id,
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { content: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        author: { select: { name: true } },
        _count: { select: { comments: true, likes: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{board.name}</h1>
        <Link
          href={`/boards/${slug}/new`}
          className="rounded bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          글쓰기
        </Link>
      </div>

      <form className="mb-4 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="제목/내용 검색"
          className="flex-1 rounded border border-black/20 px-3 py-2 text-sm dark:border-white/20"
        />
        <button
          type="submit"
          className="rounded border border-black/20 px-3 py-2 text-sm dark:border-white/20"
        >
          검색
        </button>
      </form>

      <div className="divide-y divide-black/10 dark:divide-white/10">
        {posts.length === 0 && (
          <p className="py-10 text-center text-sm text-black/50 dark:text-white/50">
            게시글이 없습니다.
          </p>
        )}
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/boards/${slug}/${post.id}`}
            className="flex items-center justify-between py-3 hover:underline"
          >
            <div>
              <p className="font-medium">{post.title}</p>
              <p className="text-xs text-black/50 dark:text-white/50">
                {post.author.name} · {post.createdAt.toLocaleDateString("ko-KR")} · 댓글{" "}
                {post._count.comments} · 좋아요 {post._count.likes}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/boards/${slug}?page=${p}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
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

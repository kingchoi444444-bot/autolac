import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  FREE: "자유게시판",
  CAR_MODEL: "차종별 게시판",
};

export default async function BoardsPage() {
  const boards = await prisma.board.findMany({ orderBy: { createdAt: "asc" } });

  const grouped = boards.reduce<Record<string, typeof boards>>((acc, board) => {
    (acc[board.type] ??= []).push(board);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">게시판</h1>

      {Object.entries(grouped).map(([type, list]) => (
        <section key={type} className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">{TYPE_LABEL[type] ?? type}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {list.map((board) => (
              <Link
                key={board.id}
                href={`/boards/${board.slug}`}
                className="rounded-lg border border-black/10 px-4 py-3 text-center transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
              >
                {board.name}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

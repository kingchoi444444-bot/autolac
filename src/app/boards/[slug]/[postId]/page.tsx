import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createComment,
  deleteComment,
  deletePost,
  toggleLike,
} from "../../actions";

type PageProps = {
  params: Promise<{ slug: string; postId: string }>;
};

export default async function PostDetailPage({ params }: PageProps) {
  const { slug, postId } = await params;

  const board = await prisma.board.findUnique({ where: { slug } });
  if (!board) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const post = await prisma.post.findFirst({
    where: { id: postId, boardId: board.id },
    include: {
      author: { select: { name: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true } } },
      },
      _count: { select: { likes: true } },
    },
  });
  if (!post) notFound();

  const hasLiked = userId
    ? Boolean(
        await prisma.like.findUnique({ where: { postId_userId: { postId, userId } } }),
      )
    : false;

  await prisma.post.update({ where: { id: postId }, data: { viewCount: { increment: 1 } } });

  const isAuthor = userId === post.authorId;

  const boundToggleLike = toggleLike.bind(null, slug, postId);
  const boundDeletePost = deletePost.bind(null, slug, postId);
  const boundCreateComment = createComment.bind(null, slug, postId);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-xl font-bold">{post.title}</h1>
      <p className="mb-6 text-xs text-black/50 dark:text-white/50">
        {post.author.name} · {post.createdAt.toLocaleDateString("ko-KR")} · 조회{" "}
        {post.viewCount + 1}
      </p>

      <div className="mb-6 whitespace-pre-wrap border-b border-black/10 pb-6 dark:border-white/10">
        {post.content}
      </div>

      <div className="mb-6 flex items-center gap-3">
        {userId ? (
          <form action={boundToggleLike}>
            <button
              type="submit"
              className={`rounded border px-3 py-1.5 text-sm ${
                hasLiked
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-black/20 dark:border-white/20"
              }`}
            >
              좋아요 {post._count.likes}
            </button>
          </form>
        ) : (
          <span className="text-sm text-black/50 dark:text-white/50">
            좋아요 {post._count.likes}
          </span>
        )}

        {isAuthor && (
          <>
            <Link
              href={`/boards/${slug}/${postId}/edit`}
              className="rounded border border-black/20 px-3 py-1.5 text-sm dark:border-white/20"
            >
              수정
            </Link>
            <form action={boundDeletePost}>
              <button
                type="submit"
                className="rounded border border-black/20 px-3 py-1.5 text-sm dark:border-white/20"
              >
                삭제
              </button>
            </form>
          </>
        )}
      </div>

      <section>
        <h2 className="mb-3 font-semibold">댓글 {post.comments.length}</h2>

        <div className="mb-4 flex flex-col gap-3">
          {post.comments.map((comment) => {
            const boundDeleteComment = deleteComment.bind(null, slug, postId, comment.id);
            return (
              <div
                key={comment.id}
                className="flex items-start justify-between rounded border border-black/10 p-3 text-sm dark:border-white/10"
              >
                <div>
                  <p className="mb-1 font-medium">{comment.author.name}</p>
                  <p className="whitespace-pre-wrap">{comment.content}</p>
                </div>
                {userId === comment.authorId && (
                  <form action={boundDeleteComment}>
                    <button type="submit" className="text-xs text-black/50 hover:underline dark:text-white/50">
                      삭제
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>

        {userId ? (
          <form action={boundCreateComment} className="flex gap-2">
            <input
              type="text"
              name="content"
              placeholder="댓글을 입력하세요"
              required
              className="flex-1 rounded border border-black/20 px-3 py-2 text-sm dark:border-white/20"
            />
            <button
              type="submit"
              className="rounded bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
            >
              등록
            </button>
          </form>
        ) : (
          <p className="text-sm text-black/50 dark:text-white/50">
            댓글을 작성하려면 <Link href="/login" className="underline">로그인</Link>이 필요합니다.
          </p>
        )}
      </section>
    </div>
  );
}

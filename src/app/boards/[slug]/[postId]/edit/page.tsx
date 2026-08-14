import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/post-form";
import { updatePost } from "../../../actions";

type PageProps = {
  params: Promise<{ slug: string; postId: string }>;
};

export default async function EditPostPage({ params }: PageProps) {
  const { slug, postId } = await params;

  const session = await auth();
  if (!session?.user) redirect("/login");

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) notFound();
  if (post.authorId !== session.user.id) redirect(`/boards/${slug}/${postId}`);

  const action = updatePost.bind(null, slug, postId);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-bold">글 수정</h1>
      <PostForm
        action={action}
        defaultTitle={post.title}
        defaultContent={post.content}
        submitLabel="수정 완료"
      />
    </div>
  );
}

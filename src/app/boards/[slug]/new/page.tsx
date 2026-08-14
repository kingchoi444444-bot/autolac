import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/post-form";
import { createPost } from "../../actions";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewPostPage({ params }: PageProps) {
  const { slug } = await params;

  const session = await auth();
  if (!session?.user) redirect("/login");

  const board = await prisma.board.findUnique({ where: { slug } });
  if (!board) notFound();

  const action = createPost.bind(null, slug);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-bold">{board.name} - 글쓰기</h1>
      <PostForm action={action} submitLabel="등록" />
    </div>
  );
}

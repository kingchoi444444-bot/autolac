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

export async function createPost(boardSlug: string, formData: FormData) {
  const userId = await requireUserId();

  const title = String(formData.get("title") ?? "").trim();
  const content = sanitizeHtml(String(formData.get("content") ?? "").trim());
  if (!title || !content) {
    throw new Error("제목과 내용을 모두 입력해주세요.");
  }

  const board = await prisma.board.findUnique({ where: { slug: boardSlug } });
  if (!board) throw new Error("존재하지 않는 게시판입니다.");

  const post = await prisma.post.create({
    data: { title, content, boardId: board.id, authorId: userId },
  });

  revalidatePath(`/boards/${boardSlug}`);
  redirect(`/boards/${boardSlug}/${post.id}`);
}

export async function updatePost(boardSlug: string, postId: string, formData: FormData) {
  const userId = await requireUserId();

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== userId) {
    throw new Error("수정 권한이 없습니다.");
  }

  const title = String(formData.get("title") ?? "").trim();
  const content = sanitizeHtml(String(formData.get("content") ?? "").trim());
  if (!title || !content) {
    throw new Error("제목과 내용을 모두 입력해주세요.");
  }

  await prisma.post.update({ where: { id: postId }, data: { title, content } });

  revalidatePath(`/boards/${boardSlug}/${postId}`);
  redirect(`/boards/${boardSlug}/${postId}`);
}

export async function deletePost(boardSlug: string, postId: string) {
  const userId = await requireUserId();

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== userId) {
    throw new Error("삭제 권한이 없습니다.");
  }

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath(`/boards/${boardSlug}`);
  redirect(`/boards/${boardSlug}`);
}

export async function createComment(boardSlug: string, postId: string, formData: FormData) {
  const userId = await requireUserId();

  const content = String(formData.get("content") ?? "").trim();
  if (!content) throw new Error("댓글 내용을 입력해주세요.");

  await prisma.comment.create({ data: { content, postId, authorId: userId } });

  revalidatePath(`/boards/${boardSlug}/${postId}`);
}

export async function deleteComment(boardSlug: string, postId: string, commentId: string) {
  const userId = await requireUserId();

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.authorId !== userId) {
    throw new Error("삭제 권한이 없습니다.");
  }

  await prisma.comment.delete({ where: { id: commentId } });

  revalidatePath(`/boards/${boardSlug}/${postId}`);
}

export async function toggleLike(boardSlug: string, postId: string) {
  const userId = await requireUserId();

  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({ data: { postId, userId } });
  }

  revalidatePath(`/boards/${boardSlug}/${postId}`);
}

import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NewsForm } from "@/components/news-form";
import { updateNews } from "../../actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditNewsPage({ params }: PageProps) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect(`/news/${id}`);

  const news = await prisma.newCarInfo.findUnique({ where: { id } });
  if (!news) notFound();

  const action = updateNews.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-bold">신차정보 수정</h1>
      <NewsForm action={action} submitLabel="수정 완료" defaultValues={news} />
    </div>
  );
}

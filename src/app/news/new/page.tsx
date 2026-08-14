import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { NewsForm } from "@/components/news-form";
import { createNews } from "../actions";

export default async function NewNewsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/news");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-bold">신차 등록</h1>
      <NewsForm action={createNews} submitLabel="등록" />
    </div>
  );
}

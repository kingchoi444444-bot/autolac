import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ListingForm } from "@/components/listing-form";
import { updateListing } from "../../actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user) redirect("/login");

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) notFound();
  if (listing.sellerId !== session.user.id) redirect(`/market/${id}`);

  const action = updateListing.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-bold">매물 수정</h1>
      <ListingForm action={action} submitLabel="수정 완료" defaultValues={listing} />
    </div>
  );
}

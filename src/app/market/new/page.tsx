import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ListingForm } from "@/components/listing-form";
import { createListing } from "../actions";

export default async function NewListingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-bold">매물 등록</h1>
      <ListingForm action={createListing} submitLabel="등록" />
    </div>
  );
}

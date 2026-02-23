import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import ListingGrid from "@/components/ListingGrid";
import { auth } from "@clerk/nextjs/server";
import { getProfile } from "./actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    const profile = await getProfile();
    // If profile doesn't exist (webhook failed) or is incomplete (missing phone), redirect.
    // We check for phone as a proxy for "completed profile" since the webhook only sets name/email.
    if (!profile || !profile.phone) {
      redirect("/complete-profile");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SearchSection />
        <ListingGrid />
      </main>
    </div>
  );
}

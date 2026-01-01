import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import ListingGrid from "@/components/ListingGrid";
import { getProfile } from "./actions";

export default async function Home() {
  const profile = await getProfile();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header firstName={profile?.first_name} lastName={profile?.last_name} />
      <main className="container mx-auto px-4 py-8">
        <SearchSection />
        <ListingGrid />
      </main>
    </div>
  );
}

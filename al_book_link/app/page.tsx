import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import ListingGrid from "@/components/ListingGrid";
import { getProfile, getRecentBooks, getUserBooks } from "./actions";

export default async function Home() {
  const profile = await getProfile();
  const recentBooks = await getRecentBooks();
  const userBooks = await getUserBooks();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header firstName={profile?.first_name} lastName={profile?.last_name} />
      <main className="container mx-auto px-4 py-8">
        <SearchSection />
        <ListingGrid listings={recentBooks} title="Recent Listings" />

        {userBooks && userBooks.length > 0 && (
          <>
            <hr className="my-12 border-gray-200" />
            <ListingGrid
              listings={userBooks}
              title="Your Publications"
              profile={profile}
              editable={true}
            />
          </>
        )}
      </main>
    </div>
  );
}

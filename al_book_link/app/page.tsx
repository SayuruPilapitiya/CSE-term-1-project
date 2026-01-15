import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import ListingGrid from "@/components/ListingGrid";
import Link from 'next/link';
import { getProfile, getRecentBooks, getUserBooks, getActiveDistricts } from "./actions";

// Note: In Next.js 15+, searchParams is a Promise.
export default async function Home(props: { searchParams: Promise<{ medium?: string; subject?: string; district?: string }> }) {
  const searchParams = await props.searchParams;
  const profile = await getProfile();
  const recentBooks = await getRecentBooks({
    medium: searchParams?.medium,
    subject: searchParams?.subject,
    district: searchParams?.district
  });
  const userBooks = await getUserBooks();
  const activeDistricts = await getActiveDistricts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header firstName={profile?.first_name} lastName={profile?.last_name} />
      <main className="container mx-auto px-4 py-8">
        <SearchSection activeDistricts={activeDistricts} />
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

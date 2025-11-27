import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import ListingGrid from "@/components/ListingGrid";

export default function Home() {
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

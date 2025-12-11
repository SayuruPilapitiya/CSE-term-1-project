import ListingCard from './ListingCard';

export default function ListingGrid() {
    const listings: any[] = [];

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {listings.map((listing) => (
                    <ListingCard
                        key={listing.id}
                        type={listing.type}
                        title={listing.title}
                        category={listing.category}
                        price={listing.price}
                        location={listing.location}
                        medium={listing.medium}
                        bgColor={listing.bgColor}
                    />
                ))}
            </div>
        </div>
    );
}

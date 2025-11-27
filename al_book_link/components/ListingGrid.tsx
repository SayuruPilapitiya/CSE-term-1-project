import ListingCard from './ListingCard';

export default function ListingGrid() {
    const listings = [
        {
            id: 1,
            type: "Physics Papers",
            title: "Physics Past Paper Book (2010-2023)",
            category: "Physical Science",
            price: "LKR 2,500",
            location: "Mawanella, Kegalle",
            medium: "English Medium",
            bgColor: "bg-slate-200"
        },
        {
            id: 2,
            type: "Maths Tutes",
            title: "Combined Maths Tute Set (Pure & Applied)",
            category: "Physical Science",
            price: "LKR 4,000",
            location: "Kandy, Kandy",
            medium: "Sinhala Medium",
            bgColor: "bg-slate-200"
        },
        {
            id: 3,
            type: "Bio Textbooks",
            title: "Biology New Syllabus Resource Book Set",
            category: "Biological Science",
            price: "LKR 3,000",
            location: "Nugegoda, Colombo",
            medium: "English Medium",
            bgColor: "bg-slate-200"
        },
        {
            id: 4,
            type: "Chem Tutes",
            title: "Chemistry Tute Set (English Medium)",
            category: "Biological Science",
            price: "LKR 2,200",
            location: "Warakapola, Kegalle",
            medium: "English Medium",
            bgColor: "bg-slate-200"
        }
    ];

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

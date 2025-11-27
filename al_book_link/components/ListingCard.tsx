import { MapPin, Book } from 'lucide-react';

interface ListingCardProps {
    title: string;
    category: string;
    price: string;
    location: string;
    medium: string;
    type: string;
    bgColor: string;
}

export default function ListingCard({ title, category, price, location, medium, type, bgColor }: ListingCardProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col cursor-pointer">
            <div className={`h-48 ${bgColor} flex items-center justify-center text-gray-700 font-medium text-lg`}>
                {type}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{category}</span>
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-1 line-clamp-2">{title}</h3>
                <div className="text-gray-900 font-bold text-xl mb-3">{price}</div>

                <div className="mt-auto space-y-1">
                    <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {location}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                        <Book className="h-4 w-4 mr-1" />
                        {medium}
                    </div>
                </div>
            </div>
        </div>
    );
}

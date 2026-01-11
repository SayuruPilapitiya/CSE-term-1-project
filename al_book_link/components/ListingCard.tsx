import { MapPin, Book } from 'lucide-react';

interface ListingCardProps {
    title: string;
    author?: string;
    subject?: string;
    condition?: string;
    price: string;
    location: string;
    type?: string;
    bgColor?: string;
    onClick?: () => void;
    onEdit?: () => void;
}

export default function ListingCard({ title, author, subject, condition, price, location, type = 'Book', bgColor = 'bg-blue-100', onClick, onEdit }: ListingCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col cursor-pointer h-full hover:border-blue-200 group relative"
        >

            <div className={`p-4 flex flex-col flex-grow`}>
                <div className="flex justify-between items-start mb-2">
                    {subject && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            {subject}
                        </span>
                    )}
                    <span className="text-gray-500 text-xs">{condition}</span>
                </div>

                <h3 className="text-gray-900 font-bold text-lg mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">{title}</h3>
                {author && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-1">by {author}</p>
                )}

                <div className="text-green-600 font-bold text-xl mb-3">LKR {price}</div>

                <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-end">
                    <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {location}
                    </div>

                    {onEdit && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center shadow-sm border border-blue-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                            </svg>
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

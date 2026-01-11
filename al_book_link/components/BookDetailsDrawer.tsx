
import { X, MapPin, User, Calendar, Tag, AlertCircle, Phone } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface BookDetailsDrawerProps {
    book: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function BookDetailsDrawer({ book, isOpen, onClose }: BookDetailsDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Close on click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen || !book) return null;

    const location = `${book.profiles?.towns?.name || ''}, ${book.profiles?.districts?.name || ''}`;
    const formattedDate = new Date(book.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div
            className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleBackdropClick}
        >
            <div
                ref={drawerRef}
                className={`w-full max-w-md h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside drawer
            >
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-900 line-clamp-1">Item Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    {/* Status Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {book.subject && (
                            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                                {book.subject}
                            </span>
                        )}
                        {book.medium && (
                            <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-100">
                                {book.medium}
                            </span>
                        )}
                        {book.condition && (
                            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                                {book.condition}
                            </span>
                        )}
                    </div>

                    {/* Title & Price */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{book.title}</h1>
                        <div className="text-3xl font-bold text-green-600">LKR {book.price}</div>
                    </div>

                    {/* Key Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        {book.author && (
                            <div className="col-span-2">
                                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Author</div>
                                <div className="text-gray-900 font-medium flex items-center">
                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                    {book.author}
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Location</div>
                            <div className="text-gray-900 font-medium flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                {location}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Posted</div>
                            <div className="text-gray-900 font-medium flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                {formattedDate}
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
                                Description
                            </h3>
                            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                                {book.description || "No description provided."}
                            </div>
                        </div>

                        {book.extra_details && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                                    <Tag className="h-4 w-4 mr-2 text-blue-600" />
                                    Extra Details
                                </h3>
                                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                                    {book.extra_details}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer - Call to Action */}
                <div className="p-5 border-t border-gray-100 bg-gray-50">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]">
                        <Phone className="h-5 w-5 mr-2" />
                        Contact Seller
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3">
                        Mention <strong>AL BookLink</strong> when contacting seller
                    </p>
                </div>
            </div>
        </div>
    );
}

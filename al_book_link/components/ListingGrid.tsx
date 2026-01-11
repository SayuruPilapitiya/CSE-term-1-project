'use client';

import { useState } from 'react';
import ListingCard from './ListingCard';
import BookDetailsDrawer from './BookDetailsDrawer';
import AdvertiseModal from './AdvertiseModal';

interface ListingGridProps {
    listings: any[];
    title?: string;
    profile?: any; // Add profile prop
    editable?: boolean; // Add editable prop
}

export default function ListingGrid({ listings, title = "Recent Listings", profile, editable = false }: ListingGridProps) {
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Edit state
    const [bookToEdit, setBookToEdit] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleCardClick = (book: any) => {
        setSelectedBook(book);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        // Optional: clear selected book after animation
        setTimeout(() => setSelectedBook(null), 300);
    };

    const handleEdit = (book: any) => {
        setBookToEdit(book);
        setIsEditModalOpen(true);
    }

    if (!listings || listings.length === 0) {
        return (
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
                <p className="text-gray-500">No listings found yet.</p>
            </div>
        )
    }

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {listings.map((listing) => (
                    <ListingCard
                        key={listing.id}
                        title={listing.title}
                        author={listing.author}
                        subject={listing.subject}
                        condition={listing.condition}
                        price={listing.price}
                        location={`${listing.profiles?.towns?.name || ''}, ${listing.profiles?.districts?.name || ''}`}
                        onClick={() => handleCardClick(listing)}
                        onEdit={editable ? () => handleEdit(listing) : undefined}
                    />
                ))}
            </div>

            <BookDetailsDrawer
                book={selectedBook}
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
            />

            {/* Edit Modal */}
            {profile && (
                <AdvertiseModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setBookToEdit(null);
                    }}
                    firstName={profile.first_name}
                    lastName={profile.last_name}
                    bookToEdit={bookToEdit}
                />
            )}
        </div>
    );
}

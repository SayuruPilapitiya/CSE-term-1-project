'use client';

import { Plus, BookOpen, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, SignOutButton } from '@clerk/nextjs';
import { useState } from 'react';
import AdvertiseModal from './AdvertiseModal';

export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <header className="bg-white border-b border-gray-200 py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <span>A/L BookLink</span>
                </Link>

                <div className="flex items-center gap-4">
                    <SignedOut>
                        <Link href="/sign-in" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors cursor-pointer">
                            <Plus className="h-5 w-5" />
                            Sign in to advertise your book
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <Link href="/my-ads" className="text-gray-600 hover:text-gray-900 font-medium">
                            My Advertisements
                        </Link>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors cursor-pointer"
                        >
                            <Plus className="h-5 w-5" />
                            Advertise your books
                        </button>

                        <div className="relative group">
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-10 w-10"
                                    }
                                }}
                            >
                                <UserButton.MenuItems>
                                    <UserButton.Action label="Profile" labelIcon={<User className="h-4 w-4" />} onClick={() => window.location.href = '/profile'} />
                                    <UserButton.Action label="manageAccount" />
                                    <UserButton.Action label="signOut" />
                                </UserButton.MenuItems>
                            </UserButton>
                        </div>
                    </SignedIn>
                </div>
            </div>

            <AdvertiseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </header>
    );
}

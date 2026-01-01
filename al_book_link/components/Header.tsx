'use client';

import { Plus, BookOpen, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, SignOutButton } from '@clerk/nextjs';
import { useState } from 'react';
import AdvertiseModal from './AdvertiseModal';

interface HeaderProps {
    firstName?: string | null;
}

export default function Header({ firstName }: HeaderProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <header className="bg-white border-b border-gray-200 py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <div className="flex flex-col gap-1">
                        <span className="text-xl font-bold text-gray-900">A/L BookLink</span>
                        {firstName && (
                            <span className="text-xl font-bold text-blue-600">
                                Welcome {firstName}
                            </span>
                        )}
                    </div>
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

                        <Link
                            href="/profile"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors cursor-pointer"
                        >
                            <User className="h-5 w-5" />
                            My Profile
                        </Link>

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

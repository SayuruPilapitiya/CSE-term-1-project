'use client';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchSection({ activeDistricts = [] }: { activeDistricts?: string[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentMedium = searchParams.get('medium');

    // Local state for filters controlled by the "Search" button
    const [subject, setSubject] = useState(searchParams.get('subject') || '');
    const [district, setDistrict] = useState(searchParams.get('district') || '');

    const handleMediumClick = (medium: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (currentMedium === medium) {
            params.delete('medium'); // Deselect if already selected
        } else {
            params.set('medium', medium);
        }

        router.push(`/?${params.toString()}`);
    };

    const handleAllClick = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('medium');
        router.push(`/?${params.toString()}`);
    };

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (subject && subject !== 'All Subjects') {
            params.set('subject', subject);
        } else {
            params.delete('subject');
        }

        if (district && district !== 'All Districts') {
            params.set('district', district);
        } else {
            params.delete('district');
        }

        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Find the books you need</h2>
            <div className="flex gap-2 mb-6">
                <button
                    onClick={handleAllClick}
                    className={`px-6 py-2 rounded-full text-sm font-medium shadow-sm transition-colors ${!currentMedium
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    All Mediums
                </button>
                <button
                    onClick={() => handleMediumClick('Sinhala')}
                    className={`px-6 py-2 rounded-full text-sm font-medium shadow-sm transition-colors ${currentMedium === 'Sinhala'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    Sinhala Medium
                </button>
                <button
                    onClick={() => handleMediumClick('English')}
                    className={`px-6 py-2 rounded-full text-sm font-medium shadow-sm transition-colors ${currentMedium === 'English'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    English Medium
                </button>
                <button
                    onClick={() => handleMediumClick('Tamil')}
                    className={`px-6 py-2 rounded-full text-sm font-medium shadow-sm transition-colors ${currentMedium === 'Tamil'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    Tamil Medium
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Subject Dropdown */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Subject</label>
                    <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="bg-gray-100 border-none rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option>All Subjects</option>
                        <option>Maths</option>
                        <option>Bio</option>
                        <option>Physics</option>
                        <option>Chemistry</option>
                        <option>I.T</option>
                        <option>Arts</option>
                        <option>Commerce</option>
                        <option>Other</option>
                    </select>
                </div>

                {/* District Dropdown */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">District</label>
                    <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="bg-gray-100 border-none rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option>All Districts</option>
                        {activeDistricts.map((dist) => (
                            <option key={dist} value={dist}>{dist}</option>
                        ))}
                    </select>
                </div>

                {/* Spacer to align search button to right if needed, or keep it consistent */}
                <div className="hidden md:block"></div>

                <div className="flex items-end">
                    <button
                        onClick={handleSearch}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer"
                    >
                        <Search className="h-5 w-5" />
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}

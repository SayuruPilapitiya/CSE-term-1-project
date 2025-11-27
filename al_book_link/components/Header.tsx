import { Plus, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-200 py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <span>A/L BookLink</span>
                </Link>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors cursor-pointer">
                    <Plus className="h-5 w-5" />
                    Post an Ad
                </button>
            </div>
        </header>
    );
}

import { Search } from 'lucide-react';

export default function SearchSection() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Find the books you need</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Stream</label>
                    <select className="bg-gray-100 border-none rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none">
                        <option>All Streams</option>
                        <option>Physical Science</option>
                        <option>Biological Science</option>
                        <option>Commerce</option>
                        <option>Arts</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Subject</label>
                    <select className="bg-gray-100 border-none rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none">
                        <option>All Subjects</option>
                        <option>Physics</option>
                        <option>Chemistry</option>
                        <option>Combined Maths</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">District</label>
                    <select className="bg-gray-100 border-none rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none">
                        <option>All Districts</option>
                        <option>Colombo</option>
                        <option>Kandy</option>
                        <option>Galle</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Medium</label>
                    <select className="bg-gray-100 border-none rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none">
                        <option>All Mediums</option>
                        <option>Sinhala</option>
                        <option>English</option>
                        <option>Tamil</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer">
                        <Search className="h-5 w-5" />
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}

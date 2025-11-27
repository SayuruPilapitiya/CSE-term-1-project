'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { createBooks } from '../app/actions';

interface AdvertiseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface BookData {
    title: string;
    author: string;
    price: string;
    condition: string;
    subject: string;
    description: string;
    extra_details: string;
}

const initialBookState: BookData = {
    title: '',
    author: '',
    price: '',
    condition: 'Used',
    subject: '',
    description: '',
    extra_details: ''
};

export default function AdvertiseModal({ isOpen, onClose }: AdvertiseModalProps) {
    const [currentBook, setCurrentBook] = useState<BookData>(initialBookState);
    const [bookList, setBookList] = useState<BookData[]>([]);
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentBook(prev => ({ ...prev, [name]: value }));
    };

    const handleAddBook = () => {
        if (!currentBook.title || !currentBook.price || !currentBook.description) {
            alert('Please fill in at least Title, Price, and Description.');
            return;
        }
        setBookList(prev => [...prev, currentBook]);
        setCurrentBook(initialBookState);
    };

    const handleRemoveBook = (index: number) => {
        setBookList(prev => prev.filter((_, i) => i !== index));
    };

    const handlePublish = async () => {
        if (bookList.length === 0 && (!currentBook.title || !currentBook.price)) {
            alert('Please add at least one book.');
            return;
        }

        setSubmitting(true);
        try {
            // If there's data in the form that hasn't been added to the list yet, include it
            let finalBookList = [...bookList];
            if (currentBook.title && currentBook.price) {
                finalBookList.push(currentBook);
            }

            const response = await createBooks(finalBookList);

            if (response.success) {
                alert('Advertisements published successfully!');
                setBookList([]);
                setCurrentBook(initialBookState);
                onClose();
            } else {
                alert(`Failed to publish: ${response.error}`);
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-4xl m-4 p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Advertise Your Books</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Add New Book</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={currentBook.title}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                placeholder="e.g. Combined Maths 2020"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={currentBook.author}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price (LKR)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={currentBook.price}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={currentBook.subject}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Condition</label>
                                <select
                                    name="condition"
                                    value={currentBook.condition}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                >
                                    <option value="New">New</option>
                                    <option value="Used">Used</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={currentBook.description}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Extra Details</label>
                            <textarea
                                name="extra_details"
                                value={currentBook.extra_details}
                                onChange={handleChange}
                                rows={2}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>

                        <button
                            onClick={handleAddBook}
                            className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Plus className="h-4 w-4" />
                            Add to Batch
                        </button>
                    </div>

                    {/* List Section */}
                    <div className="flex flex-col h-full">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Books to Publish ({bookList.length})</h3>

                        <div className="flex-1 overflow-y-auto bg-gray-50 rounded-md p-4 space-y-4 min-h-[300px]">
                            {bookList.length === 0 ? (
                                <p className="text-gray-500 text-center mt-10">No books added yet.</p>
                            ) : (
                                bookList.map((book, index) => (
                                    <div key={index} className="bg-white p-4 rounded shadow-sm border border-gray-200 relative">
                                        <button
                                            onClick={() => handleRemoveBook(index)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        <h4 className="font-bold text-gray-900">{book.title}</h4>
                                        <p className="text-sm text-gray-600">by {book.author}</p>
                                        <p className="text-sm font-medium text-blue-600 mt-1">LKR {book.price}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={handlePublish}
                                disabled={submitting || (bookList.length === 0 && !currentBook.title)}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {submitting ? 'Publishing...' : 'Publish All Advertisements'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

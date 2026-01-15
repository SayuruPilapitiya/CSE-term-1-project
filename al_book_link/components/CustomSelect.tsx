'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    id: string | number;
    name: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    required?: boolean;
    id?: string;
}

export default function CustomSelect({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    label,
    disabled = false,
    required = false,
    id
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => String(opt.id) === String(value));

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (optionId: string | number) => {
        onChange(String(optionId));
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <button
                type="button"
                id={id}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    relative w-full rounded-md border text-left cursor-default sm:text-sm p-3 flex items-center justify-between
                    bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                    ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'border-gray-300 text-black hover:border-gray-400'}
                `}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={`block truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </span>
            </button>

            {isOpen && !disabled && (
                <ul
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    tabIndex={-1}
                    role="listbox"
                >
                    {options.length === 0 ? (
                        <li className="text-gray-500 cursor-default select-none py-2 pl-3 pr-9">
                            No options available
                        </li>
                    ) : (
                        options.map((option) => {
                            const isSelected = String(option.id) === String(value);
                            return (
                                <li
                                    key={option.id}
                                    className={`
                                        text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-100 transition-colors
                                        ${isSelected ? 'bg-blue-50' : ''}
                                    `}
                                    id={`listbox-option-${option.id}`}
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => handleSelect(option.id)}
                                >
                                    <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                                        {option.name}
                                    </span>
                                    {isSelected && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                            <Check className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                    )}
                                </li>
                            );
                        })
                    )}
                </ul>
            )}
        </div>
    );
}

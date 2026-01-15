import { X, User, Phone, MapPin, MessageCircle } from 'lucide-react';

interface SellerDetailsModalProps {
    seller: {
        first_name?: string;
        phone_number?: string;
        phone_number_2?: string;
        is_whatsapp_primary?: boolean;
        is_whatsapp_secondary?: boolean;
        districts?: { name: string };
        towns?: { name: string };
    };
    isOpen: boolean;
    onClose: () => void;
}

export default function SellerDetailsModal({ seller, isOpen, onClose }: SellerDetailsModalProps) {
    if (!isOpen) return null;

    const location = `${seller.towns?.name || ''}, ${seller.districts?.name || ''}`;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Seller Details</h2>
                    <p className="text-sm text-gray-500 mt-1">{seller.first_name}</p>
                </div>

                <div className="space-y-4">
                    {/* Location */}
                    <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</div>
                            <div className="text-gray-900 font-medium">{location}</div>
                        </div>
                    </div>

                    {/* Primary Phone */}
                    {seller.phone_number && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Primary Phone</div>
                                    <div className="text-gray-900 font-medium">{seller.phone_number}</div>
                                </div>
                            </div>
                            {seller.is_whatsapp_primary && (
                                <div className="flex flex-col items-center">
                                    <MessageCircle className="w-5 h-5 text-green-500" />
                                    <span className="text-[10px] text-green-600 font-medium">WhatsApp</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Secondary Phone */}
                    {seller.phone_number_2 && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Secondary Phone</div>
                                    <div className="text-gray-900 font-medium">{seller.phone_number_2}</div>
                                </div>
                            </div>
                            {seller.is_whatsapp_secondary && (
                                <div className="flex flex-col items-center">
                                    <MessageCircle className="w-5 h-5 text-green-500" />
                                    <span className="text-[10px] text-green-600 font-medium">WhatsApp</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-xl transition-colors"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}

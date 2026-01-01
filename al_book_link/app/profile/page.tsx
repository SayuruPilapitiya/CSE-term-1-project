'use client';

import { useState, useEffect } from 'react';
import { getDistricts, getTowns, getProfile, updateProfile } from '../actions';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [districts, setDistricts] = useState<any[]>([]);
  const [towns, setTowns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [initialData, setInitialData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    secondaryPhone: '',
    district: '',
    town: '',
    isWhatsappPrimary: false,
    isWhatsappSecondary: false
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    secondaryPhone: '',
    district: '',
    town: '',
    isWhatsappPrimary: false,
    isWhatsappSecondary: false
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    async function loadData() {
      const [districtsData, profileData] = await Promise.all([
        getDistricts(),
        getProfile()
      ]);

      setDistricts(districtsData || []);

      if (profileData) {
        const data = {
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          phone: profileData.phone_number || '',
          secondaryPhone: profileData.phone_number_2 || '',
          district: profileData.district_id ? String(profileData.district_id) : '',
          town: profileData.town_id ? String(profileData.town_id) : '',
          isWhatsappPrimary: profileData.is_whatsapp_primary || false,
          isWhatsappSecondary: profileData.is_whatsapp_secondary || false
        };
        setFormData(data);
        setInitialData(data);

        // If we have a district, load its towns
        if (profileData.district_id) {
          const townsData = await getTowns(profileData.district_id);
          setTowns(townsData || []);
        }
      }

      setLoading(false);
    }

    if (isSignedIn) {
      loadData();
    }
  }, [isSignedIn]);

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;

    setFormData(prev => ({ ...prev, district: districtId, town: '' }));

    if (districtId) {
      const townsData = await getTowns(parseInt(districtId));
      setTowns(townsData || []);
    } else {
      setTowns([]);
    }
  };

  const handleTownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const townId = e.target.value;
    setFormData(prev => ({ ...prev, town: townId }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('phone', formData.phone);
      data.append('secondaryPhone', formData.secondaryPhone);
      data.append('district', formData.district);
      data.append('town', formData.town);
      data.append('isWhatsappPrimary', String(formData.isWhatsappPrimary));
      data.append('isWhatsappSecondary', String(formData.isWhatsappSecondary));

      await updateProfile(data);
      setMessage('Profile updated successfully!');
      setInitialData(formData);
    } catch (error) {
      console.error(error);
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto bg-white p-8 rounded-lg shadow-md">

        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Edit Profile
        </h2>

        {message && (
          <div className={`p-4 mb-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* First Name - Compulsory */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border text-black"
              />
            </div>

            {/* Last Name - Not Compulsory */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border text-black"
              />
            </div>

            {/* Primary Phone - Compulsory */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Primary Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="e.g. 0771234567"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border text-black"
              />
              <div className="mt-2 flex items-center">
                <input
                  id="isWhatsappPrimary"
                  name="isWhatsappPrimary"
                  type="checkbox"
                  checked={formData.isWhatsappPrimary}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isWhatsappPrimary" className="ml-2 block text-sm text-gray-900">
                  Available in WhatsApp
                </label>
              </div>
            </div>

            {/* Secondary Phone - Not Compulsory */}
            <div>
              <label htmlFor="secondaryPhone" className="block text-sm font-medium text-gray-700">
                Secondary Phone Number
              </label>
              <input
                type="tel"
                name="secondaryPhone"
                id="secondaryPhone"
                value={formData.secondaryPhone}
                onChange={handleChange}
                placeholder="e.g. 0711234567"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border text-black"
              />
              <div className="mt-2 flex items-center">
                <input
                  id="isWhatsappSecondary"
                  name="isWhatsappSecondary"
                  type="checkbox"
                  checked={formData.isWhatsappSecondary}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isWhatsappSecondary" className="ml-2 block text-sm text-gray-900">
                  Available in WhatsApp
                </label>
              </div>
            </div>

            {/* District - Not Compulsory (Dropdown) */}
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                District
              </label>
              <select
                name="district"
                id="district"
                onChange={handleDistrictChange}
                value={formData.district}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border text-black"
              >
                <option value="">Select a District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Town - Not Compulsory (Dropdown) */}
            <div>
              <label htmlFor="town" className="block text-sm font-medium text-gray-700">
                Town
              </label>
              <select
                name="town"
                id="town"
                disabled={!towns.length}
                onChange={handleTownChange}
                value={formData.town}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border disabled:bg-gray-100 text-black"
              >
                <option value="">Select a Town</option>
                {towns.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="flex items-center justify-between pt-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              &larr; Back to Home
            </Link>
            {hasChanges && (
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Update Profile'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
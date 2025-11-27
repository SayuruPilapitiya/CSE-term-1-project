'use client';

import { useState, useEffect } from 'react';
import { getDistricts, getTowns, getProfile, updateProfile } from '../actions';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [districts, setDistricts] = useState<any[]>([]);
  const [towns, setTowns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    district: '',
    town: ''
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
        setFormData({
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          phone: profileData.phone || '',
          district: profileData.district || '',
          town: profileData.town || ''
        });

        // If we have a district, load its towns
        if (profileData.district) {
          // We need the ID to fetch towns. 
          // Since we store names, we need to find the ID from the districts list.
          // However, we just fetched districts.
          const districtObj = (districtsData || []).find((d: any) => d.name === profileData.district);
          if (districtObj) {
            const townsData = await getTowns(districtObj.id);
            setTowns(townsData || []);
          }
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
    const districtName = e.target.options[e.target.selectedIndex].text;

    setFormData(prev => ({ ...prev, district: districtName, town: '' }));

    if (districtId) {
      const townsData = await getTowns(parseInt(districtId));
      setTowns(townsData || []);
    } else {
      setTowns([]);
    }
  };

  const handleTownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const townName = e.target.options[e.target.selectedIndex].text;
    setFormData(prev => ({ ...prev, town: townName }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      data.append('district', formData.district);
      data.append('town', formData.town);

      await updateProfile(data);
      setMessage('Profile updated successfully!');
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Edit Profile
        </h2>

        {message && (
          <div className={`p-4 mb-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>

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
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700">
              District
            </label>
            <select
              name="district"
              id="district"
              required
              onChange={handleDistrictChange}
              // We need to match the district NAME to the option value if we want it selected.
              // But the option value is ID.
              // So we need to find the ID corresponding to the name in formData.district
              value={districts.find(d => d.name === formData.district)?.id || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            >
              <option value="">Select a District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="town" className="block text-sm font-medium text-gray-700">
              Town
            </label>
            <select
              name="town"
              id="town"
              required
              disabled={!towns.length}
              onChange={handleTownChange}
              // Similar logic for town
              value={towns.find(t => t.town_name === formData.town)?.town_id || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
            >
              <option value="">Select a Town</option>
              {towns.map((t) => (
                <option key={t.town_id} value={t.town_id}>
                  {t.town_name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
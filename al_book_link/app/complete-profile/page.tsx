'use client';

import { useState, useEffect } from 'react';
import { getDistricts, getTowns, createProfile } from '../actions';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function CompleteProfile() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [districts, setDistricts] = useState<any[]>([]);
  const [towns, setTowns] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    async function loadDistricts() {
      const data = await getDistricts();
      setDistricts(data || []);
      setLoading(false);
    }
    loadDistricts();
  }, []);

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    const districtName = e.target.options[e.target.selectedIndex].text;
    setSelectedDistrict(districtName); // Store name for submission if needed, or ID depending on DB schema. 
    // The prompt says "district text null", so likely storing the name.
    // But towns query needs ID.

    // Wait, the prompt says "after selecting one district only the towns related to that district will be shown".
    // And the DB schema for towns has district_id.
    // So I need the ID to fetch towns.

    if (districtId) {
      const townsData = await getTowns(parseInt(districtId));
      setTowns(townsData || []);
    } else {
      setTowns([]);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true);
    try {
      // We need to append the district NAME and town NAME if the DB expects text.
      // The form select values might be IDs.
      // Let's check the schema again.
      // profiles: district text null, town text null.
      // districts: id, name.
      // towns: town_id, town_name, district_id.

      // So we should store the NAMES in the profiles table.

      const districtSelect = document.getElementById('district') as HTMLSelectElement;
      const townSelect = document.getElementById('town') as HTMLSelectElement;

      const districtName = districtSelect.options[districtSelect.selectedIndex].text;
      const townName = townSelect.options[townSelect.selectedIndex].text;

      formData.set('district', districtName);
      formData.set('town', townName);

      await createProfile(formData);
    } catch (error) {
      console.error(error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoaded || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Complete Your Profile
        </h2>
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
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
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700">
              District
            </label>
            <select
              name="district_id" // Use a temporary name, we'll override 'district' in handleSubmit
              id="district"
              required
              onChange={handleDistrictChange}
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
              name="town_id" // Use a temporary name
              id="town"
              required
              disabled={!towns.length}
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
            disabled={submitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Details'}
          </button>
        </form>
      </div>
    </div>
  );
}

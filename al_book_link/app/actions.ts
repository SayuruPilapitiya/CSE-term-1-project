'use server'

import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function getDistricts() {
    // Public data, safe to use anon client if policy allows, or admin if not.
    // Using admin to ensure it works regardless of RLS for public data.
    const { data, error } = await supabaseAdmin
        .from('districts')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching districts:', JSON.stringify(error, null, 2));
        return [];
    }

    return data;
}

export async function getTowns(districtId: number) {
    const { data, error } = await supabaseAdmin
        .from('towns')
        .select('*')
        .eq('district_id', districtId)
        .order('town_name');

    if (error) {
        console.error('Error fetching towns:', JSON.stringify(error, null, 2));
        return [];
    }

    return data;
}

export async function createProfile(formData: FormData) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error('User not authenticated');
    }

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const district = formData.get('district') as string;
    const town = formData.get('town') as string;
    const phone = formData.get('phone') as string;
    const email = user.emailAddresses[0].emailAddress;

    console.log('Attempting to create/update profile for:', userId);

    // Use upsert to handle cases where webhook might have already created the user
    // or if the user is retrying.
    const { error } = await supabaseAdmin
        .from('profiles')
        .upsert({
            user_id: userId,
            first_name: firstName,
            last_name: lastName,
            email: email,
            district: district,
            town: town,
            phone: phone,
        }, { onConflict: 'user_id' });

    if (error) {
        console.error('Error creating profile:', JSON.stringify(error, null, 2));
        throw new Error(`Failed to create profile: ${error.message}`);
    }

    redirect('/');
}

export async function getProfile() {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        // If the error is "PGRST116" (JSON object requested, multiple (or no) rows returned),
        // it just means the profile doesn't exist yet, which is fine.
        if (error.code === 'PGRST116') {
            return null;
        }
        console.error('Error fetching profile:', JSON.stringify(error, null, 2));
        return null;
    }

    return data;
}

export async function updateProfile(formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('User not authenticated');
    }

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const district = formData.get('district') as string;
    const town = formData.get('town') as string;
    const phone = formData.get('phone') as string;

    const { error } = await supabaseAdmin
        .from('profiles')
        .update({
            first_name: firstName,
            last_name: lastName,
            district: district,
            town: town,
            phone: phone,
        })
        .eq('user_id', userId);

    if (error) {
        console.error('Error updating profile:', JSON.stringify(error, null, 2));
        throw new Error('Failed to update profile');
    }

    return { success: true };
}

export async function createBooks(books: any[]) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: 'User not authenticated' };
    }

    // Fetch user profile to get seller details
    const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('district, town, phone')
        .eq('user_id', userId)
        .single();

    if (profileError || !profile) {
        console.error('Error fetching profile for book creation:', JSON.stringify(profileError, null, 2));
        return { success: false, error: 'Failed to fetch seller details. Please complete your profile first.' };
    }

    const booksToInsert = books.map(book => ({
        ...book,
        seller_id: userId,
        district: profile.district,
        town: profile.town,
        seller_phone: profile.phone
    }));

    const { error } = await supabaseAdmin
        .from('books')
        .insert(booksToInsert);

    if (error) {
        console.error('Error creating books:', JSON.stringify(error, null, 2));
        return { success: false, error: 'Failed to publish advertisements. Database error.' };
    }

    return { success: true };
}

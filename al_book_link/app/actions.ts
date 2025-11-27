'use server'

import { supabase } from '@/lib/supabase';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function getDistricts() {
    const { data, error } = await supabase
        .from('districts')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching districts:', error);
        return [];
    }

    return data;
}

export async function getTowns(districtId: number) {
    const { data, error } = await supabase
        .from('towns')
        .select('*')
        .eq('district_id', districtId)
        .order('town_name');

    if (error) {
        console.error('Error fetching towns:', error);
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

    const { error } = await supabase
        .from('profiles')
        .insert({
            user_id: userId,
            first_name: firstName,
            last_name: lastName,
            email: email,
            district: district,
            town: town,
            phone: phone,
        });

    if (error) {
        console.error('Error creating profile:', error);
        throw new Error('Failed to create profile');
    }

    redirect('/');
}

export async function getProfile() {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
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

    const { error } = await supabase
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
        console.error('Error updating profile:', error);
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
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('district, town, phone')
        .eq('user_id', userId)
        .single();

    if (profileError || !profile) {
        console.error('Error fetching profile for book creation:', profileError);
        return { success: false, error: 'Failed to fetch seller details. Please complete your profile first.' };
    }

    const booksToInsert = books.map(book => ({
        ...book,
        seller_id: userId,
        district: profile.district,
        town: profile.town,
        seller_phone: profile.phone
    }));

    const { error } = await supabase
        .from('books')
        .insert(booksToInsert);

    if (error) {
        console.error('Error creating books:', error);
        return { success: false, error: 'Failed to publish advertisements. Database error.' };
    }

    return { success: true };
}

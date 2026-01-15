'use server'

import { supabase, supabaseAdmin } from '@/lib/supabase';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// --- READ-ONLY FUNCTIONS (Keep using public 'supabase' client) ---

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
        .order('name');

    if (error) {
        console.error('Error fetching towns:', error);
        return [];
    }

    // Filter out duplicates based on town name
    const uniqueTowns = (data || []).filter((town, index, self) =>
        index === self.findIndex((t) => t.name === town.name)
    );

    return uniqueTowns;
}


export async function getRecentBooks(filters?: { medium?: string }) {
    let query = supabase
        .from('books')
        .select(`
            id,
            title,
            author,
            price,
            subject,
            condition,
            description,
            extra_details,
            medium,
            created_at,
            seller_id,
            profiles (
                first_name,
                phone_number,
                phone_number_2,
                is_whatsapp_primary,
                is_whatsapp_secondary,
                districts (name),
                towns (name)
            )
        `)
        .order('created_at', { ascending: false })
        .limit(8);

    if (filters?.medium) {
        query = query.eq('medium', filters.medium);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching recent books:', error);
        return [];
    }

    return data;
}

export async function getUserBooks() {
    const { userId } = await auth();
    if (!userId) return [];

    const { data, error } = await supabase
        .from('books')
        .select(`
            id,
            title,
            author,
            price,
            subject,
            condition,
            description,
            extra_details,
            medium,
            created_at,
            seller_id,
            profiles (
                first_name,
                phone_number,
                phone_number_2,
                is_whatsapp_primary,
                is_whatsapp_secondary,
                districts (name),
                towns (name)
            )
        `)
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user books:', error);
        return [];
    }

    return data;
}

// --- WRITE FUNCTIONS (Switch to 'supabaseAdmin') ---

export async function createProfile(formData: FormData) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) throw new Error('User not authenticated');

    const adminClient = supabaseAdmin;
    if (!adminClient) throw new Error('Server Error: Admin Key missing');

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    // Handle parsing carefully in case values are empty
    const districtStr = formData.get('district') as string;
    const townStr = formData.get('town') as string;
    const districtId = districtStr ? parseInt(districtStr) : null;
    const townId = townStr ? parseInt(townStr) : null;
    const phone = formData.get('phone') as string;
    const secondaryPhone = formData.get('secondaryPhone') as string;
    const isWhatsappPrimary = formData.get('isWhatsappPrimary') === 'true';
    const isWhatsappSecondary = formData.get('isWhatsappSecondary') === 'true';
    const email = user.emailAddresses[0].emailAddress;

    // 🛑 Validation: Ensure we have valid integers for foreign keys
    if (!districtId || !townId) {
        throw new Error('Please select both a District and a Town');
    }

    // 👇 FIXED: Changed 'user_id' to 'id'
    const { error } = await adminClient
        .from('profiles')
        .insert({
            id: userId, // <--- Correct Column Name
            first_name: firstName,
            last_name: lastName,
            email: email,
            district_id: districtId,
            town_id: townId,
            phone_number: phone,
            phone_number_2: secondaryPhone || null,
            is_whatsapp_primary: isWhatsappPrimary,
            is_whatsapp_secondary: isWhatsappSecondary
        });

    if (error) {
        console.error('Error creating profile:', error);
        throw new Error('Failed to create profile: ' + error.message);
    }

    redirect('/');
}

export async function getProfile() {
    const { userId } = await auth();
    if (!userId) return null;

    const adminClient = supabaseAdmin;
    if (!adminClient) return null;

    // 👇 FIXED: Changed 'user_id' to 'id'
    const { data, error } = await adminClient
        .from('profiles')
        .select(`
            *,
            districts (name),
            towns (name)
        `)
        .eq('id', userId) // <--- Correct Column Name
        .single();

    if (error) {
        return null;
    }
    return data;
}

export async function updateProfile(formData: FormData) {
    const { userId } = await auth();
    const user = await currentUser(); // Get user details for email

    if (!userId || !user) throw new Error('User not authenticated');

    const adminClient = supabaseAdmin;
    if (!adminClient) throw new Error('Server Error: Admin Key missing');

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const districtStr = formData.get('district') as string;
    const townStr = formData.get('town') as string;
    const districtId = districtStr ? parseInt(districtStr) : NaN;
    const townId = townStr ? parseInt(townStr) : NaN;
    const phone = formData.get('phone') as string;
    const secondaryPhone = formData.get('secondaryPhone') as string;
    const isWhatsappPrimary = formData.get('isWhatsappPrimary') === 'true';
    const isWhatsappSecondary = formData.get('isWhatsappSecondary') === 'true';
    const email = user.emailAddresses[0].emailAddress;

    // 1. Build the Data Object
    const profileData: any = {
        id: userId, // 👈 CRITICAL: Must match the Primary Key for Upsert
        first_name: firstName,
        last_name: lastName,
        email: email, // Save email in case this is a new row
        phone_number: phone,
        phone_number_2: secondaryPhone || null,
        is_whatsapp_primary: isWhatsappPrimary,
        is_whatsapp_secondary: isWhatsappSecondary,
        updated_at: new Date().toISOString(),
    };

    // 2. Validate & Add Foreign Keys
    // (If this is a NEW row, these are required by your DB schema)
    if (!isNaN(districtId)) {
        profileData.district_id = districtId;
    }
    if (!isNaN(townId)) {
        profileData.town_id = townId;
    }

    // 3. Perform UPSERT (Create if missing, Update if exists)
    const { error } = await adminClient
        .from('profiles')
        .upsert(profileData); // 👈 Changed from .update()

    if (error) {
        console.error('Error saving profile:', JSON.stringify(error, null, 2));
        throw new Error('Failed to save profile: ' + error.message);
    }
}

export async function createBooks(books: any[]) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'User not authenticated' };

    const adminClient = supabaseAdmin;
    if (!adminClient) return { success: false, error: 'Server Error' };

    // 👇 FIXED: Changed 'user_id' to 'id' for fetching seller profile
    const { data: profile, error: profileError } = await adminClient
        .from('profiles')
        .select('district_id, town_id, phone_number, districts(name), towns(name)')
        .eq('id', userId) // <--- Correct Column Name
        .single();

    if (profileError || !profile) {
        return { success: false, error: 'Please complete your profile first.' };
    }

    const districtName = (profile.districts as any)?.name;
    const townName = (profile.towns as any)?.name;

    const booksToInsert = books.map(book => ({
        ...book,
        seller_id: userId, // Foreign key to profiles table
        // Additional fields like district, town, seller_phone are fetched via join on seller_id
    }));

    const { error } = await adminClient
        .from('books')
        .insert(booksToInsert);

    if (error) {
        console.error('Error creating books:', error);
        return { success: false, error: 'Database error.' };
    }

    return { success: true };
}

export async function updateBook(bookData: any) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'User not authenticated' };

    const adminClient = supabaseAdmin;
    if (!adminClient) return { success: false, error: 'Server Error' };

    // Verify ownership
    // We can just rely on the where clause matching both ID and seller_id for security
    const { error } = await adminClient
        .from('books')
        .update({
            title: bookData.title,
            author: bookData.author,
            price: bookData.price,
            subject: bookData.subject,
            condition: bookData.condition,
            description: bookData.description,
            extra_details: bookData.extra_details,
            medium: bookData.medium
        })
        .eq('id', bookData.id)
        .eq('seller_id', userId); // Crucial: Ensure users can only edit their own books

    if (error) {
        console.error('Error updating book:', error);
        return { success: false, error: 'Failed to update book.' };
    }

    return { success: true };
}
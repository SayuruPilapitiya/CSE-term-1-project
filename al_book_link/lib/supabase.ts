// lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Creates a Supabase client authenticated with the user's Clerk token.
 * * @param clerkToken - The JWT token from Clerk (useAuth().getToken())
 * @returns An authenticated Supabase client instance
 */
export const supabaseClient = (clerkToken: string): SupabaseClient => {
  return createClient("https://oocokhefavzkncowluey.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vY29raGVmYXZ6a25jb3dsdWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMDM3ODgsImV4cCI6MjA3ODY3OTc4OH0.KKn_pk08v9Nv5URCeiKgACzSpX1d5OfikYt1tU1hFxU", {
    global: {
      // This forces Supabase to use the Clerk user's identity
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  });
};

// lib/supabaseClient.ts
//import { createClient, SupabaseClient } from '@supabase/supabase-js';

//const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Creates a Supabase client authenticated with the user's Clerk token.
 * * @param clerkToken - The JWT token from Clerk (useAuth().getToken())
 * @returns An authenticated Supabase client instance
 */
//export const supabaseClient = (clerkToken: string): SupabaseClient => {
//  return createClient("https://oocokhefavzkncowluey.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vY29raGVmYXZ6a25jb3dsdWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMDM3ODgsImV4cCI6MjA3ODY3OTc4OH0.KKn_pk08v9Nv5URCeiKgACzSpX1d5OfikYt1tU1hFxU", {
//   global: {
//      // This forces Supabase to use the Clerk user's identity
//      headers: {
//        Authorization: `Bearer ${clerkToken}`,
//      },
//    },
//  });
//};

/*
import { createClient } from '@supabase/supabase-js';

// 1. Load keys from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 2. Check if keys are missing (helps debugging)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Missing Supabase URL or Anon Key");
}

// 3. THIS IS THE MISSING EXPORT
// We use this for fetching public data and simple database saves
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

*/


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // <--- NEW

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Missing Supabase URL or Anon Key");
}

// 1. Public Client (For Dropdowns / Reading Data)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. Admin Client (For Saving Data in Actions)
// We check if the key exists to prevent crashes on the client side
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : undefined;
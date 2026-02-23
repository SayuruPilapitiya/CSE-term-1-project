import { createClient } from '@supabase/supabase-js';

// Note: This client should only be used in server-side contexts (API routes, Server Actions)
// where the SUPABASE_SERVICE_ROLE_KEY is available and secure.
// NEVER expose the service role key to the client.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  // We throw a more descriptive error to help the user debug
  throw new Error(
    'Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file.'
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

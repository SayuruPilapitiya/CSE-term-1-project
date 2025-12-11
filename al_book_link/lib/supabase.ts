// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  "https://oocokhefavzkncowluey.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vY29raGVmYXZ6a25jb3dsdWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMDM3ODgsImV4cCI6MjA3ODY3OTc4OH0.KKn_pk08v9Nv5URCeiKgACzSpX1d5OfikYt1tU1hFxU"


);


//process.env.NEXT_PUBLIC_SUPABASE_URL!,
//process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
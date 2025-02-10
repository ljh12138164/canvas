import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env?.VITE_PUBLIC_SUPABASE_NOTE_URL || 'https://dtdgcdckrehydymmxhng.supabase.co';
const supabaseKey =
  import.meta.env?.VITE_PUBLIC_SUPABASE_NOTE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGdjZGNrcmVoeWR5bW14aG5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MTE3NDUsImV4cCI6MjA0NzM4Nzc0NX0.Ur4KYiwLKE3iYZpqfgPfKKz0ah0rElXI_VC9nrcvM70';
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseNote = createClient(supabaseUrl, supabaseKey);

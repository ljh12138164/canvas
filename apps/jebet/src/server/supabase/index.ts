import { createClient } from '@supabase/supabase-js';
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_JEBT_URL! || 'https://xllpazcrvbmwkyvnpylu.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_JEBT_ANON_KEY! ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsbHBhemNydmJtd2t5dm5weWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMzYzNTAsImV4cCI6MjA0NjYxMjM1MH0.CZTvyZTWTDSt7vncfkAd5ZYw2EU657B2PoEC7ROXdaM';

if (!supabaseUrl || !supabaseKey) throw new Error('Supabase URL or key is not set');
export const supabaseJebet = createClient(supabaseUrl, supabaseKey);

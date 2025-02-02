import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_JEBT_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_JEBT_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) throw new Error('Supabase URL or key is not set');
export const supabaseJebet = createClient(supabaseUrl, supabaseKey);

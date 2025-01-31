import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_FORM_URL!;
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_FORM_KEY!;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or key is not set');
}
export const supabaseForm = createClient(supabaseUrl, supabaseKey);

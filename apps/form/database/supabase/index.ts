import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.SUPABASE_FORM_URL;
const supabaseKey = import.meta.env.SUPABASE_FORM_ANON_KEY;
export const supabaseForm = createClient(supabaseUrl!, supabaseKey!);

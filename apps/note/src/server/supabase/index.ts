import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_NOTE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_NOTE_ANON_KEY;
export const supabaseNote = createClient(supabaseUrl!, supabaseKey!);

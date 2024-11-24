import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.PUBLIC_SUPABASE_NOTE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_NOTE_ANON_KEY;
export const supabaseNote = createClient(supabaseUrl!, supabaseKey!);

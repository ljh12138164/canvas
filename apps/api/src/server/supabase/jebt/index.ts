import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_JEBT_URL;
const supabaseKey = process.env.SUPABASE_JEBT_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);
export default supabase;

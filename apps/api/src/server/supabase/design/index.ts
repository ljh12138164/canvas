import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_DESIGN_URL;
const supabaseKey = process.env.SUPABASE_DESIGN_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);
export default supabase;

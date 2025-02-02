import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_JEBT_URL;
const supabaseKey = process.env.SUPABASE_JEBT_ANON_KEY;
export const supabaseJebt = createClient(supabaseUrl!, supabaseKey!);
export const supabaseJebtToken = (token?: string) =>
  createClient(supabaseUrl!, supabaseKey!, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

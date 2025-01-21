import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_FORM_URL;
const supabaseKey = process.env.SUPABASE_FORM_ANON_KEY;
export const supabaseForm = (token?: string) =>
  createClient(supabaseUrl!, supabaseKey!, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

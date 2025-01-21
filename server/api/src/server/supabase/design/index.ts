import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_DESIGN_URL;
const supabaseKey = process.env.SUPABASE_DESIGN_ANON_KEY;
export const supabaseDesign = (token?: string) =>
  createClient(supabaseUrl!, supabaseKey!, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

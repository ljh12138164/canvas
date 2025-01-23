import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_DESIGN_URL;
const supabaseKey = process.env.SUPABASE_DESIGN_ANON_KEY;
const supabaseSer = process.env.SUPABASE_DESIGN_SERVER_KEY;
export const supabaseDesign = (token?: string) =>
  createClient(supabaseUrl!, supabaseKey!, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

export const supabaseServiceDesign = createClient(supabaseUrl!, supabaseSer!);
export const supabaseDesignPublic = createClient(supabaseUrl!, supabaseKey!);

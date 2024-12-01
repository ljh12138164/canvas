import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_NOTE_URL;
const supabaseKey = process.env.SUPABASE_NOTE_ANON_KEY;
export const supabaseNote = (token: string) =>
  createClient(supabaseUrl!, supabaseKey!, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

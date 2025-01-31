import { createClient } from '@supabase/supabase-js';
const supabaseUrl =
  import.meta.env.VITE_PUBLIC_SUPABASE_FORM_URL! || 'https://spvppoqewfwqyzlsmtru.supabase.co';
const supabaseKey =
  import.meta.env.VITE_PUBLIC_SUPABASE_FORM_KEY! ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwdnBwb3Fld2Z3cXl6bHNtdHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4ODA4MzgsImV4cCI6MjA0OTQ1NjgzOH0.HzXRR0AG0WYAyDjH3Df4pbW7b2nR2tOcRoDr0xd3eF0';
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or key is not set');
}
export const supabaseForm = createClient(supabaseUrl, supabaseKey);

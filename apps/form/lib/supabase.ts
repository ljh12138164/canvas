import { createClient } from '@supabase/supabase-js';
export const supabaseForm = () => {
  const supabaseUrl = 'https://spvppoqewfwqyzlsmtru.supabase.co';
  const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwdnBwb3Fld2Z3cXl6bHNtdHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4ODA4MzgsImV4cCI6MjA0OTQ1NjgzOH0.HzXRR0AG0WYAyDjH3Df4pbW7b2nR2tOcRoDr0xd3eF0';
  return createClient(supabaseUrl, supabaseKey);
};

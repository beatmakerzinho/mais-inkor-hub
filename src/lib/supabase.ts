
import { createClient } from '@supabase/supabase-js';

// Use default values if env variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a mock supabase client if in development with missing credentials
const isMockClient = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

if (isMockClient) {
  console.warn('⚠️ Using mock Supabase client. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to check if we have real credentials
export const hasSupabaseCredentials = () => !isMockClient;

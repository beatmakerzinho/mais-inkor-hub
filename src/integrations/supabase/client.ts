// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zhhsswlnovdkdxiznfea.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoaHNzd2xub3Zka2R4aXpuZmVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExOTIyNjAsImV4cCI6MjA1Njc2ODI2MH0.iDBZnKqGRzDUjgD9B_C5Tr3u-3MjpmVsB5bi6a6M0i0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
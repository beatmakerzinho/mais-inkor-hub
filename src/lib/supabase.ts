
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

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

// Auth functions
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { error };
  }
};

// User management
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return { user: null, error };
  }
};

// File upload function
export const uploadFile = async (bucket: string, file: File, path: string = '') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error(`Error uploading file to ${bucket}:`, error);
    return { url: null, error };
  }
};

// Function to set up real-time notifications
export const subscribeToChannel = (channel: string, callback: (payload: any) => void) => {
  if (isMockClient) {
    console.warn('Real-time subscriptions not available in mock mode');
    return { subscription: null, error: new Error('Mock client') };
  }

  try {
    const subscription = supabase
      .channel(channel)
      .on('broadcast', { event: 'all' }, (payload) => {
        callback(payload);
      })
      .subscribe();
    
    return { subscription, error: null };
  } catch (error) {
    console.error('Error subscribing to channel:', error);
    return { subscription: null, error };
  }
};

// Helper to show toast notifications for backend operations
export const showActionResult = (result: any, successMsg: string) => {
  if (result.error) {
    toast({
      title: "Erro!",
      description: result.error.message || "Ocorreu um erro na operação",
      variant: "destructive",
    });
    return false;
  } else {
    toast({
      title: "Sucesso!",
      description: successMsg,
    });
    return true;
  }
};

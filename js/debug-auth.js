import { supabase } from './supabase-client.js';

export async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session check error:', error);
      return false;
    }
    console.log('Supabase connected successfully');
    console.log('Current session:', data.session ? 'Active' : 'None');
    return true;
  } catch (err) {
    console.error('Connection test failed:', err);
    return false;
  }
}

if (typeof window !== 'undefined') {
  window.testSupabaseConnection = testSupabaseConnection;
}

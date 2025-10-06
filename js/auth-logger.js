import { supabase } from './supabase-client.js';

export async function logAuthEvent(userId, eventType, metadata = {}) {
  try {
    const { error } = await supabase
      .from('auth_logs')
      .insert({
        user_id: userId,
        event_type: eventType,
        user_agent: navigator.userAgent,
        metadata: metadata
      });

    if (error) throw error;
  } catch (error) {
    console.error('Failed to log auth event:', error);
  }
}

export async function getUserAuthLogs(userId, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('auth_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

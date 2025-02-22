import { supabase } from '@/lib/supabase';

export interface Activity {
  id: string;
  content: string;
  date: string;
  user_id: string;
}

export async function getActivity(date: Date) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startOfDay.toISOString())
    .lte('date', endOfDay.toISOString());

  if (error) throw error;
  return data?.filter(activity => activity.content?.trim().length > 0) || [];
}

export async function saveActivity(content: string, date: Date) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data: existingActivities } = await supabase
    .from('activities')
    .select('id')
    .eq('user_id', user.id)
    .gte('date', startOfDay.toISOString())
    .lte('date', endOfDay.toISOString());

  const trimmedContent = content.trim();

  if (!trimmedContent) {
    if (existingActivities && existingActivities.length > 0) {
      await supabase
        .from('activities')
        .delete()
        .eq('id', existingActivities[0].id);
      return null;
    }
  } else {
    if (existingActivities && existingActivities.length > 0) {
      const { data } = await supabase
        .from('activities')
        .update({ content: trimmedContent })
        .eq('id', existingActivities[0].id)
        .select()
        .single();
      return data;
    } else {
      const { data } = await supabase
        .from('activities')
        .insert([{
          user_id: user.id,
          content: trimmedContent,
          date: date.toISOString(),
        }])
        .select()
        .single();
      return data;
    }
  }
}

export async function getAllActivitiesWithDates() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;
  return data?.filter(activity => activity.content?.trim().length > 0) || [];
} 
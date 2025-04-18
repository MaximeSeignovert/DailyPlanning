import { supabase } from '@/lib/supabase';
import { getCachedActivities, cacheActivities } from './offline-cache';

export interface Activity {
  id: string;
  content: string;
  date: string;
  user_id: string;
}

// Vérifier si l'application est en ligne
function isOnline() {
  return navigator.onLine;
}

export async function getActivity(date: Date, userId: string) {
  try {
    if (!isOnline()) {
      // Utiliser les données en cache si hors ligne
      const cachedActivities = getCachedActivities();
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      return cachedActivities.filter((activity: Activity) => {
        const activityDate = new Date(activity.date);
        return activityDate >= startOfDay && activityDate <= endOfDay;
      });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startOfDay.toISOString())
      .lte('date', endOfDay.toISOString())
      .order('date', { ascending: false });

    // Mettre à jour le cache quand on est en ligne
    cacheActivities(userId);
    
    return data;
  } catch (error) {
    console.error('Erreur:', error);
    // En cas d'erreur, essayer d'utiliser le cache
    return getCachedActivities();
  }
}

export async function saveActivity(content: string, date: Date, userId: string) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data: existingActivities } = await supabase
    .from('activities')
    .select('id')
    .eq('user_id', userId)
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
          user_id: userId,
          content: trimmedContent,
          date: date.toISOString(),
        }])
        .select()
        .single();
      return data;
    }
  }
}

export async function getAllActivitiesWithDates(userId: string) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data?.filter(activity => activity.content?.trim().length > 0) || [];
}

export async function getLastActivity(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId)
    .lt('date', today.toISOString())
    .order('date', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data?.[0] || null;
} 

export async function getActivitiesCountFromPeriod(startDate: Date, endDate: Date, userId: string) {
  const startOfPeriod = new Date(startDate);
  startOfPeriod.setHours(0, 0, 0, 0);
  const endOfPeriod = new Date(endDate);
  endOfPeriod.setHours(23, 59, 59, 999);

  console.log('startOfPeriod', startOfPeriod);
  console.log('endOfPeriod', endOfPeriod);

  const { data, error } = await supabase
    .from('activities')
    .select('date', { count: 'exact' })
    .eq('user_id', userId)
    .gte('date', startOfPeriod.toISOString())
    .lte('date', endOfPeriod.toISOString());

  console.log('data', data);
  if (error) throw error;
  return data?.length || 0;
}

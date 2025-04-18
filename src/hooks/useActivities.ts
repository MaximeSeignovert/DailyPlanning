import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getActivity, getLastActivity, saveActivity, getAllActivitiesWithDates, Activity } from '@/services/activities';
import { format } from 'date-fns';

export function useActivityKeys() {
  const keys = {
    all: ['activities'] as const,
    today: (userId: string | undefined) => userId ? ['activities', 'today', userId] as const : ['activities', 'today'] as const,
    last: (userId: string | undefined) => userId ? ['activities', 'last', userId] as const : ['activities', 'last'] as const,
    dates: (userId: string | undefined) => userId ? ['activities', 'dates', userId] as const : ['activities', 'dates'] as const,
    byDate: (userId: string | undefined, date: Date | undefined) => date && userId 
      ? ['activities', 'date', userId, format(date, 'yyyy-MM-dd')] as const 
      : ['activities', 'date'] as const,
    allActivities: (userId: string | undefined) => userId ? ['activities', 'all', userId] as const : ['activities', 'all'] as const,
  };
  return keys;
}

export function useTodayActivity(userId: string | undefined) {
  const keys = useActivityKeys();
  
  return useQuery({
    queryKey: keys.today(userId) ?? [],
    queryFn: async () => {
      if (!userId) return null;
      const today = new Date();
      const todayActivities = await getActivity(today, userId);
      return todayActivities && todayActivities.length > 0 ? todayActivities[0] : null;
    },
    enabled: !!userId,
  });
}

export function useLastActivity(userId: string | undefined) {
  const keys = useActivityKeys();
  
  return useQuery({
    queryKey: keys.last(userId),
    queryFn: async () => {
      if (!userId) return null;
      return getLastActivity(userId);
    },
    enabled: !!userId,
  });
}

export function useSaveActivity() {
  const queryClient = useQueryClient();
  const keys = useActivityKeys();
  
  return useMutation({
    mutationFn: async ({ 
      content, 
      date, 
      userId 
    }: { 
      content: string; 
      date: Date; 
      userId: string;
    }) => {
      return saveActivity(content, date, userId);
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries after successful mutation
      queryClient.invalidateQueries({ queryKey: keys.today(variables.userId) });
      
      // If updating a past activity, also invalidate last activity
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (variables.date < today) {
        queryClient.invalidateQueries({ queryKey: keys.last(variables.userId) });
      }
    },
  });
}

export function useActivitiesWithDates(userId: string | undefined) {
  const keys = useActivityKeys();
  
  return useQuery({
    queryKey: keys.dates(userId) ?? [],
    queryFn: async () => {
      if (!userId) return [];
      return getAllActivitiesWithDates(userId);
    },
    enabled: !!userId,
  });
}

export function useActivitiesByDate(userId: string | undefined, date: Date | undefined) {
  const keys = useActivityKeys();
  
  return useQuery({
    queryKey: keys.byDate(userId, date) ?? [],
    queryFn: async () => {
      if (!userId || !date) return [];
      return getActivity(date, userId);
    },
    enabled: !!userId && !!date,
  });
}

export function useAllActivities(userId: string | undefined) {
  const keys = useActivityKeys();
  
  return useQuery({
    queryKey: keys.allActivities(userId) ?? [],
    queryFn: async () => {
      if (!userId) return [];
      return getAllActivitiesWithDates(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Fonction utilitaire pour filtrer les activités par date
export function filterActivitiesByDate(activities: Activity[] = [], selectedDate: Date | undefined) {
  if (!selectedDate || !activities.length) return [];
  
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  
  return activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return format(activityDate, 'yyyy-MM-dd') === selectedDateStr;
  });
} 
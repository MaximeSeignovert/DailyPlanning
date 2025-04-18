import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getActivity, getLastActivity, saveActivity } from '@/services/activities';

export function useActivityKeys() {
  const keys = {
    all: ['activities'] as const,
    today: (userId: string | undefined) => userId ? ['activities', 'today', userId] as const : ['activities', 'today'] as const,
    last: (userId: string | undefined) => userId ? ['activities', 'last', userId] as const : ['activities', 'last'] as const,
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
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';

interface Activity {
  id: string;
  content: string;
  date: string;
}

interface GroupedActivities {
  today: Activity[];
  lastTime: Activity[];
}

export function RecentActivities() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<GroupedActivities>({
    today: [],
    lastTime: []
  });
  const { userData } = useUser();

  useEffect(() => {
    const fetchActivities = async () => {
      if (!userData) return;

      try {
        // Obtenir la date d'aujourd'hui (début et fin)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Récupérer toutes les activités triées par date
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', userData.id)
          .order('date', { ascending: false })
          .limit(10);

        if (error) throw error;

        const todayActivities = data?.filter(activity => {
          const activityDate = new Date(activity.date);
          return activityDate >= today && activityDate < tomorrow;
        }) || [];

        const lastTimeActivities = data?.filter(activity => {
          const activityDate = new Date(activity.date);
          return activityDate < today;
        }) || [];

        setActivities({
          today: todayActivities,
          lastTime: lastTimeActivities.slice(0, 1) // Prendre seulement la dernière activité
        });
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userData]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activités Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités Récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.today.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Aujourd'hui
              </h3>
              <div className="space-y-4">
                {activities.today.map((activity) => (
                  <div key={activity.id} className="prose prose-sm dark:prose-invert">
                    <ReactMarkdown>{activity.content}</ReactMarkdown>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activities.lastTime.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Dernière fois - {format(new Date(activities.lastTime[0].date), 'dd MMMM yyyy', { locale: fr })}
              </h3>
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown>{activities.lastTime[0].content}</ReactMarkdown>
              </div>
            </div>
          )}

          {activities.today.length === 0 && activities.lastTime.length === 0 && (
            <p className="text-muted-foreground text-center">
              Aucune activité récente
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 
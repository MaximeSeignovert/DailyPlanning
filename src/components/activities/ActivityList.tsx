import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';

interface Activity {
  id: string;
  content: string;
  date: string;
}

interface GroupedActivities {
  [date: string]: Activity[];
}

export function ActivityList() {
  const [groupedActivities, setGroupedActivities] = useState<GroupedActivities>({});

  useEffect(() => {
    const fetchActivities = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Erreur:', error);
        return;
      }

      // Grouper les activités par date
      const grouped = (data || []).reduce((acc: GroupedActivities, activity) => {
        const dateKey = format(new Date(activity.date), 'yyyy-MM-dd');
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(activity);
        return acc;
      }, {});

      setGroupedActivities(grouped);
    };

    fetchActivities();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Activités Précédentes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {Object.entries(groupedActivities).map(([date, activities]) => (
            <div key={date} className="mb-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                {format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr })}
              </h3>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="prose prose-sm dark:prose-invert">
                    <ReactMarkdown>{activity.content}</ReactMarkdown>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
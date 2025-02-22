import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { getAllActivitiesWithDates, Activity } from '@/services/activities';

interface GroupedActivities {
  [key: string]: Activity[];
}

export function ActivityList() {
  const [groupedActivities, setGroupedActivities] = useState<GroupedActivities>({});

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activities = await getAllActivitiesWithDates();
        const grouped = activities.reduce((acc: GroupedActivities, activity) => {
          const date = format(new Date(activity.date), 'yyyy-MM-dd');
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(activity);
          return acc;
        }, {});
        setGroupedActivities(grouped);
      } catch (error) {
        console.error('Erreur:', error);
      }
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
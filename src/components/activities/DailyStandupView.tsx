import { useEffect, useState } from 'react';
import { subDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { ActivityEditor } from "@/components/activities/ActivityEditor";
import { getActivity, Activity } from '@/services/activities';

export function DailyStandupView() {
  const [todayContent, setTodayContent] = useState('');
  const [yesterdayActivities, setYesterdayActivities] = useState<Activity[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchActivities = async () => {
    try {
      const today = new Date();
      const yesterday = subDays(today, 1);

      const [todayActivities, yesterdayActs] = await Promise.all([
        getActivity(today),
        getActivity(yesterday)
      ]);

      if (todayActivities && todayActivities.length > 0) {
        setTodayContent(todayActivities[0].content);
      }
      setYesterdayActivities(yesterdayActs || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>📄 Activités d'hier</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {yesterdayActivities.length === 0 ? (
              <p className="text-muted-foreground text-center">
                Aucune activité enregistrée hier
              </p>
            ) : (
              <div className="space-y-4">
                {yesterdayActivities.map((activity) => (
                  <div key={activity.id} className="prose prose-sm dark:prose-invert">
                    <ReactMarkdown>{activity.content}</ReactMarkdown>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Aujourd'hui</CardTitle>
          <CardDescription>
            Qu'avez-vous prévu de faire aujourd'hui ?
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <ActivityEditor
              initialContent={todayContent}
              date={new Date()}
              onSave={() => {
                setIsEditing(false);
                fetchActivities();
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="space-y-4">
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown>{todayContent}</ReactMarkdown>
              </div>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Modifier
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      
    </div>
  );
} 
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { ActivityEditor } from "@/components/activities/ActivityEditor";
import { getActivity, getLastActivity, Activity } from '@/services/activities';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function DailyStandupView() {
  const [todayContent, setTodayContent] = useState('');
  const [lastActivity, setLastActivity] = useState<Activity | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchActivities = async () => {
    try {
      const today = new Date();
      const [todayActivities, lastAct] = await Promise.all([
        getActivity(today),
        getLastActivity()
      ]);

      if (todayActivities && todayActivities.length > 0) {
        setTodayContent(todayActivities[0].content);
      }
      setLastActivity(lastAct);
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
          <CardTitle>📄 Dernière activité <span className="italic text-muted-foreground">du {format(new Date(lastActivity?.date || new Date()), 'EEEE d MMMM yyyy', { locale: fr })}</span></CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {!lastActivity ? (
              <p className="text-muted-foreground text-center">
                Aucune activité précédente
              </p>
            ) : (
              <div className="space-y-4">
                <div className="prose prose-sm dark:prose-invert">
                  <ReactMarkdown>{lastActivity.content}</ReactMarkdown>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>✍️ Aujourd'hui</CardTitle>
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
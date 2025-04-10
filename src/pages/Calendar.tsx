import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ActivityEditor } from "@/components/activities/ActivityEditor";
import { getActivity, getAllActivitiesWithDates, Activity } from '@/services/activities';
import { useUser } from '@/contexts/UserContext';

export function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [datesWithActivities, setDatesWithActivities] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [editingContent, setEditingContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { userData } = useUser();

  const fetchAllDatesWithActivities = async () => {
    setLoading(true);
    try {
      const activities = await getAllActivitiesWithDates(userData?.id.toString() || '');
      const dates = activities.map(activity => new Date(activity.date));
      setDatesWithActivities(dates);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivitiesForDate = async (date: Date) => {
    setLoadingActivities(true);
    try {
      const activities = await getActivity(date, userData?.id.toString() || '');
      setActivities(activities || []);
      if (activities && activities.length > 0) {
        setEditingContent(activities[0].content);
      } else {
        setEditingContent('');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleEdit = (content: string) => {
    setEditingContent(content);
    setIsEditing(true);
  };

  useEffect(() => {
    fetchAllDatesWithActivities();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchActivitiesForDate(selectedDate);
    }
  }, [selectedDate]);

  const modifiers = {
    hasActivity: (date: Date) =>
      datesWithActivities.some(
        activityDate =>
          format(activityDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      ),
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row gap-8">
        <Card className="w-full md:w-auto">
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-[320px]" />
          </CardContent>
        </Card>

        <Card className="w-full md:flex-1">
          <CardHeader>
            <Skeleton className="h-7 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Card className="w-full md:w-auto">
        <CardHeader>
          <CardTitle>Calendrier</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
            className="rounded-md border"
            modifiers={modifiers}
            modifiersClassNames={{
              hasActivity: cn(
                "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2",
                "after:h-1 after:w-1 after:rounded-full after:bg-primary",
                "aria-selected:after:bg-accent aria-selected:after:bg-accent"
              )
            }}
          />
        </CardContent>
      </Card>

      <Card className="w-full md:flex-1 h-min">
        <CardHeader>
          <CardTitle>
            Activités du {selectedDate && format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingActivities ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : isEditing ? (
            <ActivityEditor
              initialContent={editingContent}
              date={selectedDate || new Date()}
              onSave={() => {
                setIsEditing(false);
                fetchActivitiesForDate(selectedDate || new Date());
                fetchAllDatesWithActivities();
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ScrollArea className="h-[300px] border p-4 rounded-md pr-4">
              {activities.length === 0 ? (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-muted-foreground">Aucune activité pour cette date</p>
                  <Button onClick={() => handleEdit('')}>
                    Ajouter une activité
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {activities.map((activity) => (
                    <div key={activity.id} className="space-y-4">
                      <div className="prose prose-sm dark:prose-invert">
                        <ReactMarkdown>{activity.content}</ReactMarkdown>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(activity.content)}>
                        Modifier
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
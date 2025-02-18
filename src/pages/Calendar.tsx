import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";

interface Activity {
  id: string;
  content: string;
  date: string;
}

export function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [datesWithActivities, setDatesWithActivities] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const fetchAllDatesWithActivities = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('activities')
      .select('date')
      .eq('user_id', user.id);

    if (error) {
      console.error('Erreur:', error);
      return;
    }

    const dates = (data || []).map(item => new Date(item.date));
    setDatesWithActivities(dates);
    setLoading(false);
  };

  const fetchActivitiesForDate = async (date: Date) => {
    setLoadingActivities(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startOfDay.toISOString())
      .lte('date', endOfDay.toISOString())
      .order('date', { ascending: false });

    if (error) {
      console.error('Erreur:', error);
      return;
    }

    setActivities(data || []);
    setLoadingActivities(false);
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
      <Card className="w-full md:w-auto h-min">
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
                "aria-selected:after:bg-accent"
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
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <ScrollArea className="h-[300px] border p-4 rounded-md pr-4">
              {activities.length === 0 ? (
                <p className="text-muted-foreground">Aucune activité pour cette date</p>
              ) : (
                <div className="space-y-6">
                  {activities.map((activity) => (
                    <div key={activity.id}>
                      <div className="prose prose-sm dark:prose-invert">
                        <ReactMarkdown>{activity.content}</ReactMarkdown>
                      </div>
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
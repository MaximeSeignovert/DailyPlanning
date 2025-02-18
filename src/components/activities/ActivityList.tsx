import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';

interface Activity {
  id: string;
  content: string;
  date: string;
}

export function ActivityList() {
  const [activities, setActivities] = useState<Activity[]>([]);

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
        console.error('Error:', error);
        return;
      }

      setActivities(data);
    };

    fetchActivities();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Previous Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {activities.map((activity) => (
            <div key={activity.id} className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {format(new Date(activity.date), 'MMMM d, yyyy')}
              </h3>
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown>{activity.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
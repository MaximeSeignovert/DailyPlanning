import { useEffect, useState } from 'react';
import {subDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  content: string;
  date: string;
}

export function DailyStandupView() {
  const [loading, setLoading] = useState(true);
  const [todayContent, setTodayContent] = useState('');
  const [yesterdayActivities, setYesterdayActivities] = useState<Activity[]>([]);
  const [savingActivity, setSavingActivity] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      try {
        // Obtenir la date d'aujourd'hui et d'hier
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = subDays(today, 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Récupérer les activités d'aujourd'hui
        const { data: todayData } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', today.toISOString())
          .lt('date', tomorrow.toISOString())
          .single();

        // Récupérer les activités d'hier
        const { data: yesterdayData } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', yesterday.toISOString())
          .lt('date', today.toISOString());

        if (todayData) {
          setTodayContent(todayData.content);
        }
        setYesterdayActivities(yesterdayData || []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleSave = async () => {
    setSavingActivity(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Vérifier si une activité existe déjà pour aujourd'hui
      const { data: existingActivity } = await supabase
        .from('activities')
        .select('id')
        .eq('user_id', user.id)
        .gte('date', today.toISOString())
        .lt('date', tomorrow.toISOString())
        .single();

      if (existingActivity) {
        await supabase
          .from('activities')
          .update({ content: todayContent })
          .eq('id', existingActivity.id);
      } else {
        await supabase
          .from('activities')
          .insert([{
            user_id: user.id,
            content: todayContent,
            date: new Date().toISOString(),
          }]);
      }

      toast({
        title: "Enregistré !",
        description: "Vos activités ont été enregistrées avec succès.",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement de vos activités.",
        variant: "destructive",
      });
    } finally {
      setSavingActivity(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <CardTitle>✍️ Activités d'aujourd'hui</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Écrivez vos activités en markdown..."
            value={todayContent}
            onChange={(e) => setTodayContent(e.target.value)}
            className="min-h-[300px]"
          />
          <Button onClick={handleSave} disabled={savingActivity}>
            {savingActivity && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 
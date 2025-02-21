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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
  const [editingContent, setEditingContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [savingActivity, setSavingActivity] = useState(false);

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

  const handleEdit = (content: string) => {
    setEditingContent(content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedDate) return;
    setSavingActivity(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Vérifier si une activité existe déjà pour cette date
      const { data: existingActivities } = await supabase
        .from('activities')
        .select('id')
        .eq('user_id', user.id)
        .gte('date', startOfDay.toISOString())
        .lte('date', endOfDay.toISOString());

      if (existingActivities && existingActivities.length > 0) {
        // Mise à jour de l'activité existante
        await supabase
          .from('activities')
          .update({ content: editingContent })
          .eq('id', existingActivities[0].id);
      } else {
        // Création d'une nouvelle activité
        await supabase
          .from('activities')
          .insert([{
            user_id: user.id,
            content: editingContent,
            date: selectedDate.toISOString(),
          }]);
      }

      toast({
        title: "Enregistré !",
        description: "Votre activité a été enregistrée avec succès.",
      });

      setIsEditing(false);
      fetchActivitiesForDate(selectedDate);
      fetchAllDatesWithActivities();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement de votre activité.",
        variant: "destructive",
      });
    } finally {
      setSavingActivity(false);
    }
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
            </div>
          ) : isEditing ? (
            <div className="space-y-4">
              <Textarea
                placeholder="Écrivez vos activités en markdown..."
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={savingActivity}>
                  {savingActivity && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enregistrer
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
              </div>
            </div>
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
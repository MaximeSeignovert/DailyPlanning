import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { ActivityEditor } from "@/components/activities/ActivityEditor";
import { getActivity, getLastActivity, Activity } from '@/services/activities';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { saveActivity } from '@/services/activities';

export function DailyStandupView() {
  const [todayContent, setTodayContent] = useState('');
  const [lastActivity, setLastActivity] = useState<Activity | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingLastActivity, setIsEditingLastActivity] = useState(false);
  const [isLoadingToday, setIsLoadingToday] = useState(true);
  const [isLoadingLastActivity, setIsLoadingLastActivity] = useState(true);
  const [isSavingToday, setIsSavingToday] = useState(false);
  const [isSavingLastActivity, setIsSavingLastActivity] = useState(false);

  const fetchTodayActivity = async () => {
    setIsLoadingToday(true);
    try {
      const today = new Date();
      const todayActivities = await getActivity(today);
      if (todayActivities && todayActivities.length > 0) {
        setTodayContent(todayActivities[0].content);
      } else {
        setTodayContent('');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'activité du jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'activité du jour.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingToday(false);
    }
  };

  const fetchLastActivity = async () => {
    setIsLoadingLastActivity(true);
    try {
      const lastAct = await getLastActivity();
      setLastActivity(lastAct);
    } catch (error) {
      console.error('Erreur lors du chargement de la dernière activité:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la dernière activité.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLastActivity(false);
    }
  };

  const handleSaveToday = async (content: string) => {
    setIsSavingToday(true);
    try {
      await saveActivity(content, new Date());
      setTodayContent(content);
      setIsEditing(false);
      toast({
        title: "Enregistré !",
        description: "Votre activité du jour a été enregistrée avec succès.",
      });
      await fetchTodayActivity();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'activité du jour:', error);
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement de l'activité du jour.",
        variant: "destructive",
      });
    } finally {
      setIsSavingToday(false);
    }
  };

  const handleSaveLastActivity = async (content: string) => {
    if (!lastActivity) return;
    
    setIsSavingLastActivity(true);
    try {
      await saveActivity(content, new Date(lastActivity.date));
      setLastActivity({ ...lastActivity, content });
      setIsEditingLastActivity(false);
      toast({
        title: "Enregistré !",
        description: "La dernière activité a été mise à jour avec succès.",
      });
      await fetchLastActivity();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la dernière activité:', error);
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour de la dernière activité.",
        variant: "destructive",
      });
    } finally {
      setIsSavingLastActivity(false);
    }
  };

  useEffect(() => {
    fetchTodayActivity();
    fetchLastActivity();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>📄 Dernière activité</CardTitle>
          <CardDescription>
            {lastActivity && format(new Date(lastActivity.date), 'EEEE d MMMM yyyy', { locale: fr })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {isLoadingLastActivity ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[75%]" />
                <Skeleton className="h-10 w-[120px] mt-4" />
              </div>
            ) : isEditingLastActivity ? (
              <ActivityEditor
                initialContent={lastActivity?.content || ''}
                date={new Date(lastActivity?.date || new Date())}
                onSave={handleSaveLastActivity}
                onCancel={() => setIsEditingLastActivity(false)}
                isSaving={isSavingLastActivity}
              />
            ) : (
              <div className="space-y-4">
                <div className="prose prose-sm dark:prose-invert">
                  <ReactMarkdown>{lastActivity?.content || ''}</ReactMarkdown>
                </div>
                <Button variant="outline" onClick={() => setIsEditingLastActivity(true)}>
                  Modifier
                </Button>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>✍️ Aujourd'hui</CardTitle>
          <CardDescription>
            {todayContent && format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingToday ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-10 w-[120px] mt-4" />
            </div>
          ) : isEditing ? (
            <ActivityEditor
              initialContent={todayContent}
              date={new Date()}
              onSave={handleSaveToday}
              onCancel={() => setIsEditing(false)}
              isSaving={isSavingToday}
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
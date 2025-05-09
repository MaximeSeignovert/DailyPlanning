import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { ActivityEditor } from "@/components/activities/ActivityEditor";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useUser } from '@/contexts/UserContext';
import { useTodayActivity, useLastActivity, useSaveActivity } from '@/hooks/useActivities';
import { Activity } from '@/services/activities';

export function DailyStandupView() {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingLastActivity, setIsEditingLastActivity] = useState(false);
  const { userData } = useUser();
  
  // Utiliser TanStack Query pour gérer les données et les états
  const { 
    data: todayActivity,
    isLoading: isLoadingToday,
    error: todayError
  } = useTodayActivity(userData?.id) as { data: Activity | null, isLoading: boolean, error: unknown };
  
  const { 
    data: lastActivity,
    isLoading: isLoadingLastActivity,
    error: lastActivityError 
  } = useLastActivity(userData?.id) as { data: Activity | null, isLoading: boolean, error: unknown };
  
  console.log('todayActivity', todayActivity);
  console.log('lastActivity', lastActivity);

  const saveActivityMutation = useSaveActivity();
  
  // Afficher les erreurs si nécessaire
  if (todayError) {
    toast({
      title: "Erreur",
      description: "Impossible de charger l'activité du jour.",
      variant: "destructive",
    });
  }
  
  if (lastActivityError) {
    toast({
      title: "Erreur",
      description: "Impossible de charger la dernière activité.",
      variant: "destructive",
    });
  }
  
  const handleSaveToday = async (content: string) => {
    if (!userData) return;
    
    try {
      await saveActivityMutation.mutateAsync({
        content,
        date: new Date(),
        userId: userData.id
      });
      
      setIsEditing(false);
      toast({
        title: "Enregistré !",
        description: "Votre activité du jour a été enregistrée avec succès.",
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement de l'activité du jour.",
        variant: "destructive",
      });
    }
  };

  const handleSaveLastActivity = async (content: string) => {
    if (!userData || !lastActivity) return;
    
    try {
      await saveActivityMutation.mutateAsync({
        content,
        date: new Date(lastActivity.date),
        userId: userData.id
      });
      
      setIsEditingLastActivity(false);
      toast({
        title: "Enregistré !",
        description: "La dernière activité a été mise à jour avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la dernière activité:', error);
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour de la dernière activité.",
        variant: "destructive",
      });
    }
  };

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
                isSaving={saveActivityMutation.isPending}
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
            {todayActivity && format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
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
              initialContent={todayActivity?.content || ''}
              date={new Date()}
              onSave={handleSaveToday}
              onCancel={() => setIsEditing(false)}
              isSaving={saveActivityMutation.isPending}
            />
          ) : (
            <div className="space-y-4">
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown>{todayActivity?.content || ''}</ReactMarkdown>
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
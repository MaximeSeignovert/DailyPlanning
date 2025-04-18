import { useState, useMemo, useEffect } from 'react';
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
import { Activity } from '@/services/activities';
import { useUser } from '@/contexts/UserContext';
import { useAllActivities, useSaveActivity, filterActivitiesByDate } from '@/hooks/useActivities';
import { toast } from '@/components/ui/use-toast';

export function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [editingContent, setEditingContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { userData } = useUser();
  
  // Récupérer toutes les activités en une seule requête
  const { 
    data: allActivities = [], 
    isLoading: loadingActivities,
    error: activitiesError
  } = useAllActivities(userData?.id);
  
  // Filtrer les activités selon la date sélectionnée (local)
  const activitiesForSelectedDate = useMemo(() => 
    filterActivitiesByDate(allActivities, selectedDate),
  [allActivities, selectedDate]);
  
  // Mettre à jour le contenu d'édition lorsque la date change
  useEffect(() => {
    if (activitiesForSelectedDate.length > 0) {
      setEditingContent(activitiesForSelectedDate[0].content);
    } else {
      setEditingContent('');
    }
  }, [activitiesForSelectedDate]);
  
  const saveActivityMutation = useSaveActivity();
  
  // Afficher les erreurs si nécessaire
  useEffect(() => {
    if (activitiesError) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les activités.",
        variant: "destructive",
      });
    }
  }, [activitiesError]);

  const handleEdit = (content: string) => {
    setEditingContent(content);
    setIsEditing(true);
  };

  const handleSave = async (content: string) => {
    if (!userData || !selectedDate) return;
    
    try {
      await saveActivityMutation.mutateAsync({
        content,
        date: selectedDate,
        userId: userData.id
      });
      
      setIsEditing(false);
      toast({
        title: "Enregistré !",
        description: "Votre activité a été enregistrée avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'activité:', error);
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement de l'activité.",
        variant: "destructive",
      });
    }
  };

  // Extraire les dates qui ont des activités 
  const activityDates = useMemo(() => 
    allActivities.map(activity => new Date(activity.date)),
  [allActivities]);

  const modifiers = useMemo(() => ({
    hasActivity: (date: Date) =>
      activityDates.some(
        activityDate =>
          format(activityDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      ),
  }), [activityDates]);

  if (loadingActivities) {
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
                "aria-selected:after:bg-accent aria-selected:after:bg-accent"
              )
            }}
          />
        </CardContent>
      </Card>

      <Card className="w-full md:flex-1">
        <CardHeader>
          <CardTitle>
            Activités du {selectedDate && format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <ActivityEditor
              initialContent={editingContent}
              date={selectedDate || new Date()}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              isSaving={saveActivityMutation.isPending}
            />
          ) : (
            <ScrollArea className="border p-4 rounded-md pr-4">
              {activitiesForSelectedDate.length === 0 ? (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-muted-foreground">Aucune activité pour cette date</p>
                  <Button onClick={() => handleEdit('')}>
                    Ajouter une activité
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {activitiesForSelectedDate.map((activity: Activity) => (
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
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from '@/contexts/UserContext';
import { useTodayActivity, useLastActivity } from '@/hooks/useActivities';
import { Activity } from '@/services/activities';
import { ActivityEditorModal } from './ActivityEditorModal';

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
  
  // Afficher les erreurs si nécessaire
  if (todayError) {
    console.error('Erreur lors de la récupération de l\'activité du jour.');
  }
  
  if (lastActivityError) {
    console.error('Erreur lors de la récupération de la dernière activité.');
  }

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
          <ScrollArea className="pr-4">
            {isLoadingLastActivity ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[75%]" />
                <Skeleton className="h-10 w-[120px] mt-4" />
              </div>
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
          
          {/* Modal pour éditer la dernière activité */}
          <ActivityEditorModal
            isOpen={isEditingLastActivity}
            onClose={() => setIsEditingLastActivity(false)}
            initialContent={lastActivity?.content || ''}
            date={new Date(lastActivity?.date || new Date())}
          />
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
          
          {/* Modal pour éditer l'activité du jour */}
          <ActivityEditorModal
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            initialContent={todayActivity?.content || ''}
            date={new Date()}
          />
        </CardContent>
      </Card>
    </div>
  );
} 
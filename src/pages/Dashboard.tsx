import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/lib/supabase';
import { PenLine, Calendar as CalendarIcon, LineChart, BookOpen } from "lucide-react";
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useUser } from '@/contexts/UserContext';

interface Activity {
  id: string;
  content: string;
  date: string;
  user_id: string;
}

interface DashboardStats {
  todayActivities: Activity[];
  streakDays: number;
  totalActivities: number;
  recentActivities: Activity[];
}

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    todayActivities: [],
    streakDays: 0,
    totalActivities: 0,
    recentActivities: [],
  });
  const { userData } = useUser();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userData) return;

      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Récupérer les activités d'aujourd'hui
        const { data: todayData } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', userData.id)
          .gte('date', today.toISOString())
          .lt('date', tomorrow.toISOString());

        // Récupérer toutes les activités pour calculer les stats
        const { data: allActivities } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', userData.id)
          .order('date', { ascending: false });

        // Récupérer les activités récentes
        const { data: recentData } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', userData.id)
          .order('date', { ascending: false })
          .limit(5);

        setStats({
          todayActivities: todayData || [],
          streakDays: calculateStreak(allActivities || []),
          totalActivities: allActivities?.length || 0,
          recentActivities: recentData || [],
        });
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userData]);

  const calculateStreak = (activities: Activity[]) => {
    if (!activities.length) return 0;
    
    const dates = activities.map(a => format(new Date(a.date), 'yyyy-MM-dd'))
      .sort()
      .reverse();
    
    let streak = 1;
    let currentDate = new Date();
    
    for (let i = 0; i < dates.length; i++) {
      const activityDate = format(currentDate, 'yyyy-MM-dd');
      if (dates.includes(activityDate)) {
        currentDate = subDays(currentDate, 1);
        streak++;
      } else {
        break;
      }
    }
    
    return streak - 1;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button asChild>
          <Link to="/journal" className="gap-2">
            <PenLine className="h-4 w-4" />
            Nouvelle entrée
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Activités aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayActivities.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.todayActivities.length === 0 ? "Aucune activité" : 
               stats.todayActivities.length === 1 ? "1 activité" : 
               `${stats.todayActivities.length} activités`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jours consécutifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streakDays}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.streakDays > 0 ? `${stats.streakDays} jours de suite` : "Commencez aujourd'hui !"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total des activités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Depuis le début
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Vos 5 dernières entrées</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <CalendarIcon className="h-4 w-4" />
                    {format(new Date(activity.date), 'dd MMMM yyyy', { locale: fr })}
                  </div>
                  <div className="prose prose-sm dark:prose-invert">
                    <ReactMarkdown>{activity.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Accès rapide</CardTitle>
            <CardDescription>Navigation rapide vers les fonctionnalités</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" asChild className="h-24 flex flex-col items-center justify-center">
                <Link to="/journal">
                  <BookOpen className="h-6 w-6 mb-2" />
                  Journal
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-24 flex flex-col items-center justify-center">
                <Link to="/calendar">
                  <CalendarIcon className="h-6 w-6 mb-2" />
                  Calendrier
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-24 flex flex-col items-center justify-center">
                <Link to="/analytics">
                  <LineChart className="h-6 w-6 mb-2" />
                  Analytique
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
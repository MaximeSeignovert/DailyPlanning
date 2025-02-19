import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, CartesianGrid } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ActivityStats {
  totalActivities: number;
  lastWeekActivities: number;
  averageWordsPerDay: number;
  streakDays: number;
}

interface Activity {
  id: string;
  content: string;
  date: string;
  user_id: string;
}

const chartConfig = {
  activities: {
    label: "Activités",
    theme: {
      light: "hsl(var(--primary))",
      dark: "hsl(var(--primary))",
    },
  },
} satisfies ChartConfig;

export function Analytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ActivityStats>({
    totalActivities: 0,
    lastWeekActivities: 0,
    averageWordsPerDay: 0,
    streakDays: 0,
  });
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      try {
        // Récupérer toutes les activités
        const { data: activities, error } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        // Calculer les statistiques
        const lastWeekDate = subDays(new Date(), 7);
        const lastWeekActivities = activities?.filter(
          activity => new Date(activity.date) >= lastWeekDate
        );

        // Calculer la moyenne de mots par jour
        const totalWords = activities?.reduce((acc, activity) => 
          acc + (activity.content?.split(/\s+/).length || 0), 0);
        const uniqueDays = new Set(activities?.map(a => 
          format(new Date(a.date), 'yyyy-MM-dd')));

        // Préparer les données pour le graphique
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
          const count = activities?.filter(a => 
            format(new Date(a.date), 'yyyy-MM-dd') === date
          ).length || 0;
          return { date, count };
        }).reverse();

        setChartData(last7Days);
        setStats({
          totalActivities: activities?.length || 0,
          lastWeekActivities: lastWeekActivities?.length || 0,
          averageWordsPerDay: Math.round(totalWords / uniqueDays.size) || 0,
          streakDays: calculateStreak(activities || []),
        });
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  const calculateTrend = () => {
    if (chartData.length < 2) return 0;
    const lastDay = chartData[chartData.length - 1].count;
    const previousDay = chartData[chartData.length - 2].count;
    if (previousDay === 0) return lastDay > 0 ? 100 : 0;
    return ((lastDay - previousDay) / previousDay) * 100;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  const trend = calculateTrend();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total des activités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Activités (7 derniers jours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lastWeekActivities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moyenne de mots par jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageWordsPerDay}</div>
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
          </CardContent>
        </Card>
      </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Card>
        <CardHeader>
          <CardTitle>Évolution des activités</CardTitle>
          <CardDescription>
            {format(subDays(new Date(), 6), 'dd MMMM', { locale: fr })} - {format(new Date(), 'dd MMMM yyyy', { locale: fr })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: fr })}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <ChartTooltipContent
                      label={format(new Date(label), 'dd MMMM yyyy', { locale: fr })}
                      payload={payload}
                      formatter={(value) => [`${value} activité${Number(value) > 1 ? 's' : ''}`]}
                    />
                  );
                }}
              />
              <Line
                type="step"
                dataKey="count"
                stroke="var(--color-activities)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {trend !== 0 && (
              <>
                {trend > 0 ? 'Augmentation' : 'Diminution'} de {Math.abs(trend).toFixed(1)}% 
                {trend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </>
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            Affichage des activités sur les 7 derniers jours
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            A venir ...
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
      
    </div>
  );
} 
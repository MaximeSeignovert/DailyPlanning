import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer} from "@/components/ui/chart";
import { TrendingUp, TrendingDown } from "lucide-react"

interface ActivityStats {
  totalDays: number;
  lastWeekDays: number;
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
  activity: {
    label: "Activité",
    color: "hsl(var(--chart-1))",
  },
  words: {
    label: "Mots",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Analytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ActivityStats>({
    totalDays: 0,
    lastWeekDays: 0,
    averageWordsPerDay: 0,
    streakDays: 0,
  });
  const [chartData, setChartData] = useState<{ date: string; hasActivity: number }[]>([]);
  const [wordCountTrend, setWordCountTrend] = useState<Array<{ date: string; wordCount: number }>>([]);

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

        // Préparer les données pour le graphique d'activités
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
          const hasActivity = activities?.some(a => 
            format(new Date(a.date), 'yyyy-MM-dd') === date
          ) ? 1 : 0;
          return { date, hasActivity };
        }).reverse();

        // Calculer la tendance du nombre de mots sur 30 jours
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
          const activity = activities?.find(a => 
            format(new Date(a.date), 'yyyy-MM-dd') === date
          );
          return {
            date,
            wordCount: activity?.content?.split(/\s+/).length || 0
          };
        }).reverse();

        setChartData(last7Days);
        setWordCountTrend(last30Days);
        setStats({
          totalDays: uniqueDays.size,
          lastWeekDays: new Set(lastWeekActivities?.map(a => 
            format(new Date(a.date), 'yyyy-MM-dd')
          )).size,
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
    const lastDay = chartData[chartData.length - 1].hasActivity;
    const previousDay = chartData[chartData.length - 2].hasActivity;
    return lastDay - previousDay;
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
              Jours d'activité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDays}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jours actifs (7 derniers jours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lastWeekDays}</div>
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
                accessibilityLayer
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
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="font-medium">
                          {format(new Date(label), 'EEEE dd MMMM yyyy', { locale: fr })}
                        </div>
                        <div className="mt-1">
                          <span>Statut : </span>
                          <span className="font-medium">
                            {payload[0].value ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Line
                  type="stepAfter"
                  dataKey="hasActivity"
                  stroke="var(--color-activity)"
                  strokeWidth={2}
                  dot={{ stroke: 'var(--color-activity)', fill: 'var(--background)' }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trend !== 0 && (
                <>
                  {trend > 0 ? (
                    <>
                      Tendance à la hausse <TrendingUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Tendance à la baisse <TrendingDown className="h-4 w-4" />
                    </>
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
            <CardTitle>Tendance de la longueur des entrées</CardTitle>
            <CardDescription>Évolution du nombre de mots sur 30 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={wordCountTrend}
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
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="font-medium">
                          {format(new Date(label), 'EEEE dd MMMM yyyy', { locale: fr })}
                        </div>
                        <div className="mt-1">
                          <span>Nombre de mots : </span>
                          <span className="font-medium">
                            {payload[0].value}
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="wordCount"
                  stroke="var(--color-words)"
                  strokeWidth={2}
                  dot={{ stroke: 'var(--color-words)', fill: 'var(--background)' }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              Évolution de la quantité de contenu sur les 30 derniers jours
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 
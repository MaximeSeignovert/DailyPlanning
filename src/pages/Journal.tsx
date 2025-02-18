import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Skeleton } from "@/components/ui/skeleton";

interface Activity {
  id: string;
  content: string;
  date: string;
}

export function Journal() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const today = format(new Date(), 'yyyy-MM-dd');

  const fetchTodayActivities = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
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
    setLoading(false);
  };

  useEffect(() => {
    fetchTodayActivities();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('activities')
        .insert([
          {
            user_id: user.id,
            content,
            date: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      toast({
        title: "Enregistré !",
        description: "Votre activité a été enregistrée avec succès.",
      });
      setContent('');
      fetchTodayActivities(); // Rafraîchir la liste
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement de votre activité.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Activités d'Aujourd'hui</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Écrivez vos activités en markdown..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
          <Button onClick={handleSave} disabled={loading || !content}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
          
          {loading ? (
            <div className="space-y-4 mt-8">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <ScrollArea className="h-[400px] mt-8">
              {activities.map((activity) => (
                <div key={activity.id} className="mb-6">
                  <div className="text-sm text-muted-foreground mb-2">
                    {format(new Date(activity.date), 'HH:mm')}
                  </div>
                  <div className="prose prose-sm dark:prose-invert">
                    <ReactMarkdown>{activity.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
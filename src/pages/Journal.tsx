import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";


export function Journal() {
  const [content, setContent] = useState('');
  const [activityId, setActivityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTodayActivity = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', today.toISOString())
        .lt('date', tomorrow.toISOString())
        .single();


      if (data) {
        setContent(data.content);
        setActivityId(data.id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayActivity();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      if (activityId) {
        // Mise à jour de l'activité existante
        const { error } = await supabase
          .from('activities')
          .update({ content })
          .eq('id', activityId);

        if (error) throw error;
      } else {
        // Création d'une nouvelle activité
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
      }

      toast({
        title: "Enregistré !",
        description: "Votre activité a été enregistrée avec succès.",
      });
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
          <CardTitle>
            Journal du {format(new Date(), 'dd MMMM yyyy', { locale: fr })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <>
              <Textarea
                placeholder="Écrivez vos activités en markdown..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
              />
              <Button onClick={handleSave} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
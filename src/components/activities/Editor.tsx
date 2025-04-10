import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export function Editor() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { userData } = useUser();

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!userData) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('activities')
        .insert([
          {
            user_id: userData.id,
            content,
            date: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      toast({
        title: "Saved!",
        description: "Your activity has been saved successfully.",
      });
      setContent('');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to save your activity.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Today's Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Write your activities in markdown..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px]"
        />
        <Button onClick={handleSave} disabled={loading || !content}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </CardContent>
    </Card>
  );
}
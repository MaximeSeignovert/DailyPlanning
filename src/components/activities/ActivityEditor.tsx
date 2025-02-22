import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { saveActivity } from '@/services/activities';

interface ActivityEditorProps {
  initialContent: string;
  date: Date;
  onSave: () => void;
  onCancel: () => void;
}

export function ActivityEditor({ initialContent, date, onSave, onCancel }: ActivityEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveActivity(content, date);
      
      if (!content.trim()) {
        toast({
          title: "Supprimé",
          description: "L'activité a été supprimée.",
        });
      } else {
        toast({
          title: "Enregistré !",
          description: "Votre activité a été enregistrée avec succès.",
        });
      }
      
      onSave();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Échec de l'opération.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Écrivez vos activités en markdown..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[200px]"
      />
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
} 
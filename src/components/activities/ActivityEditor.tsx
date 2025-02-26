import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ActivityEditorProps {
  initialContent: string;
  date: Date;
  onSave: (content: string) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function ActivityEditor({ initialContent, onSave, onCancel, isSaving = false }: ActivityEditorProps) {
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    onSave(content);
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
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
} 
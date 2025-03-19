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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      
      if (e.shiftKey) {
        // Désindenter (Shift+Tab)
        const beforeCursor = content.substring(0, start);
        const afterCursor = content.substring(end);
        const lastChar = beforeCursor.slice(-1);
        
        if (lastChar === '\t') {
          const newContent = beforeCursor.slice(0, -1) + afterCursor;
          setContent(newContent);
          setTimeout(() => {
            e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start - 1;
          }, 0);
        }
      } else {
        // Indenter (Tab)
        const newContent = content.substring(0, start) + '\t' + content.substring(end);
        setContent(newContent);
        setTimeout(() => {
          e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 1;
        }, 0);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Écrivez vos activités en markdown..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[200px] font-mono whitespace-pre"
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
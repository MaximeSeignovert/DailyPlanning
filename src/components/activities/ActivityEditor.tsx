import { useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Eye, Save, X } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useSaveActivity } from '@/hooks/useActivities';
import { useUser } from '@/contexts/UserContext';
import { EditorToolBar } from './EditorToolBar';

interface ActivityEditorProps {
  initialContent: string;
  date: Date;
  isSaving?: boolean;
}

export function ActivityEditor({ initialContent, date }: ActivityEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedText, setSelectedText] = useState({start: 0, end: 0});
  const saveActivityMutation = useSaveActivity();
  const { userData } = useUser();

  const handleSelect = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("handleSelect");
    setSelectedText({start: e.target.selectionStart, end: e.target.selectionEnd});
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasUnsavedChanges(newContent !== initialContent);
  };

  const handleSave = () => {
    if (!userData) return;
    try {
      saveActivityMutation.mutate({
        content: content,
        date: date,
        userId: userData?.id,
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving activity:", error);
    }
  };

  const handleCancel = () => {
    setContent(initialContent);
    setHasUnsavedChanges(false);
  };

  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const selection = content.substring(selectedText.start, selectedText.end);
    const textToInsert = selection || placeholder;
    
    const newContent = 
      content.substring(0, selectedText.start) + 
      before + textToInsert + after + 
      content.substring(selectedText.end);
    
    handleContentChange(newContent);
  };

  const insertAtLineStart = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const lines = content.split('\n');
    let currentPos = 0;
    let lineIndex = 0;

    // Trouver la ligne actuelle
    for (let i = 0; i < lines.length; i++) {
      if (currentPos + lines[i].length >= selectedText.start) {
        lineIndex = i;
        break;
      }
      currentPos += lines[i].length + 1; // +1 pour le \n
    }

    // Modifier la ligne
    lines[lineIndex] = prefix + lines[lineIndex];
    const newContent = lines.join('\n');
    handleContentChange(newContent);

    // Repositionner le curseur
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(selectedText.start + prefix.length, selectedText.start + prefix.length);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Gestion de la tabulation pour l'indentation
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
          handleContentChange(newContent);
          setTimeout(() => {
            e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start - 1;
          }, 0);
        }
      } else {
        // Indenter (Tab)
        const newContent = content.substring(0, start) + '\t' + content.substring(end);
        handleContentChange(newContent);
        setTimeout(() => {
          e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 1;
        }, 0);
      }
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      
      {/* Affichage côte à côte sur les grands écrans */}
      <div className="hidden lg:flex flex-1 gap-4">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Edit className="h-4 w-4" />
              Édition
            </div>
          </div>
          <div className="border rounded-md flex-1 flex flex-col overflow-hidden">
            <EditorToolBar insertMarkdown={insertMarkdown} insertAtLineStart={insertAtLineStart} />
            <Textarea
              onSelect={handleSelect}
              ref={textareaRef}
              placeholder="Écrivez vos activités en markdown..."
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 whitespace-pre resize-none border-0 focus-visible:ring-0 rounded-none"
            />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
            <Eye className="h-4 w-4" />
            Aperçu
          </div>
          <div className="border rounded-md p-4 min-h-[200px] h-full overflow-auto bg-background">
            {content.trim() ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                Commencez à écrire pour voir l'aperçu...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Affichage avec onglets sur les petits écrans */}
      <div className="lg:hidden flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div></div>
        </div>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Édition
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Aperçu
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="flex-1 mt-4">
            <div className="border rounded-md flex-1 flex flex-col overflow-hidden h-full">
              <EditorToolBar insertMarkdown={insertMarkdown} insertAtLineStart={insertAtLineStart} />
              <Textarea
                ref={textareaRef}
                placeholder="Écrivez vos activités en markdown..."
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 whitespace-pre resize-none border-0 focus-visible:ring-0 rounded-none"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="flex-1 mt-4">
            <div className="border rounded-md p-4 min-h-[200px] h-full overflow-auto bg-background">
              {content.trim() ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  Aucun contenu à prévisualiser. Basculez vers l'onglet "Édition" pour commencer à écrire.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
        

      </div>
      {/* Boutons de sauvegarde */}
        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCancel}
            className="flex items-center gap-2 cursor-pointer"
          >
            <X className="h-4 w-4" />
            Annuler
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={saveActivityMutation.isPending || !hasUnsavedChanges}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {saveActivityMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      
    </div>
  );
}
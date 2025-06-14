import { Bold, 
    Italic, 
    Underline, 
    Strikethrough,
    Quote,
    Code,
    Link,
    Heading1,
    Heading2,
    Heading3, } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

    interface EditorToolBarProps {
        insertMarkdown: (start: string, end: string, text: string) => void;
        insertAtLineStart: (text: string) => void;
      }

export function EditorToolBar({ insertMarkdown, insertAtLineStart }: EditorToolBarProps) {
    const formatActions = [
        {
          icon: Bold,
          label: "Gras",
          action: () => insertMarkdown('**', '**', 'texte en gras'),
        },
        {
          icon: Italic,
          label: "Italique",
          action: () => insertMarkdown('*', '*', 'texte en italique'),
        },
        {
          icon: Underline,
          label: "Souligné",
          action: () => insertMarkdown('<u>', '</u>', 'texte souligné'),
        },
        {
          icon: Strikethrough,
          label: "Barré",
          action: () => insertMarkdown('~~', '~~', 'texte barré'),
        },
        {
          icon: Code,
          label: "Code inline",
          action: () => insertMarkdown('`', '`', 'code'),
        },
        {
          icon: Heading1,
          label: "Titre 1",
          action: () => insertAtLineStart('# '),
        },
        {
          icon: Heading2,
          label: "Titre 2",
          action: () => insertAtLineStart('## '),
        },
        {
          icon: Heading3,
          label: "Titre 3",
          action: () => insertAtLineStart('### '),
        },
        /*{
          icon: List,
          label: "Liste à puces",
          action: () => insertAtLineStart('- '),
        },
        {
          icon: ListOrdered,
          label: "Liste numérotée",
          action: () => insertAtLineStart('1. '),
        },*/
        {
          icon: Quote,
          label: "Citation",
          action: () => insertAtLineStart('> '),
        },
        {
          icon: Link,
          label: "Lien",
          action: () => insertMarkdown('[', '](url)', 'texte du lien'),
        },
      ];

      const ToolbarButton = ({ icon: Icon, label, action }: { icon: React.ComponentType<{ className?: string }>, label: string, action: () => void }) => (
        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            // Empêcher la perte de focus du textarea
            e.preventDefault();
          }}
          onClick={(e) => {
            e.preventDefault();
            action();
          }}
          title={label}
          className="h-8 w-8 p-0"
        >
          <Icon className="h-4 w-4" />
        </Button>
      );

return (
    <div className="border-b bg-muted/30 overflow-hidden">
      <div className="flex items-center gap-1 p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
        <div className="flex items-center gap-1 flex-shrink-0">
          {formatActions.slice(0, 5).map((action, index) => (
            <ToolbarButton key={index} {...action} />
          ))}
        </div>
        <Separator orientation="vertical" className="h-6 mx-1 flex-shrink-0" />
        <div className="flex items-center gap-1 flex-shrink-0">
          {formatActions.slice(5, 8).map((action, index) => (
            <ToolbarButton key={index + 5} {...action} />
          ))}
        </div>
        <Separator orientation="vertical" className="h-6 mx-1 flex-shrink-0" />
        <div className="flex items-center gap-1 flex-shrink-0">
          {formatActions.slice(8).map((action, index) => (
            <ToolbarButton key={index + 8} {...action} />
          ))}
        </div>
      </div>
    </div>
);
}
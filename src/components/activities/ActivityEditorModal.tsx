import { ActivityEditor } from "@/components/activities/ActivityEditor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fr } from "date-fns/locale";
import { format } from "date-fns";

interface ActivityEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent: string;
  date: Date;
  onSave: (content: string) => void;
  isSaving?: boolean;
}

export function ActivityEditorModal({
  isOpen,
  onClose,
  initialContent,
  date,
  onSave,
  isSaving = false,
}: ActivityEditorModalProps) {
  const handleSave = (content: string) => {
    onSave(content);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] max-w-[90vw] max-h-[90vh] h-[90vh] md:h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Édition de l'activité</DialogTitle>
          <DialogDescription>{format(date, 'EEEE d MMMM yyyy', { locale: fr })}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <ActivityEditor 
            initialContent={initialContent}
            date={date}
            onSave={handleSave}
            onCancel={onClose}
            isSaving={isSaving}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 
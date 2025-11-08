import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesListProps {
  notes: any[];
  currentNote: any;
  onSelectNote: (note: any) => void;
  onDeleteNote?: (noteId: string) => void;
  readOnly?: boolean;
}

const NotesList = ({ notes, currentNote, onSelectNote, onDeleteNote, readOnly }: NotesListProps) => {
  const getPreview = (content: string) => {
    if (!content) return "Empty note";
    return content.slice(0, 50) + (content.length > 50 ? "..." : "");
  };

  return (
    <div className="flex-1 overflow-auto">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`p-4 border-b border-border cursor-pointer hover:bg-card transition-colors group ${
            currentNote?.id === note.id ? "bg-card" : ""
          }`}
          onClick={() => onSelectNote(note)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">
                {getPreview(note.content)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(note.updated_at).toLocaleDateString()}
              </p>
            </div>
            {!readOnly && onDeleteNote && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList;

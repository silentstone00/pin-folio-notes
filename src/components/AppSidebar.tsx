import { Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import NotesList from "@/components/NotesList";

interface AppSidebarProps {
  notes: any[];
  currentNote: any;
  onSelectNote: (note: any) => void;
  onDeleteNote: (noteId: string) => void;
  onCreateNote: () => void;
  onShare: () => void;
}

export function AppSidebar({
  notes,
  currentNote,
  onSelectNote,
  onDeleteNote,
  onCreateNote,
  onShare,
}: AppSidebarProps) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center justify-between p-4">
          {open && <h2 className="text-sm font-medium text-foreground">Notes</h2>}
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={onShare}
              className="h-8 w-8"
              title="Share notes"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onCreateNote}
              className="h-8 w-8"
              title="New note"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NotesList
          notes={notes}
          currentNote={currentNote}
          onSelectNote={onSelectNote}
          onDeleteNote={onDeleteNote}
        />
      </SidebarContent>
    </Sidebar>
  );
}

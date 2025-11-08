import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, LogOut, Share2 } from "lucide-react";
import NotesList from "@/components/NotesList";
import ShareDialog from "@/components/ShareDialog";

const Notes = () => {
  const [user, setUser] = useState<any>(null);
  const [currentNote, setCurrentNote] = useState<any>(null);
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [userPin, setUserPin] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        loadNotes(session.user.id);
        loadUserPin(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadUserPin = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("pin")
      .eq("user_id", userId)
      .single();
    
    if (data) {
      setUserPin(data.pin);
    }
  };

  const loadNotes = async (userId: string) => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      toast.error("Failed to load notes");
      return;
    }

    setNotes(data || []);
    
    if (data && data.length > 0 && !currentNote) {
      setCurrentNote(data[0]);
      setContent(data[0].content);
    }
  };

  const saveNote = async () => {
    if (!user || !currentNote) return;

    const { error } = await supabase
      .from("notes")
      .update({ content })
      .eq("id", currentNote.id);

    if (error) {
      toast.error("Failed to save note");
    }
  };

  const createNewNote = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        content: "",
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create note");
      return;
    }

    setNotes([data, ...notes]);
    setCurrentNote(data);
    setContent("");
    toast.success("New note created");
  };

  const selectNote = (note: any) => {
    if (currentNote) {
      saveNote();
    }
    setCurrentNote(note);
    setContent(note.content);
  };

  const deleteNote = async (noteId: string) => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId);

    if (error) {
      toast.error("Failed to delete note");
      return;
    }

    const updatedNotes = notes.filter(n => n.id !== noteId);
    setNotes(updatedNotes);
    
    if (currentNote?.id === noteId) {
      if (updatedNotes.length > 0) {
        setCurrentNote(updatedNotes[0]);
        setContent(updatedNotes[0].content);
      } else {
        setCurrentNote(null);
        setContent("");
      }
    }
    
    toast.success("Note deleted");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  useEffect(() => {
    if (currentNote && user) {
      const timer = setTimeout(() => {
        saveNote();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [content, currentNote, user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-64 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Notes</h2>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShareDialogOpen(true)}
              className="h-8 w-8"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={createNewNote}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLogout}
              className="h-8 w-8"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <NotesList
          notes={notes}
          currentNote={currentNote}
          onSelectNote={selectNote}
          onDeleteNote={deleteNote}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing..."
          className="w-full max-w-3xl h-[80vh] bg-transparent border-none focus-visible:ring-0 text-lg resize-none"
        />
      </div>

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        pin={userPin}
      />
    </div>
  );
};

export default Notes;

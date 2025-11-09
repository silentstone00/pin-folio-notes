import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ShareDialog from "@/components/ShareDialog";

// Generate or get user ID from localStorage
const getUserId = () => {
  let userId = localStorage.getItem("notes_user_id");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("notes_user_id", userId);
  }
  return userId;
};

const Notes = () => {
  const [userId] = useState(getUserId());
  const [currentNote, setCurrentNote] = useState<any>(null);
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [userPin, setUserPin] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  useEffect(() => {
    loadNotes(userId);
    loadUserPin(userId);
  }, [userId]);

  const loadUserPin = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("pin")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (data) {
      setUserPin(data.pin);
    } else {
      // Create a new profile with PIN if it doesn't exist
      const newPin = Math.floor(100000 + Math.random() * 900000).toString();
      await supabase.from("profiles").insert({ user_id: userId, pin: newPin });
      setUserPin(newPin);
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
    if (!currentNote) return;

    const { error } = await supabase
      .from("notes")
      .update({ content })
      .eq("id", currentNote.id);

    if (error) {
      toast.error("Failed to save note");
    }
  };

  const createNewNote = async () => {
    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: userId,
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

  useEffect(() => {
    if (currentNote) {
      const timer = setTimeout(() => {
        saveNote();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [content, currentNote]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar
          notes={notes}
          currentNote={currentNote}
          onSelectNote={selectNote}
          onDeleteNote={deleteNote}
          onCreateNote={createNewNote}
          onShare={() => setShareDialogOpen(true)}
        />

        <main className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border px-4">
            <SidebarTrigger />
          </header>

          <div className="flex-1 flex items-center justify-center p-8">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing..."
              className="w-full max-w-3xl h-[80vh] bg-transparent border-none focus-visible:ring-0 text-lg resize-none"
            />
          </div>
        </main>

        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          pin={userPin}
        />
      </div>
    </SidebarProvider>
  );
};

export default Notes;
